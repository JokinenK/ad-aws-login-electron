import * as React from 'react';
import { HashRouter, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import { FailurePage } from './pages/FailurePage';
import { MainPage } from './pages/MainPage';
import { SuccessPage } from './pages/SuccessPage';

function App() {
  return (
    <div id="container">
      <HashRouter>
        <Routes>
          <Route path="/home" element={<MainPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage errorMessage={'Damn'}/>} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
