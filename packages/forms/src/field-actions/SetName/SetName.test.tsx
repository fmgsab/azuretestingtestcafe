import * as fieldInfo from '../../hooks/useFieldInfo';
import { render } from '@fmg/ui/src/test/test-utils';
import { SetName } from './SetName';

describe('field-actions/SetName', () => {
  it('should render correctly', async () => {
    const useFieldInfoSpy = vi.spyOn(fieldInfo, 'useFieldInfo').mockResolvedValue('');
    render(<SetName sources={['year', 'make', 'model', '-', 'rego']} />);

    expect(useFieldInfoSpy).toHaveBeenCalled();
  });
});
