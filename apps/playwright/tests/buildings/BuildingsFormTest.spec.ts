import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { expect, Page, test } from '@playwright/test';
import {
  checkFieldByLocator,
  checkRadioOrCheckBoxField,
  checkRadioOrCheckBoxWithInputField,
  checkTwoInputFields,
  delay,
  getListArray,
} from '../../utils/Utility';
import { getDate, getYear } from '../../utils/DateUtils';

const frameLocator = 'iframe[title="storybook-preview-iframe"]';
const records = parse(fs.readFileSync(path.join('./data/', 'BuildingForm1.csv')), {
  columns: true,
  skip_empty_lines: true,
});

for (const record of records) {
  console.log(record);
  test(`Test Case: ${record.BuildingTypeHeading + ' ' + record.Usage}`, async ({ page }) => {
    await delay(2000);
    await page.goto('http://localhost:6006/');
    await delay(2000);
    await page.goto('http://localhost:6006/?path=/story/atoms-affixinput--text');
    await page.getByRole('button', { name: 'Hide addons [A]' }).click();
    await page.getByRole('button', { name: 'Dismiss notification' }).click();

    let buildingType = 'commercialBuilding';
    if (record.Usage == 'C') {
      await page.getByRole('button', { name: 'BuildingCommercial' }).click();
    } else {
      await page.getByRole('button', { name: 'BuildingFarm' }).click();
      buildingType = 'farmBuilding';
    }
    await page.frameLocator(frameLocator).locator('.\\!text-base').first().click();
    await page.frameLocator(frameLocator).getByText(record.BuildingTypeHeading, { exact: true }).click();
    await checkFieldByLocator(page, frameLocator, 'Location', `css=div[id='fields-location']`, record.Location, '');
    const occupancyTypeArray = getListArray(buildingType, 'occupancyTypes');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Occupancy',
      '#fields-occupancy',
      record.Occupancy,
      occupancyTypeArray,
      'Owner occupied',
      ''
    );
    await checkInputFieldWithTwoSubAndAddComponent(page, 'Tenants', record.Tenantname, 'TenantName', 'Occupation', 'y');
    const basisOfSettArray = getListArray(buildingType, 'settlementTypes');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Basis of settlement',
      '#fields-basisOfSettlement',
      record.Basisofsettlement,
      basisOfSettArray,
      '',
      basisOfSettArray[0]
    );
    await checkFieldByLocator(page, frameLocator, 'Insured Event', `css=input[name='insuredEvent']`, record.Insuredevent, 'Insured Event');
    const useSystemCalcYesArray = ['Use system calculation', 'Yes'];
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Does the client want to provide their sum insured?',
      '#fields-overrideSystemSumInsured',
      record.Doestheclientwanttoprovidetheirsuminsured,
      useSystemCalcYesArray,
      '',
      'Yes',
      false
    );
    await checkTwoInputFields(
      page,
      frameLocator,
      'Total Sum Insured',
      `css=input[name='sumInsured.gstExclusive']`,
      `css=input[name='sumInsured.gstInclusive']`,
      record.TotalSumInsured,
      '100000'
    );
    await checkFieldByLocator(page, frameLocator, 'Total Build Cost', `css=input[name='totalBuildCost']`, record.Totalbuildcost, '150000');
    const yesNoInArray = ['Yes', 'No'];
    const previousYearDate = getDate(-1);
    await checkRadioOrCheckBoxWithInputField(
      page,
      frameLocator,
      'Valuation provided for sum insured',
      '#fields-valuationForSumInsured',
      record.Valuationtobesupplied,
      yesNoInArray,
      '',
      'Yes',
      false,
      'Date of valuation',
      `css=input[name='dateOfValuation']`,
      previousYearDate
    );

    const noOfLocForDateOfValuationField = await page.frameLocator(frameLocator).locator(`css=[id='question-dateOfValuation']`).count();
    if (noOfLocForDateOfValuationField > 0) await page.frameLocator(frameLocator).locator(`css=[id='question-dateOfValuation']`).click();
    await checkTwoInputFields(
      page,
      frameLocator,
      'Present Day Value',
      `css=input[name='presentDayValue.gstExclusive']`,
      `css=input[name='presentDayValue.gstInclusive']`,
      record.PresentDayValue,
      '100000'
    );
    await checkTwoInputFields(
      page,
      frameLocator,
      'Nominated Replacement Value',
      `css=input[name='replacementValue.gstExclusive']`,
      `css=input[name='replacementValue.gstInclusive']`,
      record.NominatedReplacementValue,
      '100000'
    );
    await checkTwoInputFields(
      page,
      frameLocator,
      'Demolition cost',
      `css=input[name='demolitionCost.gstExclusive']`,
      `css=input[name='demolitionCost.gstInclusive']`,
      record.IncludeDemolitionCost,
      '100000'
    );
    const limitsPerBuildingArray = getListArray(buildingType, 'limitsPerBuilding');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Limit Per Building',
      '#fields-limitsPerBuilding',
      record.XLimitperbuilding,
      limitsPerBuildingArray,
      '',
      'Other',
      false
    );
    await checkFieldByLocator(
      page,
      frameLocator,
      'Limit Per Building Details',
      `css=textarea[name='limitPerBuilding']`,
      record.XLimitperbuildingOther,
      '3000'
    );
    /**
     * Interested Parties Validation needs to be included when added in the code
     *
     * **/
    const excessArray = getListArray(buildingType, 'excesses');
    await checkRadioOrCheckBoxField(page, frameLocator, 'Excess', '#fields-excess', record.Excess, excessArray, '', excessArray[1]);
    const waterSupplyArray = getListArray('', 'waterSupplyTypes');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Water supply',
      '#fields-waterSupply',
      record.Watersupply,
      waterSupplyArray,
      '',
      waterSupplyArray[0]
    );
    const wallSideOptionsArray = getListArray('', 'wallSideOptions');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Number of walls or sides',
      '#fields-numberWalls',
      record.Numberofwallsorsides,
      wallSideOptionsArray,
      '',
      wallSideOptionsArray[0]
    );
    const tenYearsBack = getYear(-10);
    await checkFieldByLocator(
      page,
      frameLocator,
      'Construction year',
      `css=input[name='yearConstruction']`,
      record.Constructionyear,
      tenYearsBack
    );
    const roofConstructionArray = getListArray(buildingType, 'roofConstruction');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Roof construction',
      '#fields-roofConstruction',
      record.Roofconstruction,
      roofConstructionArray,
      '',
      roofConstructionArray[0]
    );
    const floorConstructionsArray = getListArray('', 'floorConstructions');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Floor construction',
      '#fields-floorConstruction',
      record.Floorconstruction,
      floorConstructionsArray,
      '',
      floorConstructionsArray[0]
    );
    const wallConstructionArray = getListArray(buildingType, 'wallConstruction');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Wall construction',
      '#fields-wallConstruction',
      record.Wallconstruction,
      wallConstructionArray,
      '',
      wallConstructionArray[0]
    );
    const constructionTypeArray = ['Rotary', 'Herringbone'];
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Construction type',
      '#fields-constructionType',
      record.Constructiontype,
      constructionTypeArray,
      '',
      constructionTypeArray[0]
    );
    await checkFieldByLocator(page, frameLocator, 'Number of bales', `css=input[name='numberOfBales']`, record.Numberofbales, '10');
    const buildingStoriesArray = getListArray(buildingType, 'buildingStories');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Number of stories',
      '#fields-numberOfStories',
      record.Numberofstories,
      buildingStoriesArray,
      '',
      buildingStoriesArray[0]
    );
    await checkFieldByLocator(page, frameLocator, 'Engineer sign-off', `css=input[name='engineerSignOff']`, record.Engineersignoff, '10');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Has Fire Protection?',
      '#fields-hasFireProtection',
      record.HasFireProtection,
      yesNoInArray,
      '',
      'Yes'
    );
    const fireProtectionsArray = getListArray(buildingType, 'fireProtections');
    let fireProtectionToSelect = 'Other';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const containsOther = fireProtectionsArray.some((item) => /Other/i.test(item.label));

    if (!containsOther) {
      fireProtectionToSelect = fireProtectionsArray[1].label;
    }
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Fire protection',
      `xpath=//div[contains(@style, 'opacity: 1;')]//div[@id='fields-fireProtection']`,
      record.Fireprotection,
      fireProtectionsArray,
      '',
      fireProtectionToSelect,
      true
    );
    await checkFieldByLocator(
      page,
      frameLocator,
      'Fire Protection Details',
      `css=textarea[name='otherFireProtection']`,
      record.FireprotectionDetails,
      'Fire Protected in detail'
    );
    await checkFieldByLocator(
      page,
      frameLocator,
      'Year of last satisfactory switchboard check',
      `css=input[name='yearSwitchboardCheck']`,
      record.Yearoflastsatisfactoryswitchboardcheck,
      tenYearsBack
    );
    const yesNoneInArray = ['None', 'Yes'];
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Any hazardous processes or substances',
      '#fields-hasHazards',
      record.Anyhazardousprocessesorsubstances,
      yesNoneInArray,
      '',
      'Yes'
    );
    const hazardsArray = getListArray(buildingType, 'hazards');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Hazardous processes or substances',
      '#fields-hazards',
      record.Hazardousprocessesorsubstances,
      hazardsArray,
      '',
      'Other',
      true
    );
    await checkFieldByLocator(
      page,
      frameLocator,
      'Other Hazard Details',
      `css=textarea[name='otherHazardDetails']`,
      record.HazardousprocessesorsubstancesDetails,
      'Other Hazard Details'
    );
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Any security features',
      '#fields-hasSecurityFeatures',
      record.Anysecurityfeatures,
      yesNoneInArray,
      '',
      'Yes'
    );
    await page.keyboard.press('PageDown');
    const securityFeaturesArray = getListArray(buildingType, 'securityFeatures');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Hazardous processes or substances',
      '#fields-securityQuestions',
      record.SecurityQuestions,
      securityFeaturesArray,
      '',
      'Other',
      true
    );
    await checkFieldByLocator(
      page,
      frameLocator,
      'Other Security Questions Details',
      `css=textarea[name='otherSecurityDetails']`,
      record.SecurityQuestionsDetails,
      'Other Security Details'
    );
    await buildingAreas(page, record.Usage, '0', '', '1930', '40', 'Domestic area', record.BuildingAreatype);
    await page.keyboard.press('PageDown');
    const historicOptionsArray = getListArray('', 'historicOptions');
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Historic place',
      '#fields-historicPlace',
      record.Historicplace,
      historicOptionsArray,
      '',
      historicOptionsArray[1]
    );
    await page.keyboard.press('PageDown');
    await buildingAreas(page, record.Usage, '1', 'Barn', tenYearsBack, '8', 'Barn area', record.BuildingAddAnother);
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Domestic Area',
      '#fields-domesticArea',
      record.Domesticarea,
      yesNoInArray,
      '',
      'Yes'
    );
    await checkRadioOrCheckBoxField(
      page,
      frameLocator,
      'Permanently occupied',
      '#fields-permanentlyOccupied',
      record.Permanentlyoccupied,
      yesNoInArray,
      '',
      'Yes'
    );
    let locatorForAreaType = 'buildingAreas';
    if (buildingType == 'farmBuilding' && record.BuildingAreatype == 'Y' && record.DomesticAreatype == 'Y') {
      locatorForAreaType = 'buildingAreasDomestic';
    }
    await buildingAreas(page, record.Usage, '0', '', tenYearsBack, '40', 'Domestic area', record.DomesticAreatype, locatorForAreaType);
    await page.keyboard.press('PageDown');
    await buildingAreas(
      page,
      record.Usage,
      '1',
      'Carport',
      tenYearsBack,
      '8',
      'Carport area',
      record.DomesticAddAnother,
      locatorForAreaType
    );

    await delay(10000);
  });
}

