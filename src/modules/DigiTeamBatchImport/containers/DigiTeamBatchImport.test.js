import DigiTeamBatchImport from './DigiTeamBatchImport';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(DigiTeamBatchImport, props, isShallow);
}

describe('DigiTeamBatchImport container', () => {
    it('should mount', () => {
        setup({}, false);
    });
});
