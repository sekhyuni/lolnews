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

    def text_analysis(self, text, only_noun=True):
        """Preprcessing 전체
        - input) 원본 텍스트
        - output) 토큰 list"""
        refined_text = self.text_refine(text)
        # print(f"after step1)\n{refined_text}")
        # print('-'*50)
        text_applied_thes, index_to_key = self.apply_thesaurus(refined_text)
        # print(f"after step2)\n{text_applied_thes}")
        # print('-'*50)
        text_valid_lst = self.pos_analysis(text_applied_thes, only_noun)
        # print(f"after step3)\n{text_valid_lst}")
        # print('-'*50)
        decoded_text_lst = [index_to_key[word] if word in index_to_key else word for word, _ in text_valid_lst ]
        return decoded_text_lst

    def text_refine(self, text):
        """step1) 텍스트 정제"""

        # html character entity
        text = re.sub('&lt;', "", text) # <
        text = re.sub("&gt;", "", text) # >
        text = re.sub("&nbsp;", "", text) # 공백
        text = re.sub("&amp;", "", text) # &
        text = re.sub("&quot;", "", text) # "         
        
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

    def pos_analysis(self, text_applied_thes, only_noun=True):
        """step3) 형태소 분석"""
        text_pos_lst = self.mecab.pos(text_applied_thes)
        if only_noun:
            valid_pos = ["NNG", "NNP", "SL"]
            text_valid_lst = [(word, pos) for word, pos in text_pos_lst if pos in valid_pos]
        else:
            valid_pos = ["NNG", "NNP", "NNB", "NNBC", "NR", # 대명사 제외
                         "VV", "VA", "MAG", "SL", "SN", "VX", "XR"]
            text_pos_lst = [(word+'다', pos) if pos in ['VV', 'VA', 'VX'] else (word, pos) \
                        for word, pos in text_pos_lst ]
            pv = re.compile(r"VX|VV|VA") 
            text_valid_lst = [(word, pos)
                                for word, pos
                                in text_pos_lst
                                if (pos in valid_pos) | (re.search(pv, pos) is not None)]
            text_valid_lst = self._combine_pos_sn_nnbc(text_valid_lst)
        return text_valid_lst

    def _combine_pos_sn_nnbc(self, pos_lst):
        """
        input : 형태소분석 결과 list [(word1, pos1), (word2, pos2), ...]
        output : 형태소분석 결과 list [(word1, pos1), (word2, pos2), ...]
            - SN + NNBC = NNBC로 합치기
        예) 2주 = [('2', 'SN'), ('주', 'NNBC)] -> [('2주', 'NNBC')]
        """
        res_sn = ()
        final_pos_lst = []
        for res in pos_lst:
            next_word, next_pos = res
            if res_sn:
                if next_pos == "NNBC":
                    word, _ = res_sn
                    next_word = word + next_word
                    final_pos_lst.append((next_word, next_pos))
                    res_sn = ()
                elif next_pos == 'SN':
                    final_pos_lst.append(res_sn)
                    res_sn = res
                else:
                    final_pos_lst += [res_sn, res]
                    res_sn = ()
            else:
                if next_pos == 'SN':
                    res_sn = res
                else:
                    final_pos_lst.append(res)
        return final_pos_lst

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
                header.append("text_prep_noun_title_array")
                header.append("text_prep_noun_content_array")
        
                writer.writerow(header)

                idx_title = header.index('title')
                idx_content = header.index('content')
                for item in reader:
                    title = item[idx_title]
                    content = item[idx_content]
                    item.append(self.text_analysis(title, only_noun=False))
                    item.append(self.text_analysis(content, only_noun=False))
                    item.append(self.text_analysis(title, only_noun=True))
                    item.append(self.text_analysis(content, only_noun=True))
                    writer.writerow(item)
        
if __name__ == "__main__":
    # Test1 (크롤링한 데이터 전처리해서 다시 저장)
    preper = TextPrep()
    crawled_file_lst = glob.glob(os.path.join(CRAWLING_DATA_DIR, 'latest') + '/*.csv')
    date_lst = [i.split('/')[-1][:-4] for i in crawled_file_lst]
    for date in date_lst:
        preper.create_prep_file(date)
        print(f">>> Done preprocessing {date}")
    # # Test2 (텍스트 넣어보기)
    # # text = """Liiv Sandbox 이에 더해 쉬바나를 5판, 레넥톤을 2판 플레이하며 조커픽으로 활용할 여지를 더했다. 서머 시즌 우승팀은 리그오브레전드 월드 챔피언십(롤드컵) 직행이 확정된다. T1과 젠지 양 팀 모두 플레이오프 2라운드 상대팀 선택권을 갖는 리그 1위를 노리는 이유다. 유독 T1에게 약한 모습을 보였던 젠지가 오늘 트라우마를 극복할지, 아니면 T1이 다시 한번 젠지에게 공포심을 더할지 그 결과에 따라 서머 시즌 우승팀이 가려질 것으로 보인다."""
    # text = "[위클리 파워랭킹] 정글 모르가나 선보인 '피넛', 2주 연속 정글 1위"
    # print(text)
    # print('-'*50)
    # print(TextPrep().text_analysis(text, only_noun=False))