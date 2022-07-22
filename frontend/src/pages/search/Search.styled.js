import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';

// layout
export const Layout = styled.div`
    display: flex;
    flex-direction: column;
    height: inherit;
`;

export const Main = styled.main`
    height: inherit;
`;

export const Section = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: inherit;
`;

export const Div = styled.div`
    position: relative;
`;

export const Header = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 100px;
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

export const Link = styled(Link_)`
    height: inherit;
`;