import * as S from './Footer.styled';

const Footer = ({ layoutName }: any) => {
    const footerMenus = [
        { id: 1, link: 'https://gitlab.com/5622kmj/toyproject/-/blob/main/README.md', value: '팀 소개', },
        { id: 2, link: 'https://www.notion.so/t3qlab/ecaf979804b943b7a65e7b07c362238f?v=47cdfe752f4f4bf1bcc85e0beb522d36', value: '블로그', },
        { id: 3, link: '/help', value: '도움말', },
    ];

    const elementsOfFooterMenu = footerMenus
        .map((footerMenu: any): JSX.Element =>
            <S.FooterOfTopElement key={footerMenu.id} layout-Name={layoutName}>
                {footerMenu.link.startsWith('http') ? <S.A href={footerMenu.link} target="_blank">{footerMenu.value}</S.A> : <S.Link to={footerMenu.link} onClick={event => { event.preventDefault(); }}>{footerMenu.value}</S.Link>}
            </S.FooterOfTopElement>
        );

    return (
        <S.Footer layout-Name={layoutName}>
            <S.FooterOfTopElementWrapper layout-Name={layoutName}>
                {elementsOfFooterMenu}
            </S.FooterOfTopElementWrapper>
            <S.FooterOfBottomElementWrapper layout-Name={layoutName}>
                <S.FooterOfBottomElement>
                    Copyright ©
                </S.FooterOfBottomElement>
                <S.FooterOfBottomElement>
                    <S.AOfCorps layout-Name={layoutName} href="https://gitlab.com/5622kmj/toyproject" target="_blank">LOLNEWS Corps.</S.AOfCorps>
                </S.FooterOfBottomElement>
                <S.FooterOfBottomElement>
                    All Rights Reserved.
                </S.FooterOfBottomElement>
            </S.FooterOfBottomElementWrapper>
        </S.Footer>
    );
};

export default Footer;