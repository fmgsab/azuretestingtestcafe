import { test, expect } from '@playwright/test';
import {delay, screenshot} from "../utils/Utility";


test('Verify the table structure', async ({ page }, testInfo) => {
    await page.goto('http://localhost:6006/?path=/story/components-tables-itemsummarytable--default');
    await page.getByRole('button', { name: 'Hide addons [A]' }).click();
    await delay(2000)
    await screenshot(testInfo, page, "TableDefaultAct")
    await expect(await page.screenshot({mask:[page.getByRole('navigation')
            .locator('div').filter({ hasText: 'Skip to canvasStorybookSearch for components/ComponentsButtonsForm WidgetsGridsM' })
            .nth(3)]})).toMatchSnapshot('TableDefault.png')
    await page.getByRole('link', { name: 'Grouped Filtered' }).click();
    await screenshot(testInfo, page, "TableGroupedAct")
    await expect(await page.screenshot({mask:[page.getByRole('navigation')
            .locator('div').filter({ hasText: 'Skip to canvasStorybookSearch for components/ComponentsButtonsForm WidgetsGridsM' })
            .nth(3)]})).toMatchSnapshot('TableGrouped.png')
});