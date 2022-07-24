import * as S from './Footer.styled';

const footerMenus = [
    { id: 1, link: '/about', value: '팀 소개', },
    { id: 2, link: '/blog', value: '블로그', },
    { id: 3, link: '/help', value: '도움말', },
];

const Footer = ({ layoutName }) => {
    const elementsOfFooterMenu = footerMenus
        .map(footerMenu =>
            <S.FooterTopElement key={footerMenu.id} layoutName={layoutName}>
                <S.Link to={footerMenu.link}>{footerMenu.value}</S.Link>
            </S.FooterTopElement>
        )
        .reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    return (
        <S.Footer>
            <S.FooterTopElementWrapper layoutName={layoutName}>
                {elementsOfFooterMenu}
            </S.FooterTopElementWrapper>
            <S.FooterBottomElementWrapper layoutName={layoutName}>
                <S.FooterBottomElement>
                    Copyright ©
                </S.FooterBottomElement>
                <S.FooterBottomElement>
                    <S.LinkOfCorps layoutName={layoutName} to="/lolnews">LOLNEWS Corps.</S.LinkOfCorps>
                </S.FooterBottomElement>
                <S.FooterBottomElement>
                    All Rights Reserved.
                </S.FooterBottomElement>
            </S.FooterBottomElementWrapper>
        </S.Footer>
    );
};

export default Footer;