const { test } = require('../browser');

describe('Login', () => {
  it('can login', test(async (browser, opts) => {
	  const page = await browser.newPage();

	  // capture console output
	  page.on('console', (...args) => console.log('PAGE LOG:', ...args));

	  // Open page.
	  await page.goto(opts.appUrl);

	  // Show search form.
	  await page.click('.search-trigger');

	  // Focus input field.
	  await page.focus('#search-form-top input');

	  // Type in query.
	  await page.type('JavaScript', {delay: 200});

	  // Submit the form.
	  const searchForm = await page.$('#search-form-top');
	  await searchForm.evaluate(searchForm => searchForm.submit());
  }));
});
