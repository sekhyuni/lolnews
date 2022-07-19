import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthorized ? <Home onChangeAuth={setIsAuthorized} /> : <Login onChangeAuth={setIsAuthorized} />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
};

export default App;