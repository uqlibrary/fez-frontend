import FileUploadRowHeader from './FileUploadRowHeader';

const locale = {
    filenameColumn: 'Filename',
    fileAccessColumn: 'Access conditions',
    embargoDateColumn: 'Embargo release date',
    deleteAllFiles: 'Remove all files from the upload queue',
    deleteAllFilesConfirmation: {
        confirmationTitle: 'Delete all',
        confirmationMessage: 'Are you sure you want to delete all files?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes'
    }
};

function setup(testProps, isShallow = true) {
    const props = {
        onDeleteAll: testProps.onDeleteAll || jest.fn(),
        ...testProps
    };

    return getElement(FileUploadRowHeader, props, isShallow);
}

describe('Component FileUploadRowHeader', () => {
    it('should render with default setup', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with access condition and embargo date column', () => {
        const props = {
            requireOpenAccessStatus: true,
            onDeleteAll: jest.fn(),
            locale: locale
        };

        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without access condition even if requireAccessCondition true but default access condition is provided', () => {
        const props = {
            requireOpenAccessStatus: true,
            onDeleteAll: jest.fn(),
            locale: locale
        };

        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render confirmation on delete all', () => {
        const props = {
            requireOpenAccessStatus: true,
            onDeleteAll: jest.fn(),
            locale: locale
        };

        const wrapper = setup({...props}, false);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('FileUploadRowHeader').instance()._showConfirmation();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    })
});
