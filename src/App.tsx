import React from 'react';
import { priceFeed } from './feed'
import './App.css';

// 1. input stock/crypto symbols in the input, input should be uppercased. If I click on "Add symbol" OR press enter, the symbol should be added to the feed.
// 2. After adding a symbol, the input should be cleared.
// 3. After subscribing to a symbol, the table should display the symbol, price and volume.
// 4. The rows in the table should be ordered by insertion order (last added symbol should be on top).
// 5. Add an unsubscribe button to each row. When clicked, the symbol should be removed from the feed and the row should be removed from the table.
// 6. Add a dynamic colour to the "price" column. If the price is higher than the previous price, the cell should be green. If the price is lower, the cell should be red. If the price is the same, the cell should be black.

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
