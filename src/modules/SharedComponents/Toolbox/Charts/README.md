# Charts

various charts for UQ Library applications, sample data is available in `/data/*`


## AuthorsPublicationsPerYearChart

displays types of publications per year for an author

### Props 
- `rawData: PropTypes.object.isRequired` - raw output of api call `[API_URL]/academic/[USER_NAME]/publication-years`
- `yAxisTitle: PropTypes.string`, default text is 'Total publications', NOTE: x axis is represented by years
    
## Usage

**./App.js**
```jsx
import React from 'react';
...

import {AuthorsPublicationsPerYearChart} from 'uqlibrary-react-toolbox';

const App = () => (
  <div>
    <AuthorsPublicationsPerYearChart rawData={apiData} yAxisTitle='Publications count per year' />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
