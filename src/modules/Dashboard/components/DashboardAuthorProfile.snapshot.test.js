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
                uqr_id: 410,
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
<<<<<<< HEAD
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'}
=======
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'},
>>>>>>> feature-google-scholar
            },
            author: {
                aut_title: 'Professor',
                aut_fname: 'J',
                aut_lname: 'Researcher',
                aut_orgUnits: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                aut_positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                aut_scopus_id: '',
                aut_google_scholar_id: '',
                aut_researcher_id: 'G-111-1111',
                aut_orcid_id: '0000-0001-1111-1111',
                aut_publons_id: '',
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard even if data is missing - espace', () => {
        const props = {
            authorDetails: {
                uqr_id: 410,
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
<<<<<<< HEAD
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow']
=======
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'},
>>>>>>> feature-google-scholar
            },
            author: {
                aut_title: 'Professor',
                aut_fname: 'J',
                aut_lname: 'Researcher',
                aut_orgUnits: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                aut_positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                aut_scopus_id: '',
                aut_google_scholar_id: '',
                aut_researcher_id: 'G-111-1111',
                aut_orcid_id: '0000-0001-1111-1111',
                aut_publons_id: '',
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard even if data is missing - org units, positions', () => {
        const props = {
            authorDetails: {
                uqr_id: 410,
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
<<<<<<< HEAD
=======
                org_units: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'},
>>>>>>> feature-google-scholar
            },
            author: {
                aut_title: 'Professor',
                aut_fname: 'J',
                aut_lname: 'Researcher',
                aut_orgUnits: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                aut_positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                aut_scopus_id: '',
                aut_google_scholar_id: '',
                aut_researcher_id: 'G-111-1111',
                aut_orcid_id: '0000-0001-1111-1111',
                aut_publons_id: '',
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('renders dashboard - display name should load from either author or authorDetails', () => {
        const props = {
            authorDetails: {
                uqr_id: 410,
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
                espace: {'first_year': 1990, 'last_year': 2017, 'doc_count': '282'},
            },
            author: {
                aut_id: 410,
<<<<<<< HEAD
                aut_display_name: 'J. Researcher',
                aut_title: 'Prof',
=======
                aut_title: 'Professor',
                aut_fname: 'J',
                aut_lname: 'Researcher',
>>>>>>> feature-google-scholar
                aut_orgUnits: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                aut_positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
                aut_scopus_id: '',
                aut_google_scholar_id: '',
                aut_researcher_id: 'G-111-1111',
                aut_orcid_id: '0000-0001-1111-1111',
                aut_publons_id: '',
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
