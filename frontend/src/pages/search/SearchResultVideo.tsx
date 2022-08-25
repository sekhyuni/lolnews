import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import doAxiosRequest from '../../functions/doAxiosRequest';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import Pagination from '../../components/pagination/Pagination';
import * as S from './SearchResultVideo.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultVideo = ({ isAuthorized, setIsAuthorized, keyword, setKeyword, type }: any) => {
    const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    // for location
    const { search } = useLocation();

    // for result
    interface Result {
        meta: any;
        data: any;
    }
    const [result, setResult] = useState<Result>({ meta: {}, data: [] });
    const [modalIsOpen, setModalIsOpen] = useState<Array<boolean>>([]);
    const [keywordForDetectOfSetPageEffect, setKeywordForDetectOfSetPageEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const [keywordForDetectOfFetchEffect, setKeywordForDetectOfFetchEffect] = useState<string>(decodeURI(search.split('query=')[1]));
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
    const [page, setPage] = useState<number>(1);

    // for sort
    const listOfOrder = [
        { name: '유사도순', value: 'score' },
        { name: '최신순', value: 'desc' },
        { name: '과거순', value: 'asc' },
    ];
    const [order, setOrder] = useState<string>('score');
    const [orderIsActive, setOrderIsActive] = useState<Array<boolean>>([true, false, false]);
    const [orderForDetectOfFetchEffect, setOrderForDetectOfFetchEffect] = useState<string>('score');

    // for type
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={false} /> },
        // { id: 4, link: `/search/video?query=${decodeURI(search.split('query=')[1])}`, name: '영상', svg: <Svg.Video active={true} /> },
    ];

    useEffect(() => { // for set order, when keyword is changed
        setKeyword(decodeURI(search.split('query=')[1]));
        setKeywordForDetectOfSetPageEffect(decodeURI(search.split('query=')[1]));

        setOrder('score');
        setOrderIsActive([true, false, false]);
    }, [search]);

    useEffect(() => { // for set page, when keyword or order is changed
        setKeywordForDetectOfFetchEffect(decodeURI(search.split('query=')[1]));

        setOrderForDetectOfFetchEffect(order);

        setPage(1);
    }, [order, keywordForDetectOfSetPageEffect]);

    useEffect(() => { // for fetch, when keyword or order or page is changed
        const fetchData = (): void => { // 나중에 useCallback으로 바꿀까?
            const paramsOfSearch = {
                query: decodeURI(search.split('query=')[1]),
                page,
                order,
                isImageRequest: false,
            };
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, paramsOfSearch).then((resultData: any): void => {
                setResult(resultData.data);
                setModalIsOpen(resultData.data.data.map((): boolean => false));
            });
            const paramsOfInsert = {
                word: decodeURI(search.split('query=')[1])
            };
            doAxiosRequest('POST', `${BASE_URL}/word`, paramsOfInsert).then((resultData: any): void => {
                console.log(resultData);
            });
        };

        fetchData();
    }, [keywordForDetectOfFetchEffect, orderForDetectOfFetchEffect, page]);

    const elementsOfESDocument = result.data.length !== 0 ? result.data.map((document: any, idx: number): JSX.Element =>
        <S.LiOfDocumentWrapper key={document._id} id={document._id}>
            <S.ImgOfContent src={document._source.thumbnail} onClick={(): void => { openModal(idx); }} />
            <S.DivOfTitleContentWrapper>
                <S.DivOfTitle onClick={(): void => { openModal(idx); }}>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                    pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfTitle}</S.StrongOfKeyword>) : pieceOfTitle)}
                </S.DivOfTitle>
                <S.DivOfContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfContent: string) =>
                    pieceOfContent === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfContent}</S.StrongOfKeyword>) : pieceOfContent)}
                </S.DivOfContent>
            </S.DivOfTitleContentWrapper>
            <ReactModal isOpen={modalIsOpen[idx]} onRequestClose={(): void => { closeModal(idx); }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={(): void => { closeModal(idx); }}>&times;</S.SpanOfModalClose>
                    </S.DivOfSpanModalCloseWrapper>
                    <S.DivOfModalTitle>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                        pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfTitle}</S.StrongOfKeyword>) : pieceOfTitle)}
                    </S.DivOfModalTitle>
                    <S.DivOfModalContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfContent: string) =>
                        pieceOfContent === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfContent}</S.StrongOfKeyword>) : pieceOfContent)}
                    </S.DivOfModalContent>
                    <S.ImgOfModalContent src={document._source.thumbnail} />
                    <S.DivOfModalPCLinkURL>출처 -&nbsp;<S.AOfPCLinkURL href={document._source.pcLinkUrl} target="_blank">{document._source.pcLinkUrl}</S.AOfPCLinkURL></S.DivOfModalPCLinkURL>
                </S.DivOfModalWrapper>
            </ReactModal>
        </S.LiOfDocumentWrapper>)
        :
        <S.LiOfDocumentWrapper>
            <S.H3OfNoneResult>검색된 결과가 없습니다.</S.H3OfNoneResult>
        </S.LiOfDocumentWrapper>;

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
                    <S.LinkOfLogo to="/" onClick={(): void => { setKeyword(''); }}>
                        <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkOfLogo>
                    <S.Div>
                        <Input keyword={keyword} setKeyword={setKeyword} layoutName="search" type="video" />
                    </S.Div>
                    <S.Nav>
                        {isAuthorized ?
                            <Dropdown layoutName="search" search={search} setKeyword={setKeyword} setIsAuthorized={setIsAuthorized} />
                            :
                            <S.LinkOfLoginPage to="/login" onClick={(): void => {
                                setKeyword(decodeURI(search.split('query=')[1]));
                            }}>
                                로그인
                            </S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
                <S.HeaderOfBottom>
                    {elementsOfResultDataTypeMenu}
                </S.HeaderOfBottom>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.SpanfCountOfResultWrapper>검색결과 : 총 <S.StrongOfCountOfResult>{String(result.meta.count)
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</S.StrongOfCountOfResult>건</S.SpanfCountOfResultWrapper>
                    <S.DivOfLnb>
                        {listOfOrder.map((order: any, idx: number): JSX.Element =>
                            <S.ButtonOfSort
                                orderIsActive={orderIsActive[idx]} onClick={(): void => {
                                    setOrder(order.value);

                                    const newOrderIsActive = listOfOrder.map((): boolean => false);
                                    newOrderIsActive[idx] = true;
                                    setOrderIsActive(newOrderIsActive);
                                }}>
                                {order.name}
                            </S.ButtonOfSort>)}
                    </S.DivOfLnb>
                    <S.UlOfListOfDocumentWrapper>
                        {elementsOfESDocument}
                    </S.UlOfListOfDocumentWrapper>
                    {result.data.length !== 0 ?
                        <Pagination total={result.meta.count} page={page} setPage={setPage} /> : <></>}
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