import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setListOfPopularWord } from '../../redux/features/wordSlice';
import { searchListOfPopularWordAPICall } from '../../redux/features/wordSlice';
import { setListOfWordcloud } from '../../redux/features/wordcloudSlice';
import { searchListOfWordcloudAPICall } from '../../redux/features/wordcloudSlice';
import Wordcloud from '../../components/wordcloud/Wordcloud';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './Main.styled';

const Main = () => {
    // Back-End API 연동 후, 아래 1줄 제거
    const result = { '리신': 7, '연승': 7, '생각': 5, '문현준': 4, '아쉬움': 4, '상대': 4, '평가': 3, '비에고': 3, '경기': 3, '최우제': 3, 't1': 2, '픽': 2, '서울': 2, '진행': 2, '디알엑스': 2, '세트': 2, '승리': 2, '개인': 2, '만능': 2, '오공': 2, '티어': 2, '부담감': 2, '기분': 2, '긴장': 2, '이유': 2, '게임': 2, '준비': 2, '호흡': 2, '궁': 2, '데뷔': 2, '기억': 2, '순간': 2, '오너': 1, '자신': 1, '시그': 1, '처': 1, '종로구': 1, '그랑': 1, 'LCK': 1, '아레나': 1, '리그': 1, '오브': 1, '레전드': 1, '챔피': 1, '언스': 1, '코리아': 1, '서머': 1, '라운드': 1, '제압': 1, '맹활약': 1, '팀': 1, '후': 1, '인터뷰': 1, '설명': 1, '다음': 1, '일문일답': 1, '소감': 1, '순항': 1, '완승': 1, '다행': 1, '단독': 1, 'POG': 1, '본인': 1, '경기력': 1, '정도': 1, '스킬': 1, '경우': 1, '특별': 1, '패배': 1, '원인': 1, '예상': 1, '광동': 1, '제우스': 1, '아마추어': 1, '생활': 1, '지금': 1, '마음': 1, '공격력': 1, '버프': 1, 'AD': 1, '정글': 1, '플레이': 1, '집중': 1, '딜러': 1, '압박': 1, '불편': 1, '위치': 1, '중요': 1, '배달': 1, '아군': 1, '사용': 1, '가능': 1, '월드': 1, '챔피언십': 1, '롤': 1, '드': 1, '컵': 1, '강': 1, '마지막': 1, '팬': 1 };

    const dispatch = useAppDispatch();
    const { listOfPopularWord } = useAppSelector(state => state.word);
    const { listOfWordcloud } = useAppSelector(state => state.wordcloud);

    useEffect(() => {
        dispatch(searchListOfPopularWordAPICall()).unwrap().then((response: any) => {
            dispatch(setListOfPopularWord(response));
        });
    }, [dispatch]);

    useEffect(() => {
        // Back-End API 연동 후, 아래 1줄 제거
        dispatch(setListOfWordcloud(result));

        // const paramsOfSearch = {
        //     start_date: '2022-10-01',
        //     end_date: '2022-10-03'
        // };
        // dispatch(searchListOfWordcloudAPICall(paramsOfSearch)).unwrap().then((response: any) => {
        //     dispatch(setListOfWordcloud(response.result));
        // });
    }, [dispatch]);

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.Nav>
                        {localStorage.getItem('id') ?
                            <Dropdown layoutName="main" />
                            :
                            <S.LinkOfLoginPage to="/login">로그인</S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    <S.Div>
                        <Input layoutName="main" />
                        {listOfPopularWord.length !== 0 &&
                            <S.DivOfPopularWordWrapper>
                                {listOfPopularWord.map((popularWord: string): JSX.Element => <S.LinkOfPopularWord to={`/search/?query=${popularWord}`}>{`#${popularWord}`}</S.LinkOfPopularWord>)}
                            </S.DivOfPopularWordWrapper>}
                    </S.Div>
                    {listOfWordcloud.length !== 0 && <Wordcloud />}
                </S.Section>
            </S.Main>
            <Footer layoutName="main" />
        </S.DivOfLayoutWrapper >
    );
};

export default Main;