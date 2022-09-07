from collections import Counter
from wordcloud import WordCloud

from config.utils import ESapi, create_query


class ModelWordCloud:
    """ES에서 데이터 받아와서 만드는 WordCloud"""
    
    def __init__(self, start_date, end_date, esapi=ESapi()):
        self.start_date = start_date
        self.end_date = end_date
        self.esapi = esapi

    def get_data(self, fieldname):
        query = create_query(self.start_date, self.end_date)
        data_list = self.esapi.search_to_lst(query=query, fieldname=fieldname) # list of list
        one_list = []
        for data in data_list:
            one_list += data
        return one_list

    def get_wordscore_result(self, fieldname='text_prep_noun_content_array', n=100):
        """output: tuple of list[(word1, freq1), (word2, freq2), ...]"""
        word_list = self.get_data(fieldname=fieldname)
        counts = Counter(word_list)
        tags = counts.most_common(n)
        result_dict = {w:f for w, f in tags}
        return result_dict



if __name__ == "__main__":
    date = "2022-08-27"
    wc = ModelWordCloud(start_date=date, end_date=date)
    print(wc.get_wordscore_result())

    # wc = WordCloud(font_path="/root/toyproject/Model/utils/NanumSquareB.otf",background_color="white", max_font_size=60)
    # cloud = wc.generate_from_frequencies(dict(tags)) # tags = counts.most_common(100)
    # cloud.to_file('/root/toyproject/Model/test.jpg')

