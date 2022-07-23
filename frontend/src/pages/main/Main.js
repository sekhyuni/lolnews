import Input from '../../components/input/Input';
import * as S from './Main.styled'

const Main = ({ keyword, setKeyword, setResult }) => {
    return (
        <S.Layout>
            <S.Header>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.Image alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    <S.Div>
                        <Input layoutName="main" keyword={keyword} setKeyword={setKeyword} setResult={setResult} />
                        <S.ButtonWrapperOfSearch>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>선수별 검색</S.Button>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>챔피언별 검색</S.Button>
                            <S.Button onClick={() => { alert('서비스 준비중입니다.'); }}>팀별 검색</S.Button>
                        </S.ButtonWrapperOfSearch>
                        <S.P>Toyproject <S.Link to="/about/developers">AI SERVICE</S.Link></S.P>
                    </S.Div>
                </S.Section>
            </S.Main>
            <S.Footer>
            </S.Footer>
        </S.Layout>
    );
};

export default Main;