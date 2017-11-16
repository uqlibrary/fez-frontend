jest.dontMock('./DashboardAuthorProfile');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorProfile from './DashboardAuthorProfile';

function setup(props) {
    const testProps = {
        authorDetails: props.authorDetails || {},
        author: props.author || {}
    };

    return shallow(<DashboardAuthorProfile {...testProps} />);
}

describe('Dashboard Profile test', () => {
    it('renders dashboard with all data present', () => {
        const props = {
            authorDetails: {
                uqr_id: 14,
                espace_id: 20288,
                image_exists: 1,
                username: 'uqresearcher',
                staff_id: '0000111',
                given_name: 'J',
                family_name: 'Researcher',
                title: 'Professor',
                scopus_id: '',
                google_scholar_id: '',
                researcher_id: 'G-111-1111',
                orcid_id: '0000-0001-1111-1111',
                publons_id: '',
                mypub_url: 'uqresearcher',
                org_units: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'}
            }

        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard even if data is missing - espace', () => {
        const props = {
            authorDetails: {
                uqr_id: 14,
                espace_id: 20288,
                image_exists: 1,
                username: 'uqresearcher',
                staff_id: '0000111',
                given_name: 'J',
                family_name: 'Researcher',
                title: 'Professor',
                scopus_id: '',
                google_scholar_id: '',
                researcher_id: 'G-111-1111',
                orcid_id: '0000-0001-1111-1111',
                publons_id: '',
                mypub_url: 'uqresearcher',
                org_units: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow']
            }

        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard even if data is missing - org units, positions', () => {
        const props = {
            authorDetails: {
                uqr_id: 14,
                espace_id: 20288,
                image_exists: 1,
                username: 'uqresearcher',
                staff_id: '0000111',
                given_name: 'J',
                family_name: 'Researcher',
                title: 'Professor',
                scopus_id: '',
                google_scholar_id: '',
                researcher_id: 'G-111-1111',
                orcid_id: '0000-0001-1111-1111',
                publons_id: '',
                mypub_url: 'uqresearcher',
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard - display name should load from either author or authorDetails', () => {
        const props = {
            authorDetails: {
                espace_id: 20288,
                image_exists: 1,
                username: 'uqresearcher',
                staff_id: '0000111',
                scopus_id: '',
                google_scholar_id: '',
                researcher_id: 'G-111-1111',
                orcid_id: '0000-0001-1111-1111',
                publons_id: '',
                mypub_url: 'uqresearcher',
            },
            author: {
                aut_id: 410,
                aut_display_name: 'J. Researcher',
                aut_title: 'Prof'
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
