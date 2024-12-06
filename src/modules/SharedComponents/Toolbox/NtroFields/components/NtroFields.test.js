import React from 'react';
import NtroFields from './NtroFields';
import { render, WithReduxStore } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));
function setup(testProps) {
    const props = {
        submitting: false,
        hideIsmn: false,
        hideIsrc: false,
        hideVolume: false,
        hideIssue: false,
        hideStartPage: false,
        hideEndPage: false,
        hideExtent: false,
        hideOriginalFormat: false,
        hideAudienceSize: false,
        hidePeerReviewActivity: false,
        hideSeries: false,
        hideGrants: false,
        showContributionStatement: false,
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <NtroFields {...props} />
        </WithReduxStore>,
    );
}

describe('Component NtroFields', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let normalizeIsrcFn;
    let transformIsrcFn;
    let transformIsmnFn;
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disable, label, floatingLabelText, inputNormalizer, transformFunction }) => {
            if (name === 'fez_record_search_key_isrc') {
                normalizeIsrcFn = inputNormalizer;
                transformIsrcFn = transformFunction;
            } else if (name === 'fez_record_search_key_ismn') {
                transformIsmnFn = transformFunction;
            }

            return (
                <field
                    is="mock"
                    name={name}
                    title={title}
                    required={required}
                    disabled={disable}
                    label={label || floatingLabelText}
                />
            );
        },
    );

    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render contribution statement fields as well', () => {
        const { container } = setup({ showContributionStatement: true });
        expect(container).toMatchSnapshot();
    });

    it('should render all fields as disabled', () => {
        const { container } = setup({ showContributionStatement: true, submitting: true });
        expect(container).toMatchSnapshot();
    });

    it('should render with grants component hidden', () => {
        const { container } = setup({ showContributionStatement: true, hideGrants: true });
        expect(container).toMatchSnapshot();
    });

    it('should call componentDidUpdate', () => {
        const props = {
            hideVolume: true,
            hideStartPage: true,
            hideAudienceSize: true,
        };
        const { container, rerender } = setup({ hideExtent: true });
        rerender(
            <WithReduxStore>
                <NtroFields {...props} />
            </WithReduxStore>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should normalize ISRC value', () => {
        setup({});
        const expected = normalizeIsrcFn('CD-abc2323423');
        expect(expected).toEqual('CD-ABC-23-23423');
    });

    it('should transform ISRC value', () => {
        setup({});
        const expected = transformIsrcFn(
            {
                value: 'fez_test',
                order: 'fez_test_order',
            },
            'ISRC TE-EST-23-12343',
            1,
        );
        expect(expected).toEqual({
            fez_test: 'TE-EST-23-12343',
            fez_test_order: 2,
        });
    });

    it('should transform ISMN value', () => {
        setup({});
        const expected = transformIsmnFn(
            {
                value: 'fez_test',
                order: 'fez_test_order',
            },
            'ISMN TE-EST-23-12343',
            1,
        );

        expect(expected).toEqual({
            fez_test: 'TE-EST-23-12343',
            fez_test_order: 2,
        });
    });

    // cc - in reality, signif and contrib always appear together
    it('should show significance field even if contribution field isnt empty', () => {
        const { container } = setup({
            showContributionStatement: false,
            showSignificance: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should not show NTRO data card in the Ntro fields', () => {
        const { container } = setup({
            showContributionStatement: false,
            showSignificance: true,
            hideAbstract: true,
            hidePeerReviewActivity: true,
            hideLanguage: true,
            hideAudienceSize: true,
            hideOriginalFormat: true,
            hideExtent: true,
            hideEndPage: true,
            hideStartPage: true,
            hideIssue: true,
            hideVolume: true,
            hideSeries: true,
            hideIsrc: true,
            hideIsmn: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should accept a custom fieldWrapper', () => {
        const fieldWrapperMock = jest.fn();
        setup({
            fieldWrapper: fieldWrapperMock,
        });

        // this test is not about asserting all calls to fieldWrapper, but at least one
        expect(fieldWrapperMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                name: 'ntroAbstract',
                component: expect.any(Function),
                description: expect.any(String),
                disabled: expect.any(Boolean),
                fullWidth: expect.any(Boolean),
                richEditorId: expect.any(String),
                title: expect.any(Object),
                validate: expect.any(Array),
            }),
            {}, // empty 2nd arg
        );
    });
});
