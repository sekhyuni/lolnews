import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setKeyword } from '../../redux/features/articleSlice';
import * as S from './Input.styled';

const Input = ({ layoutName, type = '' }: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { keyword } = useAppSelector(state => state.article);

    return (
        <S.Form onSubmit={event => {
            event.preventDefault();

            if (keyword) {
                navigate(`/search/${type}?query=${keyword}`);
            }
        }}>
            <S.InputOfSearch layoutName={layoutName} type="text" value={keyword} placeholder="검색어 입력" onChange={event => {
                dispatch(setKeyword(event.target.value));
            }} />
            <S.IconOfSearch />
        </S.Form >
    );
};

export default Input;