import Header from "./shared/header/header";
import Footer from "./shared/footer/footer";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <div className="app-container">
          <Dashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}