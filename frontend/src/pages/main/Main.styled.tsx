import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';
import urlOfWallpaperbette from '../../assets/wallpaperbette.jpg';

const vertical = css`
    display: flex;
    flex-direction: column;
`;

const center = css`
    justify-content: center;
    align-items: center;
`;

const headerWidth = '130px';

const footerWidth = '100px';

// layout
export const DivOfLayoutWrapper = styled.div`
    ${vertical}
    height: 100vh;
    background-image: url(${urlOfWallpaperbette});
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
`;

export const Main = styled.main`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: calc(100vh - (${headerWidth} + ${footerWidth}));
`;

export const Section = styled.section`
    ${vertical}
    align-items: center;
`;

export const Div = styled.div`
    ${vertical}
    align-items: center;
    position: relative;
`;

export const Header = styled.header`
    display: flex;
    flex-direction: column;
    height: 130px;
`;

export const Nav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: end;
    height: 90px;
`;

export const LinkOfLoginPage = styled(Link_)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 110px;
    border-radius: 4px;
    margin: 23.5px 20px 23.5px 20px;
    background: #94cf58;
    text-decoration: none;
    color: #fff;
    box-shadow: 0 2px 5px 1px #fff;
    :hover {
        box-shadow: 0 4px 10px 2px #fff;
        filter: contrast(90%);
    }
`;

// component
export const ButtonOfSearchTypeWrapper = styled.div`
`;

export const Button = styled.button`
    width: 150px;
    border: none;
    border-radius: 3px;
    padding: 13px;
    margin: 15px 3px 10px 3px;
    font-weight: 500;
    color: #6e6a6a;
    background-color: #f4f4f4;
    cursor: pointer;
`;

export const ImgOfLogo = styled.img`
    width: min(70vw, 600px);
`;