import { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchResultAll from './SearchResultAll';
import SearchResultDocument from './SearchResultDocument';
import SearchResultImage from './SearchResultImage';

const Search = () => {
    const isChangedType = useRef<boolean>(false);

    return (
        <Routes>
            <Route path="" element={<SearchResultAll type="" isChangedType={isChangedType} />} />
            <Route path="/document" element={<SearchResultDocument type="document" isChangedType={isChangedType} />} />
            <Route path="/image" element={<SearchResultImage isChangedType={isChangedType} />} />
        </Routes>
    );
};

export default Search;