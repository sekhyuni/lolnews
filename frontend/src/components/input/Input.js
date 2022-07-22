import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doAxiosRequest from '../../functions/doAxiosRequest';
import * as S from './Input.styled';

const Input = ({ setValue, layoutName }) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    return (
        <>
            <S.InputForSearch layoutName={layoutName} type="text" placeholder="검색어 입력" onKeyUp={event => {
                if (event.key !== 'Enter') {
                    setKeyword(event.target.value);
                } else { // 엔터 입력 시, keyword에 대한 결과 data 요청
                    console.log(keyword);

                    doAxiosRequest('GET', `${BASE_URL}/search/keyword`, { q: keyword }).then(result => {
                        setValue(result);

                        if (layoutName === "main") {
                            navigate('/search')
                        }
                    });
                }
            }} />
            <S.IconOfSearch />
            <S.IconOfKeyboard />
            <S.IconOfMic />
        </>
    );
};

export default Input;