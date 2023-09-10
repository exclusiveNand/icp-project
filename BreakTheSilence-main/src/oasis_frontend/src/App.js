import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/landing';
import AuthPage from './pages/auth';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard/:page_id?/:view_key?" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
