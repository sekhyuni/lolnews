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
export const Layout = styled.div`
    display: flex;
    flex-direction: column;
    height: inherit;
`;

export const Main = styled.main`
    height: inherit;
    margin: 0 0 0 270px;
`;

export const Section = styled.section`
    display: flex;
    flex-direction: column;
    height: inherit;
`;

export const Div = styled.div`
`;

export const Header = styled.header`
    ${Vertical}
    height: 150px;
    border-bottom: 0.5px solid #e1e1e1;
`;

export const TopOfHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100px;
`;

export const BottomOfHeader = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    margin: 0 0 0 270px;
`;

export const ResultDataTypeMenuWrapper = styled.div`
    height: inherit;
    margin : 0 0 0 22px;
    :first-child {
        margin: 0 0 0 0;
    }
`;

export const Nav = styled.nav`
`;

export const Footer = styled.footer`
    height: 100px;
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
    text-decoration: none;
    font-weight: bold;
    color: #000;
    ${({ active, index }) => {
        if (active[index]) {
            return css`
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