import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollToSectionContext, useScrollToSectionContext } from 'context';

export const ScrollToSectionDiv = ({ children }) => {
    const { scrollToSection, sectionRef, scrollToSectionCallback } = useScrollToSectionContext();
    useEffect(scrollToSectionCallback(scrollToSection, sectionRef), []);
    return <div ref={sectionRef}>{children}</div>;
};

ScrollToSectionDiv.propTypes = {
    children: PropTypes.node,
};

export const ScrollToSection = ({ scrollToSection, children }) => {
    if (scrollToSection) {
        return (
            <ScrollToSectionContext.Provider
                value={{
                    scrollToSection: scrollToSection,
                    sectionRef: React.createRef(),
                    scrollToSectionCallback: (scrollToSection, sectionRef) => () =>
                        scrollToSection && sectionRef.current.scrollIntoView(true),
                }}
            >
                <ScrollToSectionDiv>{children}</ScrollToSectionDiv>
            </ScrollToSectionContext.Provider>
        );
    } else {
        return [children];
    }
};

ScrollToSection.propTypes = {
    scrollToSection: PropTypes.bool,
    children: PropTypes.node,
};

export default ScrollToSection;
