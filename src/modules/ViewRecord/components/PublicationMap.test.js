import PublicationMap from "./PublicationMap";
import React from 'react';

function setup(testProps, isShallow = false){
    const props = {
        ...testProps,
        googleMapURL: 'http://google.com',
        loadingElement: (<div/>)
    };
    return getElement(PublicationMap, props, isShallow);
}

describe('Publication\'s map coordinates', () => {
    it('should render component with a selected area', () => {
        const wrapper = setup({coordinates: '153.021781,-27.489337 152.988274,-27.489337 152.988274,-27.509529 153.021781,-27.509529 153.021781,-27.489337'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with empty coordinates', () => {
        const wrapper = setup({coordinates: ''});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with a marker', () => {
        const wrapper = setup({coordinates: '153.021781,-27.489337' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
