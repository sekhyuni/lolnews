import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../layouts/footer/Footer';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Join.styled';

const Join = () => {
    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <Form />
                </S.Section>
            </S.Main>
            <Footer layoutName="Join" />
        </S.DivOfLayoutWrapper>
    );
};

const Form = () => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <S.DivOfJoinForm>
                <S.LinkOfLogo to="/"><S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} /></S.LinkOfLogo>
                <S.Form onSubmit={event => {
                    event.preventDefault();

                    if (!id) {
                        alert('아이디는 필수로 입력하셔야 합니다.');
                    } else if (!password) {
                        alert('패스워드는 필수로 입력하셔야 합니다.');
                    } else if (password !== passwordCheck) {
                        alert('패스워드가 일치하지 않습니다.');
                    } else if (!email) {
                        alert('이메일은 필수로 입력하셔야 합니다.');
                    }

                    const params = {
                        id,
                        password,
                        email,
                    };
                    doAxiosRequest('POST', `${BASE_URL}/accounts/signup`, params)
                        .then((result: any) => {
                            if (!result.data.result.isDuplicated) {
                                alert(`${result.data.result.id}님 정상적으로 가입되었어요!`);

                                navigate('/login');
                            } else {
                                alert(result.data.result.reason);
                            }
                        }).catch((error: any) => {
                            alert(`Join ${error}`);
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
                    <S.Label>
                        <S.Span>비밀번호 확인</S.Span>
                        <S.Input type="password" value={passwordCheck} onChange={event => { setPasswordCheck(event.target.value); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>이메일</S.Span>
                        <S.Input type="text" value={email} onChange={event => { setEmail(event.target.value); }} />
                    </S.Label>
                    <S.ButtonOfSubmit type="submit">가입</S.ButtonOfSubmit>
                </S.Form>
            </S.DivOfJoinForm>
            <S.DivOfToLoginForm>
                <S.P>계정이 있으신가요? <S.LinkOfToLogin to="/login">로그인</S.LinkOfToLogin></S.P>
            </S.DivOfToLoginForm>
        </>
    );
};

export default Join;