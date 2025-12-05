import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SugarProvider } from './context/SugarContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';

const App = () => {
  return (
    <SugarProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddEntry />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </SugarProvider>
  );
};

export default App;
