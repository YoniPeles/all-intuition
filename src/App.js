import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
