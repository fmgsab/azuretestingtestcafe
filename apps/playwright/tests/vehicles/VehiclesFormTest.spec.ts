import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { expect, Page, test } from '@playwright/test';
import { delay } from '../../utils/Utility';
import { getEngineTypeArray } from '../../utils/Utility';
import { checkInputField } from '../../utils/Utility';

const frameLocator = 'iframe[title="storybook-preview-iframe"]';
const records = parse(fs.readFileSync(path.join('./data/', 'VehicleFields2.csv')), {
  columns: true,
  skip_empty_lines: true,
});

for (const record of records) {
  test(`Test Case: ${record.VehicleType}`, async ({ page }) => {
    await delay(2000);
    await page.goto('http://localhost:6006/');
    await delay(2000);
    await page.goto('http://localhost:6006/?path=/story/atoms-affixinput--text');
    await page.getByRole('button', { name: 'Vehicle' }).click();
    await page.frameLocator(frameLocator).locator('.\\!text-base').first().click();
    await page.frameLocator(frameLocator).getByText(record.VehicleType, { exact: true }).click();
    await delay(2000);
    await checkInputField(page, frameLocator, 'text-input-rego', record.Rego, 'REGO');
    await checkInputField(page, frameLocator, 'text-input-year', record.Year, '2000');
    await checkInputField(page, frameLocator, 'text-input-make', record.MakeModel, record.VehicleType);
    await checkInputField(page, frameLocator, 'text-input-model', record.MakeModel, 'Basic Model');
    await checkInputField(page, frameLocator, 'text-input-variant', record.Variant, 'GL');
    await checkInputField(page, frameLocator, 'text-input-vin', record.VIN, 'SOMEVINNUMBER');
    await checkInputField(page, frameLocator, 'text-input-serial', record.Serial, '1234565687');
    await checkInputField(page, frameLocator, 'text-input-ccRating', record.CCrating, '2000');
    await checkInputField(page, frameLocator, 'text-input-glw', record.GLW, '1');
    await checkEngineType(page, "css=[id=fields-engineType] div[class*='flex text-base']", record.EngineType, record.VehicleType);
  });
}

async function checkEngineType(page: Page, fieldLocator: string, stateOfTheField: string, vehicleType: string) {
  if (stateOfTheField.toUpperCase() == 'HIDE') {
    await expect(page.frameLocator(frameLocator).locator(fieldLocator)).toHaveCount(0);
  } else if (stateOfTheField == 'Large Vehicles') {
    const engineTypeArray = getEngineTypeArray(vehicleType);
    console.log('Engine Type selected ' + engineTypeArray[1]);
    await expect(page.frameLocator(frameLocator).locator(fieldLocator)).toHaveCount(1);
    await page.frameLocator(frameLocator).locator(fieldLocator).first().click();
    for (const engineType of engineTypeArray) {
      console.log('Checking engine Type ' + engineType);
      await expect(page.frameLocator(frameLocator).getByText(engineType, { exact: true })).toHaveCount(1);
    }
    await page.frameLocator(frameLocator).getByText(engineTypeArray[0], { exact: true }).click();
  } else {
  /**Vehicle Type Bike will be covered in else statement**/
    const engineTypeArray = getEngineTypeArray(vehicleType);
    console.log('Engine Type selected ' + engineTypeArray[1]);
    await expect(page.frameLocator(frameLocator).locator(fieldLocator)).toHaveCount(1);
    await page.frameLocator(frameLocator).locator(fieldLocator).first().click();
    for (const engineType of engineTypeArray) {
      console.log('Checking engine Type ' + engineType);
      await expect(page.frameLocator(frameLocator).getByText(engineType, { exact: true })).toHaveCount(1);
    }
    await page.frameLocator(frameLocator).getByText(engineTypeArray[1], { exact: true }).click();
  }
}
