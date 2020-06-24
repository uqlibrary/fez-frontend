import { AdvancedSearchCaption } from './AdvancedSearchCaption';
import AdvancedSearchCaptionWithStyles from './AdvancedSearchCaption';
import React from 'react';
import moment from 'moment';

const getProps = (testProps = {}) => ({
    classes: {},
    fieldRows: [
        { searchField: 'all', value: '', label: '' },
        { searchField: 'rek_ismemberof', value: ['UQ:120743', 'UQ:217419', 'UQ:217422'], label: '' },
        { searchField: 'rek_author_id', value: '570', label: '570 (Ashkanasy, Neal M.)' },
    ],
    docTypes: [263, 174],
    yearFilter: { from: '1991', to: '2012', invalid: false },
    isOpenAccess: true,
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(AdvancedSearchCaption, getProps(testProps));
}

describe('Component AdvancedSearchCaption', () => {
    it('should render as expected with no props', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render as default with styles', () => {
        const wrapper = getElement(AdvancedSearchCaptionWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renderCaptions should return expected with props', () => {
        const wrapper = setup();
        const test = [
            { title: 'Title', value: 'value', combiner: 'combiner' },
            { title: 'Title 2', value: 'value 2', combiner: 'combiner 2' },
        ];
        const result = JSON.stringify([
            {
                type: 'span',
                key: '0',
                ref: null,
                props: {
                    children: [
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', false, ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: ['Title', ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', 'combiner', ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', 'value'],
                            },
                            _owner: null,
                            _store: {},
                        },
                    ],
                },
                _owner: null,
                _store: {},
            },
            {
                type: 'span',
                key: '1',
                ref: null,
                props: {
                    children: [
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', ' AND ', ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: ['Title 2', ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', 'combiner 2', ' '],
                            },
                            _owner: null,
                            _store: {},
                        },
                        {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [' ', 'value 2'],
                            },
                            _owner: null,
                            _store: {},
                        },
                    ],
                },
                _owner: null,
                _store: {},
            },
        ]);
        expect(JSON.stringify(wrapper.instance().renderCaptions(test))).toEqual(result);
    });

    it('getCleanValue should return expected with props', () => {
        const wrapper = setup();
        const test = {
            title: 'Thesis type',
            combiner: 'is one of',
            value: ['B.A. Thesis', 'B.Sc Thesis', "Bachelor's Thesis"],
        };
        const result = {
            combiner: 'is one of',
            title: 'Thesis type',
            value: "B.A. Thesis, B.Sc Thesis or Bachelor's Thesis",
        };
        expect(wrapper.instance().getCleanValue(test)).toEqual(result);
        expect(wrapper.instance().getCleanValue({ value: ['test'] })).toEqual({
            value: 'test',
        });
    });

    it('getSearchFieldData should return expected with props', () => {
        const wrapper = setup();
        const test = [
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
            },
        ];
        const result = [
            {
                combiner: 'is one of',
                title: 'Thesis type',
                value: "B.A. Thesis, B.Sc Thesis or Bachelor's Thesis",
            },
            {
                combiner: 'between',
                title: 'Created',
                value: '1st January, 2010 and 2nd February, 2010',
            },
        ];
        expect(wrapper.instance().getSearchFieldData(test)).toEqual(result);
    });

    it('getOpenAccessData should return expected with props', () => {
        const wrapper = setup();
        const test = true;
        const result = { combiner: 'is', title: '', value: <span className="value">open access/full text</span> };
        expect(wrapper.instance().getOpenAccessData(test)).toEqual(result);
    });

    it('getYearFilterData should return expected with props', () => {
        const wrapper = setup();
        const test = { from: 100, to: 200, invalid: false };
        const result = { combiner: 'between', title: 'Published', value: '100 to 200' };
        expect(wrapper.instance().getYearFilterData(test)).toEqual(result);
    });

    it('updateStateData should return expected with props', () => {
        const wrapper = setup();
        const test = {
            fieldRows: [
                { searchField: 'all', value: '', label: '' },
                { searchField: 'rek_ismemberof', value: ['UQ:120743', 'UQ:217419', 'UQ:217422'], label: '' },
                { searchField: 'rek_author_id', value: '570', label: '570 (Ashkanasy, Neal M.)' },
            ],
            docTypes: [263, 174],
            yearFilter: { from: '1991', to: '2012', invalid: false },
            isOpenAccess: true,
        };
        const result = {
            captionData: [
                { combiner: 'contains', title: 'Any field', value: 'anything' },
                { combiner: 'is one of', title: 'Collection', value: 'UQ:120743, UQ:217419 or UQ:217422' },
                { combiner: 'is', title: 'Author ID', value: '570' },
                { combiner: 'is one of', title: 'Work type', value: 'Audio Document or Book' },
                { combiner: 'is', title: '', value: <span className="value">open access/full text</span> },
                { combiner: 'between', title: 'Published', value: '1991 to 2012' },
            ],
        };
        wrapper.instance().updateStateData(test);
        wrapper.update();
        expect(wrapper.state()).toEqual(result);
    });

    it('updateStateData should return expected with props when props change', () => {
        const initialProps = {
            fieldRows: [
                { searchField: 'all', value: 'sdsdfsdfgsdfg', label: '' },
                { searchField: 'rek_ismemberof', value: ['UQ:120743', 'UQ:217419', 'UQ:217422'], label: '' },
                { searchField: 'rek_author_id', value: '81861', label: '81861 (Medland, Sarah E.)' },
            ],
            isMinimised: false,
            isOpenAccess: false,
            docTypes: [],
            yearFilter: {},
            className: 'search-body',
            isLoading: false,
        };
        const wrapper = setup(initialProps);
        expect(toJson(wrapper)).toMatchSnapshot();
        const newProps = {
            fieldRows: [
                { searchField: 'all', value: 'hello', label: '' },
                { searchField: 'rek_ismemberof', value: ['UQ:120743', 'UQ:217423'], label: '' },
                { searchField: 'rek_author_id', value: 2917705, label: '2917705 (Baumeister, Roy F.)' },
            ],
            isMinimised: false,
            isOpenAccess: false,
            docTypes: [],
            yearFilter: {},
            className: 'search-body',
            isLoading: false,
        };
        wrapper.instance().UNSAFE_componentWillReceiveProps({ ...newProps });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
