/** @jsxImportSource @emotion/react */
import { useAppSelector } from '../../redux/app/hooks';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import urlOfTitleBackgroundImage from '../../assets/title-background.png';

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
            <h2 css={{
                padding: '10px 60px 10px 60px',
                margin: '0 0 0 0',
                fontSize: '32px',
                color: '#fff',
                backgroundPosition: 'center',
                backgroundSize: '400px 50px',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${urlOfTitleBackgroundImage})`,
            }}>Today's&nbsp;
                <strong css={{
                    color: '#fc0d1b',
                }}>Hot</strong>
                &nbsp;Keywords</h2>
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