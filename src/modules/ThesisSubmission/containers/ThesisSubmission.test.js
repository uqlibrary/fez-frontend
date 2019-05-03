import ThesisSubmission from './ThesisSubmission';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission container', () => {
    it('should mount', () => {
        const wrapper = setup({
            account: {}
        }, false);
    });

    it('should read the local storage', () => {
        const wrapper = setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
