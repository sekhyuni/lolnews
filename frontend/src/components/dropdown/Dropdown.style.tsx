import { Link as Link_ } from 'react-router-dom';
import styled from 'styled-components';

export const DivOfDropdownMenuWrapper = styled.div`
    display: none;
    position: absolute;
    background-color: ${({ layoutName }) => layoutName === 'main' ? '#fff' : '#000'};
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
`;

export const DivOfDropdownWrapper = styled.div`
    width: 110px;
    height: 43px;
    margin: 23.5px 20px 23.5px 20px;
    :hover ${DivOfDropdownMenuWrapper} {
        display: block;
    }
`;

export const DivOfUser = styled.div`
    height: inherit;
`;

export const LinkOfDropdownMenu = styled(Link_)`
    display: block;
    color: ${({ layoutName }) => layoutName === 'main' ? '#000' : '#fff'};
    padding: 12px 16px;
    text-decoration: none;
    :hover {
        background-color: ${({ layoutName }) => layoutName === 'main' ? '#ddd' : '#1e1e1e'};
    }
`;