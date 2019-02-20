import AddDataCollection from './AddDataCollection';

jest.mock('material-ui-pickers/DatePicker');

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(AddDataCollection, props, isShallow);
}

describe('AddDataCollection container', () => {
    fit('should correctly connect AddDataCollection component to the store', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
