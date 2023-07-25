import MyIncompleteRecord from './MyIncompleteRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import React from 'react';
import { rtlRender } from 'test-utils';
// import { pathConfig } from 'config';
// import { act } from '@testing-library/react';

function setup(testProps = {}) {
    const props = {
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
        valid: true,
        pure: true,
        pristine: true,
        invalid: false,
        submitAsSideEffect: false,
        form: 'form',
        initialized: false,
        submitFailed: false,
        dirty: testProps.dirty || true,
        submitting: testProps.submitting || false,
        submitSucceeded: testProps.submitSucceeded || false,
        recordToFix: testProps.recordToFix || null,
        isAuthorLinked: testProps.isAuthorLinked || true,
        isNtro: true,
        ntroFieldProps: {},
        hasAnyFiles: true,
        handleSubmit: jest.fn(),
        history: testProps.history || { go: jest.fn(), push: jest.fn() },
        disableSubmit: testProps.disableSubmit || true,
        publicationToFixFileUploadingError: false,
        ...testProps,
    };
    return rtlRender(<MyIncompleteRecord {...props} />);
}

describe('Component MyIncompleteRecord', () => {
    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        setup({
            recordToFix: mockRecordToFix,
            isAuthorLinked: false,
            history: {
                go: testMethod,
            },
        });
        expect(testMethod).toHaveBeenCalled();
    });

    // it('should render record citation, two actions in select field and a cancel button', () => {
    //     const wrapper = setup({ recordToFix: mockRecordToFix });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should redirect to other pages', () => {
    //     const testMethod = jest.fn();
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         history: {
    //             push: testMethod,
    //         },
    //     });
    //     wrapper.find('button#cancel-fix-work').simulate('click');
    //     expect(testMethod).toHaveBeenCalledWith(pathConfig.records.incomplete);
    // });

    // it('should display confirmation box after successful submission', () => {
    //     const wrapper = setup({ recordToFix: mockRecordToFix });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    //     act(() => {
    //         wrapper.setProps({ submitSucceeded: true });
    //         wrapper.update();
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render the confirm dialog box with an alert due to a file upload failure', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //     });

    //     expect(toJson(wrapper)).toMatchSnapshot();

    //     act(() => {
    //         wrapper.setProps({ publicationToFixFileUploadingError: true });
    //         wrapper.update();
    //     });

    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render the confirm dialog box without an alert due to a file upload success', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //     });

    //     expect(toJson(wrapper)).toMatchSnapshot();

    //     wrapper.setProps({ publicationToFixFileUploadingError: false });

    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('_handleDefaultSubmit()', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         publicationToFixFileUploadingError: false,
    //     });
    //     const testFn = jest.fn();
    //     const event = { preventDefault: testFn };

    //     wrapper.find('form').simulate('submit', event);
    //     expect(testFn).toHaveBeenCalled();
    // });

    // it('should be able to navigate to specific routes', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         history: {
    //             push: testFn,
    //             go: jest.fn(),
    //         },
    //     });

    //     wrapper
    //         .find('Memo(ConfirmationBox)')
    //         .props()
    //         .onCancelAction();
    //     expect(testFn).toBeCalledWith(pathConfig.records.incomplete);

    //     wrapper
    //         .find('Memo(ConfirmationBox)')
    //         .props()
    //         .onAction();
    //     expect(testFn).toBeCalledWith(pathConfig.dashboard);
    // });

    // it('should render no fields as they are complete', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         isNtro: true,
    //         ntroFieldProps: {
    //             hideAbstract: true,
    //             hideLanguage: true,
    //             hidePeerReviewActivity: true,
    //             hideExtent: true,
    //             hideAudienceSize: true,
    //             showSignificance: false,
    //             showContributionStatement: false,
    //         },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render langauge field', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         isNtro: true,
    //         ntroFieldProps: {
    //             hideAbstract: true,
    //             hideLanguage: false,
    //             hidePeerReviewActivity: true,
    //             hideExtent: true,
    //             hideAudienceSize: true,
    //             showSignificance: false,
    //             showContributionStatement: false,
    //         },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render file upload field', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         isNtro: true,
    //         ntroFieldProps: {
    //             hideAbstract: true,
    //             hideLanguage: true,
    //             hidePeerReviewActivity: true,
    //             hideExtent: true,
    //             hideAudienceSize: true,
    //             showSignificance: false,
    //             showContributionStatement: false,
    //         },
    //         hasAnyFiles: false,
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render significance and contribution statement fields', () => {
    //     const wrapper = setup({
    //         recordToFix: mockRecordToFix,
    //         isNtro: true,
    //         ntroFieldProps: {
    //             hideAbstract: true,
    //             hideLanguage: true,
    //             hidePeerReviewActivity: true,
    //             hideExtent: true,
    //             hideAudienceSize: true,
    //             showSignificance: true,
    //             showContributionStatement: true,
    //         },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
});
