# Overview

fans656's personal utility library, including:
- ui components
- utility functions

# Development

Start dev server:

    npm run dev

Build library:

    npm run build

Link library:

    sudo npm link

Link library for use:

    npm link fansjs

Build library in watch mode:

    npm run build -- --watch

Publish library:

    # [OPTIONAL] ensure version in package.json is updated if code changes
    npm run build
    npm publish

Build app:

    npm run build:app

Unit test:

    ./unit.sh

Unit test (specific test):

    ./unit.sh '<pattern>'
