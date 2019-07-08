import NewRecord from './NewRecord';

function setup(testProps, isShallow = true) {
    const props = {
        history: {},
        actions: {},
        ...testProps,
    };
    return getElement(NewRecord, props, isShallow);
}

describe('Add new record', () => {
    it('should not render publication form if author is not loaded ', () => {
        const wrapper = setup({ author: null });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render stepper and a publication form', () => {
        const wrapper = setup({ history: {}, author: { 'aut_display_name': 'Fred', 'aut_id': 44 } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const wrapper = setup({ history: {} });
        const showConfirmation = jest.fn();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmation,
        };

        wrapper.instance()._recordSaved();
        expect(showConfirmation).toBeCalled();
    });

    it('should navigate to find publication', () => {
        const navigateToRecordSearch = jest.fn();
        const history = {
            push: navigateToRecordSearch,
        };
        const wrapper = setup({ history: history, actions: { clearNewRecord: jest.fn() } });
        wrapper.instance()._restartWorkflow();
        expect(navigateToRecordSearch).toBeCalled();
    });

    it('should navigate to my research', () => {
        const navigateToMyResearch = jest.fn();
        const history = {
            push: navigateToMyResearch,
        };
        const wrapper = setup({ history: history, actions: { clearNewRecord: jest.fn() } });
        wrapper.instance()._navigateToMyResearch();
        expect(navigateToMyResearch).toBeCalled();
    });

    it('should restart workflow', () => {
        const navigateToSearch = jest.fn();
        const history = {
            push: navigateToSearch,
        };

        const wrapper = setup({ history: history, actions: { clearNewRecord: jest.fn() } });
        wrapper.instance()._restartWorkflow();

        expect(navigateToSearch).toBeCalled();
    });

    it('should render the confirm dialog with an alert for failed file upload', () => {
        const wrapper = setup({
            author: { aut_id: 12345, aut_display_name: 'Test' },
            history: {},
            newRecordFileUploadingError: true,
            rawSearchQuery: 'This is a test',
        }, false);
        expect(toJson(wrapper.find('ConfirmDialogBox'))).toMatchSnapshot();
    });

    it('should render the confirm dialog without an alert for a succcessful file upload', () => {
        const wrapper = setup({
            author: { aut_id: 12345, aut_display_name: 'Test' },
            history: {},
            newRecordFileUploadingError: false,
            rawSearchQuery: 'This is a test',
        });
        expect(toJson(wrapper.find('ConfirmDialogBox'))).toMatchSnapshot();
    });

    it('should render alert about file uploading or issue error', () => {
        const wrapper = setup({
            author: {},
            newRecordFileUploadingOrIssueError: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
