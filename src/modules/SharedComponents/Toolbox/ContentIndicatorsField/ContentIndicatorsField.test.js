import React from 'react';
import {
    ContentIndicatorsField,
    getContentIndicatorsItemsList,
    showContentIndicatorsField,
} from './ContentIndicatorsField';
import {
    CONTENT_INDICATORS,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_THESIS,
    contentIndicators,
} from 'config/general';
import { rtlRender, fireEvent, within } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<ContentIndicatorsField {...props} />);
}

describe('ContentIndicatorsField component', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            value: [454079, 454080],
            onChange: jest.fn(),
            state: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with given field props in list', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            value: [454079, 454080],
            onChange: jest.fn(),
            state: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should mark existing indicators as disabled', () => {
        const input = {
            state: {
                defaultValue: [CONTENT_INDICATORS[1].value, CONTENT_INDICATORS[2].value],
            },
        };
        const expected = CONTENT_INDICATORS.map(item => ({
            ...item,
            disabled: false,
        }));
        expected[1].disabled = true;
        expected[2].disabled = true;
        expect(getContentIndicatorsItemsList(contentIndicators(), input)).toEqual(expected);
    });

    it('should not mark existing indicators as disabled for admins', () => {
        const input = {
            canUnselect: true,
            state: {
                defaultValue: [CONTENT_INDICATORS[1].value, CONTENT_INDICATORS[2].value],
            },
        };
        const expected = CONTENT_INDICATORS.map(item => ({
            ...item,
            disabled: false,
        }));
        expected[1].disabled = false;
        expected[2].disabled = false;
        expect(getContentIndicatorsItemsList(contentIndicators(), input)).toEqual(expected);
    });

    it('should handle empty props', () => {
        const expected = CONTENT_INDICATORS.map(item => ({
            ...item,
            disabled: false,
        }));
        expected[1].disabled = false;
        expected[2].disabled = false;

        expect(getContentIndicatorsItemsList(contentIndicators())).toEqual(expected);
    });

    it('should mark dropdown as disabled when all indicators have been selected', () => {
        const { container } = setup({
            state: {
                defaultValue: CONTENT_INDICATORS,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should return content indicators list items', () => {
        const { getByTestId } = setup();
        fireEvent.mouseDown(getByTestId('rek-content-indicator-select'));
        const elem = getByTestId('rek-content-indicator-options');
        expect(within(elem).getByRole('option', { name: 'Scholarship of Teaching and Learning' })).toBeInTheDocument();
        expect(within(elem).getByRole('option', { name: 'Protocol' })).toBeInTheDocument();
        expect(within(elem).getByRole('option', { name: 'Case Study' })).toBeInTheDocument();
    });

    it('should specific should return content indicators list items for conference paper', () => {
        const input = {
            displayType: PUBLICATION_TYPE_CONFERENCE_PAPER,
        };
        const { getByTestId } = setup(input);
        fireEvent.mouseDown(getByTestId('rek-content-indicator-select'));
        const elem = getByTestId('rek-content-indicator-options');
        expect(within(elem).getByRole('option', { name: 'Plenary' })).toBeInTheDocument();
        expect(within(elem).getByRole('option', { name: 'Invited' })).toBeInTheDocument();
    });

    it('should not mark dropdown as disabled when all indicators have been selected for admins', () => {
        const { container } = setup({
            state: {
                defaultValue: CONTENT_INDICATORS,
            },
            canUnselect: true,
        });
        expect(container).toMatchSnapshot();
    });

    describe('should detect whether content indicator field should be shown', () => {
        it('when collection is blacklisted', () => {
            const record = {
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 'UQ:152694',
                    },
                ],
                rek_display_type: '',
            };
            expect(showContentIndicatorsField(record)).toBe(false);
        });

        it('when doctype is blacklisted', () => {
            const record = {
                fez_record_search_key_ismemberof: [],
                rek_display_type: PUBLICATION_TYPE_THESIS,
            };
            expect(showContentIndicatorsField(record)).toBe(false);
        });
    });
});
