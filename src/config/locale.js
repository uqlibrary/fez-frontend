import React from 'react';

export default {
    global: {
        title: 'UQ eSpace',
        logo: 'https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg'
    },
    authentication: {
        signInText: 'Log in',
        signOutText: 'Log out'
    },
    menu: {
        myDashboard: {
            primaryText: 'My dashboard'
        },
        myResearch: {
            primaryText: 'My research'
        },
        addMissingRecord: {
            primaryText: 'Add missing record'
        },
        manageUsers: {
            primaryText: 'Manage users'
        },
        manageGroups: {
            primaryText: 'Manage groups'
        },
        manageAuthors: {
            primaryText: 'Manage authors'
        },
        browse: {
            primaryText: 'Browse',
            secondaryText: 'UQ\'s digital repository'
        },
        search: {
            primaryText: 'Search'
        },
        faqs: {
            primaryText: 'FAQs'
        },
        about: {
            primaryText: 'About',
        },
    },
    pages: {
        about: {
            title: 'About UQ eSpace',
            text: (
                <div>
                    <h3>Information</h3>
                    <p>UQ eSpace is the single authoritative source for the research outputs and research data of the staff and students of the University of Queensland and is the archival home of UQ Research Higher Degree digital theses. UQ eSpace raises the visibility and accessibility of UQ publications to the wider world and provides data for mandatory Government reporting requirements such as Excellence in Research for Australia (ERA), as well as for internal UQ systems, including Academic Portal and the DataHub. It operates as an institutional repository for open access publications, research datasets and other digitised materials created by staff of the University such as print materials, photographs, audio materials, videos, manuscripts and other original works. UQ eSpace provides metadata to UQ Researchers in order to raise the publication profile of researchers at UQ.</p>
                    <p>The University of Queensland has implemented an Open Access for UQ Research Outputs policy that requires UQ researchers to make publications arising from their research openly available via UQ eSpace. It has also implemented a Research Data Management policy that sets out the requirements for University of Queensland researchers to ensure that their research data are managed according to legal, statutory, ethical and funding body requirements.</p>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br/>
                        Email: espace@library.uq.edu.au <br/>
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Andrew Heath <br/>
                        Manager, UQ eSpace<br/>
                        Tel: 07 334 69981<br/>
                        Email: a.heath@library.uq.edu.au<br/>
                    </p>
                    <p>
                        Mary-Anne Marrington<br/>
                        Senior Librarian, UQ eSpace<br/>
                        Tel: 07 334 69775<br/>
                        Email: m.marrington@library.uq.edu.au<br/>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        browse: {
            title: 'Browse eSpace',
            text: ( <div>
                        <p>
                            <a href="https://auth.library.uq.edu.au/login">Temporary login link...</a>
                        </p>
                    </div>
                    ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        }
    }
};


