import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setId, setPassword, setPasswordCheck, setEmail, clearUserState } from '../../redux/features/userSlice';
import { signupAPICall } from '../../redux/features/userSlice';
import { setKeyword, clearArticleState } from '../../redux/features/articleSlice';
import Footer from '../../layouts/footer/Footer';
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
            <Footer layoutName="join" />
        </S.DivOfLayoutWrapper>
    );
};

const Form = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id, password, passwordCheck, email } = useAppSelector(state => state.user);

    return (
        <>
            <S.DivOfJoinForm>
                <S.LinkOfLogo to="/" onClick={() => { dispatch(clearArticleState()); }}><S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} /></S.LinkOfLogo>
                <S.Form onSubmit={event => {
                    event.preventDefault();

                    if (!id) {
                        alert('아이디는 필수로 입력하셔야 합니다.');
                        return;
                    }
                    if (!password) {
                        alert('패스워드는 필수로 입력하셔야 합니다.');
                        return;
                    }
                    if (password !== passwordCheck) {
                        alert('패스워드가 일치하지 않습니다.');
                        return;
                    }
                    if (!email) {
                        alert('이메일은 필수로 입력하셔야 합니다.');
                        return;
                    }

                    const paramsOfInsert = {
                        id,
                        password,
                        email,
                    }
                    dispatch(signupAPICall(paramsOfInsert)).unwrap().then((response: any): void => {
                        const { result } = response;
                        if (!result.isDuplicated) {
                            alert(`${result.id}님 정상적으로 가입되었어요!`);
                            dispatch(clearUserState());

                            navigate('/login');
                        } else {
                            alert(result.reason);
                        }
                    }).catch((err: any): void => {
                        alert(`Join ${err}`);
                        console.error(err);
                    });
                }}>
                    <S.Label>
                        <S.Span>아이디</S.Span>
                        <S.Input type="text" value={id} onChange={event => { dispatch(setId(event.target.value)); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>비밀번호</S.Span>
                        <S.Input type="password" value={password} onChange={event => { dispatch(setPassword(event.target.value)); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>비밀번호 확인</S.Span>
                        <S.Input type="password" value={passwordCheck} onChange={event => { dispatch(setPasswordCheck(event.target.value)); }} />
                    </S.Label>
                    <S.Label>
                        <S.Span>이메일</S.Span>
                        <S.Input type="text" value={email} onChange={event => { dispatch(setEmail(event.target.value)); }} />
                    </S.Label>
                    <S.ButtonOfSubmit type="submit">가입</S.ButtonOfSubmit>
                </S.Form>
            </S.DivOfJoinForm>
            <S.DivOfToLoginForm>
                <S.P>계정이 있으신가요? <S.LinkOfToLogin to="/login" onClick={() => { dispatch(clearUserState()); }}>로그인</S.LinkOfToLogin></S.P>
            </S.DivOfToLoginForm>
        </>
    );
};

export default Join;