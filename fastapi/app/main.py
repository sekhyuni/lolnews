import os
import sys
path=os.getcwd()
sys.path.append(path)
import json
import pandas as pd

from config import es_config
from typing import Optional
from fastapi import FastAPI

from elasticsearch import Elasticsearch

app = FastAPI()
es = Elasticsearch(es_config.es_address, verify_certs=False) 

@app.get("/")
def es_search_test():
    return "검색 엔진 TEST 입니다."

@app.get("/search/keyword")
def search_keyword(q:Optional[str]=None):
    global es 
    result = es.search(index=es_config.index_name,
                       body={
                        'query': {'match': {
                            'content': q
                        }
                    }
                }
            )

    result = result['hits']['hits']

    return result