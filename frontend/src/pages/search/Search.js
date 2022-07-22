import Input from '../../components/input/Input';
import * as S from './Search.styled';

const Search = ({ value, setValue }) => {
    const documents = value.data.map((document, idx) =>
        <div key={idx + 1}>
            <h1>title {idx + 1} : {document._source.title}</h1>
            <div>content {idx + 1} : {document._source.content}</div>
        </div>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    return (
        <S.Layout>
            <S.Header>
                <S.Link to="/">
                    <S.Image alt="LOLNEWS" src={require('../../assets/logo.png')} />
                </S.Link>
                <S.Div>
                    <Input layoutName="search" setValue={setValue} />
                </S.Div>
                <S.Nav>
                </S.Nav>
            </S.Header>
            <S.Main>
                <S.Section>
                    {documents}
                </S.Section>
            </S.Main>
            <S.Footer>
            </S.Footer>
        </S.Layout>
    );
};

export default Search;