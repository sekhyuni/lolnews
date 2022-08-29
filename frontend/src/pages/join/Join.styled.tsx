import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';
import urlOfSunOfBackgroundImage from '../../assets/background0.jpg';
import urlOfMonOfBackgroundImage from '../../assets/background1.jpg';
import urlOfTueOfBackgroundImage from '../../assets/background2.jpg';
import urlOfWedOfBackgroundImage from '../../assets/background3.jpg';
import urlOfThuOfBackgroundImage from '../../assets/background4.jpg';
import urlOfFriOfBackgroundImage from '../../assets/background5.jpg';
import urlOfSatOfBackgroundImage from '../../assets/background6.jpg';

const getUrlOfBackgroundImage = () => {
    const day = new Date().getDay();
    const listOfImage = [urlOfSunOfBackgroundImage, urlOfMonOfBackgroundImage, urlOfTueOfBackgroundImage, urlOfWedOfBackgroundImage, urlOfThuOfBackgroundImage, urlOfFriOfBackgroundImage, urlOfSatOfBackgroundImage];

    return listOfImage.filter((_, idx: number): boolean => day === idx);
};

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

export const DivOfLayoutWrapper = styled.div`
    ${vertical}
    height: 100vh;
    background-image: url(${getUrlOfBackgroundImage()});
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

export const DivOfJoinForm = styled.div`
    ${vertical}
    align-items: center;
    width: 100%;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 0 0 6px 0;
    margin: 0 0 10px 0;
    background-color: #fff;
`;

export const DivOfToLoginForm = styled.div`
    display: flex;
    flex-direction: row;
    ${center}
    width: 100%;
    height: 60px;
    border: 1px solid #dbdbdb;
    border-radius: 10px; 
    background-color: #fff;
`;

export const ImgOfLogo = styled.img`
    width: 300px;
`;

export const Form = styled.form`
    ${vertical}
    align-items: center;
    width: 348px;
`;

export const Label = styled.label`
    ${vertical}
    width: 268px;
    height: 38px;
    margin: 0 0 6px 0;
`;

export const Span = styled.span`
    position: absolute;
    margin: 0 0 0 7px;
    font-size: 10px;
    line-height: 20px;
    color: #8e8e8e;
`;

export const Input = styled.input`
    height: 100%;
    border: 1px solid #dbdbdb;
    border-radius: 3px;
    background-color: #fafafa;
    :focus {
        outline: none;
        border: 1px solid rgb(118, 118, 118);
    }
`;

export const ButtonOfSubmit = styled.button`
    width: 268px;
    height: 30px;
    border: 1px solid #94cf58;
    border-radius: 4px;
    margin: 8px 0 8px 0;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #94cf58;
    cursor: pointer;
`;

export const P = styled.p`
    font-size: 14px;
`;

export const LinkOfLogo = styled(Link_)`
    display: flex;
    flex-direction: row;
`;

export const LinkOfToLogin = styled(Link_)`
    font-weight: bold;
    text-decoration: none;
    color: #94cf58;
`;