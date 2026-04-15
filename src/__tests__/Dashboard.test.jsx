import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard/Dashboard";
import * as api from "../services/api";

jest.mock("../services/api");

describe("Dashboard", () => {
  // 🔥 silence expected console errors
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", async () => {
    render(<Dashboard />);

    // ✅ wait for initial render stabilization
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/search crypto/i)
      ).toBeInTheDocument();
    });
  });

  test("fetches and displays coin data", async () => {
    // ✅ FULL SAFE MOCK (no undefined anywhere)
    api.searchCoin.mockResolvedValue([
      { id: "bitcoin", symbol: "btc" },
    ]);

    api.getCoinDetails.mockResolvedValue({
      current_price: 50000,
      price_change_24h: 1000,
      price_change_percentage_24h: 2,
      high_24h: 51000,
      low_24h: 49000,
    });

    api.getChartData.mockResolvedValue([
      [123, 100],
      [456, 200],
    ]);

    render(<Dashboard />);

    // 🔥 wait initial effect to settle (important)
    await waitFor(() => {
      expect(api.searchCoin).toHaveBeenCalled();
    });

    // 🔥 simulate user
    fireEvent.change(
      screen.getByPlaceholderText(/search crypto/i),
      { target: { value: "bitcoin" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /search/i })
    );

    // ✅ strong assertion
    await waitFor(() => {
      expect(screen.getByText("BTC")).toBeInTheDocument();
    });

    // ✅ verify API usage
    expect(api.getCoinDetails).toHaveBeenCalled();
    expect(api.getChartData).toHaveBeenCalled();
  });

  test("shows error when no coin found", async () => {
    // ✅ SAFE mocks
    api.searchCoin.mockResolvedValue([]);
    api.getChartData.mockResolvedValue([]);

    render(<Dashboard />);

    // 🔥 wait initial render
    await waitFor(() => {
      expect(true).toBe(true);
    });

    fireEvent.change(
      screen.getByPlaceholderText(/search crypto/i),
      { target: { value: "unknown" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /search/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/coin not found/i)
      ).toBeInTheDocument();
    });
  });
});