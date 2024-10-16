import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import HandRecognition from './components/HandRecognition';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/hand-recognition" element={
              <div className="flex-grow flex justify-center items-center p-4">
                <HandRecognition />
              </div>
            } />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
