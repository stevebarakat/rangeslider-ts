import { Basic } from "./RangeSlider.stories.mdx";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("should render", () => {
  render(<Basic initialValue={50} />);
  expect(screen.getByRole("slider")).toHaveValue("50");
});