async function buildingAreas(
  page: Page,
  usage: string,
  index: string,
  type: string,
  year: string,
  area: string,
  description: string,
  stateOfTheField: string,
  locatorForAreaType = 'buildingAreas'
  // buildingType: string,
  // farmBuildingCheckForDomestic: Boolean = false
) {
  let locPreAreaType = '';
  if (usage.toUpperCase() == 'C') locPreAreaType = `//div[contains(@style, 'opacity: 1')]`;
  const locatorPrefixForAreaType = `${locPreAreaType}//div[@id='fields-`;
  if (index == '0') {
    await checkFieldByLocator(
      page,
      frameLocator,
      'Building Area Type',
      `${locatorPrefixForAreaType}${locatorForAreaType}.0.']//div[contains(@class, 'single')]`,
      // `xpath=//form/child::div[@id='fields-${locatorForAreaType}.0.']//div[contains(@class, 'single')]`,
      stateOfTheField,
      type
    );
  } else {
    await checkFieldByLocator(
      page,
      frameLocator,
      'Building Area Type',
      `${locatorPrefixForAreaType}${locatorForAreaType}.${index}.']//div[contains(@class, '!text-base')]`,
      stateOfTheField,
      type,
      true
    );
  }
  await checkFieldByLocator(
    page,
    frameLocator,
    'Building Year',
    `${locPreAreaType}//div//input[@name='${locatorForAreaType}.${index}.year']`,
    // `css=input[name='${locatorForAreaType}.${index}.year']`,
    stateOfTheField,
    year
  );
  await checkFieldByLocator(
    page,
    frameLocator,
    'Building Area',
    `${locPreAreaType}//div//input[@name='${locatorForAreaType}.${index}.area']`,
    // `${locatorPrefixForAreaType}${locatorForAreaType}.${index}.area']`,
    // `css=input[name='${locatorForAreaType}.${index}.area']`,
    stateOfTheField,
    area
  );
  await checkFieldByLocator(
    page,
    frameLocator,
    'Building Description',
    `${locPreAreaType}//div//textarea[@name='${locatorForAreaType}.${index}.description']`,
    // `${locatorPrefixForAreaType}${locatorForAreaType}.${index}.description']`,
    // `css=textarea[name='${locatorForAreaType}.${index}.description']`,
    stateOfTheField,
    description
  );
  const locatorAddBuildingArea = `${locPreAreaType}//div[contains(@id,'${locatorForAreaType}.')]/following-sibling::div[@class='form-fields']//button[@aria-label='Add Building Area']`;
  // let locatorAddBuildingArea = `div[id*='fields-${locatorForAreaType}.'] + div[class='form-fields'] button[aria-label='Add Building Area']`;
  //form/child::div[contains(@id,'fields-buildingAreas.')]/following-sibling::div[@class='form-fields']//button[@aria-label='Add Building Area']
  await checkFieldByLocator(page, frameLocator, 'Add Building Area', locatorAddBuildingArea, stateOfTheField, '');
  if (stateOfTheField.toUpperCase() == 'Y') await page.frameLocator(frameLocator).locator(locatorAddBuildingArea).click();
}

