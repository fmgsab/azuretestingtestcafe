import { render, screen, userEvent, withFormWrapper } from '../../test/test-utils';
import { z } from 'zod';
import { AppendableList } from './AppendableList';
import { TextInputWidget } from '../../components/form-widgets/TextInput/TextInputWidget';

const schema = z.object({
  names: z.array(z.object({ firstName: z.string(), lastName: z.string() })),
});

describe('AppendableList', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it.each`
    names                                                                | buttonLength
    ${[]}                                                                | ${1}
    ${[{ key: '1', firstName: 'John' }]}                                 | ${2}
    ${[{ key: '1', firstName: 'John' }, { key: '2', firstName: 'Tom' }]} | ${3}
  `('should render and function add correctly when default fields=$names', async ({ names, buttonLength }) => {
    const question = 'Please enter your names';
    const addButtonLabel = 'Name';
    const name = 'names';

    const props = { question, addButtonLabel, name };

    await render(
      <AppendableList {...props}>
        <TextInputWidget name="name" />
      </AppendableList>,
      { wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { names } }) }
    );

    expect(screen.queryAllByRole('textbox').length).toBe(names.length);

    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(buttonLength);

    await userEvent.click(buttons[buttons.length - 1]);

    expect(screen.queryAllByRole('textbox').length).toBe(names.length + 1);
    expect(screen.queryAllByText(question).length).toBe(1);
  });

  it.each`
    child
    ${(<TextInputWidget name="name" question="First name" />)}
    ${() => <TextInputWidget name="name" question="First name" />}
  `('should render and function remove correctly when repeated child props', async ({ child }) => {
    const names = [
      { key: '1', firstName: 'John' },
      { key: '2', firstName: 'Tom' },
    ];
    const question = 'Please enter your names';
    const addButtonLabel = 'Add Name';
    const name = 'names';

    const props = { question, addButtonLabel, name };

    await render(
      <AppendableList {...props} repeatChildProps>
        {child}
      </AppendableList>,
      { wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { names } }) }
    );

    expect(screen.queryAllByText('First name').length).toBe(names.length);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);

    expect(screen.queryAllByRole('textbox').length).toBe(names.length - 1);
  });

  it('should render alert correctly', async () => {
    const names = [{ key: '1', firstName: 'John' }];
    const question = 'Please enter your names';
    const addButtonLabel = 'Add Name';
    const name = 'names';
    const alert = 'Alert message here';

    const props = { question, addButtonLabel, name, alert };

    await render(
      <AppendableList {...props} repeatChildProps>
        <TextInputWidget name="name" question="First name" />
      </AppendableList>,
      { wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { names } }) }
    );

    expect(screen.queryByText(alert)).toBeInTheDocument();
  });
});
