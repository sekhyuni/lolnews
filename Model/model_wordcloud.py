from collections import Counter
from wordcloud import WordCloud


class ModelWordCloud:
    
    def __init__(self, start_date, end_date):
        self.start_date = start_date
        self.end_date = end_date

    def get_data(self):
        pass

    def get_wordscore_list(self, n=100):
        """output: tuple of list[(word1, freq1), (word2, freq2), ...]"""
        word_list = self.get_data()
        counts = Counter(word_list)
        tags = counts.most_common(n)
        return tags


if __name__ == "__main__":
    word_list = ['T1', '오너', '문현준', '자신', '시그', '처', '픽', '리신', 
                '평가', 'T1', '서울', '종로구', '그랑', '서울', 'LCK', '아레나', 
                '진행', '리그', '오브', '레전드', '챔피', '언스', '코리아', '서머', 
                '라운드', '디알엑스', '제압', '문현준', '세트', '리신', '세트', '비에고', 
                '맹활약', '팀', '승리', '경기', '후', '인터뷰', '문현준', '개인', '리신', 
                '만능', '생각', '오공', '비에고', '티어', '설명', '연승', '부담감', '연승', 
                '아쉬움', '연승', '아쉬움', '다음', '문현준', '일문일답', '승리', '소감', '경기', 
                '연승', '순항', '디알엑스', '상대', '완승', '다행', '기분', '단독', 'POG', '본인', 
                '경기력', '평가', '정도', '긴장', '스킬', '경우', '아쉬움', '긴장', '이유', '특별', 
                '이유', '게임', '진행', '경기', '패배', '원인', '상대', '준비', '픽', '예상', '광동', 
                '준비', '게임', '제우스', '최우제', '호흡', '생각', '최우제', '아마추어', '생활', '지금', 
                '호흡', '생각', '최우제', '연승', '마음', '연승', '부담감', '연승', '아쉬움', '리신', 
                '평가', '공격력', '버프', 'AD', '정글', '상대', '개인', '리신', '만능', '생각', '오공', 
                '비에고', '티어', '리신', '플레이', '집중', '생각', '상대', '딜러', '리신', '압박', 
                '불편', '위치', '중요', '궁', '배달', '아군', '궁', '사용', '가능', '데뷔', '기억', 
                '순간', '월드', '챔피언십', '롤', '드', '컵', '강', '순간', '기억', '마지막', '데뷔', 
                '기분', '팬', '감사', '날']

    counts = Counter(word_list)
    tags = counts.most_common(100)


    # wc = WordCloud(font_path="/root/toyproject/Model/utils/NanumSquareB.otf",background_color="white", max_font_size=60)
    # cloud = wc.generate_from_frequencies(dict(tags))
    # cloud.to_file('/root/toyproject/Model/test.jpg')