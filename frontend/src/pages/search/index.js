import { Routes, Route } from 'react-router-dom';
import SearchResultAll from './SearchResultAll';
import SearchResultDocument from './SearchResultDocument';
import SearchResultImage from './SearchResultImage';
import SearchResultVideo from './SearchResultVideo';

const Search = ({ keyword, setKeyword }) => {
    return (
        <Routes>
            <Route path="" element={<SearchResultAll keyword={keyword} setKeyword={setKeyword} />} />
            <Route path="/document" element={<SearchResultDocument keyword={keyword} setKeyword={setKeyword} />} />
            <Route path="/image" element={<SearchResultImage keyword={keyword} setKeyword={setKeyword} />} />
            <Route path="/video" element={<SearchResultVideo keyword={keyword} setKeyword={setKeyword} />} />
        </Routes>
    );
};

export default Search;