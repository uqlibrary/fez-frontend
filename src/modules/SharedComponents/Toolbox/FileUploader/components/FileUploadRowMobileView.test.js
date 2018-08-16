import {FileUploadRowMobileView} from './FileUploadRowMobileView';

function setup(testProps, isShallow = true) {
    const props = {
        index: 0,
        name: 'test.pdf',
        size: '100 MB',
        accessConditionId: null,
        embargoDate: '01/01/2017',
        requireOpenAccessStatus: true,
        disabled: false,
        classes: {
            icon: {
                textAlign: 'center'
            }
        },
        onDelete: jest.fn(),
        onEmbargoDateChange: jest.fn(),
        onAccessConditionChange: jest.fn(),
        ...testProps
    };

    return getElement(FileUploadRowMobileView, props, isShallow);
}

describe('Component FileUploadRowMobileView', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render embargo date picker if access condition is set to closed access', () => {
        const wrapper = setup({
            accessConditionId: 8
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render embargo date picker if access condition is set to open access', () => {
        const wrapper = setup({
            accessConditionId: 9
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render access selector or date picker if access condition is not required to select', () => {
        const wrapper = setup({
            requireOpenAccessStatus: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});