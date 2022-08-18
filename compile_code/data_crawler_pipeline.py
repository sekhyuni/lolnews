from functools import partial

import kfp
from kfp.dsl import pipeline
from kfp.components import InputPath, OutputPath, create_component_from_func

@partial(
    create_component_from_func,
    packages_to_install = ["beautifulsoup4", "requests", "fake_useragent", "pandas"],
)
def crawling_data(
    datetime: str,
    data_path: OutputPath("csv"),
):  
    import os
    import sys
    sys.path.append('/module')
    from data_crawler import NaverNewsCrawler

    cralwer = NaverNewsCrawler(date=datetime)
    data = cralwer.get_news_data()
    cralwer.create_news_data(data_path , data)

@partial(
    create_component_from_func,
    packages_to_install= ["pandas", "dill"]
)
def csv_to_json(
    crawling_data: InputPath("csv"),
    json_data: OutputPath("json"),
):
    import pandas as pd
    import json
    import dill

    df = pd.read_csv(crawling_data)
    df=df[['title','content', 'thumbnail','pcLinkUrl', 'officeName', 'updatedAt', 'createdAt']]

    js_data = json.loads(df.to_json(orient='records', force_ascii=False, date_format='iso'))
    
    with open(json_data, 'w', encoding='utf-8') as outfile:
        json.dump(js_data, outfile)
    
@partial(
    create_component_from_func,
    packages_to_install=["elasticsearch==7.12.0", "dill"],
)
def es_data_update(
    json_data: InputPath("json"),
):
    from elasticsearch import Elasticsearch
    import json 
    import dill
    import warnings
    warnings.filterwarnings('ignore')

    # elasticsearch accesss
    es = Elasticsearch(['https://elastic:4w88klz48xcgvdq8m9gsncvt@192.168.1.10:32311'], verify_certs=False)

    with open(json_data, encoding='utf-8') as json_file:
        es_data = json.loads(json_file.read())

    body = ""
    for i in es_data:
        body = body + json.dumps({"index": {"_index": "news_index"}}) + '\n'
        body = body + json.dumps(i, ensure_ascii=False) + "\n"
    
    es.bulk(body)    

@pipeline(name="news_data_crawling_pipeline")
def news_data_crawling_pipeline(datetime: str):
    data_crawler=crawling_data(datetime)
    data_proc=csv_to_json(crawling_data=data_crawler.outputs["data"],)
    
    _=es_data_update(json_data=data_proc.outputs["json_data"])


if __name__ == "__main__":
    kfp.compiler.Compiler().compile(news_data_crawling_pipeline, "new_data_crawling_pipeline.yaml")