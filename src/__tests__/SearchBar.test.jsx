import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/Search/Search";

test("calls onSearch when button clicked", () => {
  const mockFn = jest.fn();

  render(<SearchBar onSearch={mockFn} />);

  // 🔹 type input
  fireEvent.change(
    screen.getByPlaceholderText(/search crypto/i),
    {
      target: { value: "bitcoin" },
    }
  );

  // 🔹 click button
  fireEvent.click(screen.getByText(/search/i));

  // 🔹 expect function called
  expect(mockFn).toHaveBeenCalledWith("bitcoin");
});

test("does not call onSearch when input is empty", () => {
  const mockFn = jest.fn();

  render(<SearchBar onSearch={mockFn} />);

  fireEvent.click(screen.getByText(/search/i));

  expect(mockFn).not.toHaveBeenCalled();
});