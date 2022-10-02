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

const imgOfNormalWidth = '120px';

const imgOfPopularWidth = '90px';

// layout
export const DivOfLayoutWrapper = styled.div`
    ${vertical}
`;

export const Main = styled.main`
    ${vertical}
    min-width: calc(${mainLeftDistance} + ${sectionWidth} + 20px + ${asideWidth} + 20px);
    min-height: calc(100vh - (${headerWidth} + ${footerWidth}));
    padding: 0 0 0 ${mainLeftDistance};
    background-color: #f2f4f7;
`;

export const DivOfMainContent = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Section = styled.section`
    ${vertical}
    width: ${sectionWidth};
    height: fit-content;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    padding: 0 20px 0 20px;
    margin: 20px 0 20px 0;
    background-color: #fff;
`;

export const DivOfLNBWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin: 20px 0 20px 0;
`;

export const DivOfLNB = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: absolute;
    right: 0;
`;

export const Aside = styled.aside`
    ${vertical}
    width: ${asideWidth};
    margin: 20px 0 0 20px;
`;

export const AsideOfContent = styled.div`
    ${vertical}
    min-height: 100px;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    padding: ${({ contentType }: any) => contentType === 'related' ? '20px 20px 20px 20px' : '20px 20px 0 20px'};
    margin: 0 0 20px 0;
    background-color: #fff;
`;

export const DivOfSubjectTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 20px 0;
`;

export const StrongOfSubjectTitle = styled.strong`
    width: fit-content;
    font-size: 16px;
`;

export const ImgOfHelpOfSubjectTitle = styled.img`
    width: 16px;
    height: 16px;
    margin: 0 0 0 4px;
`;

export const DivOfRelatedSearchTermWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export const LinkOfRelatedSearchTerm = styled(Link_)`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    border: 1px solid #eaeced;
    border-radius: 3px;
    padding: 0 12px 0 12px;
    margin: 0 0 0 10px;
    :first-child {
        margin: 0 0 0 0;
    }
    font-size: 14px;
    text-decoration: none;
    color: inherit;
    background-color: #fff;
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
    border-bottom: 1px solid #e1e1e1;
`;

export const HeaderOfBottom = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    border-bottom: 1px solid #e1e1e1;
    padding: 0 0 0 200px;
`;

export const DivOfResultDataTypeMenuWrapper = styled.div`
    height: inherit;
    margin : 0 0 0 22px;
    :first-child {
        margin: 0 0 0 0;
    }
`;

export const UlOfListOfArticleWrapper = styled.ul`
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    list-style: none;    
`;

export const LiOfArticleWrapper = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px 0 20px 0;
    ${({ id, contentType }: any) => {
        if (id) {
            if (contentType === 'normal') {
                return css`
                    border-bottom: 1px solid #e5e5e5;
                `;
            } else {
                return css`
                    border-bottom: 1px solid #e5e5e5;
                    :last-child {
                        border-bottom: none;
                    }
                `;
            }
        } else {
            return css`
                justify-content: center;
            `;
        }
    }}
    :first-child {
        border-top: 1px solid #e5e5e5;
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
        if (id === 2) {
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

export const DivOfResultDataTypeMenu = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
`;

export const SpanOfSvgWrapper = styled.span`
    width: ${({ position }: any) => position === 'navigation' ? '25px' : '30px'};
    height: ${({ position }: any) => position === 'navigation' ? '25px' : '30px'};
    margin: 0 5px 0 0;
    pointer-events: none;
`;

export const DivOfTitleContentWrapper = styled.div`
    ${vertical}
    justify-content: center;
    ${({ contentType }: any) => {
        if (contentType === 'normal') {
            return css`
                width: calc(100% - (${imgOfNormalWidth} + 20px));
            `;
        } else {
            return css`
                width: calc(100% - (${imgOfPopularWidth} + 20px));
            `;
        }
    }}    
`;

export const DivOfTitle = styled.div`
    ${({ contentType }: any) => {
        if (contentType === 'normal') {
            return css`
                margin: 0 0 8px 0;
                font-size: 18px;
            `;
        } else {
            return css`
                font-size: 14px;
            `;
        }
    }}
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
    font-weight: bold;
`;

export const DivOfContent = styled.div`
    margin: 0 0 10px 0;
    /* display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #666;
`;

export const ImgOfContent = styled.img`
    ${({ contentType }: any) => {
        if (contentType === 'normal') {
            return css`
                width: ${imgOfNormalWidth};
                height: 80px;
                border-radius: 8px;
            `;
        } else {
            return css`
                width: ${imgOfPopularWidth};
                height: 60px;
                border-radius: 6px;
            `;
        }
    }}
    margin: 0 20px 0 0;
    cursor: pointer;
`;

export const DivOfModalWrapper = styled.div`
    ${vertical}
`;

export const DivOfSpanModalCloseWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
`;

export const SpanOfModalClose = styled.span`
    ${vertical}
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

export const DivOfSort = styled.div`
    margin: 0 0 0 12px;
    color: #7e7e7e;
    ${({ orderIsActive }: any) => {
        if (orderIsActive) {
            return css`
                font-weight: bold;
                color: #000;
                ::before {
                    background-color: #1a73e8;
                }
            `;
        } else {
            return css`
                ::before {
                    background-color: #7e7e7e;
                }
            `;
        }
    }}
    cursor: pointer;
    :hover {
        text-decoration: underline;
        font-weight: bold;
        color: #000;
    }
    ::before {
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin: 0 3px 0 0;
        vertical-align: 3px;
    }
`;

export const LinkOfLoginPage = styled(Link_)`
    display: flex;
    flex-direction: row;
    ${center}
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

export const StrongOfAllCountOfArticle = styled.strong`    
    margin: 20px 0 0 0;
`;

export const SpanOfKeyword = styled.span`
    color: #1a73e8;  
`;

export const H3OfNoneResult = styled.h3`  
`;

export const DivOfSourceDateWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export const DivOfSource = styled.div`
    margin: 0 12px 0 0;
    font-size: 15px;
`;

export const DivOfDate = styled.div`
    font-size: 15px;
    color: #666;
`;