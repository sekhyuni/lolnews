# -*- encoding: utf-8 -*-
'''
@author: Minji 
@content: 연관어 추론(지능형 검색)
'''

import re
import os
import csv
import time
import pandas as pd
import numpy as np
from datetime import datetime
from gensim.models import FastText
from collections import defaultdict
from setproctitle import setproctitle
from konlpy.tag import Mecab

from config.utils import get_stream_logger, ESapi, create_query
from config import utils
from config.config import FastTextConfig as mdcfg
from config.config import PostConfig as postcfg


# library log 삭제
import logging 
logging.getLogger('gensim').setLevel(logging.WARNING) 
logging.getLogger('smart_open').setLevel(logging.WARNING) 


def get_model_fpath():
    """
    모델 fname 출력
    - output: /workspace/src_code/general_03_WS/model/search/fasttext_search_1945-01-01_2021-12-07_epoch30
    """
    model_list = os.listdir(mdcfg.model_dir)
    model_fname = ''
    for m in model_list:
        if not m.endswith('.npy'):
            model_fname = m
            continue
    model_fpath = os.path.join(mdcfg.model_dir, model_fname)
    return model_fpath



def inference_from_model(model, search_word, pos_tagger, 
                         log_mode=logging.INFO, is_threshold=True):
    """
    모델을 사용한 연관어 추론
    """
    logger = get_stream_logger(log_mode=log_mode)

    search_word = search_word.replace(' ', '') # 띄어쓰기 제거
    logger.debug(f"검색어1: {search_word}")

    # 영단어 input 나올 경우
        ## 한글자 영단어는 연관어 추출X
        ## vocab에 없는 영단어는 연관어 추출X
        ## input 대소문자 구분없이 결과 동일하게 출력
    if (search_word.encode().isalpha()):
        alpha_key = []
        for w in model.wv.index_to_key:
            if w.encode().isalpha():
                alpha_key.append(w)
        small_alpha_key = [k.lower() for k in alpha_key]
        if (len(search_word) == 1) | (search_word.lower() not in small_alpha_key):
            logger.debug(f"search word consists of meaningless alphabets")
            return []
        else:
            # alpha_key_lst -> alpha_dict
            alpha_dict = alpha_key_lst_to_dict(alpha_key)
            search_word = alpha_dict[search_word.lower()][0]
    logger.debug(f"검색어2: {search_word}")
    tmp_time = time.time() 
    raw_result_lst = model.wv.most_similar(search_word, topn=200)
    logger.debug(f"model init infer elapsed time: {round(time.time()-tmp_time, 3)} seconds")
    
    if is_threshold:
        raw_result_lst = [(w, s) for w, s in raw_result_lst if s >= mdcfg.ws_thres]
    
    # 연관어 후처리
    ## 한글자 단어 제거
    logger.debug(f"1..........한글자 삭제") 
    start_time = time.time()
    result_lst = [(w, s) for w,s in raw_result_lst if (len(w) > 1)]
    logger.debug(f"{[w for w, _ in raw_result_lst if w not in [word for word, _ in result_lst]]}")
    logger.debug(f"step1) Elapsed time > {round(time.time() - start_time, 3)} sec")

    # 불용어 제거
    logger.debug(f"2..........불용어 삭제")
    start_time = time.time()
    stopwords_lst = postcfg.stopwords_lst
    stop_to_valid_dict = postcfg.stopwords_to_valid_dict
    stop_to_valid_word_lst = [w for w, _ in result_lst if w in stop_to_valid_dict.keys()]
    if stop_to_valid_word_lst:
        result_lst = [(stop_to_valid_dict[w], s) if w in stop_to_valid_word_lst else (w, s) for w, s in result_lst ]
    rm_word_lst = [w for w, _ in result_lst if w in stopwords_lst]
    result_lst = [(w, s) for w, s in result_lst if w not in stopwords_lst] 
    logger.debug(f"{stop_to_valid_word_lst + rm_word_lst}")
    logger.debug(f"step2) Elapsed time > {round(time.time() - start_time, 3)} sec")

    # 조사 제거
    logger.debug(f"3..........조사 포함하는 단어 삭제")
    start_time = time.time()
    result_lst, rm_word_set = rm_word_with_josa(search_word, result_lst, nb=40, nf=40)
    logger.debug(f"{list(rm_word_set)}")
    logger.debug(f"step3) Elapsed time > {round(time.time() - start_time, 3)} sec")

    ## 연관어 안에서 substring 관계인 경우 제일 긴 단어만 남기고 제거
        ## score는 제일 큰 값 사용
    logger.debug(f"4..........연관어 subword삭제")
    start_time = time.time()
    word_lst = [w for w, _ in result_lst]
    result_lst = rm_substring_from_wslst(result_lst)
    logger.debug(f"{[w for w in word_lst if w not in [word for word, _ in result_lst]]}")
    logger.debug(f"step4) Elapsed time > {round(time.time() - start_time, 3)} sec")

    ## 제거 조건
        ## 1) 연관어가 검색어의 sub-word
        ## 2) 문장부호가 들어간 경우
        ## 3) 검색어+stopwords_suffix 제거
    logger.debug(f"6..........검색어 subword, score, 문장부호, 불용어 suffix 삭제")
    start_time = time.time()
    proc1_time = time.time()
    pro_result_lst = []
    stopwords_suffix = postcfg.stopwords_suffix
    stopwords_suffix += postcfg.josa_lst
    p = re.compile("[\.\,\?\!\(\)\[\]\"\'\-\/]+")
    logger.debug(f"step6-proc1) {round(time.time() - proc1_time, 3)}")

    proc2_time = time.time()
    for res in result_lst:
        word, score = res
        cond1 = word not in search_word
        cond2 = not re.findall(p, word)
        cond3 = word not in [search_word+suf for suf in stopwords_suffix]
        if cond1 & cond2 & cond3:
            pro_result_lst.append(res)
    logger.debug(f"step6-proc2) {round(time.time() - proc1_time, 3)}")
    logger.debug(f"{[w for w, _ in result_lst if w not in [word for word, _ in pro_result_lst]]}")
    logger.debug(f"step6) Elapsed time > {round(time.time() - start_time, 3)} sec")

    final_word_lst = [w for w, _ in pro_result_lst]

    ## 형태소 분석기 돌려서 용언, 용언활용 제거 (mecab)
        ## 1) 용언 나오면 제거
        ## 2) MAG는 제거
        ## 3) 용언 활용 제거
    logger.debug(f"7..........명사외 품사 삭제")
    start_time = time.time()
    w_lst = final_word_lst.copy()
    v_tag_lst = ['VV+EC', 'VV+EP+EC', 'VA+EC', 'VV+EC+VX+EC', 'VX+EC', 'VA+EC+VX+EC', 'VV+EC+VV+EC', 'VV+EC+VX+EP+EC', 'VA+EP+EC', 'VX+EP+EC', 'EC+VX+EC', 'XSV+EC+VX+EC', 'XSA+EC+VX+EC', 'VV+EC+VCP+EC', 'EC+VV+EC', 'VX+EC+VX+EC', 'VA+EC+VCP+EC', 'EC+VX+EP+EC', 'XSV+EC+VX+EP+EC', 'VV+EP+EC+VX+EC', 'VV+EP+EP+EC', 'VA+EC+VX+EP+EC', 'EC+VV+EP+EC', 'VV+EC+VCP+EP+EC', 'VV+ETN+VCP+EC', 'XSA+EC+VX+EP+EC', 'VV+ETM+NNB+VCP+EC', 'VV+EC+VV+EP+EC', 'NP+VV+EC', 'VA+ETM+NNB+XSA+EC', 'EP+EC+VX+EC', 'VA+ETM+NNB+VCP+EC', 'VV+EC+VX+EC+VX+EC', 'NP+JKO+VV+EC', 'VA+EC+VV+EC', 'VX+EC+VX+EP+EC', 'VX+EC+VV+EC', 'VV+EC+EC', 'VV+EC+VX+EP+EC+VV+EP+EC', 'VV+ETN+XSV+EC', 'XSA+EC+VX+EC+VX+EC', 'VX+EC+VCP+EC', 'VX+ETM+NNB+VCP+EC', 'VV+EP+EC+VV+EP+EC', 'XSV+EC+VX+EC+VX+EC', 'VCP+EC+VX+EC', 'XSV+EC+VV+EC', 'VA+ETM+NNG+VCP+EC', 'VV+EC+VV+EC+VX+EC', 'VCP+EC+VV+EP+EC', 'VX+ETN+VCP+EC', 'VV+EP+EC+VX+EP+EC', 'VA+ETN+VCP+EC', 'VV+EC+VX+ETM+NNB+VCP+EC', 'VV+EC+VX+EC+VX+EP+EC', 'VV+EC+XSV+EC', 'NNG+VCP+EC+VX+EC', 'VV+ETM+EC', 'VX+EC+VCP+EP+EC', 'XSA+EC+VV+EC', 'VV+VCP+EC', 'VA+EC+VX+EC+VX+EC', 'VA+EC+VCP+EP+EC', 'VV+EC+VX+EC+EC', 'XSN+VV+EC', 'ETN+JKB+VV+EC', 'VA+EC+VV+EP+EC', 'VV+EF+XSV+EC', 'MAG+VV+EP+EC', 'VV+ETN+EC', 'XR+XSA+EC+VX+EC', 'NP+JKB+VV+EC', 'ETM+NNB+XSA+EC+VX+EC', 'NP+VV+EC+VX+EC', 'VA+EC+XSV+EC', 'VA+ETM+EC', 'XSV+EP+EC+VX+EC', 'VA+ETN+JKB+VCP+EC', 'VV+EP+EF+VCP+EC', 'NP+JKO+VV+EP+EC', 'VV+EP+EP+EP+EC', 'NNB+VCP+EC+VX+EC', 'EC+VX+EC+EC', 'EC+VX+EP+EC+VV+EP+EC', 'VV+EF+EC', 'NP+JKG+NNG+VV+EC', 'EC+VX+EC+VV+EC', 'VV+EP+EC+VCP+EC', 'VX+EC+VX+EP+EC+VV+EP+EC', 'VX+EP+EC+VV+EP+EC', 'NP+VCP+EC+VV+EC', 'XSA+EC+VV+EP+EC', 'VV+ETM+EP+EC', 'VV+EC+VCP+EP+EP+EC', 'VA+EC+VX+EC+EC', 'EC+VV+EP+EC+EC', 'VV+EC+VA+EC+VX+EC', 'EC+VX+ETN+VCP+EC', 'VV+EC+VX+EC+VV+EC', 'EP+EC+VV+EP+EC', 'VV+ETM', 'VV+EC+VX+ETM', 'VA+ETM', 'VV+EC+VV+ETM', 'VA+EC+VX+ETM', 'VX+ETM', 'VV+EP+ETM', 'EC+VX+ETM', 'XSV+EC+VX+ETM', 'EC+VV+ETM', 'VA+EP+ETM', 'XSA+EC+VX+ETM', 'VX+EC+VX+ETM', 'VV+EC+VX+EC+VX+ETM', 'VV+ETN+VCP+ETM', 'VX+EP+ETM', 'XSV+EC+VV+ETM', 'VV+EP+EC+VX+ETM', 'VA+EC+VX+EP+ETM', 'VA+ETM+NNB+XSA+ETM', 'VV+EC+VCP+ETM', 'VV+EP+EP+ETM', 'VV+EC+VCP+EP+ETM', 'XSA+EC+VV+ETM', 'VV+EC+XSA+ETM', 'VV+ETN+XSV+ETM', 'NP+JKO+VV+ETM', 'VV+EC+VX+EP+ETM', 'VA+EC+VCP+ETM', 'XSA+EC+VX+EC+VX+ETM', 'XSA+EC+VX+EP+ETM', 'VX+EC+VV+ETM', 'EC+VX+EP+ETM', 'VA+EC+VV+ETM', 'XSV+EC+VX+EP+ETM', 'VV+EC+VX+EC+VV+ETM', 'VV+EF+VX+ETM', 'VX+EC+VX+EP+ETM', 'VA+ETN+VCN+ETM', 'VA+ETN+JKB+VCP+ETM', 'EC+VV+EP+ETM', 'NP+VV+ETM', 'VA+ETN+VCP+ETM', 'VA+EC+XSA+ETM', 'VV+EC+VX+EC+ETM', 'VA+EC+VCP+EP+ETM', 'VV+ETM+ETM', 'VA+EC+VX+EC+VX+ETM', 'VV+EC+VV+EC+VX+ETM', 'VV+VX+ETM', 'XSV+EC+VX+EC+VX+ETM', 'VV+EP+VX+EP+ETM', 'EC+VA+ETM', 'VCP+EC+VV+EP+ETM', 'VV+EC+VX+EP+EC+VV+ETM', 'VX+EC+VCP+ETM', 'VV+EC+VX+EP+EC+ETM', 'VV+ETM+NNB+XSA+ETM', 'NP+JKG+VA+ETM', 'XSV+VX+ETM', 'XSV+EC+VA+ETM', 'VV+EP+EC+XSA+ETM', 'VCP+EC+VX+ETM', 'VV+EC+VX+EP+EC+XSV+ETM', 'VA+VX+EC+VX+ETM', 'VV+EC+VV+EC+VV+ETM', 'EP+EC+VX+ETM', 'VCP+EF+VX+ETM', 'NNG+EC+VX+EC+VX+ETM', 'VV+EP+EC+VV+ETM', 'VA+ETM+VA+ETM', 'NP+EC+VV+ETM', 'VV+ETN+VV+ETM', 'VX+EP+EC+XSA+ETM', 'XSV+EC+VX+EC+XSA+ETM', 'VA+EC+XSV+ETM', 'NNG+VV+ETM', 'VX+EP+VX+EP+ETM', 'VV+EC+ETM', 'XSA+EP+EC+VX+ETM', 'EC+VV+EC+VX+ETM', 'VX+EP+EC+VX+ETM', 'XSA+XSA+EC+VX+ETM', 'VX+EC+XSA+ETM', 'VX+ETN+VCP+ETM', 'EC+VX+EC+VX+ETM', 'VV+EC+VX+EC+VCP+ETM', 'VX+ETM+ETM', 'VA+ETM+NNG+VV+ETM', 'VX+EP+EC+VV+EC+VX+ETM', 'VV+EF+VCP+ETM', 'XSV+ETN+VV+ETM', 'NP+JKG+NNG+VV+ETM', 'VX+EP+EC+VV+EP+EC+VCP+ETM', 'XSA+EC+VX+EC+VV+ETM', 'VV+ETN+XSV+EC+VX+ETM', 'VV+EC+EP+ETM', 'VX+ETM+NNB+ETM', 'ETM+VA+ETM', 'VA+EC+VX+VCP+ETM', 'XSV+ETN+JKB+VV+ETM', 'XSV+EC+VX+EC+XSV+ETM', 'VV+ETM+NNB+VCP+ETM', 'VA+EP+EP+ETM', 'VA+EF+VCP+ETM', 'VV+EF', 'VV+EC+VX+EF', 'VA+EF', 'VX+EF', 'VA+EC+VX+EF', 'VV+EP+EF', 'EC+VX+EF', 'VV+EC+VV+EF', 'XSV+EC+VX+EF', 'VA+EP+EF', 'XSA+EC+VX+EF', 'VV+EP+EC+VX+EF', 'VV+ETM+NNB+VCP+EF', 'VX+EP+EF', 'VX+EC+VX+EF', 'EC+VV+EF', 'VV+EC+VX+EP+EF', 'VV+ETN+VCP+EF', 'VV+EC+VV+EP+EF', 'VV+EC+VX+EC+VX+EF', 'EC+VX+EP+EF', 'XSV+EP+EC+VX+EF', 'VV+EP+EP+EF', 'VV+EC+VCP+EF', 'VA+ETM+NNB+VCP+EF', 'VA+EC+VX+EC+VX+EF', 'VX+EC+VX+EP+EF', 'VX+EP+EC+VX+EF', 'NP+VV+EF', 'VCP+EC+VX+EF', 'VV+EC+VV+EC+VX+EF', 'XSV+EC+VX+EP+EF', 'XSV+EC+VV+EF', 'VA+EP+UNA+EF', 'VV+EC+VX+EP+EC+VX+EF', 'EC+VV+EP+EF', 'VV+ETM+NNBC+VCP+EF', 'VX+ETM+NNB+VCP+EF', 'VX+EP+UNA+EF', 'VA+ETN+VCP+EF', 'XSA+EC+VV+EF', 'VCN+EC+VX+EF', 'VV+EP+UNA+EF', 'XSA+EP+EC+VX+EF', 'VV+EC+EF', 'XSA+EC+VX+EC+VX+EF', 'XSV+EP+EC+VX+EP+EF', 'VV+EC+ETM+NNB+VCP+EF', 'VV+EP+EC+VX+EP+EF', 'EC+VX+EP+UNA+EF', 'VA+EC+VCP+EF', 'VV+EC+VX+ETM+NNB+VCP+EF', 'NP+JKO+VV+EF', 'XSA+VX+EF', 'ETM+NNB+XSA+EC+VX+EF', 'VV+EP+EC+VV+EP+EF', 'EP+EC+VX+EF', 'VA+ETN+VA+EF', 'VCP+EC+VV+EP+EF', 'VV+EC+VX+EC+VV+EF', 'EC+VV+ETM+NNB+VCP+EF', 'VA+EC+EF', 'NNB+VCP+EC+VX+EF', 'VV+EC+VX+EC+VX+EP+EF', 'VA+UNA+EF', 'EP+EP+EC+VX+EF', 'VV+ETN+XSV+EF', 'VV+EC+EC+VX+EF', 'VV+EP+ETN+VCP+EF', 'VV+ETM+EF', 'VV+EC+VV+EP+EC+VX+EF', 'EC+VX+EC+VX+EF', 'VA+EC+VX+EP+EF', 'VX+EC+VV+EF', 'EP+EC+VV+EP+EF', 'XSA+EC+VX+EC+VX+EP+EF', 'NP+VCP+EC+VX+EF', 'VV+EC+VX+UNA+EF', 'XR+XSA+EC+VX+EF', 'VV+ETM+NNG+VCP+EF', 'VX+EP+EC+VCP+EF', 'VV+EP+ETM+NNB+VCP+EF', 'VA+EC+VX+EP+UNA+EF', 'VA+EC+VV+EF', 'VV+EP+EP+EC+VX+EF', 'NNG+VCP+EC+VX+EF', 'EC+VA+EF', 'VA+EC+VX+ETN+VCP+EF', 'NP+VV+EP+EF', 'XSV+EC+VX+EP+EC+VX+EF', 'VV+EP', 'VV+EC+VX+EP', 'VA+EP', 'VV+EC+VV+EP', 'VA+EC+VX+EP', 'VX+EP', 'EC+VX+EP', 'XSV+EC+VX+EP', 'VV+EP+EP', 'EC+VV+EP', 'VV+EC+VX+EC+VX+EP', 'VX+EC+VX+EP', 'XSA+EC+VX+EP', 'VA+EC+VX+EC+VX+EP', 'VV+EC+VV+EC+VX+EP', 'VA+EC+VV+EP', 'XSV+EC+VV+EP', 'VA+EP+EP', 'XSA+EC+VX+EC+VX+EP', 'VV+EC+VV+EC+VV+EP', 'VV+EP+VX+EP', 'VX+EP+EP', 'VV+VX+EP', 'XSV+EC+VX+EC+VX+EP', 'VV+EC+VX+EC+EP', 'NNG+JKO+VV+EP', 'VV+ETN+XSV+EP', 'VV+EC+EP', 'XSA+EC+VV+EP', 'VA+EP+EC+VX+EP', 'EC+JX+VX+EP', 'VV+EP+EC+VX+EP', 'VX+EP+EC+VV+EP+EC+VCP+EP', 'VA+ETM+VV+EP', 'VV+EC+XSA+EP', 'XSV+EC+VX+EC+XSA+EP', 'EC+VX+EC+VX+EP', 'VA+ETN+VCP+EP', 'XSA+VX+EC+VX+EP', 'NP+JKO+VV+EP', 'VA+ETN+JKB+VCP+EP', 'VX+EC+VV+EP', 'VV+VV+EP', 'VV+ETN+XSV+EC+VX+EP', 'VV+EC+VX', 'VX', 'VV+EC+VX+EC+VX', 'EC+VX', 'VX+EC+VX', 'EC+VX+EC+VX', 'XSV+EC+VX', 'VV+EP+EC+VX', 'VA+EC+VX', 'VV+EC+VV+EC+VX', 'XSV+EC+EC+VX', 'VV+VX', 'VX+EP+EC+VX', 'VCP+EP+EC+VX', 'VA+EP+EC+VX', 'VX+EC+VX+EC+VX', 'XSV+EC+VX+EC+VX', 'XSA+EC+VX+EC+VX', 'EC+VV+EC+VX', 'XSV+VX', 'XSA+EC+VX', 'EP+EC+VX', 'VV+EP+EC+JX', 'VV+EC+JX', 'VA+EC+JX', 'VX+EP+EC+JX', 'VV+JX', 'VV+EC+VX+EP+EC+JX', 'VV+ETN+JX', 'VA+ETM+NNG+JX', 'VV+ETM+NNG+JX', 'VA+ETN+JKB+JX', 'VA+ETN+JX', 'VA+EP+EC+JX', 'VA+ETM+NNB+JX', 'VX+EC+JX', 'VA+ETM+NNG+JKB+JX', 'VX+ETM+NNB+JX', 'VA+ETN+JKB+JKB+JX', 'VA+ETM+NNB+JKB+JX', 'VV+ETN+JKB+JX', 'VV+EC+VCP+EC+JX', 'VA+EC+VX+EC+JX', 'VV+ETM+NNB+JX', 'VA+JX', 'VV+EP+ETN+JKB+JX', 'VV+EC+VX+ETN+JX', 'VV+EP+ETN+JX', 'VV+EC+VX+JX', 'VA+EC+JX+JX', 'VX+JX', 'VA+EC+VCP+EC+JX', 'VA+EC+VCP+ETN+JKB+JX', 'VV+EC+VCP+ETN+JX', 'VV+EC+VCP+EP+EC+JX', 'VA+EP+ETN+JX', 'EC+VX+EP+EC+JX', 'XSA+EC+VX+EP+ETN+JKB+JX', 'VX+EP+ETN+JX', 'VX+EC+VX+EC+JX', 'VV+ETM+NNB+JKB+JX', 'VX+EC+VV+ETN+JX', 'VV+EC+ETM+NNG+JX', 'VA+EC+VX+JX', 'VA+ETN+JKB+JX+JX', 'VV+EF+EC+JX', 'VA+EC+VCP+EP+EC+JX', 'VA+ETM+JX+JX', 'XSA+EC+VX+ETN+JX', 'VA+EC+VCP+ETN+JX', 'VV+ETM+NNP+JX', 'VV+EC+VV+ETN+JKB+JX', 'VV+EC+VX+EC+JX', 'VV+ETN+JX+JX', 'VV+EC+VV+EC+JX', 'VA+EF+JX', 'VV+EP+EP+EC+JX', 'VV+ETM+NNB+NNB+JKB+JX', 'EC+VV+JX', 'VA+EP+ETN+JKB+JX', 'XSV+EC+VV+ETN+JKB+JX', 'VV+ETM+NNB+VCP+EC+JX', 'VV+EF+JX', 'VV+ETM+NNB+XSN+JX', 'VA+ETM+NNB+XSA+EC+JX', 'NP+JKO+VV+EF+JX', 'VV+EC+VCP+ETN+JKB+JX', 'VV+EC+VCP', 'VV+ETM+NNB+VCP', 'VA+ETM+NNG+VCP', 'VX+ETM+NNB+VCP', 'VA+EC+VCP', 'VX+EC+VCP', 'VA+ETM+NNB+VCP', 'VV+EC+VX+ETM+NNB+VCP', 'XSV+EC+VX+ETM+NNB+VCP', 'VV+EP+ETM+NNB+VCP', 'VV+VCP', 'VV+EF+VCP', 'EC+VX+ETM+NNB+VCP', 'VA+ETM+NNG+JKB', 'VV+ETN+JKB', 'VA+ETN+JKB', 'VA+ETM+NNB+JKB', 'VA+EC+JKB', 'VA+ETN+JKB+JKB', 'VV+ETM+NNG+JKB', 'VX+EP+ETN+JKB', 'VV+EP+EC+JKB', 'VV+EC+JKB', 'VV+ETM+NNB+JKB', 'VA+EC+VCP+ETN+JKB', 'EC+VX+ETM+NNB+JKB', 'XSV+EC+VX+ETN+JKB', 'VV+EP+ETN+JKB', 'VA+ETN+JKB+JX+JKB', 'VV+JKB', 'VV+EC+ETN+JKB', 'VX+ETN+JKB', 'VA+EP+ETN+JKB', 'VA+ETM+NNG+JKO', 'VV+ETN+JKO', 'VV+EP+EC+JKO', 'VA+EC+JKO', 'VV+JKO', 'VV+ETM+NNB+JKO', 'VV+ETM+NNG+JKO', 'VX+EC+JKO', 'VA+ETN+JKO', 'VA+ETM+NNB+JKO', 'VV+EC+JKO', 'VX+EP+EC+JKO', 'VA+ETM+NNG+VV+ETN+JKO', 'VV+EC+VV+EC+JKO', 'EC+VX+EP+ETN+JKO', 'VA+EP+EC+JKO', 'VA+EP+ETN+JKO', 'VA+ETN+JKB+JKO', 'VA+ETM+NNB+JX+JKO', 'EC+VX+EC+JKO', 'VA+EP+EF+JKO', 'EC+VX+ETN+JKO', 'VA+ETN+XSN+JKO', 'VA+ETN+JKB+JX+JKO', 'VA+EC+VX+EP+ETN+JKO', 'VX+ETM+NNB+JKO', 'VA+JKO', 'VV+EC+VX+EP+ETN+JKO', 'VV', 'VV+EC+VV', 'EC+VV', 'VX+EC+VV', 'VV+VV', 'VA+EC+VV', 'VCP+VV', 'VV+EP+EC+VV', 'VV+ETM+NNB+JKS', 'VA+ETM+NNG+JKS', 'VA+ETM+NNB+JKS', 'VA+EC+JKS', 'VV+ETN+JKS', 'VV+EP+EC+JKS', 'VV+EC+VX+ETM+NNB+JKS', 'VV+EP+ETM+NNB+JKS', 'VA+ETM+NNG+NNB+JKS', 'VV+ETM+NNG+JKS', 'EC+VX+ETN+JKS', 'VA+ETM+NNB+XSA+EC+JKS', 'VX+ETM+NNB+JKS', 'VA+EC+VX+EP+ETN+JKS', 'VA+ETN+JKB+JKS', 'VV+ETM+NNB+JKC', 'VA+EC+JKC', 'VA+ETM+NNB+JKC', 'VV+EC+JKC', 'VA+EF+JKC', 'VA+EC+JX+JKC', 'VX+ETM+NNB+JKC', 'VA+EC+VX+ETM+NNB+JKC', 'VV+ETN+JC', 'VA+ETM+NNG+JC', 'VA+ETN+JKB+JC', 'VA+ETM+NNB+JC', 'VA+ETM+NNG+JKG', 'VV+ETN+JKG', 'VV+ETM+NNG+JKG', 'VA+ETN+JKB+JKG', 'VX+UNA', 'VV+IC', 'VV+EF+JKQ', 'VX+EP+EF+JKQ', 'VV+EP+EC+XSN', 'VA+XSN', 'VV+EC+XSN', 'VA', 'NP+VA', 'VV+MAJ', 'VV+EP+EC+MM', 'VA+MM', 'VA+ETN+JKB+JX+MM', 'VA+ETN+MAG']
    
    for word in w_lst:
        flag = 0
        
        word_pos_lst = pos_tagger.pos(word)
        
        if len(word_pos_lst) == 1:
            pos_word, pos_tag = word_pos_lst[0]
            cond1 = pos_tag in ['MAG', "SN", "VV", "VA"] + v_tag_lst
            ## VV+EC+VX+ETM 예) ~할, ~진, ~해온, ~해본 (가꿔온, 가르쳐준, ...)
            ## VA+EC+VX+ETM 예) ~할, ~진, ~해온, ~해본 (우스워할, 탁해진, ...)
            ## VV+EC+VX+EP 예) 가까와졌, 가꿔왔
            ## VA+EC+VX+EP 예) 괴로워졌, 뜨거워졌...
            if cond1:
                flag += 1
        else:
            for pos_res in word_pos_lst:
                pos_word, pos_tag = pos_res
                cond1 = is_v(word, pos_tagger)

                if cond1:
                    flag += 1
                    
        if flag != 0:
            final_word_lst.remove(word)
    logger.debug(f"{[w for w in w_lst if w not in final_word_lst]}")
    logger.debug(f"step7) Elapsed time > {round(time.time() - start_time, 3)} sec")
    
    ## score순 정렬
    final_result_lst = [(w, s) for w, s in pro_result_lst if w in final_word_lst]
    final_result_lst.sort(key = lambda x: x[1], reverse=True) 

    ## 검색어, 연관어의 SubSequence 삭제
    s_time = time.time()
    logger.debug(f"8..........subsequence 단어 삭제")
    final_word_lst = [w for w, _ in final_result_lst]
    final_word_lst, rm_word_dict = rm_subsequence(final_word_lst, search_word, n=10)
    final_result_lst = [(w, s) for w, s in final_result_lst if w not in rm_word_dict.keys()]
    logger.debug(f"{rm_word_dict}")
    logger.debug(f"step8) Elapsed time > {round(time.time() - s_time, 3)} sec") 

    ## 연관어 안에서 substring 관계인 경우 제일 긴 단어만 남기고 제거 한 번 더 계산
    s_time = time.time()
    logger.debug(f"10..........한 번 더 연관어 subword삭제")
    word_lst = [w for w, _ in final_result_lst]
    final_result_lst = rm_substring_from_wslst(final_result_lst)
    logger.debug(f"{[w for w in word_lst if w not in [word for word, _ in final_result_lst]]}")
    logger.debug(f"Elapsed time > {round(time.time() - s_time, 3)} sec")

    final_result_lst.sort(key = lambda x: x[1], reverse=True)

    return final_result_lst[:100]


