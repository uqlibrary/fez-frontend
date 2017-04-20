jest.dontMock('./SearchResults');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import SearchResults from './SearchResults';

function setup(ds) {
    const props = {
        title: 'Component Title',
        explanationText: 'Lorem Ipsum',
        dataSource: Immutable.fromJS(ds)
    };
    return shallow(<SearchResults {...props} />);
}

describe('Search results snapshots tests', () => {
    it('renders default search results page', () => {
        const externalDoiSearchResult = [
            {
                'rek_display_type': 179,
                'rek_status': 2,
                'rek_object_type': 1,
                'fez_record_search_key_doi': {
                    'rek_doi': '10.1111/j.1755-5922.2010.00189.x'
                },
                'fez_record_search_key_publisher': {
                    'rek_publisher': 'Wiley-Blackwell'
                },
                'rek_title': 'External - Nutraceuticals and Atherosclerosis: Human Trials',
                'rek_date': '2010-07-05 00:00:00',
                'fez_record_search_key_collection_year': {
                    'rek_collection_year': '2010-07-05 00:00:00'
                },
                'fez_record_search_key_date_available': {
                    'rek_date_available': '2010-07-05 00:00:00'
                },
                'fez_record_search_key_journal_name': {
                    'rek_journal_name': 'Cardiovascular Therapeutics'
                },
                'fez_record_search_key_issue_number': {
                    'rek_issue_number': '4'
                },
                'fez_record_search_key_volume_number': {
                    'rek_volume_number': '28'
                },
                'fez_record_search_key_start_page': {
                    'rek_start_page': '202'
                },
                'fez_record_search_key_end_page': {
                    'rek_end_page': '215'
                },
                'fez_record_search_key_keywords': [
                    {
                        'rek_keywords': 'Pharmacology (medical)',
                        'rek_keywords_order': 1
                    },
                    {
                        'rek_keywords': 'Pharmacology',
                        'rek_keywords_order': 2
                    },
                    {
                        'rek_keywords': 'Cardiology and Cardiovascular Medicine',
                        'rek_keywords_order': 3
                    }
                ],
                'fez_record_search_key_issn': [
                    {
                        'rek_issn': '1755-5914',
                        'rek_issn_order': 1
                    },
                    {
                        'rek_issn': '1755-5922',
                        'rek_issn_order': 2
                    }
                ]
            }
        ];

        const wrapper = setup(externalDoiSearchResult);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
