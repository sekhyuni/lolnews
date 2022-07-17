import os
import json
from config import es_config
import pandas as pd

from elasticsearch import Elasticsearch
import warnings

warnings.filterwarnings('ignore')


class elasticsearch_index_update:
    def __init__(self):
        self.es_address = es_config.es_address
        self.index_name = es_config.index_name
        self.path = es_config.base_path
        self.csv_data = es_config.csv_data

    def csv_to_json(self):
        file = pd.read_csv(os.path.join(self.path, self.csv_data))
        file = file[['title','content', 'thumbnail','pcLinkUrl']]

        json_file = json.loads(file.to_json(orient='records', force_ascii=False))

        with open(os.path.join(self.path, "sample.json"), 'w', encoding='utf-8') as outfile:
            json.dump(json_file, outfile)

    def es_index_create(self):
        es = Elasticsearch(self.es_address, verify_certs=False)
        es.indices.create(
        index=self.index_name,
        body={
            "settings": {
                "index": {
                    "analysis": {
                        "analyzer": {
                            "my_analyzer": {
                                "type": "custom",
                                "tokenizer": "nori_tokenizer"
                            }
                        }
                    }
                }
            },
            "mappings": {
                    "properties": {
                        "title": {
                            "type": "text",
                            "analyzer": "my_analyzer"
                        },
                        "content": {
                            "type": "text",
                            "analyzer": "my_analyzer"
                        },
                        "thumbnail": {
                            "type": "keyword"
                        },
                        "pcLinkUrl": {
                            "type": "keyword"
                        }
                    }
                }
            }
    )

    def es_data_insert(self, json_data):
        es = Elasticsearch(self.es_address, verify_certs=False)
        
        with open(os.path.join(self.path, json_data)) as json_file:
            json_data = json.loads(json_file.read())

        body = ""
        for i in json_data:
            body = body + json.dumps({"index" : {"_index": self.index_name}}) + '\n'
            body = body + json.dumps(i, ensure_ascii=False) + '\n'
    
        es.bulk(body)
    
if __name__=="__main__":
    es_up = elasticsearch_index_update()
    es_up.csv_to_json()
    es_up.es_index_create()
    json_data = "sample.json"
    es_up.es_data_insert(json_data)
