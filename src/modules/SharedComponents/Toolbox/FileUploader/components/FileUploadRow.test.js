import { FileUploadRow } from './FileUploadRow';

function setup(testProps = {}) {
    const props = {
        index: 0,
        uploadedFile: { name: 'a.txt', size: 100 },
        requireOpenAccessStatus: true,
        onDelete: jest.fn(),
        onAccessConditionChange: jest.fn(),
        onEmbargoDateChange: jest.fn(),
        ...testProps,
    };

    return getElement(FileUploadRow, props);
}

describe('FileUploadRow', () => {
    it('renders with uploaded file', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('call prop to update file metadata with closed access', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({
            requireOpenAccessStatus: true,
            onAccessConditionChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        wrapper.instance()._updateAccessCondition(8);
        expect(testFunction).toHaveBeenCalledWith(file, 0, 8);
    });

    it('call prop to update file metadata with open access', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({
            requireOpenAccessStatus: true,
            onAccessConditionChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        wrapper.instance()._updateAccessCondition(9);
        expect(testFunction).toHaveBeenCalledWith(file, 0, 9);
    });

    it('call prop to update file metadata with open access date', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({ onEmbargoDateChange: testFunction, uploadedFile: file, index: 0 });

        wrapper.instance()._updateEmbargoDate(new Date(2016));
        expect(testFunction).toHaveBeenCalledWith(file, 0, new Date(2016));
    });

    it('should show confirmation and delete file', () => {
        const onDeleteFn = jest.fn();
        const showConfirmationFn = jest.fn();
        const wrapper = setup({
            width: 'xs',
            onDelete: onDeleteFn,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('WithStyles(FileUploadRowMobileView)')
            .props()
            .onDelete();
        expect(showConfirmationFn).not.toBeCalled();

        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onRef({
                showConfirmation: showConfirmationFn,
            });

        wrapper
            .find('WithStyles(FileUploadRowMobileView)')
            .props()
            .onDelete();
        expect(showConfirmationFn).toHaveBeenCalled();

        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onAction();
        expect(onDeleteFn).toHaveBeenCalled();
    });
});
