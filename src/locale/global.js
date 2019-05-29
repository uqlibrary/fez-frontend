import React from 'react';
import {APP_URL} from 'config/general';
import {pathConfig} from 'config/routes';

/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets, eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'CLOSE'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

*/

export default {
    global: {
        title: `UQ eSpace ${process.env.TITLE_SUFFIX || ''}`,
        appTitle: (
            <a href={`${pathConfig.index}`}
                className="appTitle"
                title="Click to return to the eSpace home page"
                style={{color: '#FFFFFF'}}
            >
                UQ eSpace {process.env.TITLE_SUFFIX || ''}
            </a>
        ),
        logo: {
            // image: 'https://static.uq.net.au/v2/logos/corporate/uq-logo-white.svg',
            label: 'The University of Queensland',
            link: 'http://www.uq.edu.au'
        },
        orgTitle: 'The University of Queensland',
        loading: 'Loading',
        loadingUserAccount: 'Loading account',
        mainNavButton: {
            tooltip: 'Main navigation',
            aria: 'Click to open the main navigation',
            closeMenuLabel: 'Close menu'
        },
        authentication: {
            signInText: 'Log in',
            signOutText: 'Log out',
            ariaIn: 'Click to log in to eSpace',
            ariaOut: 'Click to log out of eSpace'
        },
        skipNav: {
            title: 'Skip Navigation',
            ariaLabel: 'Click to skip, or tab to progress to the navigation',
        },
        loginAlert: {
            title: 'You are not logged in',
            message: 'Login to UQ eSpace for full search results and more services.',
            type: 'info_outline',
            actionButtonLabel: 'Click to login'
        },
        errorMessages: {
            401: {
                message: 'You are not authorised to access the requested information. Please contact eSpace administrators or try again later.',
                status: 401
            },
            403: {
                message: 'Your session expired, please login to continue.',
                status: 403
            },
            404: {
                message: 'The requested page could not be found.',
                status: 404
            },
            422: {
                message: 'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                status: 500
            },
            500: {
                message: 'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                status: 500
            },
            generic: 'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            genericAlternate: 'Error has occurred during request and request cant be processed. Please contact eSpace administrators or try again later.',
        },
        notRegisteredAuthorAlert: {
            title: 'You are not registered in UQ eSpace as an author',
            message: 'Please contact the UQ eSpace administrator to resolve this.',
            type: 'info_outline'
        },
        noOrcidAlert: {
            title: 'ORCID ID REQUIRED',
            message: 'You do not have an ORCID ID linked to your UQ eSpace.',
            type: 'warning',
            actionButtonLabel: 'Click here to link or register'
        },
        forceOrcidLinkAlert: {
            title: 'ORCID ID REQUIRED',
            message: 'Before you can start using UQ eSpace you have to link your UQ eSpace profile to your ORCID ID.',
            type: 'error_outline'
        },
        discardFormChangesConfirmation: {
            confirmationTitle: 'Discard changes?',
            confirmationMessage: 'Are you sure you want to navigate away and discard all changes to the form?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes'
        },
        linkWillOpenInNewWindow: 'Link to [destination] will open in a new window.',
        sources: {
            espace: {
                id: 'espace',
                title: 'eSpace',
                priority: 0,
                externalUrl: APP_URL + 'records/[id]',
                idKey: 'rek_pid'
            },
            wos: {
                id: 'wos',
                title: 'Web of science',
                priority: 1,
                externalUrl: 'http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=FullRecord&DestApp=WOS_CPL&KeyUT=[id]&SrcAuth=uqueensland',
                idKey: 'fez_record_search_key_isi_loc.rek_isi_loc'
            },
            scopus: {
                id: 'scopus',
                title: 'Scopus',
                priority: 2,
                externalUrl: 'http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/record/display.url?eid=[id]&origin=inward',
                idKey: 'fez_record_search_key_scopus_id.rek_scopus_id'
            },
            pubmed: {
                id: 'pubmed',
                title: 'PubMed',
                priority: 3,
                externalUrl: 'http://ezproxy.library.uq.edu.au/login?url=https://www.ncbi.nlm.nih.gov/pubmed/[id]',
                idKey: 'fez_record_search_key_pubmed_id.rek_pubmed_id'
            },
            crossref: {
                id: 'crossref',
                title: 'Crossref',
                priority: 4,
                externalUrl: 'http://ezproxy.library.uq.edu.au/login?url=https://doi.org/[id]',
                idKey: 'fez_record_search_key_doi.rek_doi'
            },
        },
        doiCitationLink: {
            ariaLabel: 'Open this DOI in an new window',
            prefix: 'https://doi.org/',
            externalUrl: 'https://doi.org/[id]',
        },
        pubmedCentralLink: {
            ariaLabel: 'Full text via Pubmed Central (open access)',
            prefix: 'https://www.ncbi.nlm.nih.gov/pmc/articles/',
            externalUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/[id]'
        },
        sherpaRomeoLink: {
            ariaLabel: 'View publisher\'s open access policy in an new window',
            prefix: 'http://www.sherpa.ac.uk/romeo/',
            externalUrl: 'http://www.sherpa.ac.uk/romeo/search.php?issn=[issn]'
        },
        embargoDateFormat: 'YYYY-MM-DD',
        defaultLinkDescription: 'Link to work',
        offlineSnackbar: {
            online: {
                message: 'Your connection is back online',
                autoHideDuration: 5000
            },
            offline: {
                message: 'Your connection is offline',
                autoHideDuration: null
            }
        },
        audioPlayer: {
            controls: {
                playAudio: 'Click to play audio file [fileName]',
                pauseAudio: 'Click to pause audio file [fileName]'
            }
        },
        sessionExpiredConfirmation: {
            confirmationTitle: 'Session Expired',
            confirmationMessage: 'Your session has expired. Follow the login prompt to return to your submission form. You must upload your files again to successfully deposit your thesis, even if you have already uploaded your files.',
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Redirect to login'
        },
        defaultAuthorDataPlaceholder: 'Missing'
    }
};
