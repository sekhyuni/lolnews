import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Input from '../../components/input/Input';
import * as S from './Search.styled';
import * as Svg from '../../components/svg/Svg';

const Search = ({ keyword, setKeyword, result, setResult }) => {
    const [active, setActive] = useState([true, false, false, false]);

    // 운영 코드
    const resultDataTypeMenus = [
        { id: 1, link: '/search', value: '전체', svg: <Svg.All active={active[0]} /> },
        { id: 2, link: '/search/document', value: '문서', svg: <Svg.Document active={active[1]} /> },
        { id: 3, link: '/search/image', value: '이미지', svg: <Svg.Image active={active[2]} /> },
        { id: 4, link: '/search/video', value: '동영상', svg: <Svg.Video active={active[3]} /> },
    ];

    // 임시 개발 코드
    // const resultDataTypeMenus = [
    //     { id: 1, link: '/search', value: '전체', svg: <Svg.All active={active[0]} /> },
    //     { id: 2, link: '/search', value: '문서', svg: <Svg.Document active={active[1]} /> },
    //     { id: 3, link: '/search', value: '이미지', svg: <Svg.Image active={active[2]} /> },
    //     { id: 4, link: '/search', value: '동영상', svg: <Svg.Video active={active[3]} /> },
    // ];

    // 운영 코드
    const elementsOfESDocument = result.data.map((document, idx) =>
        <div key={document._id}>
            <h1>Title {idx + 1} : {document._source.title}</h1>
            <div>Content {idx + 1} : {document._source.content}</div>
        </div>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    // 임시 개발 코드
    // const elementsOfESDocument = result.map((document, idx) =>
    //     <div key={document._id}>
    //         <h1>Title {idx + 1} : {document._source.title}</h1>
    //         <div>Content {idx + 1} : {document._source.content}</div>
    //     </div>
    // ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    const elementsOfResultDataTypeMenu = resultDataTypeMenus.map((resultDataTypeMenu, idx) =>
        <S.ResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkForMenu to={resultDataTypeMenu.link} active={active} index={idx} onClick={() => {
                const newActive = [false, false, false, false];
                newActive[idx] = true;

                setActive(newActive);
            }}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.value}
            </S.LinkForMenu>
        </S.ResultDataTypeMenuWrapper>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    return (
        <S.LayoutWrapper>
            <S.Header>
                <S.TopOfHeader>
                    <S.LinkForLogo to="/" onClick={() => { setKeyword(''); }}>
                        <S.Image alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkForLogo>
                    <S.Div>
                        <Input layoutName="search" keyword={keyword} setKeyword={setKeyword} setResult={setResult} />
                    </S.Div>
                    <S.Nav>
                    </S.Nav>
                </S.TopOfHeader>
                <S.BottomOfHeader>
                    {elementsOfResultDataTypeMenu}
                </S.BottomOfHeader>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.Ul>
                        {elementsOfESDocument}
                    </S.Ul>
                </S.Section>
            </S.Main>
            <S.Footer>
            </S.Footer>
        </S.LayoutWrapper>
    );
};

export default Search;