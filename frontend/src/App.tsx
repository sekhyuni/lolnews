import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Join from './pages/join/Join';
import Login from './pages/login/Login';
import Search from './pages/search/index';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search/*" element={<Search />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;