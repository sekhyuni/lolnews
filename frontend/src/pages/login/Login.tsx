import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setId, setPassword, clearUserState } from '../../redux/features/userSlice';
import { signinAPICall } from '../../redux/features/userSlice';
import { clearArticleState } from '../../redux/features/articleSlice';
import Footer from '../../layouts/footer/Footer';
import * as S from './Login.styled';

const Login = () => {
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
            <Footer layoutName="login" />
        </S.DivOfLayoutWrapper>
    );
};

const Form = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id, password } = useAppSelector(state => state.user);
    const { keyword } = useAppSelector(state => state.article);

    return (
        <>
            <S.DivOfLoginForm>
                <S.LinkOfLogo to="/" onClick={() => { dispatch(clearArticleState()); }}><S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} /></S.LinkOfLogo>
                <S.Form onSubmit={event => {
                    event.preventDefault();

                    const paramsOfSearch = {
                        id,
                        password
                    };
                    dispatch(signinAPICall(paramsOfSearch)).unwrap().then((response: any): void => {
                        const { result } = response;
                        if (result.isPermitted) {
                            localStorage.setItem('id', result.id);
                            alert(`${result.id}님 정상적으로 로그인되었어요!`);
                            dispatch(clearUserState());

                            keyword ? navigate(`/search/?query=${keyword}`) : navigate('/');
                        } else {
                            alert(result.reason);
                        }
                    }).catch((err: any): void => {
                        alert(`Login ${err}`);
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
                    <S.ButtonOfSubmit type="submit">로그인</S.ButtonOfSubmit>
                </S.Form>
            </S.DivOfLoginForm>
            <S.DivOfToJoinForm>
                <S.P>계정이 없으신가요? <S.LinkOfToJoin to="/join" onClick={() => { dispatch(clearUserState()); }}>가입하기</S.LinkOfToJoin></S.P>
            </S.DivOfToJoinForm>
        </>
    );
};

export default Login;