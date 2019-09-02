import { FileUploadRowHeader } from './FileUploadRowHeader';
import FileUploadRowHeaderWithStyles from './FileUploadRowHeader';

const locale = {
    filenameColumn: 'Filename',
    fileAccessColumn: 'Access conditions',
    embargoDateColumn: 'Embargo release date',
    deleteAllFiles: 'Remove all files from the upload queue',
    deleteAllFilesConfirmation: {
        confirmationTitle: 'Delete all',
        confirmationMessage: 'Are you sure you want to delete all files?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
    },
};

const getProps = (testProps = {}) => ({
    onDeleteAll: testProps.onDeleteAll || jest.fn(),
    classes: {
        icon: '',
    },
    ...testProps,
});

function setup(testProps = {}, args = {}) {
    return getElement(FileUploadRowHeader, getProps(testProps), args);
}

describe('Component FileUploadRowHeader', () => {
    it('should render with default setup', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with default setup with styles', () => {
        const wrapper = getElement(FileUploadRowHeaderWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with access condition and embargo date column', () => {
        const props = {
            requireOpenAccessStatus: true,
            onDeleteAll: jest.fn(),
            locale: locale,
        };

        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it(
        'should render without access condition even if requireAccessCondition ' +
            'true but default access condition is provided',
        () => {
            const props = {
                requireOpenAccessStatus: true,
                onDeleteAll: jest.fn(),
                locale: locale,
            };

            const wrapper = setup({ ...props });
            expect(toJson(wrapper)).toMatchSnapshot();
        }
    );

    it('should render confirmation on delete all', () => {
        const props = {
            requireOpenAccessStatus: true,
            onDeleteAll: jest.fn(),
            locale: locale,
        };

        const wrapper = setup({ ...props }, { isShallow: false });
        const tightWrapper = wrapper.find('FileUploadRowHeader');
        tightWrapper.instance()._showConfirmation();
        wrapper.update();
        expect(JSON.stringify(tightWrapper)).toMatchSnapshot();
    });
});
