import { Routes, Route } from 'react-router-dom';
import SearchResultAll from './SearchResultAll';
import SearchResultDocument from './SearchResultDocument';
import SearchResultImage from './SearchResultImage';
// import SearchResultVideo from './SearchResultVideo';

const Search = ({ keyword, setKeyword }: any) => {
    return (
        <Routes>
            <Route path="" element={<SearchResultAll keyword={keyword} setKeyword={setKeyword} type="" />} />
            <Route path="/document" element={<SearchResultDocument keyword={keyword} setKeyword={setKeyword} type="document" />} />
            <Route path="/image" element={<SearchResultImage keyword={keyword} setKeyword={setKeyword} type="image" />} />
            {/* <Route path="/video" element={<SearchResultVideo keyword={keyword} setKeyword={setKeyword} type="video" />} /> */}
        </Routes>
    );
};

export default Search;