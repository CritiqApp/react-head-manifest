# react-head-manifest

> Define your SPA head information from a single manifest file

[![NPM](https://img.shields.io/npm/v/react-head-manifest.svg)](https://www.npmjs.com/package/react-head-manifest) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

This project requires `react-router-dom` to be installed.

```bash
yarn add react-router-dom
```

```bash
yarn add react-head-manifest
```

## Usage

Using React Head Manifest is as easy as creating/importing a `head-manifest.json` file with your manifest data, and using the `useHeadManifest` hook provided by the library.

Example:
```tsx
import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom'
import useHeadManifest from 'react-head-manifest'

// Load your head manifest file
const headManifest = require('./head-manifest.json');

// Base App component
const App = () => {
    return (
        <Router>
            <RoutedApp />
        </Router>
    )
}

// Routed app component, has access to react-router-dom
const RoutedApp = () => {

    useHeadManifest(headManifest)

    return ( ... )
}

export default App

```

This project is intended for use with our sister project [Laravel Head Manifest](https://github.com/CritiqApp/laravel-head-manifest), 

## License

MIT © [NichoCM](https://github.com/NichoCM)
