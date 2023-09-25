import React, { PropsWithChildren } from 'react';
import { cleanup, render } from '@testing-library/react';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  const _jest = globalThis.jest;

  globalThis.jest = {
    ...globalThis.jest,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };

  return () => void (globalThis.jest = _jest);
});

afterEach(() => {
  cleanup();
});

type WrapperType = React.JSXElementConstructor<PropsWithChildren>;

export function withProviders(Wrapper: WrapperType = React.Fragment) {
  return function CreatedWrapper({ children }: PropsWithChildren) {
    return <Wrapper>{children}</Wrapper>;
  };
}

function customRender(ui: React.ReactElement, options: { wrapper?: WrapperType } = {}) {
  return render(ui, {
    ...options,
    // wrap provider(s) here if needed
    wrapper: withProviders(options.wrapper),
  });
}

export * from './withFormWrapper';
export * from '@testing-library/react';
export { composeStories } from '@storybook/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
