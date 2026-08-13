import React from 'react';
import Sidebar from './Sidebar';
import '../assets/global.css';

const PageContainer = ({ children }) => {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-wrapper">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;