import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Search from './pages/search/Search';
import NotFound from './pages/notfound/Notfound';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main keyword={keyword} setKeyword={setKeyword} setResult={setResult} />} />
        <Route path="/search" element={<Search keyword={keyword} setKeyword={setKeyword} result={result} setResult={setResult} />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;