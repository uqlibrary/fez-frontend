import { DocumentTypeMultipleField, styles } from './DocumentTypeMultipleField';

function setup(testProps = {}) {
    const props = {
        docTypes: [],
        updateDocTypeValues: jest.fn(),
        className: 'document-type-field',
        disabled: false,
        classes: {},
        ...testProps,
    };

    return getElement(DocumentTypeMultipleField, props);
}

describe('DocumentTypeMultipleField component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(ForwardRef(Select))').props().disabled).toBeTruthy();
    });

    it('should render with given document types selected by default', () => {
        const defaultDocTypes = [371, 316];
        const wrapper = setup({
            docTypes: defaultDocTypes,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(ForwardRef(MenuItem))')
            .map(
                menuItem =>
                    defaultDocTypes.indexOf(menuItem.props.value) > -1 && expect(menuItem.props.checked).toBeTruthy(),
            );
    });

    it('should handle doc type change event', () => {
        const updateDocTypeValuesFn = jest.fn();
        const wrapper = setup({
            updateDocTypeValues: updateDocTypeValuesFn,
        });
        wrapper
            .find('WithStyles(ForwardRef(Select))')
            .props()
            .onChange({ target: { value: 316 } });
        expect(updateDocTypeValuesFn).toHaveBeenCalledWith(316);
    });

    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                caption: 'test1',
            },
            palette: {
                accent: {
                    main: 'test2',
                },
                white: {
                    main: 'test3',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.accent;
        delete theme.palette.white;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should have the value "0" if docTypes property is empty', () => {
        const wrapper = setup({
            docTypes: null,
        });
        expect(wrapper.find('WithStyles(ForwardRef(Select))').prop('value')).toStrictEqual(['0']);
    });
});
