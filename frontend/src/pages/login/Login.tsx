import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../layouts/footer/Footer';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Login.styled';
import { Navigate } from 'react-router-dom';

const Login = ({ setAuth }: any) => {
    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <Form setAuth={setAuth} />
                </S.Section>
            </S.Main>
            <Footer layoutName="login" />
        </S.DivOfLayoutWrapper>
    );
};

const Form = ({ setAuth }: any) => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <S.DivOfLoginForm>
                <S.Link to="/"><S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} /></S.Link>
                <S.Form onSubmit={event => {
                    event.preventDefault();

                    const params = {
                        id,
                        password,
                    };
                    doAxiosRequest('POST', `${BASE_URL}/accounts/signin`, params)
                        .then((result: any) => {
                            setAuth(true);

                            if (result.data.result.isPermitted) {
                                alert(`Welcome to ${result.data.result.id}!`);
                                navigate('/');
                            } else {
                                alert(result.data.result.reason);
                            }
                        }).catch((error: any) => {
                            alert(`Login ${error}`);
                            console.error(error);
                        });
                }}>
                    <S.Label>
                        <S.Span>전화번호, 사용자, 이름 또는 이메일</S.Span>
                        <S.Input type="text" value={id} onChange={event => { setId(event.target.value); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>비밀번호</S.Span>
                        <S.Input type="password" value={password} onChange={event => { setPassword(event.target.value); }} />
                    </S.Label>
                    <S.Button type="submit">로그인</S.Button>
                </S.Form>
            </S.DivOfLoginForm>
            <S.DivOfJoinForm>
                <S.P>계정이 없으신가요? <S.Link to="/account">가입하기</S.Link></S.P>
            </S.DivOfJoinForm>
        </>
    );
};

export default Login;