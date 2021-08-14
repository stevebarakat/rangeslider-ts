import { RangeSlider } from "./RangeSlider";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("should render", () => {
  render(<RangeSlider initialValue={50} />);
  expect(screen.getByRole("slider")).toHaveValue("50");
});