def rm_dl_word_with_josa_dl(word):
    cond1 = word.endswith('자들')
    cond2 = word.endswith('사람들')
    cond3 = word.endswith('학생들')
    cond4 = word.endswith('선수들')
    cond5 = word.endswith('일군들')
    if (cond1 | cond2 | cond3 | cond4 | cond5):
        return word[:-1]
    else:
        cond6 = word.endswith("자들이")
        cond7 = word.endswith("자들의")
        if (cond6 | cond7) :
            return word[:-2]
        return word


def is_v(word, postagger):
    """
    input 단어가 용언인지 판단
    """
    result_lst = postagger.pos(word)
    if postagger.__module__.split('_')[1] == 'mecab':
        cond1 = result_lst[-1] == ('다', 'EC')
        cond2 = result_lst[-1] == ('한다', 'VX+EC')
        last_tag = result_lst[-1][1]
        cond5 = last_tag == 'VV+EC' # 만난다, 간다, 앞서
        cond6 = "VV+EC+VX" in last_tag # 당해낼, 떨쳐왔, 해댔, 꾸려진
        if cond1 | cond2:
            return True
        elif (last_tag == 'NNG') | (last_tag == 'NNP'):
            return False
        else:
            for res in result_lst:
                word, pos = res
                cond3 = pos in ['VV', 'VA', 'VX']
                cond4 = word[-1] == '다'
                if cond3 & cond4:
                    return True
                
            return False
    else:
        raise ValueError("형태소 분석기는 Mecab만 사용이 가능")
        
        
        
