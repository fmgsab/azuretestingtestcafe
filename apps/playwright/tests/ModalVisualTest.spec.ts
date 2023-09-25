import {expect, test} from '@playwright/test';
import {delay} from "../utils/Utility";


test('Verify Modal Delete Dialog box', async({page}, testInfo) => {
   await page.goto('http://localhost:6006/?path=/story/overlays-modal--delete')


    await page.frameLocator('iframe[title="storybook-preview-iframe"]').getByRole('button', { name: 'modal open' }).click();
    await delay(2000)
    await testInfo.attach("Modal Dialog Box", {body : await page.screenshot(), contentType: "image/png",})
    /**Screen on demand**/
    expect( await page.screenshot()).toMatchSnapshot('ModalDelete.png')
});



