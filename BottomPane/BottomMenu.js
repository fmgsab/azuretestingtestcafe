import { Selector } from 'testcafe';
class LeftMenuWizard {
  constructor() {
    this.menuHideBottom = Selector(`button[type='button'][title='Hide addons [A]'] svg`);
  }
}
export default new LeftMenuWizard();
