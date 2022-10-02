import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setKeyword, setPage, incrementPage, setOrder, setOrderIsActive, setOrderForDetectOfFetchEffect, setListOfArticle, addListOfArticle, setModalOfArticleIsOpen, clearArticleState } from '../../redux/features/articleSlice';
import { searchListOfArticleAPICall, insertArticleIdAPICall, insertForRecommendArticleIdAPICall } from '../../redux/features/articleSlice';
import { insertWordAPICall } from '../../redux/features/wordSlice';
import ReactModal from 'react-modal';
import Bricks from 'bricks.js';
import Loader from 'react-loader-spinner';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import moment from 'moment';
import * as S from './SearchResultImage.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultImage = ({ isChangedType }: any) => {
    const { search } = useLocation();

    const dispatch = useAppDispatch();
    const { page, order, orderIsActive, orderForDetectOfFetchEffect, listOfArticle, modalOfArticleIsOpen } = useAppSelector(state => state.article);

    const [keywordForDetectOfSetPageEffect, setKeywordForDetectOfSetPageEffect] = useState<string>(decodeURI(search.split('query=')[1]));
    const [keywordForDetectOfFetchEffect, setKeywordForDetectOfFetchEffect] = useState<string>(decodeURI(search.split('query=')[1]));

    interface ResidenceTime {
        start: Date;
        result: number;
    }
    const isChangedKeyword = useRef<boolean>(false);
    const residenceTime = useRef<ResidenceTime>({ start: new Date(0), result: 0 });
    const openModalOfArticle = (idx: number): void => {
        residenceTime.current.start = new Date();

        const newModalOfArticleIsOpen = [...modalOfArticleIsOpen];
        newModalOfArticleIsOpen[idx] = true;
        dispatch(setModalOfArticleIsOpen(newModalOfArticleIsOpen));

        document.body.style.overflow = 'hidden';
    };
    const closeModalOfArticle = (idx: number): void => {
        residenceTime.current.result = Number(new Date()) - Number(residenceTime.current.start);

        const newModalOfArticleIsOpen = [...modalOfArticleIsOpen];
        newModalOfArticleIsOpen[idx] = false;
        dispatch(setModalOfArticleIsOpen(newModalOfArticleIsOpen));

        document.body.style.overflow = '';
    };
    const insertArticleId = useCallback((articleId: string) => {
        const paramsOfInsert = {
            articleId,
            date: moment(residenceTime.current.start).add(9, 'hours')
        };
        dispatch(insertArticleIdAPICall(paramsOfInsert)).unwrap().then((response: any) => {
            console.log(response);
        }).catch((err: any) => {
            console.error(err);
        });
    }, [dispatch]);
    const insertForRecommendArticleId = useCallback((articleId: string) => {
        const paramsOfInsert = {
            userId: localStorage.getItem('id') || '',
            articleId,
            date: moment(residenceTime.current.start).add(9, 'hours'),
            residenceTime: residenceTime.current.result,
        };
        dispatch(insertForRecommendArticleIdAPICall(paramsOfInsert)).unwrap().then((response: any) => {
            console.log(response);
        }).catch((err: any) => {
            console.error(err);
        });
    }, [dispatch]);
    const listOfOrder = [
        { name: '최신순', value: 'desc' },
        { name: '과거순', value: 'asc' },
        { name: '유사도순', value: 'score' },
    ];
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={false} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={true} /> },
    ];
    const listOfElementOfResultDataTypeMenu = listOfResultDataTypeMenu.map((resultDataTypeMenu: any): JSX.Element =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id} onClick={() => {
                if (resultDataTypeMenu.id !== 3) {
                    dispatch(clearArticleState());
                    isChangedType.current = true;
                }
            }}>
                <S.SpanOfSvgWrapper position="navigation">
                    {resultDataTypeMenu.svg}
                </S.SpanOfSvgWrapper>
                {resultDataTypeMenu.name}
            </S.LinkOfResultDataTypeMenu>
        </S.DivOfResultDataTypeMenuWrapper>);

    const [loading, setLoading] = useState<boolean>(true);
    const loader = useRef<HTMLDivElement>(null);
    const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);
    const handleObserver = useCallback((entries: any): void => {
        if (isFirstRequest) {
            return;
        }
        const target = entries[0];
        if (target.isIntersecting) {
            dispatch(incrementPage());
        }
    }, [isFirstRequest, dispatch]);
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
    const listOfElementOfImage = listOfArticle.data.length !== 0 ? listOfArticle.data.map((document: any, idx: number, arr: any): JSX.Element =>
        <S.LiOfImageWrapper onLoad={(): void => { imageOnloaded(idx, arr); }} ref={(element: HTMLLIElement): void => {
            listOfImageWrapperRef.current[idx] = element;
        }} key={document._id} id={document._id} >
            <S.ImgOfContent src={document._source.thumbnail} onClick={(): void => {
                openModalOfArticle(idx);
                insertArticleId(document._id);
            }} />
            <ReactModal isOpen={modalOfArticleIsOpen[idx]} onRequestClose={(): void => {
                closeModalOfArticle(idx);
                insertForRecommendArticleId(document._id);
            }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={(): void => {
                            closeModalOfArticle(idx);
                            insertForRecommendArticleId(document._id);
                        }}>&times;</S.SpanOfModalClose>
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
        dispatch(setKeyword(decodeURI(search.split('query=')[1])));
        setKeywordForDetectOfSetPageEffect(decodeURI(search.split('query=')[1]));

        if (isChangedType.current) {
            dispatch(setOrder('desc'));
            dispatch(setOrderIsActive([true, false, false]));
        } else {
            isChangedKeyword.current = true;
        }
        isChangedType.current = false;
    }, [search, dispatch]);

    useEffect(() => {
        dispatch(setListOfArticle({ meta: {}, data: [] }));
        setKeywordForDetectOfFetchEffect(decodeURI(search.split('query=')[1]));

        dispatch(setOrderForDetectOfFetchEffect(order));

        dispatch(setPage(1));
    }, [order, keywordForDetectOfSetPageEffect, dispatch]);

    useEffect(() => {
        const paramsOfSearch = {
            query: decodeURI(search.split('query=')[1]),
            page,
            order,
            isImageRequest: true,
        };
        setLoading(true);
        dispatch(searchListOfArticleAPICall(paramsOfSearch)).unwrap().then((response: any) => {
            dispatch(addListOfArticle(response));
            dispatch(setModalOfArticleIsOpen(response.data.map((): boolean => false)));
            if (response.data.length === 0) {
                setLoading(false);
                if (listOfArticle.data.length === 0) { // 첫 요청 시에는 렌더링 전이므로 무조건 초깃값으로 0이지만, 이후 요청 시에는 0인 경우가 존재하지 않음
                    containerOfListOfImageWrapperRef.current.style.height = 'fit-content';
                }
            }
        }).catch((err: any) => {
            setLoading(false);
            containerOfListOfImageWrapperRef.current.style.height = 'fit-content';
            console.error(err);
        });
        if (isChangedKeyword.current) {
            const paramsOfInsert = {
                word: decodeURI(search.split('query=')[1]),
                date: moment().add(9, 'hours')
            };
            dispatch(insertWordAPICall(paramsOfInsert)).unwrap().then((response: any) => {
                console.log(response);
            }).catch((err: any) => {
                console.error(err);
            });
            isChangedKeyword.current = false;
        }
    }, [keywordForDetectOfFetchEffect, orderForDetectOfFetchEffect, page, dispatch]);

    return (
        <S.DivOfLayoutWrapper>
            <S.Header>
                <S.HeaderOfTop>
                    <S.LinkOfLogo to="/" onClick={(): void => { dispatch(clearArticleState()); }}>
                        <S.ImgOfLogo alt="LOLNEWS" src={require('../../assets/logo.png')} />
                    </S.LinkOfLogo>
                    <S.Div>
                        <Input layoutName="search" type="image" />
                    </S.Div>
                    <S.Nav>
                        {localStorage.getItem('id') ?
                            <Dropdown layoutName="search" />
                            :
                            <S.LinkOfLoginPage to="/login">로그인</S.LinkOfLoginPage>}
                    </S.Nav>
                </S.HeaderOfTop>
                <S.HeaderOfBottom>
                    {listOfElementOfResultDataTypeMenu}
                </S.HeaderOfBottom>
            </S.Header>
            <S.Main>
                <S.Section>
                    <S.DivOfLNBWrapper>
                        <S.DivOfResultDataTypeMenu>
                            <S.SpanOfSvgWrapper position="content">
                                <Svg.Image />
                            </S.SpanOfSvgWrapper>
                            포토
                        </S.DivOfResultDataTypeMenu>
                        <S.DivOfLNB>
                            {listOfOrder.map((order: any, idx: number): JSX.Element =>
                                <S.DivOfSort
                                    orderIsActive={orderIsActive[idx]} onClick={(): void => {
                                        dispatch(setOrder(order.value));

                                        const newOrderIsActive = listOfOrder.map((): boolean => false);
                                        newOrderIsActive[idx] = true;
                                        dispatch(setOrderIsActive(newOrderIsActive));
                                    }}>
                                    {order.name}
                                </S.DivOfSort>)}
                        </S.DivOfLNB>
                    </S.DivOfLNBWrapper>
                    <S.UlOfListOfImageWrapper ref={containerOfListOfImageWrapperRef}>
                        {listOfElementOfImage}
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