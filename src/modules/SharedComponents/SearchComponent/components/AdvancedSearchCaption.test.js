import React from 'react';
import AdvancedSearchCaption from './AdvancedSearchCaption';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import moment from 'moment';
import * as Hooks from 'hooks/userIsAdmin';

const renderComponents = props => {
    return render(
        <WithRouter>
            <WithReduxStore>
                <AdvancedSearchCaption {...props} />
            </WithReduxStore>
        </WithRouter>,
    );
};

function setup(testProps = {}) {
    const props = {
        fieldRows: [
            { searchField: 'all', value: '', label: '' },
            { searchField: 'rek_ismemberof', value: ['UQ:120743', 'UQ:217419', 'UQ:217422'], label: '' },
            { searchField: 'rek_author_id', value: '570', label: '570 (Ashkanasy, Neal M.)' },
        ],
        docTypes: [263, 174],
        yearFilter: { from: '1991', to: '2012', invalid: false },
        isOpenAccess: true,
        showInputForm: false,
        InputForm: null,
        ...testProps,
    };
    return renderComponents(props);
}

describe('Component AdvancedSearchCaption', () => {
    it('should render with default props', () => {
        const { container } = renderComponents();
        expect(container).toMatchSnapshot();
    });

    it('should render as expected with no props', () => {
        const { getByTestId } = setup();

        expect(getByTestId('all-caption-title')).toHaveTextContent('Any field');
        expect(getByTestId('all-caption-combiner')).toHaveTextContent('contains');
        expect(getByTestId('all-caption-value')).toHaveTextContent('anything');

        expect(getByTestId('rek-ismemberof-caption-title')).toHaveTextContent('Collection');
        expect(getByTestId('rek-ismemberof-caption-combiner')).toHaveTextContent('is one of');
        expect(getByTestId('rek-ismemberof-caption-value')).toHaveTextContent('UQ:120743, UQ:217419 or UQ:217422');

        expect(getByTestId('rek-author-id-caption-title')).toHaveTextContent('Author ID');
        expect(getByTestId('rek-author-id-caption-combiner')).toHaveTextContent('is');
        expect(getByTestId('rek-author-id-caption-value')).toHaveTextContent('570');

        expect(getByTestId('rek-display-type-caption-title')).toHaveTextContent('Work type');
        expect(getByTestId('rek-display-type-caption-combiner')).toHaveTextContent('is one of');
        expect(getByTestId('rek-display-type-caption-value')).toHaveTextContent('Audio Document or Book');

        expect(getByTestId('facet-year-range-caption-title')).toHaveTextContent('Published');
        expect(getByTestId('facet-year-range-caption-combiner')).toHaveTextContent('between');
        expect(getByTestId('facet-year-range-caption-value')).toHaveTextContent('1991 to 2012');

        expect(getByTestId('open-access-caption-combiner')).toHaveTextContent('is');
        expect(getByTestId('open-access-caption-value')).toHaveTextContent('open access/full text');
    });

    it('should render caption data correctly', () => {
        const { getByTestId } = setup({
            fieldRows: [
                { searchField: 'all', value: '', label: '' },
                { searchField: 'rek_ismemberof', value: ['UQ:120743'], label: '' },
                { searchField: 'rek_author_id', value: '570', label: '570 (Ashkanasy, Neal M.)' },
            ],
            docTypes: [263],
            yearFilter: { from: '1991', to: '2012', invalid: false },
            isOpenAccess: true,
        });

        expect(getByTestId('advanced-search-caption-container')).toHaveStyle('word-break: break-all');

        expect(getByTestId('all-caption-title')).toHaveTextContent('Any field');
        expect(getByTestId('all-caption-combiner')).toHaveTextContent('contains');
        expect(getByTestId('all-caption-value')).toHaveTextContent('anything');

        expect(getByTestId('rek-ismemberof-caption-title')).toHaveTextContent('Collection');
        expect(getByTestId('rek-ismemberof-caption-combiner')).toHaveTextContent('is one of');
        expect(getByTestId('rek-ismemberof-caption-value')).toHaveTextContent('UQ:120743');

        expect(getByTestId('rek-author-id-caption-title')).toHaveTextContent('Author ID');
        expect(getByTestId('rek-author-id-caption-combiner')).toHaveTextContent('is');
        expect(getByTestId('rek-author-id-caption-value')).toHaveTextContent('570');

        expect(getByTestId('rek-display-type-caption-title')).toHaveTextContent('Work type');
        expect(getByTestId('rek-display-type-caption-combiner')).toHaveTextContent('is one of');
        expect(getByTestId('rek-display-type-caption-value')).toHaveTextContent('Audio Document');

        expect(getByTestId('facet-year-range-caption-title')).toHaveTextContent('Published');
        expect(getByTestId('facet-year-range-caption-combiner')).toHaveTextContent('between');
        expect(getByTestId('facet-year-range-caption-value')).toHaveTextContent('1991 to 2012');

        expect(getByTestId('open-access-caption-combiner')).toHaveTextContent('is');
        expect(getByTestId('open-access-caption-value')).toHaveTextContent('open access/full text');
    });

    it('should render caption data correctly for unpublished buffer', () => {
        const { getByTestId } = setup({
            fieldRows: [
                {
                    searchField: 'rek_genre_type',
                    value: ['B.A. Thesis', 'B.Sc Thesis', "Bachelor's Thesis"],
                    label: ['B.A. Thesis', 'B.Sc Thesis', "Bachelor's Thesis"],
                },
                {
                    searchField: 'rek_created_date',
                    value: {
                        from: moment('01/01/2010', 'DD/MM/YYYY'),
                        to: moment('02/02/2010', 'DD/MM/YYYY'),
                    },
                    label: '',
                },
            ],
            yearFilter: {},
            isOpenAccess: false,
        });

        expect(getByTestId('advanced-search-caption-container')).toHaveStyle('word-break: break-all');

        expect(getByTestId('rek-genre-type-caption-title')).toHaveTextContent('Thesis type');
        expect(getByTestId('rek-genre-type-caption-combiner')).toHaveTextContent('is one of');
        expect(getByTestId('rek-genre-type-caption-value')).toHaveTextContent(
            "B.A. Thesis, B.Sc Thesis or Bachelor's Thesis",
        );

        expect(getByTestId('rek-created-date-caption-title')).toHaveTextContent('Created');
        expect(getByTestId('rek-created-date-caption-combiner')).toHaveTextContent('between');
        expect(getByTestId('rek-created-date-caption-value')).toHaveTextContent(
            '1st January, 2010 and 2nd February, 2010',
        );
    });

    it('should render star icon to save favourite search', () => {
        const userIsAdminHook = jest.spyOn(Hooks, 'userIsAdmin');

        userIsAdminHook.mockImplementation(() => true);

        const { getByTestId } = setup({
            fieldRows: [
                { searchField: 'all', value: '', label: '' },
                { searchField: 'rek_ismemberof', value: ['UQ:120743'], label: '' },
                { searchField: 'rek_author_id', value: '570', label: '570 (Ashkanasy, Neal M.)' },
            ],
            docTypes: [263],
            yearFilter: { from: '1991', to: '2012', invalid: false },
            isOpenAccess: true,
        });

        expect(getByTestId('add-favourite-search')).toBeInTheDocument();
    });
});
