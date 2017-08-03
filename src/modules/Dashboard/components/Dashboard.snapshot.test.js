jest.dontMock('./Dashboard');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Dashboard from './Dashboard';

function setup({details}) {
    const props = {details};
    return shallow(<Dashboard {...props} />);
}

describe('Dashboard test', () => {
    it('Render the dashboard as expected for a UQ researcher)', () => {
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
            },
            account: {
                'id': 'uqstaff',
                'class': ['libstaff', 'IS_CURRENT'],
                'type': 18,
                'homeLib': 'St Lucia',
                'firstName': 'J',
                'lastName': 'Staff',
                'name': 'J STAFF',
                'mail': 'j.staff@example.uq.edu.au',
                'barcode': '111111111111111',
                'groups': ['DC=uq,DC=edu,DC=au'],
                'classes': [],
                'expiryDate': '31-12-19',
                'hasSession': true,
                'tokenBased': false,
                'canMasquerade': true,
                'blocked': false
            },
            authorDetailsLoading: false
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the dashboard as expected for a Student)', () => {
        const props = {
            authorDetails: {
                'orcid_id': null,
                'researcher_id': null,
                'scopus_id': null,
                'publons_id': null
            },
            account: {
                'id': 's1111111',
                'class': ['hass'],
                'type': 2,
                'homeLib': 'St Lucia',
                'firstName': 'J',
                'lastName': 'RHD Student',
                'name': 'J RHD Student',
                'mail': 'rhd@student.uq.edu.au',
                'barcode': '111111111111111',
                'groups': null,
                'classes': [],
                'expiryDate': '14-12-19',
                'hasSession': true,
                'tokenBased': false,
                'canMasquerade': false,
                'blocked': false
            },
            authorDetailsLoading: false
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
