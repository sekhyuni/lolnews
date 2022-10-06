/** @jsxImportSource @emotion/react */
import { useAppSelector } from '../../redux/app/hooks';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const Wordcloud = () => {
    const { listOfWordcloud } = useAppSelector(state => state.wordcloud);

    const options: any = {
        colors: ['#febf2d', '#94cf58', '#1072be', '#6f359e', '#fc0d1b'],
        enableTooltip: true,
        deterministic: false,
        fontSizes: [18, 80],
        padding: 3,
        rotations: 3,
        rotationAngles: [0, 90],
        scale: 'sqrt',
        spiral: 'archimedean',
        transitionDuration: 1000,
    };
    const size: any = [850, 600];

    return (
        <DivOfWordcloudWrapper>
            <ReactWordcloud words={listOfWordcloud} options={options} size={size} />
        </DivOfWordcloudWrapper>
    );
};

export default Wordcloud;

const vertical = css`
    display: flex;
    flex-direction: column;
`;

const DivOfWordcloudWrapper = styled.div`
    ${vertical}
    align-items: center;
    margin: 20px 0 0 0;    
`;