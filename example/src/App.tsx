import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom'
import useHeadManifest from 'react-head-manifest'

import Screen1 from './screens/Screen1'
import Screen2 from './screens/Screen2'

const headManifest = require('./head-manifest.json');

const App = () => {
    return (
        <Router>
            <RoutedApp />
        </Router>
    )
}

const RoutedApp = () => {

    useHeadManifest(headManifest, 'http://laravel-head-manifest.com:9001/head-manifest')

    return (
        <div>
            <ul>
            <li><Link to={'/'}>{'Home'}</Link></li>
            <li><Link to={'/first'}>{'Screen 1'}</Link></li>
            <li><Link to={'/second'}>{'Screen 2'}</Link></li>
            </ul>
            <Switch>
                <Route path={'/first'}><Screen1 /></Route>
                <Route path={'/second'}><Screen2 /></Route>
            </Switch>
        </div>
    )
}

export default App
