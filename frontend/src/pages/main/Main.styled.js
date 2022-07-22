import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';
import urlOfWallpaperbette from '../../assets/wallpaperbette.jpg';

const Vertical = css`
    display: flex;
    flex-direction: column;
`;

const Center = css`
    justify-content: center;
    align-items: center;
`

// layout
export const Layout = styled.div`
    ${Vertical}
    height: inherit;
    background-image: url(${urlOfWallpaperbette});
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
`;

export const Main = styled.main`
    display: flex;
    flex-direction: row;
    ${Center}
    height: inherit;
`;

export const Section = styled.section`
    ${Vertical}
    align-items: center;
`;

export const Div = styled.div`
    ${Vertical}
    align-items: center;
    position: relative;
`;

export const Header = styled.header`
    height: 100px;
`;

export const Nav = styled.nav`
`;

export const Footer = styled.footer`
    height: 100px;
`;

// component
export const ButtonWrapperOfSearch = styled.div`
`;

export const Button = styled.button`
    width: 150px;
    border: none;   
    padding: 13px;
    margin: 15px 3px 10px 3px;
    font-weight: 500;
    font-family: 'IBM Plex Sans KR', sans-serif;
    color: #6e6a6a;
    background-color: #f4f4f4;
`;

export const Image = styled.img`
    width: min(50vw, 600px);
`;

export const P = styled.p`
    font-size: 20px;
`;

export const Link = styled(Link_)`
    text-decoration: none;
    font-size: inherit;
    font-family: 'IBM Plex Sans KR', sans-serif;
    color: #f2fa09;
`;