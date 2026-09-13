import React from 'react';
import Cookies from 'js-cookie';

// Read via optional chaining so a mocked js-cookie (jest.fn() with no `.get`) yields the `false`
// default instead of throwing at module-eval.
export default React.createContext({
    tabbed: Cookies.get?.('adminFormTabbed') === 'tabbed',
    toggleTabbed: () => {},
});
