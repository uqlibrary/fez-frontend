import ThirdPartyLookupTool from './ThirdPartyLookupTool';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(ThirdPartyLookupTool, props, isShallow);
}

describe('ThirdPartyLookupTool containers', () => {
    it('should mount', () => {
        setup({}, false);
    });
});
