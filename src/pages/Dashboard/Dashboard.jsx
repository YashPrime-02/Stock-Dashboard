import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "../../components/Search/Search";
import Charts from "../../components/Charts/Charts";
import { searchCoin, getCoinDetails, getChartData } from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  // 🔹 Core state
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Persistent cache (does NOT reset on re-render)
  const cacheRef = useRef({});

  // 🔹 Request lock to prevent multiple API calls
  const isFetchingRef = useRef(false);

  // 🔹 Initial load (default coin)
  useEffect(() => {
    handleSearch("bitcoin");
  }, []);

  // 🔹 Safe currency formatter (prevents NaN issues)
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "N/A";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  // 🚀 Main search handler (core logic)
  const handleSearch = async (input) => {
    const key = input.toLowerCase().trim();

    // ✅ 1. Check cache first (avoid API call)
    if (cacheRef.current[key]) {
      const cached = cacheRef.current[key];
      setData(cached.data);
      setChart(cached.chart);
      setSymbol(cached.symbol);
      return;
    }

    // ✅ 2. Prevent duplicate API calls
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;

      // Reset UI states
      setLoading(true);
      setError("");
      setData(null);
      setChart([]);

      // 🔹 Step 1: Search coin
      const results = await searchCoin(input);

      if (!results || results.length === 0) {
        setError("Coin not found");
        return;
      }

      const coin = results[0];
      const symbol = coin.symbol.toUpperCase();

      // 🔹 Step 2: Fetch coin details
      const details = await getCoinDetails(coin.id);

      // 🔹 Step 3: Fetch chart data
      const chartRes = await getChartData(coin.id);

      // 🔹 Format chart data
      const formattedChart = chartRes.map((item) => ({
        date: new Date(item[0]).toLocaleDateString("en-IN"),
        price: item[1],
      }));

      // 🔹 Format stats data
      const formattedData = {
        c: details.current_price,
        d: details.price_change_24h,
        dp: details.price_change_percentage_24h,
        h: details.high_24h,
        l: details.low_24h,
        o: details.current_price - details.price_change_24h,
      };

      // ✅ 3. Save to cache (important optimization)
      cacheRef.current[key] = {
        data: formattedData,
        chart: formattedChart,
        symbol,
      };

      // Update UI
      setSymbol(symbol);
      setData(formattedData);
      setChart(formattedChart);

    } catch (err) {
      console.error(err);

      // Handle rate limit
      if (err.response?.status === 429) {
        setError("Too many requests. Please wait...");
      } else {
        setError("Failed to fetch data");
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // 🎬 Animation variants (structured animation system)
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }, // stagger children animation
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="dashboard">
      {/* 🔍 Search */}
      <SearchBar onSearch={handleSearch} />

      {/* ⏳ Loading State */}
      {loading && (
        <motion.div
          className="skeleton-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="skeleton-card" />
          <div className="skeleton-chart" />
        </motion.div>
      )}

      {/* ❌ Error State */}
      {error && (
        <motion.div
          className="error-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="error-icon">⚠️</span>
          <p className="error-text">{error}</p>
          <button className="error-close" onClick={() => setError("")}>
            ✕
          </button>
        </motion.div>
      )}

      {/* 📊 Data Section */}
      {data && (
        <motion.div
          key={symbol} // 🔥 forces re-animation on new search
          className="stats-container"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* 🔥 Main Card */}
          <motion.div className="main-stat-card" variants={itemVariant}>
            <h2 className="coin-name">{symbol}</h2>

            <p className="main-price">{formatCurrency(data.c)}</p>

            <p
              className={`main-change ${
                data.d >= 0 ? "positive" : "negative"
              }`}
            >
              {data.d.toFixed(2)} ({data.dp.toFixed(2)}%)
            </p>
          </motion.div>

          {/* 📦 Stats Grid */}
          <motion.div
            className="stats-grid"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "24H HIGH", value: data.h },
              { label: "24H LOW", value: data.l },
              { label: "OPEN", value: data.o },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="stat-card"
                variants={itemVariant}
                whileHover={{ scale: 1.05 }} // hover animation
              >
                <p className="stat-label">{item.label}</p>
                <p className="stat-value">
                  {formatCurrency(item.value)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 📈 Chart Section */}
      {chart.length > 0 && (
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Charts data={chart} />
        </motion.div>
      )}
    </div>
  );
}