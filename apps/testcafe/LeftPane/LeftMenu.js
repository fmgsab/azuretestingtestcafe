import { Selector } from 'testcafe';
class LeftMenuWizard {
  constructor() {
    this.menuHOuseHoldContents = Selector('#forms-householdcontents');
  }
}
export default new LeftMenuWizard();
