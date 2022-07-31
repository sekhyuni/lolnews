import * as S from './Pagination.styled';

function Pagination({ total, page, setPage }) {
    const numPages = Math.ceil(total / 20);

    return (
        <>
            <S.NavOfButtonOfPageWrapper>
                <S.ButtonOfPage onClick={() => { setPage(page - 1); }} disabled={page === 1}>
                    &lt;
                </S.ButtonOfPage>
                {Array(numPages).fill().map((_, index) => (
                    <S.ButtonOfPage
                        key={index + 1}
                        onClick={() => { setPage(index + 1); }}
                        aria-current={page === index + 1 ? 'page' : null} >
                        {index + 1}
                    </S.ButtonOfPage>
                ))}
                <S.ButtonOfPage onClick={() => { setPage(page + 1); }} disabled={page === numPages}>
                    &gt;
                </S.ButtonOfPage>
            </S.NavOfButtonOfPageWrapper>
        </>
    );
}

export default Pagination;
