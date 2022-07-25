from tracemalloc import start
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent # User-urgent로 connection 막힌 것 해결 
import json
import csv
import pandas as pd
from datetime import datetime, timedelta


class NaverNewsCrawler:
    today = datetime.now().strftime("%Y-%m-%d")
    def __init__(self):
        self.data_dir = "C:/Users/mzmj/Desktop/toyproject/DataCollection/crawling_data"

    def get_news_date_range(self, start_date, end_date):
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')

        while True:
            date = start_dt.strftime('%Y-%m-%d')
            data = self.get_news_data(date=date)
            datapath = f"{self.data_dir}/{date}.csv"
            self.create_news_data(datapath, data)
            print(f'>>> Done create {date} data')
            start_dt = start_dt + timedelta(days=1)
            if start_dt > end_dt:
                break

    def get_news_data(self, date=today):
        
        news_info = self._get_news_info(date)
        if not news_info:
            print("No data")
        else:
            data = []
            for news in news_info:
                url = news["pcLinkUrl"]
                content = self._get_news_content(url)
                news_added_content = {k: v for k, v in news.items() if k != 'subContent'}
                news_added_content['content'] = content
                data.append(news_added_content)
            return data
            

    def create_news_data(self, datapath, data):
        """
        data는 list of dicts
        """
        fieldnames = list(data[0].keys())
        with open(datapath, 'a', encoding='utf-8') as csvfile:
            fieldnames = fieldnames # 위에서 정의
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames, restval=None, lineterminator = '\n')
            writer.writeheader()
            writer.writerows(data)


    def _get_news_info(self, date):
        ua = UserAgent()
        headers = {
            'authority': 'apis.naver.com',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent' : ua.random
            # 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        }

        params = {
            'newsType': 'lol',
            'sort': 'latest',
            'day': date,
        }

        response = requests.get('https://apis.naver.com/nng_main/esports/v1/news/list', params=params, headers=headers)
        news_info_json = json.loads(response.text)['content']
        return news_info_json


    def _get_news_content(self, url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        news_content = soup.select_one("#newsEndContents")
        news_content_split_list = list(news_content.strings)
        idx = news_content_split_list.index('기사제공')
        content = ' '.join(news_content_split_list[:idx])
        return content.strip()

        
if __name__ == "__main__":
    # test1
    # date = input("날짜를 입력하세요(예: 2022-07-13): ")
    # cralwer = NaverNewsCrawler()
    # data = cralwer.get_news_data(date)
    # datapath = f"/root/toyproject/DataCollection/crawling_data/{date}.csv"
    # cralwer.create_news_data(datapath, data)
    # print(f'>>> Done create {date} data')
    #----------------------
    # test2
    cralwer = NaverNewsCrawler()
    start_date = '2022-07-01'
    end_date = "2022-07-26"
    cralwer.get_news_date_range(start_date, end_date)