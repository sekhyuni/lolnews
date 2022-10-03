# -*- encoding: utf-8 -*-
"""
@author: Minji (운영계)
@content: 지능형 검색 연관어 모델 배치 프로세스
"""
from setproctitle import setproctitle
setproctitle("model_search_ws_batch")

import warnings
warnings.filterwarnings(action="ignore")

import re
import os
import time
import argparse
from datetime import datetime
import logging
from dateutil.relativedelta import relativedelta
from gensim.models import FastText

from config.config import ESConfig as escfg
from config.config import FastTextConfig as mdcfg
from config.utils import ESapi, create_query, get_stream_logger


logger = get_stream_logger(log_mode=logging.INFO)


def calc_elapsed_time(func):
    
    func_name = func.__name__
    
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        result = func(*args, **kwargs)
        
        end_time = time.time() - start_time
        hours = end_time // 3600
        minutes = (end_time % 3600) // 60
        seconds = round((end_time % 3600) % 60, 4)
        logger.info("*** [{}] Elapsed time : {} hour {} min {} sec".format(func_name, 
                                                                                    hours,
                                                                                    minutes,
                                                                                    seconds))
        return result
    return wrapper


def fasttext_corpus(start_date, end_date):
    fieldname = 'text_prep_content_array'
    es_url = escfg.ipport
    esapi = ESapi(ipport=es_url) 
    
    query = create_query(start_date, end_date)
    corpus = esapi.search_to_lst(query=query, fieldname=fieldname) # list of list
    logger.info("Corpus Size : {0} nums ({1} ~ {2})".format(len(corpus),
                                                    start_date,
                                                    end_date))
    return corpus 


@calc_elapsed_time
def fasttext_train(corpus, model_params, model_fname):
    logger.info('Create model...')
    if len(corpus) < 1:
        logger.info('The model cannot be created because the corpus does not exist.')
        return None
    model = FastText(corpus, **model_params)
    model.save(model_fname)
    if check_work_train(model_fname):
        logger.info(f"Done saving model.")
    else:
        logger.info("※Failure model train.※")
    return model    


def check_work_train(model_fname):
    today = datetime.now()
    end_date = today.strftime('%Y-%m-%d')    
    save_date = time.localtime(os.path.getmtime(model_fname))  # 파일 수정일자
    save_date = time.strftime('%Y-%m-%d', save_date)
    if save_date == end_date:
        return True
    else:
        return False
    

# 연도별 모델 파라미터 설정
def define_model_params(args):
    # vector_size = 80
    # epochs = 50
    # window = 10

    vector_size = args.vector_size
    epochs = args.epochs
    window = args.window
    min_count = args.min_count
   
    model_params = {
                    'sg': 1, 
                    'vector_size': vector_size,
                    'window': window, 
                    'min_count': min_count,
                    'epochs': epochs, 
                    'workers': 4
                }

    return model_params


def define_argparser():
    p = argparse.ArgumentParser()
    p.add_argument('-d', '--days', type=int, default=7, help='How many days ago') 
    p.add_argument('-v', '--vector_size', type=int, default=50)
    p.add_argument('-e', '--epochs', type=int, default=40)
    p.add_argument('-w', '--window', type=int, default=5)
    p.add_argument('-m', '--min_count', type=int, default=3)
    args = p.parse_args()
    return args
    
def delete_prev_model(remain_model_fname):
    """input에 있는 모델만 남기고 다 삭제"""
    model_list = os.listdir(mdcfg.model_dir)
    for m in model_list:
        if remain_model_fname not in m:
            rm_model_fpath = os.path.join(mdcfg.model_dir, m)
            os.remove(rm_model_fpath)
            if '.npy' not in m:
                logger.info(f"Delete previous model({rm_model_fpath})")


def main(args):
    
    today = datetime.now()
    start_date = (today - relativedelta(days=args.days)).strftime('%Y-%m-%d')
    end_date = today.strftime('%Y-%m-%d') 

    # corpus 생성
        ## corpus 생성 log
    corpus = fasttext_corpus(start_date, end_date)

    # 모델 학습
    model_params = define_model_params(args)
    logger.info(f"model_params: {model_params}")
    model_name = f"ws_model_from_{start_date}_to_{end_date}_v{model_params['vector_size']}_e{model_params['epochs']}_w{model_params['window']}" 
    model_fpath = os.path.join(mdcfg.model_dir, model_name)
    model = fasttext_train(corpus, model_params, model_fpath)
    delete_prev_model(model_name)

     
if __name__ == "__main__":
    args = define_argparser()
    main(args)

