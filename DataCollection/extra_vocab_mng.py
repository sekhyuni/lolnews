# -*- coding: utf-8 -*-
import os
import csv
import time
import random
import subprocess
import warnings
from config import *

# Warning 제거
# warnings.filterwarnings(action="ignore")
with warnings.catch_warnings():
    warnings.simplefilter('ignore')

class ManagerUserdic:
    """
    새로 추가한 단어가 mecab 사용자 정의 사전에 반영되도록 돕는 manager
    """
    def __init__(self, 
                 extra_vocab_fpath=EXTRA_VOCAB_PATH,
                 base_dic_dir=BASE_MECAB_DIC_DIR, new_dic_dir=NEW_MECAB_DIC_DIR):
        self.base_dic_dir = base_dic_dir
        self.new_dic_dir = new_dic_dir
        self.extra_vocab_fpath = extra_vocab_fpath # 사용자가 입력한 사전 위치
        # self.log = log
        # self.err_log = err_log
    

    def init_mecab_usedic(self):
        """
        이전 mecab-ko-dic-use를 제거하고 새 사전(mecab-ko-dic-notouch) 가져오기
        """
        cmd_list = [
            f'rm -rf {self.new_dic_dir}',
            f'cp -rf {self.base_dic_dir} {self.new_dic_dir}'
        ] 
        for cmd in cmd_list:
            # self.log.debug(cmd)
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, encoding='utf-8')
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                # if output:
                #     self.log.debug(output.strip())

        print(">>> Done initiation mecab-ko-dic-use")           
        

    def _push_word_to_userdic(self, word_list):
        """
        단어들을 user-dic/extra_nng.csv의 형식에 맞게 입력
        """
        total_word_nums = len(word_list)
        
        userdict_path = os.path.join(self.new_dic_dir, "user-dic/extra_nng.csv")
        
        with open(userdict_path, 'a', encoding='utf-8', newline='') as f_out:
            writer = csv.writer(f_out)
            for idx, word in enumerate(word_list):
                jongsung = 'F' if (ord(word[-1]) - 44032) % 28 == 0 else 'T'
                line = [word, "", "", "-5000", "NNG", "*", jongsung, word, "*", "*", "*", "*"]
                writer.writerow(line)
                # if ((idx+1) % 1000 == 0) & (idx+1 != total_word_nums):
                #     self.log.debug(f"{idx+1}/{total_word_nums}...")
                if idx+1 == total_word_nums:
                    print(f"{idx+1}/{total_word_nums}...")
        print(f'>>> Done pushing all words({total_word_nums} nums) to user-dict')       


    def _get_extra_nng_list(self):
        """사용자가 추가한 단어(extra-vocab.csv) -> list로 반환"""
        word_list = []
        with open(self.extra_vocab_fpath, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                word_list.append(row[0])
        return word_list


    def create_extra_nng_csv(self):
        """
        사용자가 추가한 단어(extra-vocab.csv)를 mecab의 user-dic/extra_nng.csv에 넣어주기
        - extra-vocab.csv : 단어,등록일자
        - extra_nng.csv : mecab 형식에 맞춰서 (예) 당생활지도부문,*,*,-5000,NNG,*,T,당생활지도부문,*,*,*,*
        """
        word_list = self._get_extra_nng_list()
        self._push_word_to_userdic(word_list)     


    def mecab_vocab_install(self):
        """mecab vocab 재설치"""
        os.chdir(self.new_dic_dir)
        cmd_list = [
            'chmod +x configure',
            './configure',
            'make',
            'make install'
        ]        

        for cmd in cmd_list:
            # self.log.debug(f"--> {cmd}") ###
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, 
                                       stderr=subprocess.PIPE, encoding='utf-8')
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                # if output:
                #     self.log.debug(output.strip())
            # self.log.debug('-'*50) ###


    def mecab_vocab_compile(self):
        """mecab user-dic에 있는 단어 compile"""
        os.chdir(self.new_dic_dir)
        cmd_list = [
            'bash tools/add-userdic.sh',
            'make',
            'make install'
        ]
        
        for cmd in cmd_list:
            # self.log.debug(f"--> {cmd}") ###
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, 
                                       stderr=subprocess.PIPE, encoding='utf-8')
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
            #     if output:
            #         self.log.debug(output.strip())
            # self.log.debug('-'*50) ###
   
    def main(self):
        start_time = time.time()
        # 사전 초기화
        self.init_mecab_usedic()
        # 사용자 사전 추가
        self.create_extra_nng_csv()
        # 사전 설치
        self.mecab_vocab_install()
        # 사용자 정의 사전 compile
        self.mecab_vocab_compile()
        print(f">>> Load vocab for Mecab -> total elapsed time: {round(time.time()-start_time, 5)}sec")

if __name__ == "__main__":
    # 테스트
    test_num = int(input("번호를 입력하세요(1: extra vocab 추가, 2: extra vocab 추가됐는지 확인) "))
    if test_num == 1:
        from extra_vocab_mng import ManagerUserdic
        # Prepare Mecab vocab
        dic_manager = ManagerUserdic()
        dic_manager.main()
    elif test_num == 2:
        extra_vocab_fpath = EXTRA_VOCAB_PATH
        csvfile = open(extra_vocab_fpath, "r")
        reader = csv.reader(csvfile)
        csv_line_list = list(reader)
        if not csv_line_list:
            print("extra_vocab.csv에 추가된 단어가 없습니다.")
        else:
            last_line = csv_line_list[-1]
            last_word = last_line[0]
            print(f"--> Last word: {last_word}")
            from konlpy.tag import Mecab
            m = Mecab()
            result = m.pos(last_word)
            print(f"--> Result of Mecab : {result}")
            if (len(result) == 1) & (result[0][1] == 'NNG'):
                print("사용자 정의 사전에 extra_vocab.csv이 제대로 등록됨")
            else:
                print("※사용자 정의 사전에 extra_vocab.csv가 제대로 등록되지 않음※")
    else:
        print("번호를 잘못 입력했습니다. 다시 시도해주세요.")
    