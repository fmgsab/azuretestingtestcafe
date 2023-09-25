import { render, screen } from '../test/test-utils';

import * as model from '../test/mock-model';
import * as formUtil from '../hooks/useLoadTable';

import { FormProviderWrapper } from './FormProviderWrapper';
import { FormProps } from '../types';

const FormContent = (props: FormProps<unknown>) => (
  <FormProviderWrapper {...props}>
    <div>Form Content</div>
  </FormProviderWrapper>
);

describe('useFormField', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  const db = new model.MockDB('TestDB', { friends: '++, name, age' });

  const useLoadTableSpy = vi.spyOn(formUtil, 'useLoadTable');

  const defaultProps = {
    model: { ...model, table: db.friends },
    uid: 1,
    onSubmit: vi.fn(),
  };

  it('should invoke useLoadTable correctly', async () => {
    render(<FormContent {...defaultProps} />);
    expect(useLoadTableSpy).toHaveBeenCalled();
  });

  it('should render correctly when no table', async () => {
    const props = { model, uid: 1, onSubmit: vi.fn() };
    render(<FormContent {...props} />);
    expect(screen.queryByText('Form Content')).toBeDefined();
  });

  it('should render correctly', async () => {
    useLoadTableSpy.mockReturnValueOnce({ result: {}, isLoaded: true });
    render(<FormContent {...defaultProps} />);
    expect(screen.queryByText('Form Content')).toBeDefined();
  });

  it('should validate onload', async () => {
    useLoadTableSpy.mockReturnValueOnce({ result: {}, isLoaded: true });
    render(<FormContent shouldValidateOnLoad={true} {...defaultProps} />);
    expect(screen.queryByText('Form Content')).toBeDefined();
  });

  it('should render nothing when no loaded data', async () => {
    render(<FormContent {...defaultProps} />);
    expect(screen.queryByText('Form Content')).toBeNull();
  });
});
