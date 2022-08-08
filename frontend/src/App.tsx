import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Search from './pages/search/index';
import Account from './pages/account/Account';
import Login from './pages/login/Login';
import NotFound from './pages/notfound/Notfound';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    layoutName?: string;
    contentType?: string;
    type?: string;
    orderIsActive?: any;
  }
}

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [keyword, setKeyword] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} />} />
        <Route path="/search/*" element={<Search isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login setIsAuthorized={setIsAuthorized} keyword={keyword} setKeyword={setKeyword} />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;