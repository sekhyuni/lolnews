import { useNavigate } from 'react-router-dom';
import * as S from './Input.styled';

const Input = ({ keyword, setKeyword, layoutName, type }) => {
    const navigate = useNavigate();

    return (
        <S.Form onSubmit={event => {
            event.preventDefault();

            navigate(`/search/${type}?q=${keyword}`);
        }}>
            <S.InputOfSearch layoutName={layoutName} type="text" value={keyword} placeholder="검색어 입력" onChange={event => {
                setKeyword(event.target.value);
            }} />
            <S.IconOfSearch />
            <S.IconOfKeyboard />
            <S.IconOfMic />
        </S.Form >
    );
};

export default Input;