import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ReactModal from 'react-modal';
import Bricks from 'bricks.js';
import Loader from 'react-loader-spinner';
import doAxiosRequest from '../../functions/doAxiosRequest';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import * as S from './SearchResultImage.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultImage = ({ keyword, setKeyword, isChangedType }: any) => {
    const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

    // for location
    const { search } = useLocation();

    // for article
    interface Article {
        meta: any;
        data: any;
    }
    const [listOfArticle, setListOfArticle] = useState<Article>({ meta: {}, data: [] });
    const [modalOfArticleIsOpen, setModalOfArticleIsOpen] = useState<Array<boolean>>([]);
    const [keywordForDetectOfSetPageEffect, setKeywordForDetectOfSetPageEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const [keywordForDetectOfFetchEffect, setKeywordForDetectOfFetchEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const isChangedKeyword = useRef<boolean>(false);
    const openModalOfArticle = (idx: number): void => {
        const newModalOfArticleIsOpen = [...modalOfArticleIsOpen];
        newModalOfArticleIsOpen[idx] = true;
        setModalOfArticleIsOpen(newModalOfArticleIsOpen);

        document.body.style.overflow = 'hidden';
    };
    const closeModalOfArticle = (idx: number): void => {
        const newModalOfArticleIsOpen = [...modalOfArticleIsOpen];
        newModalOfArticleIsOpen[idx] = false;
        setModalOfArticleIsOpen(newModalOfArticleIsOpen);

        document.body.style.overflow = '';
    };
    const insertArticleId = useCallback((articleId: string) => {
        const paramsOfInsert = {
            articleId
        };
        doAxiosRequest('POST', `${BASE_URL}/article`, paramsOfInsert).then((resultData: any): void => {
            console.log(resultData);
        });
    }, []);

    // for pagination
    const [page, setPage] = useState<number>(1);

    // for sort
    const listOfOrder = [
        { name: '최신순', value: 'desc' },
        { name: '과거순', value: 'asc' },
        { name: '유사도순', value: 'score' },
    ];
    const [order, setOrder] = useState<string>('desc');
    const [orderIsActive, setOrderIsActive] = useState<Array<boolean>>([true, false, false]);
    const [orderForDetectOfFetchEffect, setOrderForDetectOfFetchEffect] = useState<string>('desc');

    // for type
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={true} /> },
        // { id: 4, link: `/search/video?query=${decodeURI(search.split('query=')[1])}`, name: '영상', svg: <Svg.Video active={false} /> },
    ];
    const listOfElementOfResultDataTypeMenu = listOfResultDataTypeMenu.map((resultDataTypeMenu: any): JSX.Element =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id} onClick={() => { if (resultDataTypeMenu.id !== 3) { isChangedType.current = true; } }}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.name}
            </S.LinkOfResultDataTypeMenu>
        </S.DivOfResultDataTypeMenuWrapper>);

    // for loading
    const [loading, setLoading] = useState<boolean>(true);
    const loader = useRef<HTMLDivElement>(null);
    const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);
    const handleObserver = useCallback((entries: any): void => {
        if (isFirstRequest) {
            return;
        }
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev: number): number => prev + 1);
        }
    }, [isFirstRequest]);
    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "0px", // 값이 클수록 빨리 감지됨
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
        Bricks({
            container: containerOfListOfImageWrapperRef.current,
            packed: 'data-packed',
            position: true,
            sizes: [
                { columns: 5, gutter: 12 }, // gutter는 column 사이 간격 (px)
            ]
        }).resize(true).pack();
        if (idxOfImage === arrOfImage.length - 1) {
            setLoading(false);
            if (isFirstRequest) {
                setIsFirstRequest(false);
            }
        }
    };
    const listOfElementOfArticle = listOfArticle.data.length !== 0 ? listOfArticle.data.map((document: any, idx: number, arr: any): JSX.Element =>
        <S.LiOfImageWrapper onLoad={(): void => { imageOnloaded(idx, arr); }} ref={(element: HTMLLIElement): void => {
            listOfImageWrapperRef.current[idx] = element;
        }} key={document._id} id={document._id} >
            <S.ImgOfContent src={document._source.thumbnail} onClick={(): void => {
                openModalOfArticle(idx);
                insertArticleId(document._id);
            }} />
            <ReactModal isOpen={modalOfArticleIsOpen[idx]} onRequestClose={(): void => { closeModalOfArticle(idx); }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={(): void => { closeModalOfArticle(idx); }}>&times;</S.SpanOfModalClose>
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

    useEffect(() => {
        setKeyword(decodeURI(search.split('query=')[1]));
        setKeywordForDetectOfSetPageEffect(decodeURI(search.split('query=')[1]));

        setOrder('desc');
        setOrderIsActive([true, false, false]);

        if (!isChangedType.current) {
            isChangedKeyword.current = true;
        }
        isChangedType.current = false;
    }, [search]);

    useEffect(() => {
        setListOfArticle({ meta: {}, data: [] });
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
                    setListOfArticle((prev: Article): Article => ({ meta: resultData.data.meta, data: [...prev.data, ...resultData.data.data] }));
                    setModalOfArticleIsOpen(resultData.data.data.map((): boolean => false));
                    if (resultData.data.data.length === 0) {
                        setLoading(false);
                        if (listOfArticle.data.length === 0) { // 첫 요청 시에는 렌더링 전이므로 무조건 초깃값으로 0이지만, 이후 요청 시에는 0인 경우가 존재하지 않음
                            containerOfListOfImageWrapperRef.current.style.height = 'fit-content';
                        }
                    }
                }).catch((err: any): void => {
                    setLoading(false);
                    containerOfListOfImageWrapperRef.current.style.height = 'fit-content';
                    console.error(err);
                });
            if (isChangedKeyword.current) {
                const paramsOfInsert = {
                    word: decodeURI(search.split('query=')[1])
                };
                doAxiosRequest('POST', `${BASE_URL}/word`, paramsOfInsert).then((resultData: any): void => {
                    console.log(resultData);
                });
                isChangedKeyword.current = false;
            }
        };

        fetchData();
    }, [keywordForDetectOfFetchEffect, orderForDetectOfFetchEffect, page]);

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
                        {localStorage.getItem('id') ?
                            <Dropdown layoutName="search" search={search} setKeyword={setKeyword} />
                            :
                            <S.LinkOfLoginPage to="/login" onClick={(): void => {
                                setKeyword(decodeURI(search.split('query=')[1]));
                            }}>
                                로그인
                            </S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
                <S.HeaderOfBottom>
                    {listOfElementOfResultDataTypeMenu}
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
                    <S.UlOfListOfImageWrapper ref={containerOfListOfImageWrapperRef}>
                        {listOfElementOfArticle}
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