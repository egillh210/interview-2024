import { useEffect, useState, useRef } from "react";
import { subscribeToPrices, priceFeed, Tick } from "./feed";
import "./App.css";

interface TickWithPrevPrice extends Tick {
  prevPrice: number | null;
}

interface ListNode {
  symbol: string;
  tick: TickWithPrevPrice;
  prev: ListNode | null;
  next: ListNode | null;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [renderData, setRenderData] = useState<ListNode[]>([]);

  const dataMap = useRef(new Map<string, ListNode>());
  const head = useRef<ListNode | null>(null); // Head of the DLL
  const tail = useRef<ListNode | null>(null); // Tail of the DLL

  const subscribeSymbol = () => {
    if (inputValue && !dataMap.current.has(inputValue)) {
      // Create a new list node
      const newNode: ListNode = {
        symbol: inputValue,
        tick: { symbol: inputValue, price: 0, volume: 0, prevPrice: null },
        prev: null,
        next: null,
      };

      // Add to the doubly-linked list (prepend to head)
      newNode.next = head.current;
      if (head.current) head.current.prev = newNode;
      head.current = newNode;
      if (!tail.current) tail.current = newNode;

      // Add to the map for O(1) access
      dataMap.current.set(inputValue, newNode);

      // Trigger a re-render
      updateRenderData();

      setInputValue(""); // Clear input
      priceFeed.subscribeToSymbol(inputValue);
    }
  };

  const unsubscribeSymbol = (symbol: string) => {
    const node = dataMap.current.get(symbol);
    if (!node) return;

    // Remove from the doubly-linked list
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === head.current) head.current = node.next;
    if (node === tail.current) tail.current = node.prev;

    // Remove from the map
    dataMap.current.delete(symbol);

    // Trigger a re-render
    updateRenderData();

    priceFeed.unsubscribeFromSymbol(symbol);
  };

  const updateRenderData = () => {
    const nodes: ListNode[] = [];
    let current = head.current;
    while (current) {
      nodes.push(current);
      current = current.next;
    }
    setRenderData(nodes); // Update renderData with the correct order
  };

  useEffect(() => {
    const subscription = subscribeToPrices().subscribe((priceTick) => {
      const node = dataMap.current.get(priceTick.symbol);
      if (node) {
        // Update the node's tick
        node.tick = {
          ...node.tick,
          ...priceTick,
          prevPrice: node.tick.price,
        };

        // Trigger a re-render
        updateRenderData();
      }
    });

    return () => subscription.unsubscribe();
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
          {renderData.map((node) => (
            <tr key={node.symbol}>
              <td style={{ textAlign: "center" }}>{node.symbol}</td>
              <td
                style={{
                  textAlign: "center",
                  color: getPriceColor(node.tick.prevPrice, node.tick.price),
                }}
              >
                {node.tick.price}
              </td>
              <td style={{ textAlign: "center" }}>{node.tick.volume}</td>
              <td style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => unsubscribeSymbol(node.symbol)}>
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
