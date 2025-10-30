import React from 'react';
import NtroFields, { normalizeIsrc, transformIsmn, transformIsrc } from './NtroFields';
import { render, WithReduxStore } from 'test-utils';
import { useForm } from 'react-hook-form';

// Mock the RichEditorField to avoid lazy loading in tests
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: require('modules/SharedComponents/RichEditor/components/RichEditor').default,
}));

const ControlledFieldWithReduxStore = props => {
    const {
        control,
        formState: { isSubmitting },
    } = useForm();

    return (
        <WithReduxStore>
            <NtroFields {...{ control, isSubmitting, ...props }} />
        </WithReduxStore>
    );
};

function setup(testProps) {
    const props = {
        isSubmitting: false,
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
    return render(<ControlledFieldWithReduxStore {...props} />);
}

describe('Component NtroFields', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render contribution statement fields as well', () => {
        const { container } = setup({ showContributionStatement: true });
        expect(container).toMatchSnapshot();
    });

    it('should render all fields as disabled', () => {
        const { container } = setup({ showContributionStatement: true, isSubmitting: true });
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
        rerender(<ControlledFieldWithReduxStore {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('should normalize ISRC value', () => {
        setup({});
        const expected = normalizeIsrc('CD-abc2323423');
        expect(expected).toEqual('CD-ABC-23-23423');
    });

    it('should transform ISRC value', () => {
        setup({});
        const expected = transformIsrc(
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
        const expected = transformIsmn(
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
});
