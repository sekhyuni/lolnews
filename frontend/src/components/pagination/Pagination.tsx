import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { setPage, incrementPage, decrementPage } from '../../redux/features/articleSlice';
import * as S from './Pagination.styled';

const Pagination = ({ total }: any) => {
    const dispatch = useAppDispatch();
    const { page } = useAppSelector(state => state.article);

    const numPages = Math.ceil(total / 10);
    const [pageStartIdx, setPageStartIdx] = useState<number>(1);
    const [pageEndIdx, setPageEndIdx] = useState<number>(10);

    return (
        <>
            <S.NavOfButtonOfPageWrapper>
                <S.ButtonOfPage onClick={() => {
                    if (page === pageStartIdx) {
                        setPageStartIdx((prev: number): number => prev - 1);
                        setPageEndIdx((prev: number): number => prev - 1);
                    }

                    dispatch(decrementPage());
                }} disabled={page === 1}>
                    &lt;
                </S.ButtonOfPage>
                {Array(numPages).fill('').map((_, idx: number): JSX.Element | undefined => {
                    if (idx >= pageStartIdx - 1 && idx <= pageEndIdx - 1) {
                        return (
                            <S.ButtonOfPage
                                key={idx + 1}
                                onClick={() => { dispatch(setPage(idx + 1)); }}
                                aria-current={page === idx + 1 ? 'page' : undefined}>
                                {idx + 1}
                            </S.ButtonOfPage>
                        );
                    }
                })}
                <S.ButtonOfPage onClick={() => {
                    if (page === pageEndIdx) {
                        setPageStartIdx((prev: number): number => prev + 1);
                        setPageEndIdx((prev: number): number => prev + 1);
                    }

                    dispatch(incrementPage());
                }} disabled={page === numPages}>
                    &gt;
                </S.ButtonOfPage>
            </S.NavOfButtonOfPageWrapper>
        </>
    );
};

export default Pagination;