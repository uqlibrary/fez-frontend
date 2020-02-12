import React from 'react';

export default React.createContext({
    scrollToSection: false,
    sectionRef: null,
    scrollToSectionCallback: () => {},
});
