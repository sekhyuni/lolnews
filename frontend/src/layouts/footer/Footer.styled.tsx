import { Link as Link_ } from 'react-router-dom';
import styled, { css } from 'styled-components';

const vertical = css`
    display: flex;
    flex-direction: column;
`;

const center = css`
    justify-content: center;
    align-items: center;
`;

const leftPadding = '200px';

const sectionWidth = '690px';

const asideWidth = '350px';

export const Footer = styled.footer`
    ${vertical}
    ${center}
    height: 100px;
    ${({ layoutName }: any) => {
        if (layoutName === 'search') {
            return css`
                border-top: 1px solid #e1e1e1;
                min-width: calc(${leftPadding} + ${sectionWidth} + 20px + ${asideWidth} + 20px);
            `;
        }
    }}
    padding: 0 16px 0 16px;
`;

export const FooterOfTopElementWrapper = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 16px;
    color: ${({ layoutName }: any) => layoutName !== 'search' ? '#fff' : '#7e7e7e'};
`;

export const FooterOfBottomElementWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 12px 0 12px 0;
    font-size: 16px;
    color: ${({ layoutName }: any) => layoutName !== 'search' ? '#fff' : '#7e7e7e'};
`;

export const FooterOfTopElement = styled.div`
    border-left: ${({ layoutName }: any) => layoutName !== 'search' ? '1.2px solid #fff' : '1.2px solid #7e7e7e'};
    :first-child {
        border-left: 0;
    }
    padding: 0 20px 0 20px;
    :hover {
        text-decoration: underline;
    }
`;

export const FooterOfBottomElement = styled.div`
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
    color: ${({ layoutName }: any) => layoutName !== 'search' ? '#94cf58' : 'inherit'};
`;