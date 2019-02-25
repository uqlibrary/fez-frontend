import DocumentTypeFieldWithStyles from './DocumentTypeField';
import {DocumentTypeField} from './DocumentTypeField';
import moment from 'moment';

function setup(testProps, isShallow = true) {
    const props = {
        docTypes: [],
        updateDocTypeValues: jest.fn(),
        className: 'document-type-field',
        disabled: false,
        classes: {},
        ...testProps
    };

    return getElement(DocumentTypeField, props, isShallow);
};

describe('DocumentTypeField component', () => {
    it('should render default view with styles', () => {
        const wrapper = getElement(DocumentTypeFieldWithStyles, {onChange: jest.fn()});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(Select)').props().disabled).toBeTruthy();
    });

    it('should render with given document types selected by default', () => {
        const defaultDocTypes = [371, 316];
        const wrapper = setup({
            docTypes: defaultDocTypes
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('WithStyles(MenuItem)').map(menuItem => defaultDocTypes.indexOf(menuItem.props.value) > -1 && expect(menuItem.props.checked).toBeTruthy());
    });

    it('should handle doc type change event', () => {
        const updateDocTypeValuesFn = jest.fn();
        const wrapper = setup({
            updateDocTypeValues: updateDocTypeValuesFn
        });

        wrapper.find('WithStyles(Select)').props().onChange({target: {value: 316}});
        expect(updateDocTypeValuesFn).toHaveBeenCalledWith(316);
    });
});
