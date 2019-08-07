import { FileUploadRowStatus, mapStateToProps } from './FileUploadRowStatus';
import FileUploadRowStatusContainer from './FileUploadRowStatus';

const getProps = (testProps = {}) => ({
    progress: 0,
    isUploadInProgress: false,
    onDelete: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(FileUploadRowStatus, getProps(testProps));
}

describe('Component FileUploadRowStatus', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render circular progress if upload is in progress', () => {
        const wrapper = setup({
            progress: 50,
            isUploadInProgress: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render done icon if upload is finished', () => {
        const wrapper = setup({
            progress: 100,
            isUploadInProgress: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render for edge browser if file is being uploaded but no progress data', () => {
        const wrapper = setup({ progress: 0, isUploadInProgress: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render if file uploaded successfully but later other file failed', () => {
        const wrapper = setup({ progress: 100, isUploadInProgress: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should mount the container', () => {
        const wrapper = getElement(FileUploadRowStatusContainer, getProps(), { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should map state to props as expected', () => {
        const state = {
            get: jest.fn(() => ({
                propName: 'test1',
                isUploadInProgress: true,
            })),
        };
        const test = mapStateToProps(state, { name: 'propName' });
        const result = {
            progress: 'test1',
            isUploadInProgress: true,
        };
        expect(test).toMatchObject(result);
    });
});
