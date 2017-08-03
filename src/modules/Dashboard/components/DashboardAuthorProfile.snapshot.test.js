jest.dontMock('./DashboardAuthorProfile');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorProfile from './DashboardAuthorProfile';

function setup({authorDetails}) {
    const props = {
        authorDetails: {
            'uqr_id': 14,
            'espace_id': 20288,
            'image_exists': 1,
            'username': 'uqresearcher',
            'staff_id': '0000111',
            'given_name': 'J',
            'family_name': 'Researcher',
            'title': 'Professor',
            'scopus_id': '',
            'google_scholar_id': '',
            'researcher_id': 'G-111-1111',
            'orcid_id': '0000-0001-1111-1111',
            'publons_id': '',
            'mypub_url': 'uqresearcher',
            'org_units': ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
            'positions': ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
            'espace': {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'}
        }
    };
    return shallow(<DashboardAuthorProfile {...props} />);
}

describe('Alert snapshots test', () => {
    it('Render the collective dashboard author profile area (all components)', () => {
        const authorDetails = {
            'uqr_id': 14,
            'espace_id': 20288,
            'image_exists': 1,
            'username': 'uqresearcher',
            'staff_id': '0000111',
            'given_name': 'J',
            'family_name': 'Researcher',
            'title': 'Professor',
            'scopus_id': '',
            'google_scholar_id': '',
            'researcher_id': 'G-111-1111',
            'orcid_id': '0000-0001-1111-1111',
            'publons_id': '',
            'mypub_url': 'uqresearcher',
            'org_units': ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
            'positions': ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
            'espace': {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'}
        };
        const wrapper = setup(authorDetails);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
