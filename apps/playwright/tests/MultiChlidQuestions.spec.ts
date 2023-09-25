import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/util-scope--simple-visibility');
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('PersonCollectiveTrustPartnershipTraderLimited CompanyOther >>').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByTestId('text-input-accountTypeOther').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByTestId('text-input-accountTypeOther').fill('Dealer');
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('html').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('[id="check-container-\\:r7\\:"]').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByTestId('text-input-accountTypeOther').click();
    await page.getByRole('link', { name: 'Multi Child Questions' }).click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByTestId('text-input-hazardNumOccurrences').fill('2');
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByRole('textbox', { name: 'hazardDetails' }).click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByRole('textbox', { name: 'hazardDetails' }).fill('In October and November');
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByRole('textbox', { name: 'eqcDetails' }).click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByRole('textbox', { name: 'eqcDetails' }).fill('Kaikora claims');
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('Damage type*').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('.\\!text-base').click();
    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('Cosmetic', { exact: true }).click();
});