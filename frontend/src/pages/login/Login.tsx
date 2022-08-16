import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../layouts/footer/Footer';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Login.styled';

const Login = ({ setIsAuthorized, keyword, setKeyword }: any) => {
    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <Form setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} />
                </S.Section>
            </S.Main>
            <Footer layoutName="login" />
        </S.DivOfLayoutWrapper>
    );
};

const Form = ({ setIsAuthorized, keyword, setKeyword }: any) => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <S.DivOfLoginForm>
                <S.LinkOfLogo to="/" onClick={() => { setKeyword(''); }}><S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} /></S.LinkOfLogo>
                <S.Form onSubmit={event => {
                    event.preventDefault();

                    const params = {
                        id,
                        password,
                    };
                    doAxiosRequest('POST', `${BASE_URL}/accounts/signin`, params)
                        .then((result: any) => {
                            if (result.data.result.isPermitted) {
                                setIsAuthorized(true);
                                alert(`${result.data.result.id}님 정상적으로 로그인되었어요!`);

                                keyword ? navigate(`/search/?query=${keyword}`) : navigate('/');
                            } else {
                                alert(result.data.result.reason);
                            }
                        }).catch((error: any) => {
                            alert(`Login ${error}`);
                            console.error(error);
                        });
                }}>
                    <S.Label>
                        <S.Span>아이디</S.Span>
                        <S.Input type="text" value={id} onChange={event => { setId(event.target.value); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>비밀번호</S.Span>
                        <S.Input type="password" value={password} onChange={event => { setPassword(event.target.value); }} />
                    </S.Label>
                    <S.ButtonOfSubmit type="submit">로그인</S.ButtonOfSubmit>
                </S.Form>
            </S.DivOfLoginForm>
            <S.DivOfToJoinForm>
                <S.P>계정이 없으신가요? <S.LinkOfToJoin to="/join">가입하기</S.LinkOfToJoin></S.P>
            </S.DivOfToJoinForm>
        </>
    );
};

export default Login;