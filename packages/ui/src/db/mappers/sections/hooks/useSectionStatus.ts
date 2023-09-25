import store from '../store';
import { useNavContext } from '../../../../context/NavContext';

export function useSectionStatus() {
  const jobId = store.useStore(store.getJobId);
  const selectedSectionId = store.useStore(store.getSelectedSectionId);
  const form = store.useStore(store.getForm);

  const navContext = useNavContext();

  return {
    selectedSectionId,
    setSelectedSectionId: (sectionId: unknown, replace = false) => {
      store.setSelectedSectionId(sectionId);
      replace ? navContext.replace?.(String(sectionId)) : navContext.push?.(String(sectionId));
    },
    jobId,
    setJobId: store.setJobId,
    form,
    setForm: store.setForm,
  };
}
