import { useState } from 'react';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Main.styled'
import { faKeyboard, faMicrophone, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Main = ({ setValue }) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    return (
        <>
            <S.Header>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.Image alt="LOLNEWS" src={require('../../assets/logo.png')}></S.Image>
                    <S.Div>
                        <S.Input type="text" placeholder="검색어 입력" onKeyUp={event => {
                            if (event.key !== 'Enter') {
                                setKeyword(event.target.value);
                            } else { // 엔터 입력 시, keyword에 대한 결과 data 요청
                                alert(keyword);

                                doAxiosRequest('GET', `${BASE_URL}/search/keyword`, { q: keyword }).then(result => {
                                    setValue(result);
                                    navigate('/search');
                                    console.log(result);
                                });
                            }
                        }} />
                        <S.IconOfSearch icon={faSearch} />
                        <S.IconOfKeyboard icon={faKeyboard} />
                        <S.IconOfMic icon={faMicrophone} />
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
        </>
    );
};

export default Main;