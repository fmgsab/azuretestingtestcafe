import React from "react";
import { act, composeStories, render, screen } from "../../../test/test-utils";
import * as stories from "./Header.stories";
import { HeaderType } from "./Header";

const { Default } = composeStories(stories);

describe("layout/Headers", () => {
  afterAll(() => vi.clearAllMocks());

  it("should render new application header", async () => {
    await act(() => render(<Default headerType={HeaderType.acquisition} />));

    const input = screen.getByTestId("header-acquisition");
    expect(input).toBeInTheDocument();
  });

  it("should render acquisitions header", async () => {
    await act(() => render(<Default headerType={HeaderType.newApplication} />));

    const input = screen.getByTestId("header-newApplication");
    expect(input).toBeInTheDocument();
  });

  it("should render offline message", async () => {
    const args = {
      online: false,
    };

    await act(() => render(<Default headerType={HeaderType.newApplication} {...args} />));

    const input = screen.getByTestId("header-offline-message");
    expect(input).toBeInTheDocument();
  });

  it("should not render offline message", async () => {
    const args = {
      online: true,
    };

    await act(() => render(<Default headerType={HeaderType.newApplication} {...args} />));
    expect(screen.queryByTestId("header-offline-message")).not.toBeInTheDocument();
  });
});
