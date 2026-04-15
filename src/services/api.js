import axios from "axios";
import { ENV } from "../config/env";

const BASE_URL =
  ENV.BASE_URL || "https://api.coingecko.com/api/v3";

const CURRENCY = ENV.CURRENCY || "inr";

// ✅ Get coin list (for search)
export const searchCoin = async (query) => {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { query },
  });

  return res.data.coins;
};

// ✅ Get price + stats
export const getCoinDetails = async (coinId) => {
  const res = await axios.get(`${BASE_URL}/coins/markets`, {
    params: {
      vs_currency: CURRENCY,
      ids: coinId,
    },
  });

  return res.data[0];
};

// ✅ Get chart
export const getChartData = async (coinId) => {
  const res = await axios.get(
    `${BASE_URL}/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: CURRENCY,
        days: 7,
      },
    }
  );

  return res.data.prices;
};