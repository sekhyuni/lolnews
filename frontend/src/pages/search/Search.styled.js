import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Vertical = css`
    display: flex;
    flex-direction: column;
`;

const Center = css`
    justify-content: center;
    align-items: center;
`;

// layout
export const LayoutWrapper = styled.div`
    ${Vertical}
`;

export const Main = styled.main`
    display: flex;
    flex-direction: row;
    min-width: calc(200px + 600px + 30px + 350px + 30px);
    min-height: calc(100vh - 230px);
    padding: 0 0 0 200px;
    background-color: #f2f4f7;
`;

export const Section = styled.section`
    ${Vertical}
    width: 600px;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    margin: 24px 0 24px 0;
    background-color: #fff;
`;

export const Aside = styled.aside`
    ${Vertical}
    width: 350px;
`;

export const ContentOfAside = styled.div`
    ${Vertical}
    width: inherit;
    min-height: 100px;
    /* height: ${({ type }) => type === 1 ? '100px' : '200px'}; */
    border-radius: 10px;
    padding: 18px 30px 18px 30px;
    margin: 24px 0 0 30px;
    background-color: #fff;
`;

export const Strong = styled.strong`
    font-size: 16px;
`;

export const RelatedSearchTerms = styled.div`
    display: flex;
    flex-direction: row;
    margin: 18px 0 0 0;
`;

export const RelatedSearchTerm = styled(Link_)`
    display: flex;
    flex-direction: row;
    ${Center}
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
    ${Vertical}
    height: 130px;
    border-bottom: 0.5px solid #e1e1e1;
`;

export const TopOfHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 90px;
`;

export const BottomOfHeader = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    margin: 0 0 0 200px;
`;

export const ResultDataTypeMenuWrapper = styled.div`
    height: inherit;
    margin : 0 0 0 22px;
    :first-child {
        margin: 0 0 0 0;
    }
`;

export const Ul = styled.ul`
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    list-style: none;
`;

export const Li = styled.li`
    padding: 18px 0 18px 0;
    border-bottom: 1.5px solid #f5f6f7;
    :last-child {
        border-bottom: 0;
    }
`;

export const Nav = styled.nav`
`;

// component
export const Image = styled.img`
    height: inherit;
    padding: 10px 0 0 0;
`;

export const LinkForLogo = styled(Link_)`
    height: inherit;
`;

export const LinkForMenu = styled(Link_)`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: inherit;
    padding: 0 0 3px 0;
    text-decoration: none;
    font-weight: bold;
    color: #000;
    ${({ active, index }) => {
        if (active[index]) {
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

export const Title = styled.div`
    margin: 0 0 8px 0;
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
    font-size: 18px;
    font-weight: bold;
`;

export const Content = styled.div`
    /* display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #666;
`;