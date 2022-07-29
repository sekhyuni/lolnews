import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import doAxiosRequest from '../../functions/doAxiosRequest';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import * as S from './Search.styled';
import * as Svg from '../../components/svg/Svg';

const Search = ({ keyword, setKeyword }) => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    const { search } = useLocation();
    const [hash, setHash] = useState(search);
    const [result, setResult] = useState([]);
    const [active, setActive] = useState([true, false, false, false]);
    const [modalIsOpen, setModalIsOpen] = useState([]);

    if (hash !== search) {
        setHash(search);
    }

    useEffect(() => {
        const fetchData = () => {
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, { q: decodeURI(search.split('=')[1]) }).then(resultData => {
                setResult(resultData.data);
                setModalIsOpen(resultData.data.map(() => false));
            });

            if (!keyword) {
                setKeyword(decodeURI(search.split('=')[1]));
            }
        };

        fetchData();
    }, [hash]);

    const openModal = idx => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = true;

        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = 'hidden';
    };

    const closeModal = idx => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = false;

        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = '';
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

    const elementsOfESDocument = result.length !== 0 ? result.map((document, idx) =>
        <S.Li key={document._id}>
            <S.ImgOfContent src={document._source.thumbnail} onClick={() => { openModal(idx); }} />
            <S.DivOfTitleContentWrapper>
                <S.DivOfTitle onClick={() => { openModal(idx); }}>{document._source.title}</S.DivOfTitle>
                <S.DivOfContent>{document._source.content.substr(0, 100)}</S.DivOfContent>
            </S.DivOfTitleContentWrapper>
            <ReactModal isOpen={modalIsOpen[idx]} onRequestClose={() => { closeModal(idx); }} preventScroll={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={() => { closeModal(idx); }}>&times;</S.SpanOfModalClose>
                    </S.DivOfSpanModalCloseWrapper>
                    <S.DivOfModalTitle>{document._source.title}</S.DivOfModalTitle>
                    <S.DivOfModalContent>{document._source.content}</S.DivOfModalContent>
                    <S.ImgOfModalContent src={document._source.thumbnail} />
                </S.DivOfModalWrapper>
            </ReactModal>
        </S.Li>)
        :
        <S.Li>
            <h3>검색된 결과가 없습니다.</h3>
        </S.Li>

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
        </S.DivOfResultDataTypeMenuWrapper>);

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.LinkOfLogo to="/" onClick={() => { setKeyword(''); }}>
                        <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkOfLogo>
                    <S.Div>
                        <Input layoutName="search" keyword={keyword} setKeyword={setKeyword} />
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