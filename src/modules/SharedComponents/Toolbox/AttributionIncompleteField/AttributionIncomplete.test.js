import { AttributionIncomplete, styles } from './AttributionIncomplete';

function setup(testProps) {
    const props = {
        isAttributionIncomplete: false,
        onChange: jest.fn(),
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
        disabled: false,
        attributionIncompleteStatement: 'Test statement',
        attributionIncompleteDetail: 'Test detail',
        copyrightAgreement: 'test deposit agreement',
        ...testProps,
    };

    return getElement(AttributionIncomplete, props);
}

describe('Component AttributionIncomplete', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render checked if record is checked', () => {
        const wrapper = setup({ isAttributionIncomplete: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should call onChange to handle change', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onChange: testFn });
        wrapper.instance()._handleChange({ target: { checked: true } });
        expect(testFn).toHaveBeenCalledWith(true);
        wrapper.instance()._handleChange({ target: { checked: false } });
        expect(testFn).toHaveBeenCalledWith(false);
    });
    it('should have a proper style generator', () => {
        const theme = {
            status: {
                danger: 'test1',
            },
            palette: {
                primary: {
                    main: 'test2',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.status;
        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });
});
