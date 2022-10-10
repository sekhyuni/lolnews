import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Main from './pages/main/Main';
// import Join from './pages/join/Join';
// import Login from './pages/login/Login';
// import Search from './pages/search/index';
// import Notfound from './pages/notfound/Notfound';

const Main = lazy(() => import('./pages/main/Main'));
const Join = lazy(() => import('./pages/join/Join'));
const Login = lazy(() => import('./pages/login/Login'));
const Search = lazy(() => import('./pages/search/index'));
const Notfound = lazy(() => import('./pages/notfound/Notfound'));

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    layoutName?: string;
    contentType?: string;
    type?: string;
    orderIsActive?: any;
    position?: string;
  }
}

const App = () => {
  return (
    <Router>
      <Suspense>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search/*" element={<Search />} />
          <Route path="/*" element={<Notfound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;