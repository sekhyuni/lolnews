import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import * as S from './Search.styled';
import * as Svg from '../../components/svg/Svg';

const Search = ({ keyword, setKeyword, result, setResult }) => {
    const [active, setActive] = useState([true, false, false, false]);

    const [modalIsOpen, setModalIsOpen] = useState(result.data.map(() => false));

    const openModal = idx => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = true;

        setModalIsOpen(newModalIsOpen);
    };

    const closeModal = idx => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = false;

        setModalIsOpen(newModalIsOpen);
    };

    // 운영 코드
    const resultDataTypeMenus = [
        { id: 1, link: '/search', value: '전체', svg: <Svg.All active={active[0]} /> },
        { id: 2, link: '/search/document', value: '문서', svg: <Svg.Document active={active[1]} /> },
        { id: 3, link: '/search/image', value: '포토', svg: <Svg.Image active={active[2]} /> },
        { id: 4, link: '/search/video', value: '영상', svg: <Svg.Video active={active[3]} /> },
    ];

    // 임시 개발 코드
    // const resultDataTypeMenus = [
    //     { id: 1, link: '/search', value: '전체', svg: <Svg.All active={active[0]} /> },
    //     { id: 2, link: '/search', value: '문서', svg: <Svg.Document active={active[1]} /> },
    //     { id: 3, link: '/search', value: '포토', svg: <Svg.Image active={active[2]} /> },
    //     { id: 4, link: '/search', value: '영상', svg: <Svg.Video active={active[3]} /> },
    // ];

    const elementsOfESDocument = result.data.map((document, idx) =>
        <S.Li key={document._id}>
            <S.DivOfTitle onClick={() => { openModal(idx); }}>{document._source.title}</S.DivOfTitle>
            <S.DivOfContent>{document._source.content.substr(0, 100)}</S.DivOfContent>
            <ReactModal isOpen={modalIsOpen[idx]}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={() => { closeModal(idx); }}>&times;</S.SpanOfModalClose>
                    </S.DivOfSpanModalCloseWrapper>
                    <S.DivOfModalTitle>{document._source.title}</S.DivOfModalTitle>
                    <S.DivOfModalContent>{document._source.content}</S.DivOfModalContent>
                    <S.ButtonOfModalClose onClick={() => { closeModal(idx); }}>닫기</S.ButtonOfModalClose>
                </S.DivOfModalWrapper>
            </ReactModal>
        </S.Li>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    const elementsOfResultDataTypeMenu = resultDataTypeMenus.map((resultDataTypeMenu, idx) =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} active={active} index={idx} onClick={() => {
                const newActive = [false, false, false, false];
                newActive[idx] = true;

                setActive(newActive);
            }}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.value}
            </S.LinkOfResultDataTypeMenu>
        </S.DivOfResultDataTypeMenuWrapper>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    // const day = ['일', '월', '화', '수', '목', '금', '토'];
    // const today = new Date();
    // const date = `${today.getMonth() + 1}.${today.getDate()}(${day[today.getDay()]})`;

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.LinkOfLogo to="/" onClick={() => { setKeyword(''); }}>
                        <S.Img alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkOfLogo>
                    <S.Div>
                        <Input layoutName="search" keyword={keyword} setKeyword={setKeyword} setResult={setResult} />
                    </S.Div>
                    <S.Nav>
                    </S.Nav>
                </S.HeaderOfTop>
                <S.HeaderOfBottom>
                    {elementsOfResultDataTypeMenu}
                </S.HeaderOfBottom>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.DivOfLnb>
                        <S.ButtonOfSort>최신순</S.ButtonOfSort>
                        <S.ButtonOfSort>과거순</S.ButtonOfSort>
                        <S.ButtonOfSort>많이본순</S.ButtonOfSort>
                    </S.DivOfLnb>
                    <S.Ul>
                        {elementsOfESDocument}
                    </S.Ul>
                </S.Section>
                <S.Aside>
                    <S.AsideOfContent type={1}>
                        <S.Strong>
                            연관 검색어
                        </S.Strong>
                        <S.DivOfRelatedSearchTermWrapper>
                            <S.LinkOfRelatedSearchTerm to="/search/?q=페이커">
                                페이커
                            </S.LinkOfRelatedSearchTerm>
                            <S.LinkOfRelatedSearchTerm to="/search/?q=롤">
                                롤
                            </S.LinkOfRelatedSearchTerm>
                            <S.LinkOfRelatedSearchTerm to="/search/?q=LOL">
                                LOL
                            </S.LinkOfRelatedSearchTerm>
                        </S.DivOfRelatedSearchTermWrapper>
                    </S.AsideOfContent>
                    {/* <S.AsideOfContent type={2}>
                        <strong>
                            포토
                        </strong>
                    </S.AsideOfContent> */}
                </S.Aside>
            </S.Main>
            <Footer layoutName="search" />
        </S.DivOfLayoutWrapper>
    );
};

export default Search;