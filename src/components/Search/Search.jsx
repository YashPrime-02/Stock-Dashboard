import { useState, useEffect } from "react";
import "./Search.css";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  // ✅ DEBOUNCE LOGIC
  useEffect(() => {
    if (!input) return;

    const timer = setTimeout(() => {
      onSearch(input);
    }, 850); // ⏱ 850ms delay (sweet spot)

    return () => clearTimeout(timer);
  }, [input]);

  const suggestions = ["bitcoin", "ethereum", "solana", "doge"];

  return (
    <div>
      <div className="search-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search crypto (btc, eth, sol...)"
          className="search-input"
        />

        <button onClick={() => input && onSearch(input)} className="search-btn">
          Search
        </button>
      </div>

      {/* 🔥 Suggestions */}
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        {suggestions.map((coin) => (
          <span
            key={coin}
            onClick={() => onSearch(coin)}
            style={{
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "8px",
              background: "#1e293b",
              fontSize: "12px",
            }}
          >
            {coin}
          </span>
        ))}
      </div>
    </div>
  );
}
