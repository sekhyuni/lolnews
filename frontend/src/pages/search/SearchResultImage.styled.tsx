import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';

const vertical = css`
    display: flex;
    flex-direction: column;
`;

const center = css`
    justify-content: center;
    align-items: center;
`;

const headerWidth = '130px';

const mainLeftDistance = '200px';

const sectionWidth = '690px';

const asideWidth = '350px';

const footerWidth = '100px';

const imageOfContentWidth = '120px';

// layout
export const DivOfLayoutWrapper = styled.div`
    ${vertical}
`;

export const Main = styled.main`
    display: flex;
    flex-direction: row;
    min-width: calc(${mainLeftDistance} + ${sectionWidth} + 20px + ${asideWidth} + 20px);
    min-height: calc(100vh - (${headerWidth} + ${footerWidth}));
    background-color: #f2f4f7;
`;

export const Section = styled.section`
    ${vertical}
    width: 100vw;
    border: 0.5px solid #e1e1e1;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    margin: 20px 0 20px 0;
    background-color: #fff;
`;

export const DivOfLnb = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 0 20px 0;
`;

export const Strong = styled.strong`
    font-size: 16px;
`;

export const Div = styled.div`
`;

export const Header = styled.header`
    ${vertical}
    min-width: calc(${mainLeftDistance} + ${sectionWidth} + 20px + ${asideWidth} + 20px);
    height: ${headerWidth};
`;

export const HeaderOfTop = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 90px;
    border-bottom: 0.5px solid #e1e1e1;
`;

export const HeaderOfBottom = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    border-bottom: 0.5px solid #e1e1e1;
    padding: 0 0 0 200px;
`;

export const DivOfResultDataTypeMenuWrapper = styled.div`
    height: inherit;
    margin : 0 0 0 22px;
    :first-child {
        margin: 0 0 0 0;
    }
`;

export const UlOfImageListWrapper = styled.ul`
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    list-style: none;    

    // 잠시 대기
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    /* box-sizing: border-box; */
    align-content: space-between;
`;

export const LiOfImageWrapper = styled.li`
    // 잠시 대기
    width: 20%;
    :nth-child(5n + 1) {
        order: 1;
    }
    :nth-child(5n + 2) {
        order: 2;
    }
    :nth-child(5n + 3) {
        order: 3;
    }
    :nth-child(5n + 4) {
        order: 4;
    }
    :nth-child(5n) {
        order: 5;
    }

    border-radius: 10px;
    margin: 0 0 0 5px;
    overflow: hidden;
`;

export const ImgOfContent = styled.img`
    // 잠시 대기
    max-width: 100%;

    cursor: pointer;
    transition: transform .1s;
    :hover {
        -ms-transform: scale(1.2); /* IE 9 */
        -webkit-transform: scale(1.2); /* Safari 3-8 */
        transform: scale(1.2); 
    }
`;

export const Nav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: end;
    width: 100%;
    height: inherit;
`;

// component
export const ImgOfLogo = styled.img`
    height: inherit;
    padding: 10px 0 0 0;
`;

export const LinkOfLogo = styled(Link_)`
    height: inherit;
`;

export const LinkOfResultDataTypeMenu = styled(Link_)`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: inherit;
    padding: 0 0 3px 0;
    text-decoration: none;
    font-weight: bold;
    color: #000;
    ${({ id }: any) => {
        if (id === 3) {
            return css`
                border-bottom: 3px solid #1a73e8;
                padding: 0 0 0 0;
                color: #1a73e8;
            `;
        }
    }}
    :hover {
        color: #1a73e8;
    }
    :hover svg {
        fill: #1a73e8;
    }
`;

export const Span = styled.span`
    width: 25px;
    height: 25px;
    margin: 0 5px 0 0;
    pointer-events: none;
`;

export const DivOfTitleContentWrapper = styled.div`
    ${vertical}
    justify-content: center;
    width: calc(100% - (${imageOfContentWidth} + 20px));
`

export const DivOfTitle = styled.div`
    margin: 0 0 8px 0;
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
    font-size: 18px;
    font-weight: bold;
`;

export const DivOfContent = styled.div`
    /* display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #666;
`;

// export const ImgOfContent = styled.img`
//     width: inherit;
//     border: 1px solid rgba(0,0,0,0.1);
//     cursor: pointer;
//     transition: transform .1s;
//     :hover {
//         -ms-transform: scale(1.2); /* IE 9 */
//         -webkit-transform: scale(1.2); /* Safari 3-8 */
//         transform: scale(1.2); 
//     }
// `;

export const DivOfModalWrapper = styled.div`
    ${vertical}
`;

export const DivOfSpanModalCloseWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
`;

export const SpanOfModalClose = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
    font-size: 50px;
    font-weight: 100;
    cursor: pointer;
`;

export const DivOfModalTitle = styled.div`
    margin: 0 40px 0 40px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
`;

export const StrongOfKeyword = styled.strong`
    color: #1a73e8;
`;

export const DivOfModalContent = styled.div`
    margin: 20px 40px 20px 40px;
`;

export const ImgOfModalContent = styled.img`
    margin: 0 40px 0 40px;
`;

export const DivOfModalPCLinkURL = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 0 0 0;
`;

export const AOfPCLinkURL = styled.a`
    text-decoration: none;
    :hover {
        text-decoration: underline;
    }
    color: #000;
`;

export const ButtonOfSort = styled.button`
    width: 150px;
    height: 45px;
    border: none;
    border-radius: 30px;
    margin: 0 10px 0 10px;
    font-size: 18px;
    background-color: #f2f4f7;
    ${({ orderIsActive }: any) => {
        if (orderIsActive) {
            return css`
                color: #1a73e8;
            `;
        }
    }}
    cursor: pointer;
    :hover {
        text-decoration: underline;
        color: #1a73e8;
    }
`;

export const LinkOfLoginPage = styled(Link_)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 110px;
    border-radius: 4px;
    margin: 23.5px 20px 23.5px 20px;
    background: #1a73e8;
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    :hover {
        filter: contrast(90%);
    }
`;

export const LinkOfUser = styled(Link_)`
    height: 43px;
    margin: 23.5px 20px 23.5px 20px;
`;