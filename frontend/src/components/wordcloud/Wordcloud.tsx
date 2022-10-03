import { useAppSelector } from '../../redux/app/hooks';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import * as S from './Wordcloud.styled';

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

    const size: any = [1200, 300];

    return (
        <S.DivOfWordcloudWrapper>
            <ReactWordcloud words={listOfWordcloud} options={options} size={size} />
        </S.DivOfWordcloudWrapper>
    );
};

export default Wordcloud;