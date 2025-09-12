import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignInPage, SignUpPage, HomePage, NotFoundPage, UnauthorizedPage } from './pages';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/super-admin/signin" element={<SignInPage />} />
          
          {/* Error Pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* 404 - Catch all route for undefined paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
