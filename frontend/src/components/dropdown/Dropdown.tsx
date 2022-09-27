import React from 'react';
import * as S from './Dropdown.styled';
import * as Svg from '../../components/svg/Svg';

const Dropdown = ({ layoutName }: any) => {
    return (
        <S.DivOfDropdownWrapper>
            <S.DivOfUser>
                <Svg.User layoutName={layoutName} />
            </S.DivOfUser>
            <S.DivOfDropdownMenuWrapper layoutName={layoutName}>
                <S.LinkOfDropdownMenu to="/login" layoutName={layoutName} onClick={() => { localStorage.clear(); }}>로그아웃</S.LinkOfDropdownMenu>
            </S.DivOfDropdownMenuWrapper>
        </S.DivOfDropdownWrapper>
    );
};

export default React.memo(Dropdown);