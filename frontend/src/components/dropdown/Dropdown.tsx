import { useAppDispatch } from '../../redux/app/hooks';
import { setKeyword } from '../../redux/features/articleSlice';
import * as S from './Dropdown.styled';
import * as Svg from '../../components/svg/Svg';

const Dropdown = ({ layoutName, search }: any) => {
    const dispatch = useAppDispatch();

    return (
        <S.DivOfDropdownWrapper>
            <S.DivOfUser>
                <Svg.User layoutName={layoutName} />
            </S.DivOfUser>
            <S.DivOfDropdownMenuWrapper layoutName={layoutName}>
                <S.LinkOfDropdownMenu to="/community" layoutName={layoutName}>커뮤니티</S.LinkOfDropdownMenu>
                <S.LinkOfDropdownMenu to="/login" layoutName={layoutName} onClick={() => {
                    layoutName === 'main' ? dispatch(setKeyword('')) : dispatch(setKeyword(decodeURI(search.split('query=')[1])))
                    localStorage.clear();
                }}>로그아웃</S.LinkOfDropdownMenu>
            </S.DivOfDropdownMenuWrapper>
        </S.DivOfDropdownWrapper>
    );
};

export default Dropdown;