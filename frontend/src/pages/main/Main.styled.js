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
`;

// layout
export const DivOfLayoutWrapper = styled.div`
    ${Vertical}
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
    height: calc(100vh - 230px);
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
    height: 130px;
`;

export const Nav = styled.nav`
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

export const Img = styled.img`
    width: min(70vw, 600px);
`;