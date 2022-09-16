# -*- encoding: utf-8 -*-
"""
Created on 2022.02.03.
@author: Minji (운영계)
@content: 지능형 검색 연관어 모델 배치 프로세스
- [배치 목적] 배치 프로세스로 모델 갱신
- 모델은 1년, 3년, 5년, 10년
- 각 모델마다 hyperparams가 다름
- (0418) min_count=6으로 수정
"""
from setproctitle import setproctitle
setproctitle("general_03_WS/search_ws_batch")

import warnings
warnings.filterwarnings(action="ignore")

import re
import os
import time
import argparse
from datetime import datetime
from dateutil.relativedelta import relativedelta
from konlpy.tag import Mecab
from gensim.models import FastText

from config.src_log import log_errlog
from config.init_jvm import run_jvm
from config.config import PrepConfig as prepcfg
from config.config import ESConfig as escfg
from config.config import FastTextConfig as mdcfg
from config import utils

import train 



# config
log_prefix = 'ws_search_batch'
log, err_log = log_errlog(log_prefix)


def calc_elapsed_time(func):
    
    func_name = func.__name__
    
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        result = func(*args, **kwargs)
        
        end_time = time.time() - start_time
        hours = end_time // 3600
        minutes = (end_time % 3600) // 60
        seconds = round((end_time % 3600) % 60, 4)
        log.info("*** [{}] Elapsed time : {} hour {} min {} sec".format(func_name, 
                                                                                    hours,
                                                                                    minutes,
                                                                                    seconds))
        return result
    return wrapper


def fasttext_corpus(use_stt=False):
    index = "mou_file_index_basic"
    fieldname = 'text_prep'
    es_url = escfg.ipport
    esapi = utils.ESapi(ipport=es_url) # 운영계 es

    all_media_lst = [
                        "1301", "1304", 
                        "1101", "1102", "1104", "1106", "1109", "1110",
                        "1201", "1203", "1204", "1205", "1206", 
                        "2401", # 연합뉴스
                        "1302", "1303", "1305" # STT
    ]
    stt_media_lst = ["1302", "1303", "1305"]
    
    today = datetime.now()
    start_date = (datetime.now() - relativedelta(years=args.year)).strftime('%Y-%m-%d')
    end_date = today.strftime('%Y-%m-%d')

    if not use_stt:
        all_media_lst = [i for i in all_media_lst if i not in stt_media_lst]

    corpus = train.create_corpus(esapi, all_media_lst, start_date, end_date)
    log.info("Corpus Size : {0} nums ({1} ~ {2})".format(len(corpus),
                                                    start_date,
                                                    end_date))
    return corpus 


@calc_elapsed_time
def fasttext_train(corpus, model_params, model_fname):
    log.info('Create model...')
    if len(corpus) < 1:
        log.info('The model cannot be created because the corpus does not exist.')
        return None
    model = FastText(corpus, **model_params)
    model.save(model_fname)
    if check_work_train(model_fname):
        log.info(f"Done saving model.")
    else:
        log.info("※Failure model train.※")
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
    if (args.vector_size==0) | (args.epochs==0) | (args.window==0):
        if args.year == 1:
            # 확정
                ## 데이터 27629개
                ## STT 사용 X, 연합뉴스 사용
            vector_size = 80
            epochs = 50
            window = 10
        elif args.year == 3:
            # 미정
                ## 데이터 
            vector_size = 80
            epochs = 50
            window = 10
        elif args.year == 5:
            # 미정
                ## 데이터
            vector_size = 80
            epochs = 50
            window = 10    
        elif args.year == 10:
            # 미정
                ## 데이터
            vector_size = 80
            epochs = 50
            window = 10  
    else:
        vector_size = args.vector_size
        epochs = args.epochs
        window = args.window
   
    model_params = {
                    'sg': 1, 
                    'vector_size': vector_size,
                    'window': window, 
                    'min_count': 6,
                    'epochs': epochs, 
                    'workers': 16
                }

    return model_params


def define_argparser():
    p = argparse.ArgumentParser()
    p.add_argument('-y', '--year', choices=[1, 3, 5, 10], type=int, required=True) 
    p.add_argument('-v', '--vector_size', type=int, default=0)
    p.add_argument('-e', '--epochs', type=int, default=0)
    p.add_argument('-w', '--window', type=int, default=0)
    args = p.parse_args()
    return args
    

def main(args):
    
    run_jvm()
    log.info(f"*** Batch train {args.year} year model")
    m = Mecab()
    inflect_df = None
    NER_TAGS = prepcfg.NER_TAGS
    
    # corpus 생성
        ## corpus 생성 log
    corpus = fasttext_corpus(use_stt=False)
    
    # 모델 학습
    model_params = define_model_params(args)
    log.info(f"model_params: {model_params}")
    model_name = f"{args.year}year_v{model_params['vector_size']}_e{model_params['epochs']}_w{model_params['window']}" 
    model_fname = os.path.join(mdcfg.model_batch_dir, model_name)
    model = fasttext_train(corpus, model_params, model_fname)

     
if __name__ == "__main__":
    args = define_argparser()
    main(args)

