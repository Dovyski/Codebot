const { test } = require('../browser');
const assert = require('assert');

describe('Unauthenticated user', () => {
    it('should authenticate using dev option', test(async (browser, opts) => {
        const page = await browser.newPage();
        await page.goto(opts.appUrl);

        // Wait for the page to load completly
        let body = await page.evaluate(async () => {
            return document.body;
        });

        // Click "Dev" login button
        await page.click('.dev-btn');

        // Get all panel buttons
        let aPanelButtons = await page.evaluate(() => {
            return document.body.getElementsByClassName('config-bar-button');
        });

        // Get the settings button, which should be always there.
        var aSettingsButton = await page.$('#config-bar-button-cc-codebot-ui-preferencesAA');

        assert(aSettingsButton, 'settings button is missing, user is not authenticated.');
    }));
});
