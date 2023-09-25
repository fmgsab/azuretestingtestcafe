import { renderHook, screen, userEvent, render } from '../test/test-utils';

import { useColumnDefinitions, Header, Cell, UseColumnDefinitionsProps } from './useColumnDefinitions';
import { IRow } from '../components/tables/tables';

describe('components/tables/hooks/useColumnDefinitions', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('<Header /', () => {
    it('should render correctly', async () => {
      const content = 'Description';
      render(<Header content={content} />);
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  describe('<Cell />', () => {
    it('should render Cell correctly for static value', async () => {
      const content = 'Hello';
      const getValue = vi.fn().mockReturnValue(content);
      const staticValue = 'Static hello';
      render(<Cell getValue={getValue} value={staticValue} />);
      expect(screen.queryByText(staticValue)).toBeInTheDocument();
    });

    it('should render Cell correctly for formatted value', async () => {
      const content = 'Hello';
      const getValue = vi.fn().mockReturnValue(content);
      const formatValue = vi.fn().mockImplementation((val: string) => val.toUpperCase());
      render(<Cell getValue={getValue} formatValue={formatValue} />);
      expect(screen.queryByText(content.toUpperCase())).toBeInTheDocument();
    });

    it('should render Cell correctly for simple string', async () => {
      const content = 'Hello';
      const getValue = vi.fn().mockReturnValue(content);
      render(<Cell getValue={getValue} />);
      expect(screen.queryByText(content)).toBeInTheDocument();
    });

    it('should render Cell correctly for keyPath', async () => {
      const user = userEvent.setup();

      const content = 'Hello';
      const keyContent = 'Key';
      const getValue = vi.fn().mockReturnValue(content);
      const getPathValue = vi.fn().mockReturnValue(keyContent);
      const onClick = vi.fn();
      const { rerender } = render(
        <Cell path="keyColumn" getValue={getValue} getPathValue={getPathValue} onClick={onClick} dataType="action" />
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cell = screen.queryByText(content)!;
      expect(cell).toBeInTheDocument();
      await user.click(cell);
      expect(onClick).toHaveBeenCalledWith(keyContent);

      rerender(<Cell path="keyColumn" getValue={getValue} onClick={onClick} dataType="action" />);
      await user.click(cell);
      expect(onClick).toHaveBeenCalledWith(content);
    });

    it('should render Cell correctly for currency type', async () => {
      const content = '20000';
      const getValue = vi.fn().mockReturnValue(content);
      render(<Cell getValue={getValue} dataType="currency" />);
      expect(screen.queryByText(content)).not.toBeInTheDocument();
      expect(screen.queryByText('$20,000')).toBeInTheDocument();
    });

    it('should render Cell correctly for action type', async () => {
      const content = '20000';
      const getValue = vi.fn().mockReturnValue(content);
      const { rerender } = render(<Cell getValue={getValue} dataType="action" />);
      expect(screen.queryByText(content)?.parentElement).toHaveClass('text-link');

      rerender(<Cell getValue={getValue} dataType="action" isActionDisabled />);
      expect(screen.queryByText(content)?.parentElement).toHaveClass('text-link-disabled cursor-not-allowed');
    });
  });

  it('should return correct column headers', async () => {
    const onClickFn = vi.fn();
    const columns = [
      {
        id: 'description',
        header: 'Description',
      },
      { id: 'coverType', header: 'Cover Type', size: 49.5 },
      { id: 'sumInsured', header: 'Sum Insured', dataType: 'currency', size: 25.5 },
      { id: 'excess', header: 'excess', dataType: 'currency', maxSize: 18 },
      {
        id: 'action',
        header: 'Action',
        dataType: 'action',
        value: 'Edit',
        path: 'description',
        // eslint-disable-next-line no-console
        onClick: onClickFn,
        maxSize: 18,
      },
    ] satisfies UseColumnDefinitionsProps<IRow>;

    const { result } = renderHook(() => useColumnDefinitions<IRow>(columns));

    expect(result.current[0]).toEqual({
      meta: { isAutoSizable: true },
      header: expect.any(Function),
      cell: expect.any(Function),
      accessorKey: 'description',
    });

    expect(result.current[1]).toEqual({
      header: expect.any(Function),
      cell: expect.any(Function),
      size: 49.5,
      accessorKey: 'coverType',
    });

    expect(result.current[2]).toEqual({
      header: expect.any(Function),
      cell: expect.any(Function),
      size: 25.5,
      accessorKey: 'sumInsured',
    });

    expect(result.current[3]).toEqual({
      header: expect.any(Function),
      cell: expect.any(Function),
      size: 18,
      maxSize: 18,
      accessorKey: 'excess',
    });

    expect(result.current[4]).toEqual({
      header: expect.any(Function),
      cell: expect.any(Function),
      size: 18,
      maxSize: 18,
      accessorKey: 'action',
    });
  });
});
