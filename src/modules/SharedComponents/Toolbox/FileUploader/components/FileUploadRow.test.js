import {FileUploadRow} from './FileUploadRow';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        index: testProps.index || 0,
        uploadedFile: testProps.uploadedFile || {name: 'a.txt', size: 100},
        requireOpenAccessStatus: testProps.requireOpenAccessStatus || false,
        onDelete: testProps.onDelete || jest.fn(),
        onAccessConditionChange: testProps.onAccessConditionChange || jest.fn(),
        onEmbargoDateChange: testProps.onEmbargoDateChange || jest.fn(),
        progress: testProps.progress || 0,
        isUploadInProgress: testProps.isUploadInProgress || false
    };

    return getElement(FileUploadRow, props, isShallow);
}

describe('FileUploadRow', () => {
    it('renders with uploaded file', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders with uploaded file with some progress', () => {
        const wrapper = setup({progress: 50, isUploadInProgress: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders for edge browser if file is being uploaded but no progress data', () => {
        const wrapper = setup({progress: 0, isUploadInProgress: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders with file upload success', () => {
        const wrapper = setup({progress: 100, isUploadInProgress: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders if file uploaded successfully but later other file failed', () => {
        const wrapper = setup({progress: 100, isUploadInProgress: false});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    
    it('call prop to update file metadata with closed access', () => {
        const testFunction = jest.fn();
        const file = new File([""], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({requireOpenAccessStatus: true, onAccessConditionChange: testFunction, uploadedFile: file, index: 0});

        wrapper.instance()._updateAccessCondition(8);
        expect(testFunction).toHaveBeenCalledWith(file, 0, 8);
    });

    it('call prop to update file metadata with open access', () => {
        const testFunction = jest.fn();
        const file = new File([""], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({requireOpenAccessStatus: true, onAccessConditionChange: testFunction, uploadedFile: file, index: 0});

        wrapper.instance()._updateAccessCondition(9);
        expect(testFunction).toHaveBeenCalledWith(file, 0, 9);
    });

    it('call prop to update file metadata with open access date', () => {
        const testFunction = jest.fn();
        const file = new File([""], 'a.txt');
        file.date = '2017-01-01';
        const wrapper = setup({onEmbargoDateChange: testFunction, uploadedFile: file, index: 0});

        wrapper.instance()._updateEmbargoDate(new Date(2016));
        expect(testFunction).toHaveBeenCalledWith(file, 0, new Date(2016));
    });
});
