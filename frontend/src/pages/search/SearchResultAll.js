import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import doAxiosRequest from '../../functions/doAxiosRequest';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Pagination from '../../components/pagination/Pagination';
import * as S from './SearchResultAll.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultAll = ({ keyword, setKeyword }) => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    // for location
    const { search } = useLocation();

    // for result
    const [result, setResult] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState([]);

    // for pagination
    const [page, setPage] = useState(1);
    const offset = (page - 1) * 20;

    useEffect(() => {
        const fetchData = () => {
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, { q: decodeURI(search.split('q=')[1]) }).then(resultData => {
                setResult(resultData.data);
                setModalIsOpen(resultData.data.map(() => false));
            });

            // let resultData = [];
            // try {
            //     resultData = require(`../../../test/${decodeURI(search.split('q=')[1])}.json`);
            // } catch (error) {
            //     console.error(error);
            // }
            // setResult(resultData);
            // setModalIsOpen(resultData.map(() => false));

            setKeyword(decodeURI(search.split('q=')[1]));
            setPage(1);
        };

        fetchData();
    }, [search, setKeyword]);

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

    const elementsOfESDocument = result.length !== 0 ? result.slice(offset, offset + 20).map((document, idx) =>
        <S.Li key={document._id}>
            <S.ImgOfContent src={document._source.thumbnail} onClick={() => { openModal(idx); }} />
            <S.DivOfTitleContentWrapper>
                <S.DivOfTitle onClick={() => { openModal(idx); }}>{document._source.title}</S.DivOfTitle>
                <S.DivOfContent>{document._source.content.substr(0, 100)}</S.DivOfContent>
            </S.DivOfTitleContentWrapper>
            <ReactModal isOpen={modalIsOpen[idx]} onRequestClose={() => { closeModal(idx); }} preventScroll={false} ariaHideApp={false}>
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
        </S.Li>;

    const resultDataTypeMenus = [
        { id: 1, link: `/search/?q=${keyword}`, value: '전체', svg: <Svg.All active={true} /> },
        { id: 2, link: `/search/document?q=${keyword}`, value: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?q=${keyword}`, value: '포토', svg: <Svg.Image active={false} /> },
        { id: 4, link: `/search/video?q=${keyword}`, value: '영상', svg: <Svg.Video active={false} /> },
    ];

    const elementsOfResultDataTypeMenu = resultDataTypeMenus.map(resultDataTypeMenu =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id}>
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
                        <Input layoutName="search" type="" keyword={keyword} setKeyword={setKeyword} />
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
                    {result.length !== 0 ?
                        <Pagination total={result.length} page={page} setPage={setPage} /> : <></>}
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

export default SearchResultAll;