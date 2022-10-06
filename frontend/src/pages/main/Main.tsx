import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setListOfPopularWord } from '../../redux/features/wordSlice';
import { searchListOfPopularWordAPICall } from '../../redux/features/wordSlice';
import { setListOfWordcloud, clearWordcloudState } from '../../redux/features/wordcloudSlice';
import { searchListOfWordcloudAPICall } from '../../redux/features/wordcloudSlice';
import Wordcloud from '../../components/wordcloud/Wordcloud';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './Main.styled';

const Main = () => {
    const dispatch = useAppDispatch();
    const { listOfPopularWord } = useAppSelector(state => state.word);
    const { listOfWordcloud } = useAppSelector(state => state.wordcloud);

    useEffect(() => {
        dispatch(searchListOfPopularWordAPICall()).unwrap().then((response: any) => {
            dispatch(setListOfPopularWord(response));
        });
    }, [dispatch]);

    const date = useRef<Date>(new Date());
    const decrementDate = (): void => {
        date.current = new Date(new Date().setDate(date.current.getDate() - 1));
    };
    const formatDateToString = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        dispatch(clearWordcloudState());

        const paramsOfSearch = {
            start_date: formatDateToString(date.current),
            end_date: formatDateToString(date.current)
        };
        dispatch(searchListOfWordcloudAPICall(paramsOfSearch)).unwrap()
            .then((response: any) => Object.entries(response).length !== 0 && dispatch(setListOfWordcloud(response)))
            .then((ExistsTodayData: boolean | object) => {
                if (ExistsTodayData) {
                    return;
                }

                decrementDate();

                paramsOfSearch['start_date'] = formatDateToString(date.current);
                paramsOfSearch['end_date'] = formatDateToString(date.current);

                return dispatch(searchListOfWordcloudAPICall(paramsOfSearch)).unwrap();
            })
            .then((response: any | undefined) => {
                if (typeof response === 'undefined') {
                    return;
                }

                dispatch(setListOfWordcloud(response));
            });
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