import React, { PropsWithChildren, ReactElement } from 'react';
import { render } from '../test/test-utils';
import { OnlineStatusContext, OnlineStatusProvider, useOnlineContext } from './useOnlineStatus';

type ProviderProps = {
  children: ReactElement;
  value: {
    value: boolean;
  };
};

const customRender = ({ children, value }: ProviderProps) => {
  return render(<OnlineStatusContext.Provider {...value}>{children}</OnlineStatusContext.Provider>);
};

const customProvider = ({ children }: PropsWithChildren) => {
  return render(<OnlineStatusProvider>{children}</OnlineStatusProvider>);
};

const TestingComponent = () => {
  const result = useOnlineContext();
  return <div data-testid="online-status">{result?.toString()}</div>;
};

describe('useOnlineStatus', () => {
  it('should return true if online', async () => {
    const result = customRender({ children: <TestingComponent />, value: { value: true } });
    expect(result.getByTestId('online-status')).toHaveTextContent('true');
  });

  it('should return false if online', async () => {
    const result = customRender({ children: <TestingComponent />, value: { value: false } });
    expect(result.getByTestId('online-status')).toHaveTextContent('false');
  });

  it('Provider should return true', async () => {
    const result = customProvider({ children: <TestingComponent /> });
    expect(result.getByTestId('online-status')).toHaveTextContent('true');
  });
});
