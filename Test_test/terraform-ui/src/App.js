
// app.js

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import TemplateSelector from './components/TemplateSelector';
import DatabaseSelector from './components/DatabaseSelector';
import DeploymentSelector from './components/DeploymentSelector';
import DeployButton from './components/DeployButton';

function App() {
return (
<BrowserRouter>
<Switch>
<Route path="/" exact component={WelcomePage} /> {/* Route to WelcomePage */}
<Route path="/template" exact component={TemplateSelector} /> {/* Route to TemplateSelector */}
<Route path="/database" component={DatabaseSelector} /> {/* Route to DatabaseSelector */}
<Route path="/deployment" component={DeploymentSelector} /> {/* Route to DeploymentSelector */}
<Route path="/deploybutton" component={() => <DeployButton template="AWS" />} /> {/* Route to DeployButton */}
</Switch>
</BrowserRouter>
 );
}

export default App;