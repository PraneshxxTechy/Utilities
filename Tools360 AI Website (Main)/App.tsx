import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ToolPage } from './components/ToolPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTool, setCurrentTool] = useState(null);

  const handleNavigate = (page, tool = null) => {
    setCurrentPage(page);
    setCurrentTool(tool);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="pt-16">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'tool' && currentTool && (
          <ToolPage tool={currentTool} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}