def substringSieve(string_lst):
    """
    input : 연관어 리스트
    output : 
        - out : substring 제거된 연관어 리스트
        - rm_dict : {'대표 단어': [substring 단어들]} - 대표단어는 제일 긴 단어
    """
    string_lst.sort(key=lambda s: len(s), reverse=True)
    out = []
    rm_dict = defaultdict(list) # 대표단어 : [나머지 단어들]
    for s in string_lst:
        cond_lst = [s in o for o in out] # True, False list
        if not any(cond_lst): # False만 있는 경우
            out.append(s)
        else:
            longest_word = [o for i, o in enumerate(out) if cond_lst[i]][0]
            rm_dict[longest_word].append(s)
    return out, rm_dict
    

def rm_substring_from_wslst(ws_result_lst):
    """
    input : score 기준으로 정렬된 연관어 결과 list [(연관어, score)]
    output : substring 제거된 연관어 결과 list [(연관어, score)]
    """
    ws_result_dict = {k:v for k, v in ws_result_lst}
    ws_word_lst = [k for k, _ in ws_result_lst]
    
    word_lst, rm_dict = substringSieve(ws_word_lst)
    
    final_lst = []
    for word in word_lst:
        rep_score = ws_result_dict[word]
        
        if word in rm_dict.keys():
            v_lst = rm_dict[word]
            score_lst = [ws_result_dict[v] for v in v_lst] + [rep_score]
            rep_score = max(score_lst)
        final_lst.append((word, rep_score))
    final_lst.sort(key = lambda x: x[1], reverse=True)
    return final_lst

