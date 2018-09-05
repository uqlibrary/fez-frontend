import ThesisSubmission from './ThesisSubmission';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission container', () => {
    it.skip('should mount', () => {
        const wrapper = setup({}, false);
    });

    it.skip('should read the local storage', () => {
        const wrapper = setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
