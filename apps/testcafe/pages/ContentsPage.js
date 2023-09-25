import { Selector } from 'testcafe';

class ContentsPage {
  constructor() {
    this.locSubType = `div[id='fields-itemSubtype']`;
    this.locLocation = `div[id='fields-location']`;
    this.locStoryBookIFrame = Selector('#storybook-preview-iframe');
    this.locItemSubTypeComBox = Selector(`${this.locSubType} input[role='combobox']`);
    this.locLocationComBox = Selector(`${this.locLocation} input[role='combobox']`);
    this.locMenuHouseHoldContents = Selector('#forms-householdcontents');
    this.locRadioOptionOccupancy = Selector(`div[id='fields-occupancy'] label:nth-of-type(1) span`);
    this.locClientDescription = Selector(`div[id='fields-name'] input`);
    this.locValueOfContentsInStorage = Selector(`div[id='fields-valueOfContentsInStorage'] input`);
    this.locOccupation = Selector(`div[id='fields-occupation'] input`);
    this.locSumInsuredGSTExclusive = Selector(`div[id='fields-sumInsured'] input[name='sumInsured.gstExclusive']`);
  }

  async ContentType(t, contentType) {
    await t
      .switchToIframe(this.locStoryBookIFrame())
      .click(this.locItemSubTypeComBox())
      .typeText(this.locItemSubTypeComBox, contentType)
      .click(Selector(`${this.locSubType} div[class*='overflow-hidden'] div[id*='option-1']`))
      .expect(Selector(`${this.locSubType} input[name='itemSubtype']`).value)
      .eql(contentType);
  }
  async Location(t, itemNumber) {
    await t
      .click(this.locLocationComBox())
      .click(Selector(`${this.locLocation} div[class*='overflow-hidden'] div[id*='option-${itemNumber}']`));
  }

  async setClientDescription(t, clientDescription) {
    await t.typeText(this.locClientDescription, clientDescription);
  }

  async verifyOccupancy(t, occupancyArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-occupancy', 'Occupancy', occupancyArray, optionToSelect);
  }

  async setOccupation(t, occupation) {
    await t.typeText(this.locOccupation, occupation);
  }

  async selectContentsInStorage(t, contentsInStorageArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-hasContentsInStorage', 'Contents In Storage', contentsInStorageArray, optionToSelect);
  }

  async selectCommercialUse(t, commercialUseArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-isCommercialUse', 'Commercial use', commercialUseArray, optionToSelect);
  }

  async selectShortTermPayingGuests(t, shortTermPayingGuestsArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-hasShortTermGuest',
      'Short term paying guests',
      shortTermPayingGuestsArray,
      optionToSelect
    );
  }

  async selectBodyCorporateManagedBuilding(t, bodyCorporateArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-isBodyCorpManaged',
      'Body corporate managed building',
      bodyCorporateArray,
      optionToSelect
    );
  }

  async selectFixedCarpetCover(t, fixedCarpetCoverArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-hasFixedCarpetCover', 'Fixed carpet cover', fixedCarpetCoverArray, optionToSelect);
  }

  async selectWaterSupply(t, waterSupplyArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-waterSupply', 'Water supply', waterSupplyArray, optionToSelect);
  }

  async selectUnrepairedEarthquakeDamage(t, unrepairedEarthquakeArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-hasUnRepairedEqcDamage',
      'Unrepaired earthquake damage',
      unrepairedEarthquakeArray,
      optionToSelect
    );
  }

  async selectBasisOfSettlement(t, basisOfSettlementArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-basisOfSettlement', 'Basis of settlement', basisOfSettlementArray, optionToSelect);
  }

  async selectExcess(t, excessArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-excess', 'Excess', excessArray, optionToSelect);
  }

  async selectLifestyleBlockContents(t, lifestyleBlockContentsArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-lifeStyleBlockContents',
      'Lifestyle block contents',
      lifestyleBlockContentsArray,
      optionToSelect
    );
  }

  async selectSpecifiedItems(t, specifiedItemsArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(t, 'fields-hasSpecifiedItems', 'Specified items', specifiedItemsArray, optionToSelect);
  }

  async selectBodyCorporateManagedBuilding(t, bodyCorporateArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-hasUnRepairedEqcDamage',
      'Body corporate managed building',
      bodyCorporateArray,
      optionToSelect
    );
  }

  async selectBodyCorporateManagedBuilding(t, bodyCorporateArray, optionToSelect) {
    await this.checkRadioOrCheckBoxField(
      t,
      'fields-isBodyCorpManaged',
      'Body corporate managed building',
      bodyCorporateArray,
      optionToSelect
    );
  }

  async checkRadioOrCheckBoxField(t, locatorRadio, fieldName, optionsArray, optionToSelect) {
    for (const list of optionsArray) {
      this.locRadioOccupancy = `//div[@id='${locatorRadio}']//span[text()=${list}]`;
      if (Selector(this.locRadioOccupancy).exists) console.log(`${fieldName} ${list} exists`);
      else console.log(`${fieldName} ${list} does not exists`);
    }
    if (optionToSelect != '') await this.clickOnElement(t, locatorRadio, optionToSelect);
  }

  async selectOccupancy(t, optionToSelect) {
    await this.clickOnElement(t, 'fields-occupancy', optionToSelect);
  }

  async clickOnElement(t, locatorRadio, optionToSelect) {
    await t.click(Selector(`div[id='${locatorRadio}'] span`).withText(optionToSelect));
  }

  async setValueOfContentsInStorage(t, valueOfContentsInStorage) {
    await t.typeText(this.locValueOfContentsInStorage, valueOfContentsInStorage);
  }

  async setSumInsuredGSTExclusive(t, sumInsuredGSTExclusive) {
    await t.typeText(this.locSumInsuredGSTExclusive, sumInsuredGSTExclusive, { paste: true });
  }

  async submitForm(t) {
    await t.click(Selector(`button`).withText('Submit'));
  }
}

export default new ContentsPage();