#--------------------------------
def is_subsequence(s1, s2, m, n):
    """
    s1이 s2의 subsequence인지 확인
    m = len(s1)
    n = len(s2)
    """
    if m == 0:
        return True
    if n == 0:
        return False
    
    if s1[m-1] == s2[n-1]:
        return is_subsequence(s1, s2, m-1, n-1)
    return is_subsequence(s1, s2, m, n-1)


def _find_subseq_word(word, c_word_lst):
    """
    input:
        - word: base 단어
        - c_word_lst: 단어 리스트(base 단어 다음 단어부터)
    output:
        - rm_word_set: 삭제할 단어
    """   
    rm_word_dict = defaultdict(list)
    for c_word in c_word_lst:
        if is_subsequence(word, c_word, len(word), len(c_word)):
            rm_word_dict[word].append(c_word)
    return rm_word_dict


def rm_subseq_word_forward(word_lst, n):
    word_lst_topn = word_lst[:n]
    rm_word_dict = defaultdict(list)
    
    for i, word in enumerate(word_lst_topn):
        new_rm_word_dict = _find_subseq_word(word, word_lst_topn[i+1:])
        for w, remain_lst in new_rm_word_dict.items():
            rm_word_dict[w] += remain_lst

    word_lst = [w for w in word_lst if w not in rm_word_dict.keys()]
    return word_lst, rm_word_dict


