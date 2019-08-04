import ThirdPartyLookupTool from './ThirdPartyLookupTool';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(ThirdPartyLookupTool, props, isShallow);
}

describe('ThirdPartyLookupTool container', () => {
    it('should mount', () => {
        setup({}, false);
    });
});
