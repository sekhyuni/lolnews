import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Vertical = css`
    display: flex;
    flex-direction: column;
`;

export const Footer = styled.footer`
    ${Vertical}
    justify-content: center;
    align-items: center;
    height: 100px;
    ${({ layoutName }) => {
        if (layoutName === 'search') {
            return css`
                border-top: 0.5px solid #e1e1e1;
            `;
        }
    }}
    padding: 0 16px 0 16px;
`;

export const FooterOfTopElementWrapper = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 16px;
    color: ${({ layoutName }) => layoutName === 'main' ? '#000' : '#7e7e7e'};
`;

export const FooterOfBottomElementWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 12px 0 12px 0;
    font-size: 16px;
    color: ${({ layoutName }) => layoutName === 'main' ? '#000' : '#7e7e7e'};
`;

export const FooterOfTopElement = styled.div`
    border-left: ${({ layoutName }) => layoutName === 'main' ? '1.2px solid #000' : '1.2px solid #7e7e7e'};
    :first-child {
        border-left: 0;
    }
    padding: 0 20px 0 20px;
    :hover {
        text-decoration: underline;
    }
`;

export const FooterOfBottomElement = styled.div`
    margin: 0 3px 0 3px;
`

export const P = styled.p`
    margin: 0 0 0 0;
    font-weight: bold;
`;

export const A = styled.a`  
    text-decoration: none;
    color: inherit;
`;

export const Link = styled(Link_)`
    text-decoration: none;
    color: inherit;
`;

export const AOfCorps = styled.a`
    text-decoration: none;
    :hover {
        text-decoration: underline;
    }
    font-weight: bold;
    color: ${({ layoutName }) => layoutName === 'main' ? '#f2fa09' : 'inherit'};
`;