def rm_subseq_word_backward(word_lst, n):
    word_lst_topn = word_lst[:n]
    rm_word_dict = defaultdict(list)
    
    for i, word in enumerate(word_lst_topn):
        new_rm_word_dict = _find_subseq_word(word, word_lst_topn[:i])
        for w, remain_lst in new_rm_word_dict.items():
            rm_word_dict[w] += remain_lst

    word_lst = [w for w in word_lst if w not in rm_word_dict.keys()]
    return word_lst, rm_word_dict


def rm_subsequence(word_lst, search_word, n=40):
    """
    input : 연관어 리스트
    output : subsequence 연관어가 삭제된 결과 단어 리스트
    """
    
    top_word_lst = word_lst[:n]
    # 검색어 subsequence 확인
    rm_word_dict = defaultdict(list)
    for c_word in top_word_lst:
        if is_subsequence(c_word, search_word, len(c_word), len(search_word)):
            rm_word_dict[c_word].append(search_word)
    final_word_lst = [w for w in word_lst if w not in rm_word_dict.keys()]

    # 뒤쪽 연관어 제거
    final_word_lst, rm_word_dict1 = rm_subseq_word_backward(final_word_lst, n=n)

    # 앞쪽 연관어 제거
    final_word_lst, rm_word_dict2 = rm_subseq_word_forward(final_word_lst, n=n)

    for w, remain_lst in rm_word_dict1.items():
        rm_word_dict[w] += remain_lst 
    for w, remain_lst in rm_word_dict2.items():
        rm_word_dict[w] += remain_lst    
    return final_word_lst, rm_word_dict
    

