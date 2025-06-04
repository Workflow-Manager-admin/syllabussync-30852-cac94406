import React from 'react';
import './App.css';
import MainContainer from './components/MainContainer';
import { ReactComponent as SyllabusSyncLogo } from './components/SyllabusSyncLogo.svg';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <SyllabusSyncLogo
                height={34}
                width={34}
                aria-label="SyllabusSync Logo"
                alt="SyllabusSync Logo"
                style={{ verticalAlign: 'middle', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main>
        <MainContainer />
      </main>
    </div>
  );
}

export default App;