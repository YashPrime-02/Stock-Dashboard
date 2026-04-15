# 🚀 Crypto Dashboard (React + Vite)

A modern, responsive crypto market dashboard built with React and Vite.

## ✨ Features

-   🔍 Search cryptocurrencies
-   📊 Real-time price data
-   📈 Interactive charts
-   ⚡ Debounced search
-   🧠 Smart caching
-   🎬 Smooth animations
-   🧪 Unit & integration tests

## 🏗️ Tech Stack

-   React 19 + Vite
-   Recharts
-   Axios
-   Framer Motion
-   Jest + React Testing Library
-   CoinGecko API
-   Docker (Nginx)

## 📁 Structure

src/ ├── components/ ├── pages/ ├── services/ ├── shared/ └── **tests**/

## ⚙️ Environment

VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
VITE_CURRENCY=inr

## 🧑‍💻 Run

npm install npm run dev

## 🧪 Test

npm run test

## 🐳 Docker

docker build -t crypto-dashboard . docker run -p 3000:80
crypto-dashboard

## 👨‍💻 Author

Yash Mishra
