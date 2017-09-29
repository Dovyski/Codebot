# Testing

This directory contains the files to run automated tests on Codebot.

## Installation

Before you start, install Mocha:

```
npm install puppeteer mocha
```

## Run tests

You can run all tests by typing:

```
mocha --timeout 10000 ./runner.js cases/*.js
```
