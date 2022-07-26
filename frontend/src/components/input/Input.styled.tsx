import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faKeyboard, faMicrophone } from '@fortawesome/free-solid-svg-icons';

export const Form = styled.form`
    position: relative;
`;

export const InputOfSearch = styled.input`
    width: ${({ layoutName }: any) => layoutName === 'main' ? 'min(70vw, 850px)' : '800px'};
    height: 40px;
    border: 1.5px solid #ededed;
    border-radius: 30px;
    padding: 20px 45px;
    font-size: 1.1rem;
    font-weight: 500;
    ${({ layoutName }: any) => {
        if (layoutName === 'main') {
            return css`
                box-shadow: 0 2px 5px 1px #94cf58;
                :hover {
                    box-shadow: 0 4px 10px 2px #94cf58;
                }
            `;
        } else {
            return css`
                box-shadow: 0 2px 5px 1px rgba(64,60,67,.16);
                :hover {
                    box-shadow: 0 4px 10px 2px rgba(64,60,67,.16);
                }
            `;
        }
    }}
    :focus {
        outline: none;
    }
`;

const StyledIconOfSearch = styled(FontAwesomeIcon)`
    position: absolute; 
    top: 13px;
    left: 20px; 
    color: #999;
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

export const IconOfSearch = (): JSX.Element => {
    return (
        <StyledIconOfSearch icon={faSearch} />
    );
};

export const IconOfKeyboard = (): JSX.Element => {
    return (
        <StyledIconOfKeyboard icon={faKeyboard} />
    );
};

export const IconOfMic = (): JSX.Element => {
    return (
        <StyledIconOfMic icon={faMicrophone} />
    );
};