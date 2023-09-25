import { act, renderHook } from '../test/test-utils';
import * as applicationFns from './useApplicationSubmission';
import { MockDB } from '../test/mock-model-sections';
import * as dexieReactHooks from 'dexie-react-hooks';

const { useApplicationSubmission } = applicationFns;

describe('ui/hooks/useApplicationSubmission', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should correctly render', async () => {
    const isOnline = true;
    const { result } = await act(async () => await renderHook(() => useApplicationSubmission(jobId, isOnline, sections)));
    expect(result).toBeDefined();
  });

  it('should calculate submission enabled when all conditions are met', async () => {
    const useLiveQuerySpy = vi.spyOn(dexieReactHooks, 'useLiveQuery');
    const getAllPromisesSpy = vi.spyOn(applicationFns, 'getAllPromises');
    expect(getAllPromisesSpy).toHaveBeenCalledTimes(0);

    useLiveQuerySpy.mockReturnValueOnce(useLiveQueryMockReturnAccounts).mockReturnValueOnce(useLiveQueryMockReturnRisk);
    useLiveQuerySpy.mockReturnValueOnce(useLiveQueryMockReturnAccounts).mockReturnValueOnce(useLiveQueryMockReturnRisk);
    useLiveQuerySpy.mockReturnValueOnce(useLiveQueryMockReturnAccounts).mockReturnValueOnce(useLiveQueryMockReturnRisk);
    const isOnline = true;
    const { result } = await act(() => renderHook(() => useApplicationSubmission(jobId, isOnline, sections)));

    expect(useLiveQuerySpy).toHaveBeenCalled();
    expect(useLiveQuerySpy).toHaveBeenCalledTimes(4);

    expect(result.current[0]).toBeTruthy();
    expect(result.current[1]).toBeDefined();

    act(() => result.current[1]());
  });
});

const jobId = 'test_1';
const contactId = 'test_1';
const db = new MockDB();
const sections = [
  {
    title: 'Account',
    sectionList: [
      {
        name: 'Key Information',
        table: db.keyInfo,
        uid: { contactId: contactId, jobId: jobId, type: 'keyInformation' },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Declarations',
    sectionList: [
      {
        name: 'Disclosure Statement',
        table: db.disclosureStatement,
        uid: { contactId: contactId, jobId: jobId, type: 'disclosureStatement' },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Risk',
    sectionList: [{ name: 'Houses', table: db.house, uid: { contactId: contactId, jobId: jobId, type: 'houses' }, isGroup: true }],
  },
];

const useLiveQueryMockReturnAccounts = [
  [
    {
      contactId: 'contact_1',
      jobId: 'application_1',
      type: 'keyInformation',
      name: 'Key Information',
      hasStarted: true,
      id: 1,
      hasCompleted: true,
      hasError: false,
    },
  ],
  [
    {
      contactId: 'contact_1',
      jobId: 'application_1',
      type: 'disclosureStatement',
      name: 'Disclosure Statement',
      hasStarted: true,
      id: 1,
      hasCompleted: true,
      hasError: false,
    },
  ],
];

const useLiveQueryMockReturnRisk = [
  [
    {
      contactId: 'contact_1',
      jobId: 'application_1',
      type: 'houses',
      name: 'Houses',
      hasStarted: true,
      id: 1,
      hasCompleted: true,
      hasError: false,
    },
  ],
];
