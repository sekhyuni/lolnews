import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Search from './pages/search/Search';
import NotFound from './pages/notfound/Notfound';

const App = () => {
  const [data, setData] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main setValue={setData} />}></Route>
        <Route path="/search" element={<Search value={data} />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
};

export default App;