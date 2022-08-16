import { Routes, Route } from 'react-router-dom';
import SearchResultAll from './SearchResultAll';
import SearchResultDocument from './SearchResultDocument';
import SearchResultImage from './SearchResultImage';
// import SearchResultVideo from './SearchResultVideo';

const Search = ({ isAuthorized, setIsAuthorized, keyword, setKeyword }: any) => {
    return (
        <Routes>
            <Route path="" element={<SearchResultAll isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} type="" />} />
            <Route path="/document" element={<SearchResultDocument isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} type="document" />} />
            <Route path="/image" element={<SearchResultImage isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} />} />
            {/* <Route path="/video" element={<SearchResultVideo isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} type="video" />} /> */}
        </Routes>
    );
};

export default Search;