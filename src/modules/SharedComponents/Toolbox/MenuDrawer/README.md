# MenuDrawer

simple reusable menu for UQ Library applications using ReactJs

## Props
- `menuItems: PropTypes.array.isRequired` - a list of menu items, see usage
- `drawerOpen: PropTypes.bool`
- `docked: PropTypes.bool`
- `toggleDrawer: PropTypes.func`
- `logoImage: PropTypes.string` - url of an image of a logo
- `logoText: PropTypes.string` - alt text for a logo image
    
## Usage

**./App.js**
```jsx
import React from 'react';
...

import {MenuDrawer} from 'uqlibrary-react-toolbox/build/MenuDrawer';

// Icon import is required to display an icon in the menu
import ActionHome from 'material-ui/svg-icons/action/home';


// Menu configuration
const menuItems = [
            {
                linkTo: '/',
                primaryText: 'Home',
                leftIcon: <ActionHome />,
            },
            {
                divider: true
            },
            {
                linkTo: '/Help',
                primaryText: 'Help'
            }
        ];
        
const App = () => (
  <div>
    <MenuDrawer 
      menuItems={menuItems}
      logoImage='http://images/image.svg'
      logoText='logo image'
      drawerOpen={docked ? true : drawerOpen}
      docked={docked}
      toggleDrawer={this.toggleDrawer}
      imgAltText: 'Image Alt Text',
      imgLogo: 'https://url/to/image'
       />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

