import ViewRecord from './ViewRecord';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(ViewRecord, props, isShallow);
}

describe('ViewRecord container', () => {
    it('should mount', () => {
        setup({}, false);
    });
});
