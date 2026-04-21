import { render } from "@testing-library/react";
import App from "./App";

test("renders the engine canvas", () => {
  render(<App />);
  expect(document.querySelector("canvas")).toBeInTheDocument();
});
