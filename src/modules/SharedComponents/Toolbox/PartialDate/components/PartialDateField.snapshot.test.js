import PartialDateField from './PartialDateField';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {
            fakeTitle: {},
        },
        ...testProps,
    };
    return getElement(PartialDateField, props, isShallow);
}

describe('Redux-form Field PartialDateField snapshots tests', () => {
    it('renders PartialDateField component', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            input: {
                onChange: () => {},
            },
        };

        const wrapper = setup(props);

        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders PartialDateField component with requiredField class on year field', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            className: 'requiredField',
            input: {
                onChange: () => {},
            },
        };

        const wrapper = setup(props);

        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders PartialDateField component with requiredField class on all fields', () => {
        const props = {
            name: 'partialDate',
            allowPartial: false,
            className: 'requiredField',
            input: {
                onChange: () => {},
            },
        };

        const wrapper = setup(props);

        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
