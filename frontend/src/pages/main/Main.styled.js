import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Layout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    display: flex;
    flex-direction: column;
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

export const ButtonWrapperOfSearch = styled.div`
`;

export const Image = styled.img`

`;

export const Input = styled.input`
    width: 900px;
    height: 40px;
    border: 1.5px solid #ededed;
    border-radius: 30px;
    padding: 20px 45px;
    font-weight: 500;
    font-family: 'IBM Plex Sans KR', sans-serif;
`;

export const IconOfSearch = styled(FontAwesomeIcon)`
    position: absolute; 
    top: 12px;         
    left: 20px;
    color: #aaa;
`;

export const IconOfKeyboard = styled(FontAwesomeIcon)`
    position: absolute;
    top: 12px;
    right: 47px;
`;

export const IconOfMic = styled(FontAwesomeIcon)`
    position: absolute;
    top: 12px;
    right: 20px;
    color: #4f86ec;
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

export const P = styled.p`
    font-size: 20px;
`;

export const Link = styled(Link_)`
    text-decoration: none;
    font-size: inherit;
    font-family: 'IBM Plex Sans KR', sans-serif;
    color: #f2fa09fa;
`;