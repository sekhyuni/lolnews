import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setKeyword, setPage, setOrder, setOrderIsActive, setOrderForDetectOfFetchEffect, setListOfArticle, setListOfPopularArticle, setModalOfArticleIsOpen, setModalOfPopularArticleIsOpen, clearArticleState } from '../../redux/features/articleSlice';
import { searchListOfArticleAPICall, searchListOfPopularArticleAPICall, insertArticleIdAPICall, insertForRecommendArticleIdAPICall } from '../../redux/features/articleSlice';
import { insertWordAPICall } from '../../redux/features/wordSlice';
import ReactModal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import { re } from '../../functions/re-template-tag';
import Footer from '../../layouts/footer/Footer';
import Input from '../../components/input/Input';
import Dropdown from '../../components/dropdown/Dropdown';
import Pagination from '../../components/pagination/Pagination';
import moment from 'moment';
import * as S from './SearchResultDocument.styled';
import * as Svg from '../../components/svg/Svg';

const SearchResultDocument = ({ type, isChangedType }: any) => {
    // react-tooltip bug fix 후, 아랫줄 제거
    const [tooltip, showTooltip] = useState(true);
    const { search } = useLocation();

    const dispatch = useAppDispatch();
    const { page, order, orderIsActive, orderForDetectOfFetchEffect, listOfArticle, listOfPopularArticle, modalOfArticleIsOpen, modalOfPopularArticleIsOpen } = useAppSelector(state => state.article);

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
    const listOfElementOfArticle = listOfArticle.data.length !== 0 ? listOfArticle.data.map((document: any, idx: number): JSX.Element =>
        <S.LiOfArticleWrapper contentType="normal" key={document._id} id={document._id}>
            <S.ImgOfContent contentType="normal" src={document._source.thumbnail} onClick={(): void => {
                openModalOfArticle(idx);
                insertArticleId(document._id);
            }} />
            <S.DivOfTitleContentWrapper contentType="normal">
                <S.DivOfTitle contentType="normal" onClick={(): void => {
                    openModalOfArticle(idx);
                    insertArticleId(document._id);
                }}>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                    pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfTitle}</S.StrongOfKeyword>) : pieceOfTitle)}
                </S.DivOfTitle>
                <S.DivOfContent>{document._source.content.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfContent: string) =>
                    pieceOfContent === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfContent}</S.StrongOfKeyword>) : pieceOfContent)}
                </S.DivOfContent>
                <S.DivOfSourceDateWrapper>
                    <S.DivOfSource>
                        {document._source.officeName}
                    </S.DivOfSource>
                    <S.DivOfDate>
                        {moment(document._source.createdAt).add(9, 'hours').format('YYYY.MM.DD. A hh:mm').replace(/AM|PM/, (el: string): string => ({ AM: '오전', PM: '오후' }[el]) || '')}
                    </S.DivOfDate>
                </S.DivOfSourceDateWrapper>
            </S.DivOfTitleContentWrapper>
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
        </S.LiOfArticleWrapper>)
        :
        <S.LiOfArticleWrapper>
            <S.H3OfNoneResult>검색된 결과가 없습니다.</S.H3OfNoneResult>
        </S.LiOfArticleWrapper>;

    const listOfOrder = [
        { name: '최신순', value: 'desc' },
        { name: '과거순', value: 'asc' },
        { name: '유사도순', value: 'score' },
    ];
    const listOfResultDataTypeMenu = [
        { id: 1, link: `/search/?query=${decodeURI(search.split('query=')[1])}`, name: '전체', svg: <Svg.All active={false} /> },
        { id: 2, link: `/search/document?query=${decodeURI(search.split('query=')[1])}`, name: '문서', svg: <Svg.Document active={true} /> },
        { id: 3, link: `/search/image?query=${decodeURI(search.split('query=')[1])}`, name: '포토', svg: <Svg.Image active={false} /> },
    ];
    const listOfElementOfResultDataTypeMenu = listOfResultDataTypeMenu.map((resultDataTypeMenu: any): JSX.Element =>
        <S.DivOfResultDataTypeMenuWrapper key={resultDataTypeMenu.id}>
            <S.LinkOfResultDataTypeMenu to={resultDataTypeMenu.link} id={resultDataTypeMenu.id} onClick={() => {
                if (resultDataTypeMenu.id !== 2) {
                    dispatch(clearArticleState());
                    isChangedType.current = true;
                }
            }}>
                <S.Span>
                    {resultDataTypeMenu.svg}
                </S.Span>
                {resultDataTypeMenu.name}
            </S.LinkOfResultDataTypeMenu>
        </S.DivOfResultDataTypeMenuWrapper>);

    const openModalOfPopularArticle = (idx: number): void => {
        residenceTime.current.start = new Date();

        const newModalOfPopularArticleIsOpen = [...modalOfPopularArticleIsOpen];
        newModalOfPopularArticleIsOpen[idx] = true;
        dispatch(setModalOfPopularArticleIsOpen(newModalOfPopularArticleIsOpen));

        document.body.style.overflow = 'hidden';
    };
    const closeModalOfPopularArticle = (idx: number): void => {
        residenceTime.current.result = Number(new Date()) - Number(residenceTime.current.start);

        const newModalOfPopularArticleIsOpen = [...modalOfPopularArticleIsOpen];
        newModalOfPopularArticleIsOpen[idx] = false;
        dispatch(setModalOfPopularArticleIsOpen(newModalOfPopularArticleIsOpen));

        document.body.style.overflow = '';
    };
    const listOfElementOfPopularArticle = listOfPopularArticle.map((document: any, idx: number): JSX.Element =>
        <S.LiOfArticleWrapper contentType="popular" key={document._id} id={document._id}>
            <S.ImgOfContent contentType="popular" src={document._source.thumbnail} onClick={(): void => {
                openModalOfPopularArticle(idx);
                insertArticleId(document._id);
            }} />
            <S.DivOfTitleContentWrapper contentType="popular">
                <S.DivOfTitle contentType="popular" onClick={(): void => {
                    openModalOfPopularArticle(idx);
                    insertArticleId(document._id);
                }}>{document._source.title.split(re`/(${decodeURI(search.split('query=')[1])})/g`).map((pieceOfTitle: string) =>
                    pieceOfTitle === decodeURI(search.split('query=')[1]) ? (<S.StrongOfKeyword>{pieceOfTitle}</S.StrongOfKeyword>) : pieceOfTitle)}
                </S.DivOfTitle>
            </S.DivOfTitleContentWrapper>
            <ReactModal isOpen={modalOfPopularArticleIsOpen[idx]} onRequestClose={(): void => {
                closeModalOfPopularArticle(idx);
                insertForRecommendArticleId(document._id);
            }} preventScroll={false} ariaHideApp={false}>
                <S.DivOfModalWrapper>
                    <S.DivOfSpanModalCloseWrapper>
                        <S.SpanOfModalClose onClick={(): void => {
                            closeModalOfPopularArticle(idx);
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
        </S.LiOfArticleWrapper>);

    useEffect(() => {
        dispatch(searchListOfPopularArticleAPICall()).unwrap().then((response: any) => {
            dispatch(setListOfPopularArticle(response));
            dispatch(setModalOfPopularArticleIsOpen(response.map((): boolean => false)));
        }).catch((err: any) => {
            console.error(err);
        });
    }, [dispatch]);

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
        setKeywordForDetectOfFetchEffect(decodeURI(search.split('query=')[1]));

        dispatch(setOrderForDetectOfFetchEffect(order));

        dispatch(setPage(1));
    }, [order, keywordForDetectOfSetPageEffect, dispatch]);

    useEffect(() => {
        const paramsOfSearch = {
            query: decodeURI(search.split('query=')[1]),
            page,
            order,
            isImageRequest: false,
        };
        dispatch(searchListOfArticleAPICall(paramsOfSearch)).unwrap().then((response: any) => {
            dispatch(setListOfArticle(response));
            dispatch(setModalOfArticleIsOpen(response.data.map((): boolean => false)));
        }).catch((err: any) => {
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
                        <Input layoutName="search" type="document" />
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
                    <S.StrongOfAllCountOfArticle>
                        <S.SpanOfKeyword>{decodeURI(search.split('query=')[1])}</S.SpanOfKeyword>
                        &nbsp;검색결과 :&nbsp;{String(listOfArticle.meta.count).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}건
                    </S.StrongOfAllCountOfArticle>
                    <S.DivOfLnb>
                        {listOfOrder.map((order: any, idx: number): JSX.Element =>
                            <S.ButtonOfSort
                                orderIsActive={orderIsActive[idx]} onClick={(): void => {
                                    dispatch(setOrder(order.value));

                                    const newOrderIsActive = listOfOrder.map((): boolean => false);
                                    newOrderIsActive[idx] = true;
                                    dispatch(setOrderIsActive(newOrderIsActive));
                                }}>
                                {order.name}
                            </S.ButtonOfSort>)}
                    </S.DivOfLnb>
                    <S.UlOfListOfArticleWrapper>
                        {listOfElementOfArticle}
                    </S.UlOfListOfArticleWrapper>
                    {listOfArticle.data.length !== 0 &&
                        <Pagination total={listOfArticle.meta.count} />}
                </S.Section>
                <S.Aside>
                    <S.AsideOfContent contentType="related">
                        <S.DivOfSubjectTitleWrapper>
                            <S.StrongOfSubjectTitle>연관 검색어</S.StrongOfSubjectTitle>
                            {/* <S.ImgOfHelpOfSubjectTitle alt="helpOfRelated" src={require('../../assets/help.png')} data-for="related" data-tip />
                            <ReactTooltip id="related" getContent={() => '사용자가 특정 단어를 검색한 후 연이어 많이 검색한 검색어를 자동 로직에 의해 추출하여 제공합니다.'} /> */}
                            {/* react-tooltip bug fix 후, 아래 2줄 제거 */}
                            <S.ImgOfHelpOfSubjectTitle alt="helpOfRelated" src={require('../../assets/help.png')} data-for="related" data-tip onMouseEnter={() => { showTooltip(true); }} onMouseLeave={() => { showTooltip(false); }} />
                            {tooltip && <ReactTooltip id="related" getContent={() => '사용자가 특정 단어를 검색한 후 연이어 많이 검색한 검색어를 자동 로직에 의해 추출하여 제공합니다.'} />}
                        </S.DivOfSubjectTitleWrapper>
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
                    {listOfPopularArticle.length !== 0 &&
                        <S.AsideOfContent contentType="popular">
                            <S.DivOfSubjectTitleWrapper>
                                <S.StrongOfSubjectTitle>많이 본 기사</S.StrongOfSubjectTitle>
                                {/* <S.ImgOfHelpOfSubjectTitle alt="helpOfPopular" src={require('../../assets/help.png')} data-for="popular" data-tip />
                                <ReactTooltip id="popular" getContent={() => '최근 12시간 집계 결과입니다.'} /> */}
                                {/* react-tooltip bug fix 후, 아래 2줄 제거 */}
                                <S.ImgOfHelpOfSubjectTitle alt="helpOfPopular" src={require('../../assets/help.png')} data-for="popular" data-tip onMouseEnter={() => { showTooltip(true); }} onMouseLeave={() => { showTooltip(false); }} />
                                {tooltip && <ReactTooltip id="popular" getContent={() => '최근 12시간 집계 결과입니다.'} />}
                            </S.DivOfSubjectTitleWrapper>
                            <S.UlOfListOfArticleWrapper>
                                {listOfElementOfPopularArticle}
                            </S.UlOfListOfArticleWrapper>
                        </S.AsideOfContent>}
                </S.Aside>
            </S.Main>
            <Footer layoutName="search" />
        </S.DivOfLayoutWrapper>
    );
};

export default SearchResultDocument;