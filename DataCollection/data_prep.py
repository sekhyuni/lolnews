import re
import glob
import random
import pandas as pd
from datetime import datetime
from konlpy.tag import Mecab


class TextPrep:

    def __init__(self):
        self.mecab = Mecab()

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
        
        return text
    

    def pos_analysis(self, refined_text):
        """step2) 형태소 분석"""
        pass
    

    def _apply_user_dict(self, text):
        """따로 구축한 시소러스를 활용한 명사 추출
        - output: 치환된 결과, decode를 위한 dictionary"""
        pass


    def create_prep_file(self, data, fpath):
        pass


if __name__ == "__main__":
    pass