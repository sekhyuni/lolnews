import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setListOfPopularWord } from '../../redux/features/wordSlice';
import { searchListOfPopularWordAPICall } from '../../redux/features/wordSlice';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './Main.styled';

const Main = () => {
    const dispatch = useAppDispatch();
    const { listOfPopularWord } = useAppSelector(state => state.word);

    useEffect(() => {
        dispatch(searchListOfPopularWordAPICall()).unwrap().then((response: any) => {
            dispatch(setListOfPopularWord(response));
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
                </S.Section>
            </S.Main>
            <Footer layoutName="main" />
        </S.DivOfLayoutWrapper >
    );
};

export default Main;