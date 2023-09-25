import React from 'react';
import { act, render, screen, userEvent } from '../../test/test-utils';
import { ApplicationSubmitButton } from './ApplicationSubmitButton';
import * as applicationFns from '../../hooks/useApplicationSubmission';
import { MockDB } from '../../test/mock-model-sections';

describe('menus/ApplicationSubmitButton', () => {
  const handler = vi.fn();
  const mockHookReturn: [boolean, () => void] = [true, handler];

  it('should render the Application summary button, sections and submit correctly', async () => {
    const user = userEvent.setup();
    const useAppSubSpy = vi.spyOn(applicationFns, 'default');
    useAppSubSpy.mockImplementation(() => mockHookReturn);
    render(<ApplicationSubmitButton sectionLists={{ jobId: jobId, sections: sections }} isOnline={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    expect(useAppSubSpy).toHaveBeenCalled();

    await act(() => user.click(button));

    expect(handler).toHaveBeenCalled();
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