#----------- 조사 떼기 -----------
def is_korean(word):
    """
    마지막 글자가 한글인지 확인
    """
    code = ord(word[-1])
    if 44031 <= code <= 55203:
        return True
    return False


def _find_word_with_josa(word, c_word_lst):
    """
    input:
        - word: base 단어
        - c_word_lst: 단어 리스트(base 단어 다음 단어부터)
    output:
        - rm_word_set: 삭제할 조사 포함 단어
    """
    rm_word_set = set({})
    josa_lst = postcfg.josa_lst
    word_with_josa_lst = [word + josa for josa in josa_lst]
    for c_word in c_word_lst:
        if c_word in word_with_josa_lst:
            rm_word_set.add(c_word)
    return rm_word_set


def rm_word_with_josa(search_word, result_lst, nb=20, nf=20):
    
    word_lst = [w for w, _ in result_lst]
    
    # 검색어 + 조사 제거
    rm_word_set = _find_word_with_josa(search_word, word_lst)
    result_lst = [(w, s) for w, s in result_lst if w not in rm_word_set]
    
    # 뒤쪽 연관어 조사 제거
    result_lst, rm_word_set1 = rm_word_with_josa_backward(result_lst, n=nb)
    
    # 앞쪽 연관어 조사 제거
    result_lst, rm_word_set2 = rm_word_with_josa_forward(result_lst, n=nf)
    
    rm_word_set = rm_word_set1.union(rm_word_set2)
    return result_lst, rm_word_set

