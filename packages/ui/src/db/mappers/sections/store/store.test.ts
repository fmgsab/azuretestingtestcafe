import { renderHook } from '../../../../test/test-utils';

import store, { createStore } from './store';

describe('util/section/store', () => {
  const initialState = { groups: {}, selectedSectionId: '', jobId: '', form: '' };

  it('should render result correctly', async () => {
    expect(store).toEqual(
      expect.objectContaining({
        createGroup: expect.any(Function),
        selectGroup: expect.any(Function),
        getJobId: expect.any(Function),
        setJobId: expect.any(Function),
        getSelectedSectionId: expect.any(Function),
        setSelectedSectionId: expect.any(Function),
        getForm: expect.any(Function),
        setForm: expect.any(Function),
        getState: expect.any(Function),
        setState: expect.any(Function),
        subscribe: expect.any(Function),
        serverInitialize: expect.any(Function),
        getServerState: expect.any(Function),
        useStore: expect.any(Function),
      })
    );

    expect(store.getState()).toEqual(initialState);
    expect(store.getServerState()).toEqual(initialState);
    store.setState({ ...initialState, selectedSectionId: 1 });
    expect(store.getState()).toEqual({ ...initialState, selectedSectionId: 1 });

    store.setSelectedSectionId(2);
    expect(store.getSelectedSectionId(store.getState())).toEqual(2);

    store.setJobId('test-1');
    expect(store.getJobId(store.getState())).toEqual('test-1');

    store.setForm('test-1-form-1');
    expect(store.getForm(store.getState())).toEqual('test-1-form-1');

    store.createGroup('New group');
    expect(store.selectGroup('New group')(store.getState())).toEqual({});
  });

  it('should render useStore hook correctly', async () => {
    const selector = vi.fn().mockReturnValue('Result');
    const newStore = createStore(initialState);

    const { result } = renderHook(() => newStore.useStore(selector));
    expect(result.current).toEqual('Result');
    expect(newStore.getServerState()).toEqual(initialState);

    const serverState = { ...initialState, form: 'test-1-form-2' };
    newStore.serverInitialize(serverState);
    expect(newStore.getServerState()).toEqual(serverState);

    newStore.serverInitialize({ ...serverState, form: 'test-1-form-3' });
    expect(newStore.getServerState()).toEqual(serverState);
  });
});
