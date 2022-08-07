import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import doAxiosRequest from '../../functions/doAxiosRequest';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Pagination from '../../components/pagination/Pagination';
import * as S from './SearchResultVideo.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultVideo = ({ keyword, setKeyword, type }: any) => {
    const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    // for location
    const { search } = useLocation();

    // for result
    const [result, setResult] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState<Array<boolean>>([]);
    const openModal = (idx: number): void => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = true;
        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = 'hidden';
    };
    const closeModal = (idx: number): void => {
        const newModalIsOpen = [...modalIsOpen];
        newModalIsOpen[idx] = false;
        setModalIsOpen(newModalIsOpen);

        document.body.style.overflow = '';
    };

    // for pagination
    const [page, setPage] = useState(1);
    const offset = (page - 1) * 20;

    // for sort
    const listOfOrder = [
        { name: '유사도순', value: 'score', sort: (a: any, b: any): number => b._score - a._score },
        { name: '최신순', value: 'desc', sort: (a: any, b: any): number => new Date(b._source.createdAt).getTime() - new Date(a._source.createdAt).getTime() },
        { name: '과거순', value: 'asc', sort: (a: any, b: any): number => new Date(a._source.createdAt).getTime() - new Date(b._source.createdAt).getTime() },
    ];
    const [order, setOrder] = useState('score');
    const [orderIsActive, setOrderIsActive] = useState([true, false, false]);

    // for type
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={false} /> },
        // { id: 4, link: `/search/video?query=${decodeURI(search.split('query=')[1])}`, name: '영상', svg: <Svg.Video active={true} /> },
    ];

    useEffect(() => {
        const fetchData = (): void => {
            const params = {
                query: decodeURI(search.split('query=')[1])
            };
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, params).then((resultData: any): void => {
                setResult(resultData.data);
                setModalIsOpen(resultData.data.map((): boolean => false));
            });

            setKeyword(decodeURI(search.split('query=')[1]));
            setPage(1);
            setOrder('score');
            setOrderIsActive([true, false, false]);
        };

        fetchData();
    }, [search, setKeyword]);

    const elementsOfESDocument = result.length !== 0 ? result.sort((a: any, b: any): number => {
        for (let idx = 0; idx < listOfOrder.length; idx++) {
            if (order === listOfOrder[idx].value) {
                return listOfOrder[idx].sort(a, b);
            }
        }

        return b._score - a._score;
    }).slice(offset, offset + 20).map((document: any, idx: number): JSX.Element =>
        <S.Li key={document._id}>
            <S.ImgOfContent src={document._source.thumbnail} onClick={() => { openModal(idx); }} />
            <S.DivOfTitleContentWrapper>
                <S.DivOfTitle onClick={() => { openModal(idx); }}>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                    pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.SpanOfKeyword>{pieceOfTitle}</S.SpanOfKeyword>) : pieceOfTitle)}
                </S.DivOfTitle>
                <S.DivOfContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                    pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.SpanOfKeyword>{pieceOfTitle}</S.SpanOfKeyword>) : pieceOfTitle)}
                </S.DivOfContent>
            </S.DivOfTitleContentWrapper>
            <ReactModal isOpen={modalIsOpen[idx]} onRequestClose={() => { closeModal(idx); }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={() => { closeModal(idx); }}>&times;</S.SpanOfModalClose>
                    </S.DivOfSpanModalCloseWrapper>
                    <S.DivOfModalTitle>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                        pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.SpanOfKeyword>{pieceOfTitle}</S.SpanOfKeyword>) : pieceOfTitle)}
                    </S.DivOfModalTitle>
                    <S.DivOfModalContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                        pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.SpanOfKeyword>{pieceOfTitle}</S.SpanOfKeyword>) : pieceOfTitle)}
                    </S.DivOfModalContent>
                    <S.ImgOfModalContent src={document._source.thumbnail} />
                    <S.DivOfModalPCLinkURL>출처 -&nbsp;<S.AOfPCLinkURL href={document._source.pcLinkUrl} target="_blank">{document._source.pcLinkUrl}</S.AOfPCLinkURL></S.DivOfModalPCLinkURL>
                </S.DivOfModalWrapper>
            </ReactModal>
        </S.Li>)
        :
        <S.Li>
            <h3>검색된 결과가 없습니다.</h3>
        </S.Li>;

    const elementsOfResultDataTypeMenu = listOfResultDataTypeMenu.map((resultDataTypeMenu: any): JSX.Element =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.name}
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
                        <Input keyword={keyword} setKeyword={setKeyword} layoutName="search" type="video" />
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
                        {listOfOrder.map((order: any, idx: number): JSX.Element =>
                            <S.ButtonOfSort
                                orderIsActive={orderIsActive[idx]} onClick={() => {
                                    setOrder(order.value);

                                    const newOrderIsActive = listOfOrder.map(() => false);
                                    newOrderIsActive[idx] = true;
                                    setOrderIsActive(newOrderIsActive);
                                }}>
                                {order.name}
                            </S.ButtonOfSort>)}
                    </S.DivOfLnb>
                    <S.Ul>
                        {elementsOfESDocument}
                    </S.Ul>
                    {result.length !== 0 ?
                        <Pagination total={result.length} page={page} setPage={setPage} /> : <></>}
                </S.Section>
                <S.Aside>
                    <S.AsideOfContent contentType="related">
                        <S.Strong>
                            연관 검색어
                        </S.Strong>
                        <S.DivOfRelatedSearchTermWrapper>
                            <S.LinkOfRelatedSearchTerm to={`/search/${type}?query=페이커`}>
                                페이커
                            </S.LinkOfRelatedSearchTerm>
                            <S.LinkOfRelatedSearchTerm to={`/search/${type}?query=롤`}>
                                롤
                            </S.LinkOfRelatedSearchTerm>
                            <S.LinkOfRelatedSearchTerm to={`/search/${type}?query=LOL`}>
                                LOL
                            </S.LinkOfRelatedSearchTerm>
                        </S.DivOfRelatedSearchTermWrapper>
                    </S.AsideOfContent>
                    {/* <S.AsideOfContent contentType="photo">
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

export default SearchResultVideo;