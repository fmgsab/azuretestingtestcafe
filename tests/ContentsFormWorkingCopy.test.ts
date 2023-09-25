import contentPage from './../pages/ContentsPage';
import leftMenuWizard from './../LeftPane/LeftMenu';
import bottomMenuWizard from './../BottomPane/BottomMenu';
import { getListArray } from '../utils/Utility';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';

const data = [];

// Use fs.readFileSync to read the CSV file
const fileContent = fs.readFileSync('./data/SampleFile.csv', 'utf8');

// Parse the CSV data using fast-csv
fastcsv
  .parseString(fileContent, {
    headers: true,
  })
  .on('data', (row) => {
    // Push each row from the CSV into the data array
    data.push(row);
  })
  .on('end', () => {
    // This block of code is executed when the CSV parsing is complete
    console.log('What is the Test Data');
    console.log(data);

    // Now you can perform actions with the parsed data, such as running TestCafe tests
  });

fixture(`Verify Contents Form`).page`http://localhost:6006/`.skipJsErrors();

test('Household contents Test', async (t) => {
  await t.maximizeWindow().click(leftMenuWizard.menuHOuseHoldContents);
  await t.click(bottomMenuWizard.menuHideBottom);
  let contentType = 'Household contents';
  await contentPage.ContentType(t, contentType);
  await contentPage.Location(t, 2);
  await contentPage.setClientDescription(t, contentType);
  const occupancyTypeArray = await getListArray('content', 'occupancyTypes');
  await contentPage.verifyOccupancy(t, occupancyTypeArray, occupancyTypeArray[2]);
  await contentPage.selectOccupancy(t, occupancyTypeArray[2]);
  const yesNoInArray = ['Yes', 'No'];
  await contentPage.selectContentsInStorage(t, yesNoInArray, 'Yes');
  await contentPage.setValueOfContentsInStorage(t, '10000');
  // await contentPage.setSumInsuredGSTExclusive('100000');
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