async function checkInputFieldWithTwoSubAndAddComponent(
  page: Page,
  fieldName: string,
  stateOfTheField: string,
  subFieldName1: string,
  subFieldName2: string,
  toCheckForAddButton: string
) {
  if (stateOfTheField.toUpperCase() == 'HIDE') {
    await test.step('Verify the field ' + fieldName + ' is not displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).getByText(fieldName)).toHaveCount(0);
    });
  } else {
    await test.step('Verify the field ' + fieldName + ' is displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).getByText(fieldName)).toHaveCount(1);
    });
    const locatorPrefix = 'text-input-' + fieldName.toLowerCase();
    // await page.frameLocator(frameLocator).getByTestId(locatorPrefix +'.0.name').click();
    // await page.frameLocator(frameLocator).getByTestId(locatorPrefix +'.0.occupation').click();
    await test.step(
      'Verify the sub fields ' + subFieldName1 + ' and  ' + subFieldName2 + ' are displayed in ' + fieldName + ' radio button',
      async () => {
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.0.name')
          .click();
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.0.name')
          .fill('Tenant1');
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.0.occupation')
          .click();
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.0.occupation')
          .fill('Bee Keeping');
      }
    );
    const dynamicVariable = 'fields-' + fieldName.toLowerCase();
    const locatorForAddButton = `xpath=//div[contains(@id, '${dynamicVariable}')]/following-sibling::div[@class='form-fields']//button[@aria-label='Add Another']`;
    if (toCheckForAddButton.toUpperCase() == 'HIDE') {
      await test.step(
        'Verify the sub fields ' + subFieldName1 + ' and  ' + subFieldName2 + ' are displayed in ' + fieldName + ' radio button',
        async () => {
          await expect(page.frameLocator(frameLocator).locator(locatorForAddButton)).toHaveCount(0);
        }
      );
    } else {
      await test.step('Verify the field Add button is displayed for ' + fieldName, async () => {
        await expect(page.frameLocator(frameLocator).locator(locatorForAddButton)).toHaveCount(1);
        // await page.frameLocator(frameLocator).getByText('Tenants*').click();
        await page.frameLocator(frameLocator).getByRole('button', { name: 'Add Another' }).click();
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.1.name')
          .click();
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.1.name')
          .fill('Tenant2');
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.1.occupation')
          .click();
        await page
          .frameLocator(frameLocator)
          .getByTestId(locatorPrefix + '.1.occupation')
          .fill('Farming');
        // await page.frameLocator(frameLocator).getByText('Tenants*').click();
      });
    }
  }
}
