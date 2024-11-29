import { useEffect, useState } from "react";
import { subscribeToPrices, priceFeed, Tick } from "./feed";
import "./App.css";

// 1. input stock/crypto symbols in the input, input should be uppercased. If I click on "Add symbol" OR press enter, the symbol should be added to the feed.
// 2. After adding a symbol, the input should be cleared.
// 3. After subscribing to a symbol, the table should display the symbol, price and volume.
// 4. The rows in the table should be ordered by insertion order (last added symbol should be on top).
// 5. Add an unsubscribe button to each row. When clicked, the symbol should be removed from the feed and the row should be removed from the table.
// 6. Add a dynamic colour to the "price" column. If the price is higher than the previous price, the cell should be green. If the price is lower, the cell should be red. If the price is the same, the cell should be black.

interface TickWithPrevPrice extends Tick {
  prevPrice: number | null;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<TickWithPrevPrice[]>([]);

  const subscribeSymbol = () => {
    if (inputValue && !data.some((item) => item.symbol === inputValue)) {
      priceFeed.subscribeToSymbol(inputValue);

      // Add symbol to the top of the array
      setData((prev) => [
        { symbol: inputValue, price: 0, volume: 0, prevPrice: null },
        ...prev,
      ]);

      setInputValue(""); // Clear input
    }
  };

  const unsubscribeSymbol = (symbol: string) => {
    priceFeed.unsubscribeFromSymbol(symbol);

    // Remove the symbol from the data array
    setData((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  useEffect(() => {
    // I have used RxJS Observable to take advantage of the buil-in cleanup. This way it's easier to unsubscribe and i wont need a manual cleanup
    const subscription = subscribeToPrices().subscribe((priceTick) => {
      setData((prevState) =>
        prevState.map((item) =>
          item.symbol === priceTick.symbol
            ? { ...item, ...priceTick, prevPrice: item.price }
            : item
        )
      );
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({
    key,
  }) => {
    if (key === "Enter") {
      subscribeSymbol();
    }
  };

  const getPriceColor = (prevPrice: number | null, currentPrice: number) => {
    if (prevPrice === null || prevPrice === currentPrice) return "black";
    return currentPrice > prevPrice ? "green" : "red";
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter symbol"
        />
        <button onClick={subscribeSymbol}>Add symbol</button>
      </div>
      <table style={{ width: 400, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid black" }}>Symbol</th>
            <th style={{ borderBottom: "1px solid black" }}>Price</th>
            <th style={{ borderBottom: "1px solid black" }}>Volume</th>
            <th style={{ borderBottom: "1px solid black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.symbol}>
              <td style={{ textAlign: "center" }}>{item.symbol}</td>
              <td
                style={{
                  textAlign: "center",
                  color: getPriceColor(item.prevPrice, item.price),
                }}
              >
                {item.price}
              </td>
              <td style={{ textAlign: "center" }}>{item.volume}</td>
              <td style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => unsubscribeSymbol(item.symbol)}>
                  Unsubscribe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
