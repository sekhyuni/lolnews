import { useState, useEffect } from 'react';
import doAxiosRequest from '../../functions/doAxiosRequest';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './Main.styled';

const Main = ({ keyword, setKeyword }: any) => {
    const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    const [listOfPopularWord, setListOfPopularWord] = useState<Array<string>>([]);

    useEffect(() => {
        const fetchData = (): void => {
            doAxiosRequest('GET', `${BASE_URL}/word`).then((resultData: any): void => {
                setListOfPopularWord(resultData.data);
            });
        }

        fetchData();
    }, []);

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.Nav>
                        {localStorage.getItem('id') ?
                            <Dropdown layoutName="main" setKeyword={setKeyword} />
                            :
                            <S.LinkOfLoginPage to="/login" onClick={(): void => {
                                setKeyword('');
                            }}>
                                로그인
                            </S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    <S.Div>
                        <Input layoutName="main" keyword={keyword} setKeyword={setKeyword} />
                        <S.DivOfPopularWordWrapper>
                            {listOfPopularWord.map((popularWord: string): JSX.Element => <S.LinkOfPopularWord to={`/search/?query=${popularWord}`}>{`#${popularWord}`}</S.LinkOfPopularWord>)}
                        </S.DivOfPopularWordWrapper>
                    </S.Div>
                </S.Section>
            </S.Main>
            <Footer layoutName="main" />
        </S.DivOfLayoutWrapper >
    );
};

export default Main;