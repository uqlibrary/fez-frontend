import CollectionForm from './CollectionForm';

function setup(testProps, args = {}) {
    const props = {
        ...testProps,
    };

    return getElement(CollectionForm, props, args);
}

describe('CollectionForm container', () => {
    it('should mount and read the local storage', () => {
        setup({}, { isShallow: false });
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
