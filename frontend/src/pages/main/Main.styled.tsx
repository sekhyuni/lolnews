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

export const HeaderOfTop = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 90px;
`;

export const Nav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: end;
    width: 100%;
    height: inherit;
`;

export const LinkOfLoginPage = styled(Link_)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 110px;
    border: 1.5px solid #ededed;
    border-radius: 4px;
    margin: 23.5px 20px 23.5px 20px;
    background: #fff;
    text-decoration: none;
    color: #999;
    font-weight: 500;
    box-shadow: 0 2px 5px 1px #94cf58;
    :hover {
        box-shadow: 0 4px 10px 2px #94cf58;
    }
`;

export const DivOfPopularWordWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0 0 0;
`;

// component
export const ImgOfLogo = styled.img`
    width: min(70vw, 600px);
`;

export const LinkOfPopularWord = styled(Link_)`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    border-radius: 30px;
    padding: 0 12px 0 12px;
    margin: 0 0 0 10px;
    :nth-child(1) {
        margin: 0 0 0 0px;
        background-color: #ffd700;
    }
    :nth-child(2) {
        background-color: #b5b5bd;
    }
    :nth-child(3) {
        background-color: #cd7f32;
    }
    font-size: 14px;
    text-decoration: none;
    color: inherit;
    background-color: #fff;
    :hover {
        text-decoration: underline;
        filter: contrast(90%);
    }
`