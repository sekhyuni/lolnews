import * as S from './Footer.styled';

const footerMenus = [
    // { id: 1, link: '/about', value: '팀 소개', },
    { id: 1, link: 'https://gitlab.com/5622kmj/toyproject/-/blob/main/README.md', value: '팀 소개', },
    { id: 2, link: 'https://www.notion.so/t3qlab/ecaf979804b943b7a65e7b07c362238f?v=47cdfe752f4f4bf1bcc85e0beb522d36', value: '블로그', },
    { id: 3, link: '/help', value: '도움말', },
];

const Footer = ({ layoutName }) => {
    const elementsOfFooterMenu = footerMenus
        .map(footerMenu =>
            <S.FooterTopElement key={footerMenu.id} layoutName={layoutName}>
                {footerMenu.link.startsWith('http') ? <S.A href={footerMenu.link} target="_blank">{footerMenu.value}</S.A> : <S.Link to={footerMenu.link}>{footerMenu.value}</S.Link>}
            </S.FooterTopElement>
        )
        .reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    return (
        <S.Footer layoutName={layoutName}>
            <S.FooterTopElementWrapper layoutName={layoutName}>
                {elementsOfFooterMenu}
            </S.FooterTopElementWrapper>
            <S.FooterBottomElementWrapper layoutName={layoutName}>
                <S.FooterBottomElement>
                    Copyright ©
                </S.FooterBottomElement>
                <S.FooterBottomElement>
                    <S.AOfCorps layoutName={layoutName} href="https://gitlab.com/5622kmj/toyproject" target="_blank">LOLNEWS Corps.</S.AOfCorps>
                </S.FooterBottomElement>
                <S.FooterBottomElement>
                    All Rights Reserved.
                </S.FooterBottomElement>
            </S.FooterBottomElementWrapper>
        </S.Footer>
    );
};

export default Footer;