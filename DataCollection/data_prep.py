import os
import re
import csv
import glob
import random
import pandas as pd
import itertools
from string import ascii_lowercase
from datetime import datetime
from konlpy.tag import Mecab
from config import *


class TextPrep:
    """
    순서
    1. text_refine(정제)
    2. apply_thesaurus(시소러스)
    3. pos_analysis(형태소분석)
    """
    def __init__(self):
        self.mecab = Mecab()

    def text_analysis(self, text, valid_pos = ["NNG", "NNP", "SL"]):
        refined_text = self.text_refine(text)
        # print(f"after step1)\n{refined_text}")
        # print('-'*50)
        text_applied_thes, index_to_key = self.apply_thesaurus(refined_text)
        # print(f"after step2)\n{text_applied_thes}")
        # print('-'*50)
        text_valid_lst = self.pos_analysis(text_applied_thes)
        # print(f"after step3)\n{text_valid_lst}")
        # print('-'*50)
        decoded_text_lst = [index_to_key[word] if word in index_to_key else word for word, _ in text_valid_lst ]
        return decoded_text_lst

    def text_refine(self, text):
        """step1) 텍스트 정제"""
        
        # 엑스포츠 뉴스
        text = re.sub("\(.+기자\)", "", text)
        
        # 인벤
        text = re.sub("▲ 출처: 네이버.+기사제보 및 문의", '', text)
        text = re.sub("e스포츠인벤 Copyright.+기사제보 및 문의", '', text)
        
        # 포모스
        text = re.sub("포모스와 함께 즐기는 e스포츠,.+무단 +전재 +및 +재배포 +금지 +포모스", "", text)
        
        # 스포츠 서울
        text = re.sub("(사진)*제공.+ 기자\]", '', text)
        
        # 국민일보
        text = re.sub("\[네이버 메인에서 채널 구독하기\].+재배포금지", "", text)
        text = re.sub("\[국민일보 채널 구독하기\].+재배포금지", "", text)
        text = re.sub('LCK 제공', "", text)
        
        # 공통
        text = re.sub("^사진( 출처)*=[가-힣a-zA-Z0-9 ]+(\,|\.)", "", text)
        text = re.sub("\xa0", " ", text)
        text = re.sub('\[[^\]]+\]', " ", text)
        photos = re.findall("사진=.+$", text)
        if photos:
            if len(photos[0]) < 20:
                text = re.sub("사진=.+$", "", text)
        text = re.sub(r"((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*", "", text)

        # 
        text = re.sub("[^ㄱ-ㅎ가-힣0-9a-zA-Z\.\?\!\[\]\-\/\:\%\(\) ]+", "", text)
        text = re.sub("\(\)", '', text)
        text = re.sub(' {2,}', ' ', text).strip()
        text = re.sub('[가-힣a-zA-Z\,\/\ ]+ 기자$', '', text).strip()
        text = text.strip("/").strip()
        
        # 영어는 소문자로 변환
        text = text.lower()

        return text

    def pos_analysis(self, text_applied_thes, valid_pos = ["NNG", "NNP", "SL"]):
        """step3) 형태소 분석"""
        text_pos_lst = self.mecab.pos(text_applied_thes)
        text_valid_lst = [(word, pos) for word, pos in text_pos_lst if pos in valid_pos]
        return text_valid_lst

    def _iter_all_strings(self):
        for size in itertools.count(1):
            for s in itertools.product(ascii_lowercase, repeat=size):
                yield "".join(s)

    def apply_thesaurus(self, text):
        """step2) 따로 구축한 시소러스를 활용한 명사 추출
        - output: 치환된 결과, decode를 위한 dictionary"""
        # Load thesaurus
        f = open(THESAURUS_FILE_PATH, 'r', encoding='utf-8')
        words = f.read().splitlines()
        
        # 치환
        index_to_key = {}
        tag = 'THES'
        gen = self._iter_all_strings()
        for word in words:
            if word in text:
                cd = tag + next(gen)
                index_to_key[cd] = word
                text = re.sub(word, cd, text)
        return text, index_to_key
        
    def create_prep_file(self, date):
        with open(f"{CRAWLING_DATA_DIR}latest/{date}.csv", 'r', encoding='utf-8') as fin:
            with open(f"{CRAWLING_DATA_DIR}prep/{date}.csv", 'w', encoding='utf-8') as fout:
        
                reader = csv.reader(fin)
                writer = csv.writer(fout)

                header = next(reader)
                header.append("text_prep_title_array")
                header.append("text_prep_content_array")
                writer.writerow(header)

                idx_title = header.index('title')
                idx_content = header.index('content')
                for item in reader:
                    title = item[idx_title]
                    content = item[idx_content]
                    item.append(self.text_analysis(title))
                    item.append(self.text_analysis(content))
                    writer.writerow(item)
        
if __name__ == "__main__":
    preper = TextPrep()
    crawled_file_lst = glob.glob(os.path.join(CRAWLING_DATA_DIR, 'latest') + '/*.csv')
    date_lst = [i.split('/')[-1][:-4] for i in crawled_file_lst]
    for date in date_lst:
        preper.create_prep_file(date)
        print(f">>> Done preprocessing {date}")
