# -*- encoding: utf-8 -*-
'''
Created on 2022.02.04.
@author: Minji 
@content: 연관어 추론(지능형 검색)
[내용]
(0104)
- postcfg 제거
- load_model_fname 수정
(0111)
- ws_search_infer에 추론시간 log 추가
- 모델 로드하는 거부터 추론시간 계산함(알고리즘에서 s_time을 파라미터로 받음)
(0204)
- load_model_fname > 배치 모델 경로로 수정
'''

import re
import os
import csv
import pandas as pd
import numpy as np
from config.config import  as mdcfg
from gensim.models import FastText
from gensim.models import KeyedVectors # load model
import train
from config import utils 
from setproctitle import setproctitle
import inference as infer

# tibero
from config import db_util as db

# library log 삭제
import logging 
logging.getLogger('gensim').setLevel(logging.WARNING) 
logging.getLogger('smart_open').setLevel(logging.WARNING) 


def load_model_fname():
    """
    모델 fname 출력
    - output: /workspace/src_code/general_03_WS/model/search/fasttext_search_1945-01-01_2021-12-07_epoch30
    """
    # model_path = os.path.join(mdcfg.model_dir, 'search')
    model_fname = os.path.join(mdcfg.model_batch_dir, mdcfg.search_model_name)
    return model_fname


def ws_search_infer(df, params):
    
    log, err_log = params['log'], params['err_log']
    esapi = params['esapi']
    model = params['model']
    pos_tagger = params['pos_tagger']
    inflect_df = params['inflect_df']
    NER_TAGS = params['NER_TAGS']
    s_time = params['s_time']
    search_word = df.values[0][0]
    search_word_masked = ''.join([s if i % 2 == 0 else "*" for i, s in enumerate(search_word)])
    log.info(f"keyword: {search_word_masked}")
    
    result = {
        "related_word": [],
        "status": 200
    }
    
    try:
        ws_result_lst = infer.inference_from_model(model, search_word, pos_tagger, inflect_df, NER_TAGS, log)
        ws_result_lst = [w for w, _ in ws_result_lst[:10]]
    except Exception as e:
        err_log.error(e)
        result['status'] = 500
    else:
        result['related_word'] = ws_result_lst
        h, m, s = utils.print_elapsed_time(s_time)
        log.info("--> Whole time of making WS top10 results.")
        log.info("--> {0} hours {1} minutes {2} seconds".format(h, m, s))
    
    return result
    