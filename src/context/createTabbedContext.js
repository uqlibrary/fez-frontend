import React from 'react';
import Cookies from 'js-cookie';

export default React.createContext({
    tabbed: Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed') || false,
    toggleTabbed: () => {}
});
