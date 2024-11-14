import React from 'react';
import { priceFeed } from './feed'
import './App.css';

function App() {

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex' }}>
        <input />
        <button>Add symbol</button>
      </div>
      <table style={{ width: 200 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid black'}}>Symbol</th>
            <th style={{ borderBottom: '1px solid black'}}>Price</th>
            <th style={{ borderBottom: '1px solid black'}}>Volume</th>
            <th style={{ borderBottom: '1px solid black'}}></th>
          </tr>
        </thead>
        <tbody>
          {/** display stuff */}
        </tbody>
      </table>
    </div>
  );
}

export default App;
