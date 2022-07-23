import { useNavigate } from 'react-router-dom';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Input.styled';

const Input = ({ keyword, setKeyword, setResult, layoutName }) => {
    const navigate = useNavigate();
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    return (
        <S.Form onSubmit={event => {
            event.preventDefault();

            // 운영 코드
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, { q: keyword }).then(result => {
                setResult(result);

                if (layoutName === 'main') {
                    navigate('/search');
                }
            });

            // 임시 개발 코드
            // const result = require(`../../../test/${keyword}.json`);

            // setResult(result);

            // if (layoutName === 'main') {
            //     navigate('/search');
            // }
        }}>
            <S.InputForSearch layoutName={layoutName} type="text" value={keyword} placeholder="검색어 입력" onChange={event => {
                setKeyword(event.target.value);
            }} />
            <S.IconOfSearch />
            <S.IconOfKeyboard />
            <S.IconOfMic />
        </S.Form>
    );
};

export default Input;