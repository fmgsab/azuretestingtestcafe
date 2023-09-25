import contentPage from './../pages/ContentsPage';
import leftMenuWizard from './../LeftPane/LeftMenu';
import bottomMenuWizard from './../BottomPane/BottomMenu';
import { getListArray } from '../utils/Utility';


fixture(`Verify Contents Form`).page`https://646a8109004ca89604646800-xwzlfvdwje.chromatic.com/`.skipJsErrors();

// JSON file is working fine
const dataSet = require('../data/SampleFile.json');

dataSet.forEach((data) => {
  test(`Household contents Test '${data.no}'`, async (t) => {
    console.log('What is the record number ' + data.no);
    await t.maximizeWindow().click(leftMenuWizard.menuHOuseHoldContents);
    await t.click(bottomMenuWizard.menuHideBottom);
    await contentPage.ContentType(t, data.contentType);
    await contentPage.Location(t, 2);
    await contentPage.setClientDescription(t, data.contentType);
    const occupancyTypeArray = await getListArray('content', 'occupancyTypes');
    await contentPage.verifyOccupancy(t, occupancyTypeArray, occupancyTypeArray[2]);
    await contentPage.selectOccupancy(t, occupancyTypeArray[2]);
    const yesNoInArray = ['Yes', 'No'];
    await contentPage.selectContentsInStorage(t, yesNoInArray, 'Yes');
    await contentPage.setValueOfContentsInStorage(t, '10000');
    await contentPage.selectCommercialUse(t, yesNoInArray, 'Yes');
    await contentPage.setOccupation(t, 'ACCT');
    await contentPage.selectShortTermPayingGuests(t, yesNoInArray, 'Yes');
    await contentPage.selectBodyCorporateManagedBuilding(t, yesNoInArray, 'Yes');
    await contentPage.selectFixedCarpetCover(t, yesNoInArray, 'Yes');
    const waterSupplyArray = await getListArray('', 'waterSupplyTypes');
    await contentPage.selectWaterSupply(t, waterSupplyArray, waterSupplyArray[1]);
    const yesNoDontKnowInArray = ['Yes', 'No', `Don't Know`];
    await contentPage.selectUnrepairedEarthquakeDamage(t, yesNoDontKnowInArray, 'Yes');
    const basisOfSettArray = await getListArray('content', 'settlementTypes');
    await contentPage.selectBasisOfSettlement(t, basisOfSettArray, basisOfSettArray[0]);
    await contentPage.setSumInsuredGSTExclusive(t, '100000');
    const excessesArray = await getListArray('content', 'excesses');
    await contentPage.selectExcess(t, excessesArray, excessesArray[2]);
    await contentPage.selectLifestyleBlockContents(t, yesNoInArray, 'Yes');
    await contentPage.selectSpecifiedItems(t, yesNoInArray, 'No');
    await contentPage.submitForm(t);
    await t.wait(4000);
  });
});
