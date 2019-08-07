import { FileUploadRowMobileView } from './FileUploadRowMobileView';
import FileUploadRowMobileViewWithStyles from './FileUploadRowMobileView';

const getProps = (testProps = {}) => ({
    index: 0,
    name: 'test.pdf',
    size: '100 MB',
    accessConditionId: null,
    embargoDate: '01/01/2017',
    requireOpenAccessStatus: true,
    disabled: false,
    classes: {
        root: 'root',
        listItem: 'listItem',
    },
    onDelete: jest.fn(),
    onEmbargoDateChange: jest.fn(),
    onAccessConditionChange: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(FileUploadRowMobileView, getProps(testProps));
}

describe('Component FileUploadRowMobileView', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with styles', () => {
        const wrapper = getElement(FileUploadRowMobileViewWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render embargo date picker if access condition is set to closed access', () => {
        const wrapper = setup({
            accessConditionId: 8,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render embargo date picker if access condition is set to open access', () => {
        const wrapper = setup({
            accessConditionId: 9,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render access selector or date picker if access condition is not required to select', () => {
        const wrapper = setup({
            requireOpenAccessStatus: false,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
