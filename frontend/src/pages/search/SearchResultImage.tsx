import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import Loader from 'react-loader-spinner';
import doAxiosRequest from '../../functions/doAxiosRequest';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './SearchResultImage.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultImage = ({ isAuthorized, setIsAuthorized, keyword, setKeyword }: any) => {
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
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={true} /> },
        // { id: 4, link: `/search/video?query=${decodeURI(search.split('query=')[1])}`, name: '영상', svg: <Svg.Video active={false} /> },
    ];

    // for loading
    const [loading, setLoading] = useState<boolean>(true);
    const loader = useRef<HTMLDivElement>(null);
    const handleObserver = useCallback((entries: any): void => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev: number): number => prev + 1);
        }
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "500px 500px 500px 500px", // 값이 클수록 빨리 감지됨
            threshold: 0 // 0~1에서 1이면 추적하는 요소가 전부 보여야 감지됨
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, [handleObserver]);

    // for image arrangement
    const containerOfListOfImageWrapperRef = useRef<any>([]);
    const listOfImageWrapperRef = useRef<Array<HTMLLIElement>>([]);
    const imageOnloaded = (idxOfImage: number, arrOfImage: any): void => {
        const maxCountOfColumn = containerOfListOfImageWrapperRef.current.dataset.columns;

        const getHeight = (ImageWrapper: any): number => { // listOfImageWrapperRef.current[idx]
            let elmMargin = 0;
            let elmHeight = Math.ceil(parseFloat(getComputedStyle(ImageWrapper).height));
            elmMargin += Math.ceil(parseFloat(getComputedStyle(ImageWrapper).marginTop));
            elmMargin += Math.ceil(parseFloat(getComputedStyle(ImageWrapper).marginBottom));
            return elmHeight + elmMargin;
        };

        const calculateMasonryHeight = (listOfImageWrapper: any): void => { // listOfImageWrapperRef.current
            let idxOfColumn = 0;
            const columns: any = [];
            listOfImageWrapper.forEach((ImageWrapper: any): void => { // listOfImageWrapperRef.current[idx]
                if (!columns[idxOfColumn]) {
                    columns[idxOfColumn] = getHeight(ImageWrapper);
                } else {
                    columns[idxOfColumn] += getHeight(ImageWrapper);
                }
                idxOfColumn === maxCountOfColumn - 1 ? idxOfColumn = 0 : idxOfColumn++;
            });
            const maxHeight = Math.max(...columns);
            containerOfListOfImageWrapperRef.current.style.height = maxHeight + 'px';
        };

        if (idxOfImage === arrOfImage.length - 1) {
            calculateMasonryHeight(listOfImageWrapperRef.current);
            setLoading(false);
        }
    };

    useEffect(() => {
        setKeyword(decodeURI(search.split('query=')[1]));
        setKeywordForDetectOfSetPageEffect(decodeURI(search.split('query=')[1]));

        setOrder('score');
        setOrderIsActive([true, false, false]);
    }, [search]);

    useEffect(() => {
        setResult({ meta: {}, data: [] });
        setKeywordForDetectOfFetchEffect(decodeURI(search.split('query=')[1]));

        setOrderForDetectOfFetchEffect(order);

        setPage(1);
    }, [order, keywordForDetectOfSetPageEffect]);

    useEffect(() => {
        const fetchData = (): void => { // 나중에 useCallback으로 바꿀까?
            const paramsOfSearch = {
                query: decodeURI(search.split('query=')[1]),
                page,
                order,
                isImageRequest: true,
            };
            setLoading(true);
            doAxiosRequest('GET', `${BASE_URL}/search/keyword`, paramsOfSearch)
                .then((resultData: any): void => {
                    setResult((prev: Result): Result => ({ meta: resultData.data.meta, data: [...prev.data, ...resultData.data.data] }));
                    setModalIsOpen(resultData.data.data.map((): boolean => false));
                }).catch((err: any): void => {
                    setLoading(false);
                    containerOfListOfImageWrapperRef.current.style.height = 'fit-content';
                    console.error(err);
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

    const elementsOfESDocument = result.data.length !== 0 ? result.data.map((document: any, idx: number, arr: any): JSX.Element =>
        <S.LiOfImageWrapper onLoad={(): void => { imageOnloaded(idx, arr); }} ref={(element: HTMLLIElement): void => {
            listOfImageWrapperRef.current[idx] = element;
        }} key={document._id} id={document._id} >
            <S.ImgOfContent src={document._source.thumbnail} onClick={(): void => { openModal(idx); }} />
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
        </S.LiOfImageWrapper>)
        :
        <S.LiOfImageWrapper>
            {loading ? <></> : <S.H3OfNoneResult>검색된 결과가 없습니다.</S.H3OfNoneResult>}
        </S.LiOfImageWrapper>;

    const elementsOfBreakerSpan = Array(5).fill('').map((): JSX.Element => <S.SpanOfBreaker />);

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
                        <Input keyword={keyword} setKeyword={setKeyword} layoutName="search" type="image" />
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
                    <S.UlOfListOfImageWrapper ref={containerOfListOfImageWrapperRef} data-columns="5">
                        {elementsOfESDocument}
                        {elementsOfBreakerSpan}
                    </S.UlOfListOfImageWrapper>
                    {loading && <Loader type="Oval" color="#1a73e8" width={100} height={100} />}
                    <S.DivOfLoader ref={loader} />
                </S.Section>
            </S.Main>
            <Footer layoutName="search" />
        </S.DivOfLayoutWrapper>
    );
};

export default SearchResultImage;