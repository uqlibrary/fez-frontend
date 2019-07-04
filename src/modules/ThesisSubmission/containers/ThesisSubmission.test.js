import ThesisSubmission from './ThesisSubmission';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission container', () => {
    it('should mount', () => {
        setup({ account: {} }, false);
    });

    it('should read the local storage', () => {
        setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
