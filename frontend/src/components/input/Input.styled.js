import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faKeyboard, faMicrophone } from '@fortawesome/free-solid-svg-icons';

export const Form = styled.form`
    position: relative;
`;

export const InputForSearch = styled.input`
    width: ${({ layoutName }) => layoutName === 'main' ? 'min(70vw, 850px)' : '800px'};
    height: 40px;
    border: 1.5px solid #ededed;
    border-radius: 30px;
    padding: 20px 45px;
    font-size: 1.1rem;
    font-weight: 500;
    font-family: 'IBM Plex Sans KR', sans-serif;
    ${({ layoutName }) => {
        if (layoutName === 'search') {
            return css`
                box-shadow: 0 2px 5px 1px rgba(64,60,67,.16);
            `;
        }
    }}
    :focus {
        outline: 0;
    }
`;

const StyledIconOfSearch = styled(FontAwesomeIcon)`
    position: absolute; 
    top: 14px;
    left: 20px; 
    color: #aaa;
`;

const StyledIconOfKeyboard = styled(FontAwesomeIcon)`
    position: absolute;
    top: 12px;
    right: 47px;
`;

const StyledIconOfMic = styled(FontAwesomeIcon)`
    position: absolute;
    top: 12px;
    right: 20px;
    color: #4f86ec;
`;

export const IconOfSearch = () => {
    return (
        <StyledIconOfSearch icon={faSearch} />
    );
};

export const IconOfKeyboard = () => {
    return (
        <StyledIconOfKeyboard icon={faKeyboard} />
    );
};

export const IconOfMic = () => {
    return (
        <StyledIconOfMic icon={faMicrophone} />
    );
};