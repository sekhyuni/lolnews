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



@pipeline(name="news_data_crawling_pipeline")
def news_data_crawling_pipeline(datetime: str):
    crawling_data(datetime)

if __name__ == "__main__":
    kfp.compiler.Compiler().compile(news_data_crawling_pipeline, "new_data_crawling_pipeline.yaml")