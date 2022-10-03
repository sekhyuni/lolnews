# -*- encoding: utf-8 -*-
"""
@author : Minji
@content : es 사용 코드
"""
import time
from datetime import datetime
import pandas as pd
import ast
from elasticsearch import Elasticsearch
import logging

try:
    from config.config import ESConfig as escfg
except ImportError:
    from config import ESConfig as escfg


def get_stream_logger(log_mode=logging.INFO):
    logger = logging.getLogger(__name__) # log file name
    logger.setLevel(log_mode) # 어느 level까지 log로 남길지
    log_form_front = '[%(levelname)s][%(filename)s:%(lineno)s][%(asctime)s]'
    formatter = logging.Formatter(log_form_front + '%(message)s')
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    return logger


class ESapi:
    """
    e/s 데이터 불러오기
    - e/s 데이터 → pandas 
    """
    def __init__(self, size=10000, ipport=escfg.ipport):
        """
        10000개 미만 데이터 추출하고 싶을 때, size=원하는 데이터 개수
        전체 데이터 추출하고 싶을 때, size=10000
        """
        self.es = Elasticsearch(ipport, timeout=30000, verify_certs=False) # ip와 포트번호 입력
        if (size <= 10000) & (type(size) == int):
            self.size = size
        else:
            raise ValueError("size <= 10000 입력. 전체 데이터 가져오고 싶으면 10000 입력.")
        print(f"es 연결 완료 : {self.es.info}")

    def _check_data_num(self, index='news_index', query={}):
        """주어진 쿼리의 데이터 개수 확인"""
        body = {
                    'track_total_hits': True,
                    'size': 0,
                    'query': query
                }
        print(f"_check_data_num query: {body}")
        body = self.es.search(index=index, body=body)
        hits = body['hits']
        value = hits['total']['value']
        return value
    
    
    def search_text_corpus(self, index='news_index', query={}, \
                           fields= ["text_prep_noun_content_array"]):
        """
        - 검색 데이터 10000개 넘어도 조회 가능
        - index : new_index
        - 사용할 쿼리
          > create_query에서 작성
        """
        RETRY_NUM = 0
        RETRY_MAX = 5
        WAITING_TIME = 5
        CONN_FAILED = True       
        while CONN_FAILED and RETRY_NUM != RETRY_MAX:
            try:
                num_data = self._check_data_num(index=index, query=query)
                num_loop = num_data // 10000 + 1

                total_res = []
                body = {
                            'sort': [
                                        {
                                          "createdAt": {"order": "asc"}
                                        }
                                    ],
                            'size': self.size,
                            '_source': fields,
                            'query': query
                        }
                
                is_loop = True
                i = 0
                while is_loop:
                    if i != 0:
                        body['search_after'] = [sort_num]
                    res = self.es.search(index=index, body=body)
                    hits = res['hits']['hits']
                    total_res += hits
                    
                    event_date_lst = [hit['sort'][0] for hit in hits]
                    unique_event_date_lst = sorted(list(set(event_date_lst)))
                    if len(unique_event_date_lst) > 1:
                        sort_num = unique_event_date_lst[-2]
                    elif len(unique_event_date_lst) == 1:
                        sort_num = unique_event_date_lst[-1]
                    else: # hits에 데이터가 없음
                        is_loop = False
                    i += 1
                    
            except Exception as e:
                time.sleep(WAITING_TIME)
                print('e/s connection error')
            else:
                CONN_FAILED = False
                print('e/s connection success')
            finally:
                RETRY_NUM += 1
                if RETRY_NUM > 1:
                    print(f"e/s retry num >> {RETRY_NUM}")
 
        return total_res

    
    def es_to_pandas(self, index='news_index', query={}, \
                     fields = ["text_prep_noun_content_array"]):
        """
        es에서 가져온 데이터로 df 생성(_id 포함) 
        - drop_duplicates 해도 id가 걸려있어서 내용은 같지만 id가 다른 경우는 서로 다른 데이터로 고려
        """
        hits = self.search_text_corpus(index=index, query=query, fields=fields)
        data_dict = {}
        for hit in hits:
            one_dict = hit['_source'] # {"field": field content,}
            _id = hit['_id']
            data_dict[_id] = one_dict
        
        df =  pd.DataFrame(data_dict).T
        df = df.rename_axis("_id").reset_index()        
        return df

        
    def search_to_lst(self, index='news_index', query={}, fieldname="text_prep_noun_content_array"):
        """
        특정 field의 데이터 list로 가져오기
        - 중복데이터 제거(내용이 같으면 1개만 사용)
        """
        RETRY_NUM = 0
        RETRY_MAX = 5
        WAITING_TIME = 5
        CONN_FAILED = True   
        
        while CONN_FAILED and RETRY_NUM != RETRY_MAX:
            try:
                num_data = self._check_data_num(index=index, query=query)
                num_loop = num_data // 10000 + 1

                total_res = []
                body = {
                            'sort': [
                                        {
                                          "createdAt": {"order": "asc"}
                                        }
                                    ],
                            'size': self.size,
                            '_source': [fieldname],
                            'query': query
                        }
                is_loop = True
                i = 0
                while is_loop:
                    if i != 0:
                        body['search_after'] = [sort_num]
                    res = self.es.search(index=index, body=body)
                    hits = res['hits']['hits']
                    for hit in hits:
                        output = hit['_source'][fieldname]
                        total_res.append(output)

                    event_date_lst = [hit['sort'][0] for hit in hits]
                    unique_event_date_lst = sorted(list(set(event_date_lst)))
                    if len(unique_event_date_lst) > 1:
                        sort_num = unique_event_date_lst[-2]
                    elif len(unique_event_date_lst) == 1:
                        sort_num = unique_event_date_lst[-1]
                    else: # hits에 데이터가 없음
                        is_loop = False
                    i += 1
                
                total_res = list(set(total_res))
                if 'array' in fieldname:
                    total_res = [ast.literal_eval(res) for res in total_res]
                        
            except Exception as e:
                raise(e)
                time.sleep(WAITING_TIME)
                print('e/s connection error')
            else:
                CONN_FAILED = False
                print('e/s connection success')
            finally:
                RETRY_NUM += 1
                if RETRY_NUM > 1:
                    print(f"e/s retry num >> {RETRY_NUM}")
                        
        return total_res




#----------------------------------------------------------------------------
def print_elapsed_time(start_time):
    """경과시간 출력."""
    end_time = time.time() - start_time
    hours = end_time // 3600
    minutes = (end_time % 3600) // 60
    seconds = round((end_time % 3600) % 60, 4)
    print("*** Elapsed time : {0} hour {1} min {2} sec".format(hours,
                                                               minutes,
                                                               seconds))
    return hours, minutes, seconds



def create_query(start_date, end_date):
    """날짜는 0000-00-00 형식으로 입력"""
    start_date += "T00:00:00"
    end_date += "T24:00:00"
    
    query = {
        "range": {
            "createdAt": {
                "time_zone": "+09:00",
                "gte": start_date,
                "lt": end_date
            }
        }
      }
    return query


if __name__ == "__main__":
    esapi = ESapi()
    index = 'news_index'
    start_date = "2022-08-27"
    end_date = "2022-08-27"
    query = create_query(start_date, end_date)
    data_list = esapi.search_to_lst(index, query, fieldname="text_prep_noun_content_array")
    #print(f"*** 데이터 {len(data_list)}개")
    #print(data_list)
    df = esapi.es_to_pandas(index, query)
    print(f"데이터 {len(df)}개")
     
    


