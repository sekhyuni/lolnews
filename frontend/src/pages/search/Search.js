const Search = ({ value }) => {
    const documents = value.data.map((document, idx) =>
        <div key={idx + 1}>
            <h1>title {idx + 1} : {document._source.title}</h1>
            <div>content {idx + 1} : {document._source.content}</div>
        </div>
    ).reduce((prev, curr) => prev === null ? [curr] : [...prev, curr], null);

    console.log(documents);

    return (
        documents
    );
};

export default Search;