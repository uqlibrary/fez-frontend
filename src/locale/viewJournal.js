import { APP_URL } from 'config/general';
import React from 'react';

const caulLink = 'https://caul.libguides.com/read-and-publish/reports';

export default {
    viewJournal: {
        uqConnections: {
            title: 'UQ Connections',
            authorCount: {
                heading: 'Number of UQ Authors',
            },
            authorPublications: {
                heading: 'UQ Authored Publications',
                ariaLabel: 'Click to explore articles published in the past 5 years in UQ eSpace',
                linkText: 'View these articles in UQ eSpace',
                externalUrl:
                    APP_URL +
                    'records/search?activeFacets[ranges][Year+published][from]=' +
                    (new Date().getFullYear() - 5) +
                    '&activeFacets[ranges][Year+published][to]=' +
                    new Date().getFullYear() +
                    '&searchQueryParams[mtj_jnl_id][value]=[id]&searchMode=advanced&activeFacets[ranges][Author%20Id]=[1%20TO%20*]',
            },
            editorialStaff: {
                heading: 'UQ Editorial Staff',
                ariaLabel: 'View authors statistic page',
            },
        },
        readAndPublish: {
            title: 'Publisher agreements',
            heading: 'UQ publisher agreement',
            ariaLabel: 'Click to view read and publish agreement',
            status: {
                noAgreement: 'No',
                exceeded: 'No (exhausted)',
                discounted: 'Discount',
                capped: 'Article Processing Charge covered',
            },
            caulLink: {
                heading: 'Limited amount available',
                ariaLabel: 'Click to view CAUL information on number of remaining pre-paid APCs',
                linkText: 'Check current status',
                externalUrl: caulLink,
            },
            alert: {
                title: 'Read and Publish Agreement',
                approaching: (
                    <p>
                        The available cap for this title is projected to run out shortly. Please{' '}
                        <a href={caulLink} target="_blank">
                            check the current status
                        </a>
                        .
                    </p>
                ),
                exceeded: (
                    <p>
                        The available cap for this title has been exceeded. For the remainder of the year open access
                        publishing in this title will no longer be fully covered through the agreement.
                    </p>
                ),
                nodeal: (
                    <p>
                        From January 1 2026, this title does not have a Read and Publish agreement.{' '}
                        <a
                            href="https://web.library.uq.edu.au/stories/changes-accessing-and-publishing-journals-2026"
                            target="_blank"
                        >
                            Learn more about current agreements
                        </a>
                        .
                    </p>
                ),
            },
        },
        notFound: {
            title: 'Journal not found',
            message: (
                <div>
                    <p>The journal you are attempting to access does not appear in our system.</p>
                    <p>
                        If you believe this is in error, please{' '}
                        <a href="https://guides.library.uq.edu.au/research-and-teaching-staff/uqespace-publications-datasets/contact-us">
                            contact the eSpace team.
                        </a>
                    </p>
                </div>
            ),
        },
    },
};
