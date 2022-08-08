import styled from 'styled-components';

export const NavOfButtonOfPageWrapper = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 20px 0 20px 0;
`;

export const ButtonOfPage = styled.button`
    width: 35px;
    border: none;
    border-radius: 8px;
    padding: 8px;
    margin: 0;
    background: black;
    color: white;
    font-size: 1rem;

    &:hover {
        background: tomato;
        cursor: pointer;
        transform: translateY(-2px);
    }

    &[disabled] {
        background: grey;
        cursor: revert;
        transform: revert;
    }

    &[aria-current] {
        background: #1a73e8;
        font-weight: bold;
        cursor: revert;
        transform: revert;
    }
`;