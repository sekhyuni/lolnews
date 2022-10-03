import itertools

class ESConfig:
    ipport = "https://elastic:jp5r4fwmhfz2mz72k2k42lmz@10.233.47.116:9200"


class FastTextConfig:
    model_params = {
                    'sg': 1, # if 0, then CBOW
                    'vector_size': 50,
                    'window': 5, # default
                    'min_count': 3, 
                    'epochs': 40, 
                    'workers': 4
                    }
    model_dir = "/root/toy_project/Model/model"
    corpus_size_lb = 1 # 모델을 생성하기 위한 최소한의 기사 개수
    ws_thres = 0.5

    

class PostConfig:
    """
    연관어 후처리에 사용하는 설정
    """
    # 조사 제거---------------------------------------------------------------
    josa_lst = ['을', '를', '은', '는', '이', '가', '에', '의', '와', '과', '들',
                '들이', '들과', '들은', '들의', '들에', "에서", "도", "로"]
    
    # 검색어 + stopwords_suffix 제거------------------------------------------
    stopwords_suffix = []
    
    # 불용어----------------------------------------------------------------
    stopwords_noun_lst = [
                            "다음", '우리', '누구', '모두', '오늘', 
                            '지금', '이번', '저번', '가장', '바로', 
                            '그것', '이것', '저것', '최근', '모두', 
                            '기간', '활동', '시간', '역할', '현재', 
                            '사실', '여기', '저기', '거기', '무엇', 
                            '해당', '이어', '한편', '때문', '얼마나', 
                            '이후', '이전', '얼마', '많이', '당시', 
                            '자리',  '가운데', '이곳', '그곳', '저곳', 
                            '어디', '제일', '단지', '그간', '이때', '그때', 
                            '저때', '오늘날', '인근', '나날', '이렇게',
                            '그렇게', '저렇게', '이날', '그날', '저날', 
                            '어서', '문면', '마다', '무들', '정녕',
                            '1면', '2면', '3면', '4면', '5면', '6면',
                            '7면', '8면', '9면', '10면', '즈음',
                            '그길', '이길', '저길', 
                        ]
    stopwords_noun_with_josa_lst = [''.join(e) for e in itertools.product(stopwords_noun_lst, josa_lst)]


    stopwords_typo_lst = []
    ## 
    stopwords_verb_lst = [
                            '있다', '하다', '위하다', '없다', '보다',
                            '나가다',  '가고', '밝히다', '꾸려진', 
                            '펼쳐보인', '모셔졌', '모셔진', '모신', '오시',
                            '시여', '이시다', '태다', '커진다', "울려나온다",
                            "지켜갈", "아로새겨져", '서다', 
                        ]
    stopwords_lst = stopwords_noun_lst + stopwords_typo_lst + stopwords_verb_lst + \
                    [
                        'https', 'www', 'com', 'go', 'KH',           
                    ] + stopwords_noun_with_josa_lst
                    

    stopwords_to_valid_dict = {} # 변경전 단어: 변경후 단어   