def rm_word_with_josa_backward(result_lst, n):
    """
    * top10 연관어만 확인
    
    input: 검색어, 전체 연관어 단어 리스트
    output: 조사 제거된 연관어 단어 리스트
    """
    word_lst = [w for w, _ in result_lst]
    word_lst_topn = word_lst[:n]
    rm_word_set = set({})
    
    for i, word in enumerate(word_lst_topn):
        if is_korean(word): # 마지막 글자가 한글
            word_with_josa_set = _find_word_with_josa(word, word_lst[i+1:])
            rm_word_set = rm_word_set.union(word_with_josa_set)
        else:
            continue
    result_lst = [(w, s) for w, s in result_lst if w not in rm_word_set]
    return result_lst, rm_word_set


def rm_word_with_josa_forward(result_lst, n):
    word_lst = [w for w, _ in result_lst]
    word_lst_topn = word_lst[:n]
    josa_lst = postcfg.josa_lst
    rm_word_dict = defaultdict(list)
    
    for i in range(1, len(word_lst_topn)):
        word = word_lst[i]
        forward_lst = word_lst[:i]
        word_with_josa_lst = [word + josa for josa in josa_lst]
        
        if rm_word_dict:
            rm_word_lst = sum(rm_word_dict.values(), [])
            if word in rm_word_lst:
                continue
    
        for c_word in forward_lst:
            if c_word in word_with_josa_lst:
                rm_word_dict[word].append(c_word)
                
    rm_word_set = set(sum(rm_word_dict.values(), []))
    add_lst = []
    if rm_word_dict:
        result_dict = {w: s for w, s in result_lst}
        for base_word in rm_word_dict.keys():
            v_lst = rm_word_dict[base_word]
            rep_score = max([result_dict[v] for v in v_lst])
            add_lst.append((base_word, rep_score))
    
    result_lst = [(w, s) for w, s in result_lst if (w not in rm_word_set) & (w not in rm_word_dict.keys())]
    result_lst += add_lst
    result_lst.sort(key = lambda x: x[1], reverse=True)
    
    return result_lst, rm_word_set
#--------------------------------


#------ 사전에 있는 영단어 대소문자 영향받지 않게 처리하기 위한 작업------
def alpha_key_lst_to_dict(alpha_key_lst):
    """
    input: vocab에 있는 모든 영단어(대소문자 구별)
    output: {소문자 영단어: [대소문자 구별되는 모든 같은 영단어들], ...}
    """
    alpha_dict = {}
    for k in alpha_key_lst:
        small_k = k.lower()
        if small_k in alpha_dict.keys():
            alpha_dict[small_k].append(k)
        else:
            alpha_dict[small_k] = [k]  
    return alpha_dict



if __name__ == "__main__":
    print(get_model_fpath())