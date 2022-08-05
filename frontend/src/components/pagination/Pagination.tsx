import { useState } from 'react';
import * as S from './Pagination.styled';

function Pagination({ total, page, setPage }: any) {
    const numPages = Math.ceil(total / 20);
    const [pageStartIndex, setPageStartIndex] = useState(1);
    const [pageEndIndex, setPageEndIndex] = useState(10);

    return (
        <>
            <S.NavOfButtonOfPageWrapper>
                <S.ButtonOfPage onClick={() => {
                    if (page === pageStartIndex) {
                        setPageStartIndex(pageStartIndex - 1);
                        setPageEndIndex(pageEndIndex - 1);
                    }

                    setPage(page - 1);
                }} disabled={page === 1}>
                    &lt;
                </S.ButtonOfPage>
                {Array(numPages).fill('').map((_, index) => {
                    if (index >= pageStartIndex - 1 && index <= pageEndIndex - 1) {
                        return (
                            <S.ButtonOfPage
                                key={index + 1}
                                onClick={() => { setPage(index + 1); }}
                                aria-current={page === index + 1 ? 'page' : undefined}>
                                {index + 1}
                            </S.ButtonOfPage>
                        );
                    }
                })}
                <S.ButtonOfPage onClick={() => {
                    if (page === pageEndIndex) {
                        setPageStartIndex(pageStartIndex + 1);
                        setPageEndIndex(pageEndIndex + 1);
                    }

                    setPage(page + 1);
                }} disabled={page === numPages}>
                    &gt;
                </S.ButtonOfPage>
            </S.NavOfButtonOfPageWrapper>
        </>
    );
}

export default Pagination;
