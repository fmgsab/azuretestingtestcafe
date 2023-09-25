import { expect, Locator, Page, test, TestInfo } from '@playwright/test';
import fs from 'fs';
import * as fastcsv from 'fast-csv';

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function screenshot(
  testInfo: TestInfo,
  page: Page,
  screenshotName: string,
  locator: Locator = page
    .getByRole('navigation')
    .locator('div')
    .filter({ hasText: 'Skip to canvasStorybookSearch for components/ComponentsButtonsForm WidgetsGridsM' })
    .nth(3)
) {
  await testInfo.attach(screenshotName, {
    body: await page.screenshot({
      mask: [locator],
    }),
    contentType: 'image/png',
  });
}

export async function readCSVData(filePath: string): Promise<any[]> {
  return new Promise((resolve) => {
    const vehicleFieldsData: any[] = [];

    fs.createReadStream(filePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (data: any) => {
        vehicleFieldsData.push(data);
      })
      .on('end', () => {
        resolve(vehicleFieldsData);
      });
  });
}

function getJSONAdminData(): any {
  const adminData = fs.readFileSync('../../packages/models/src/data-dictionary/lookup-data.json', 'utf-8');
  return JSON.parse(adminData);
}

export function getEngineTypeArray(vehicleType: string): any {
  let engineTypesArray = [];
  for (const item of getJSONAdminData().engineTypes) {
    if (item.itemSubtype.includes(vehicleType)) {
      engineTypesArray = item.list;
      break;
    }
  }
  if (engineTypesArray.length < 1) {
    fail('Test failed -------> No Engine Type found for vehicle ' + vehicleType);
  }
  return engineTypesArray;
}

/**
 * typeToExtract is the field name on lookup-data.json file**/

export function getListArray(itemTypeToMatch: string, typeToExtract: string): any {
  let listArray = [];
  const genericTypes = getJSONAdminData()[typeToExtract];
  if (itemTypeToMatch != '') {
    for (const item of genericTypes) {
      if (item.itemType.includes(itemTypeToMatch)) {
        listArray = item.list;
        break;
      }
    }
  } else {
    listArray = genericTypes;
  }
  console.log(listArray);
  return listArray;
}

export async function checkInputField(
  page: Page,
  frameLocator: string,
  fieldLocator: string,
  stateOfTheField: string,
  valueToPopulate: string
) {
  if (stateOfTheField.toUpperCase().includes('HIDE')) {
    await expect(page.frameLocator(frameLocator).getByTestId(fieldLocator)).toHaveCount(0);
  } else {
    await expect(page.frameLocator(frameLocator).getByTestId(fieldLocator)).toHaveCount(1);
    await page.frameLocator(frameLocator).getByTestId(fieldLocator).fill(valueToPopulate);
  }
}

export async function checkFieldByLocator(
  page: Page,
  frameLocator: string,
  fieldName: string,
  locatorFieldName: string,
  stateOfTheField: string,
  valueToPopulate: string,
  comboBox: Boolean = false
) {
  if (stateOfTheField.toUpperCase().includes('HIDE')) {
    await test.step('Verify the field ' + fieldName + ' is not displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(0);
    });
  } else {
    await test.step('Verify the field ' + fieldName + ' is displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(1);
      if (valueToPopulate != '') {
        if (!comboBox) {
          await page.frameLocator(frameLocator).locator(locatorFieldName).click();
          await page.frameLocator(frameLocator).locator(locatorFieldName).fill(valueToPopulate);
        } else {
          // await page.frameLocator(frameLocator).locator(locatorFieldName).fill(valueToPopulate);
          await page.frameLocator(frameLocator).locator(locatorFieldName).click();
          await page
            .frameLocator(frameLocator)
            .locator(locatorFieldName + '/input')
            .fill(valueToPopulate);
          await page.frameLocator(frameLocator).getByText(valueToPopulate, { exact: true }).click();
        }
      }
    });
  }
}

export async function checkTwoInputFields(
  page: Page,
  frameLocator: string,
  fieldName: string,
  locatorFieldName: string,
  locatorFieldName2: string,
  stateOfTheField: string,
  valueToPopulate: string
) {
  if (stateOfTheField.toUpperCase().includes('HIDE')) {
    await test.step('Verify the field ' + fieldName + ' is not displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(0);
    });
  } else {
    await test.step('Verify the field ' + fieldName + ' is displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(1);
      await page.frameLocator(frameLocator).locator(locatorFieldName).fill(valueToPopulate);
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName2)).toHaveCount(1);
    });
  }
}

/**
 * fieldName is the exact field name from the form
 * locatorFieldName is the div id locator that comprises the radio button options **/
export async function checkRadioOrCheckBoxField(
  page: Page,
  frameLocator: string,
  fieldName: string,
  locatorFieldName: string,
  stateOfTheField: string,
  listArray: any,
  defaultValueToCheck: string,
  valueToSelect: string,
  checkBox: Boolean = false
) {
  if (stateOfTheField.toUpperCase() == 'HIDE') {
    await test.step('Verify the field ' + fieldName + ' is not displayed in the form', async () => {
      await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(0);
    });
  } else {
    await expect(page.frameLocator(frameLocator).locator(locatorFieldName)).toHaveCount(1);
    for (const list of listArray) {
      if (!checkBox) {
        await test.step('Verify the field ' + list + ' is displayed in ' + fieldName, async () => {
          await expect(page.frameLocator(frameLocator).locator(locatorFieldName).getByText(list, { exact: true })).toHaveCount(1);
        });
      } else {
        await test.step('Verify the field ' + list.label + ' is displayed in ' + fieldName, async () => {
          await expect(page.frameLocator(frameLocator).locator(locatorFieldName).getByText(list.label, { exact: true })).toHaveCount(1);
        });
      }
    }
    if (defaultValueToCheck != '') {
      await test.step('Verify the default ' + defaultValueToCheck + ' is selected in ' + fieldName, async () => {
        await expect(page.frameLocator(frameLocator).locator("css=input[value='" + defaultValueToCheck + "'][checked]")).toHaveCount(1);
      });
    }
    if (valueToSelect != '') {
      await page.frameLocator(frameLocator).locator(locatorFieldName).getByText(valueToSelect).click();
    }
  }
}

export async function checkRadioOrCheckBoxWithInputField(
  page: Page,
  frameLocator: string,
  fieldName: string,
  locatorFieldName: string,
  stateOfTheField: string,
  listArray: any,
  defaultValueToCheck: string,
  valueToSelect: string,
  checkBox: Boolean = false,
  inputFieldName: string,
  inputFieldLocator: string,
  inputValueToPopulate: string
) {
  await checkRadioOrCheckBoxField(
    page,
    frameLocator,
    fieldName,
    locatorFieldName,
    stateOfTheField,
    listArray,
    defaultValueToCheck,
    valueToSelect,
    checkBox
  );
  if (inputValueToPopulate != '') {
    // await page.frameLocator(frameLocator).locator(locatorFieldName).getByText(valueToSelect).click();
    // await page.frameLocator(frameLocator).locator(locatorFieldName).scrollIntoViewIfNeeded();
    await checkFieldByLocator(page, frameLocator, inputFieldName, inputFieldLocator, stateOfTheField, inputValueToPopulate);
  }
  // }
}
