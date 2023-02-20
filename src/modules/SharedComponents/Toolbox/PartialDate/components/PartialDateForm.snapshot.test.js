import PartialDateForm from './PartialDateForm';

function setup(testProps, args = { isShallow: false }) {
    const props = { partialDateFormId: 'test', ...testProps };
    return getElement(PartialDateForm, props, args);
}

describe('PartialDateForm snapshots tests', () => {
    it('renders PartialDateForm component', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            onChange: () => {},
        };

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders PartialDateForm component 2', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            className: 'requiredField',
            onChange: () => {},
        };

        const wrapper = setup(props);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders PartialDateForm component 3', () => {
        const props = {
            name: 'partialDate',
            allowPartial: false,
            className: 'requiredField',
            onChange: () => {},
        };

        const wrapper = setup(props);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
