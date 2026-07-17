import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PageContainer = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--background-light)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
export default PageContainer;
