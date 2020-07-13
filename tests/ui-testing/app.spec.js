import App from "../src/App.svelte";

import { render, fireEvent } from "@testing-library/svelte";

describe("UI Load Test", () => {
  it("Check Dropzone Loaded", () => {
    const { getByText, getByTestId } = render(App);
    const dropzone = getByTestId("dropzone");
    expect(dropzone).toBeDefined();
  });
});
