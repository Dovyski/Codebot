const { test } = require('../browser');
const assert = require('assert');

describe('Unauthenticated user', () => {
    it('should redirect to login', test(async (browser, opts) => {
        const page = await browser.newPage();
        await page.goto(opts.appUrl);

        // Wait for the page to load completly
        let body = await page.evaluate(async () => {
            return document.body;
        });

        var loginForm = await page.$('#formLogin');
        assert(loginForm, 'Login form is not present');
    }));
});
