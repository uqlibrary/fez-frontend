import { MyIncompleteRecordClass, styles }from './MyIncompleteRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import { routes } from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        array: {
            insert: jest.fn(),
            move: jest.fn(),
            pop: jest.fn(),
            push: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
            shift: jest.fn(),
            splice: jest.fn(),
            swap: jest.fn(),
            unshift: jest.fn(),
        },
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        pristine: true,
        submitting: false,
        invalid: false,
        submitSucceeded: false,

        recordToFix: null,
        isAuthorLinked: true,
        isNtro: true,
        ntroFieldProps: {},
        hasAnyFiles: true,
        author: {aut_id: 410},

        handleSubmit: jest.fn(),
        actions: {},
        history: {go: jest.fn(), push: jest.fn()},
        match: {},
        classes: {},

        publicationToFixFileUploadingError: false,
        ...testProps,
    };
    return getElement(MyIncompleteRecordClass, props, isShallow);
}

describe('Component MyIncompleteRecord', () => {
    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        setup({
            recordToFix: mockRecordToFix,
            isAuthorLinked: false,
            history: {
                go: testMethod
            }});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            history: {
                push: testMethod
            }
        });
        wrapper.instance()._cancelFix();
        expect(testMethod).toHaveBeenCalledWith('/records/incomplete');
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: true
        });
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the confirm dialog box without an alert due to a file upload success', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        const testFN = jest.fn();
        const event = {preventDefault: testFN};
        wrapper.instance()._handleDefaultSubmit(event);
        expect(testFN).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        wrapper.instance()._handleDefaultSubmit();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be able to navigate to specific routes', () => {
        const testFn = jest.fn();
        const wrapper = setup({ history: {
            push: testFn,
            go: jest.fn(),
        } });
        wrapper.instance()._navigateToMyIncomplete();
        expect(testFn).toBeCalledWith(routes.pathConfig.records.incomplete);

        wrapper.instance()._navigateToDashboard();
        expect(testFn).toBeCalledWith(routes.pathConfig.dashboard);
    });

    it('componentWillReceiveProps()', () => {
        const wrapper = setup({
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });


        const nextProps = {submitSucceeded: true};
        wrapper.setProps(nextProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render no fields as they are complete', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            isNtro: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideLanguage: true,
                hidePeerReviewActivity: true,
                hideExtent: true,
                hideAudienceSize: true,
                showSignificance: false,
                showContributionStatement: false
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render langauge field', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            isNtro: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideLanguage: false,
                hidePeerReviewActivity: true,
                hideExtent: true,
                hideAudienceSize: true,
                showSignificance: false,
                showContributionStatement: false
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render file upload field', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            isNtro: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideLanguage: true,
                hidePeerReviewActivity: true,
                hideExtent: true,
                hideAudienceSize: true,
                showSignificance: false,
                showContributionStatement: false
            },
            hasAnyFiles: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render significance and contribution statement fields', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            isNtro: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideLanguage: true,
                hidePeerReviewActivity: true,
                hideExtent: true,
                hideAudienceSize: true,
                showSignificance: true,
                showContributionStatement: true
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('_navigateToMyIncomplete()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            author: {
                aut_id: 1
            },
            recordToFix: {
                fez_datastream_info: [],
                fez_record_search_key_author_id: [
                    {rek_author_id: 1}
                ]
            },
            history: {push: testFN},
            accountAuthorLoading: false,
            loadingRecordToFix: false
        });
        wrapper.instance()._navigateToMyIncomplete();
        expect(testFN).toHaveBeenCalledWith('/records/incomplete');
    });

    it('_navigateToDashboard()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            author: {
                aut_id: 1
            },
            recordToFix: {
                fez_datastream_info: [],
                fez_record_search_key_author_id: [
                    {rek_author_id: 1}
                ]
            },
            history: {push: testFN},
            accountAuthorLoading: false,
            loadingRecordToFix: false
        });
        wrapper.instance()._navigateToDashboard();
        expect(testFN).toHaveBeenCalledWith('/dashboard');
    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                secondary: {
                    light: 'test1'
                }
            }
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});
