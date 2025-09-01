import React from 'react';
import { render } from 'test-utils';
import {
    ScaleOfSignificanceForm,
    handleContributionStatementCallbackFactory,
    handleSignificanceCallbackFactory,
    resetFormCallbackFactory,
    saveCallbackFactory,
} from '../ScaleOfSignificanceForm';

function setup(testProps = {}, renderer = render) {
    const props = {
        locale: {},
        onAdd: jest.fn(),
        buttonLabel: 'label',
        showForm: jest.fn(),
        saveChangeToItem: jest.fn(),
        ...testProps,
    };

    return renderer(<ScaleOfSignificanceForm {...props} />);
}

describe('ScaleOfSignificanceForm component', () => {
    it('should render the default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});

describe('ScaleOfSignificanceForm callback factories', () => {
    it('should create handleContributionStatement callback', () => {
        const setContributionStatement = jest.fn();
        const callback = handleContributionStatementCallbackFactory(setContributionStatement)[0];
        const test = {};
        callback(test);
        expect(setContributionStatement).toHaveBeenCalledWith(test);
    });

    it('should create handleSignificance callback', () => {
        const setSignificance = jest.fn();
        const callback = handleSignificanceCallbackFactory(setSignificance)[0];
        const test = {};
        callback(test);
        expect(setSignificance).toHaveBeenCalledWith(test);
    });

    it('should create resetForm callback', () => {
        const setSignificance = jest.fn();
        const showScaleAdditionForm = jest.fn();
        const callback = resetFormCallbackFactory(setSignificance, showScaleAdditionForm)[0];
        callback();
        expect(setSignificance).toHaveBeenCalledWith(null);
        expect(showScaleAdditionForm).toHaveBeenCalledWith(false);
    });

    it('should create addItem callback', () => {
        const disabled = false;
        const significance = 'test 1';
        const contributionStatement = 'test 2';
        const emptySignificance = false;
        const onAdd = jest.fn();
        const resetForm = jest.fn();
        const callback = saveCallbackFactory(
            disabled,
            emptySignificance,
            significance,
            contributionStatement,
            onAdd,
            resetForm,
        )[0];
        callback({ key: 'Enter' });
        expect(onAdd).toHaveBeenCalledWith({ key: 'test 1', value: 'test 2' });
        expect(resetForm).toHaveBeenCalledTimes(1);

        onAdd.mockClear();
        resetForm.mockClear();
        callback({ key: 'test' });
        expect(onAdd).toHaveBeenCalledTimes(0);
        expect(resetForm).toHaveBeenCalledTimes(0);
    });
});
