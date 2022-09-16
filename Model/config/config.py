class ESConfig:
    ipport = "https://elastic:jp5r4fwmhfz2mz72k2k42lmz@10.233.47.116:9200"


class FastTextConfig:
    model_params = {
                    'sg': 1, # if 0, then CBOW
                    'vector_size': 60,
                    'window': 5, # default
                    'min_count': 5, # default 
                    'epochs': 10, # 30이었음
                    'workers': 128
                    }
    model_dir = "/data/aip/common_data/general_03_WS/general_03_WS/model"
    corpus_size_lb = 1 # 모델을 생성하기 위한 최소한의 기사 개수
    ws_thres = 0.5

    # 지능형검색 모델
    search_model_name = "1year_v80_e50_w10" # 최근 1년
    
