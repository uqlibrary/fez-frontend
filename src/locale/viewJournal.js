import { APP_URL } from 'config/general';
import React from 'react';

const caulLink = 'https://caul.libguides.com/read-and-publish/reports';

export default {
    viewJournal: {
        basic: {
            title: 'Journal Information',
            help: {
                text: (
                    <>
                        <h3>ISO abbreviated title</h3>
                        <p>International standard for abbreviation of the journal title.</p>

                        <h3>ISSN(s)</h3>
                        <p>
                            International Standard Serial Number (ISSN) is the journal’s unique identifier code. Journal
                            will have a separate ISSN for print and online format.
                        </p>

                        <h3>Refereed</h3>
                        <p>Peer-reviewed journal</p>

                        <h3>Type of journal</h3>
                        <p>Fully open access journals - all content is immediately free to access. </p>
                        <p>
                            Hybrid journals are subscription journals in which some of the articles are open access by
                            means of an Article Processing Charge (APC).
                        </p>
                        <p>Sources: Ulrichs and DOAJ</p>
                    </>
                ),
                tooltip: 'Open help panel for journal information',
            },
        },
        openAccess: {
            title: 'Open Access Options',
            help: {
                text: (
                    <>
                        <p>
                            Publishing open access increases research visibility by making work freely available to a
                            global audience.
                        </p>
                        <p>Terminology and pathways to make work open access include:</p>

                        <h3>Article Processing Charge (APC)</h3>
                        <p>
                            Fee paid to the publisher to make an article immediately available and openly accessible.
                            Check the journal’s website for the most up-to-date APC.
                        </p>

                        <h3>Open access with Accepted manuscript</h3>
                        <p>
                            You can make your work openly accessible by depositing the Author Accepted Manuscript (AAM)
                            of your article in UQ eSpace.
                        </p>
                        <p>
                            An Author Accepted Manuscript is the version of an article that has been peer-reviewed and
                            accepted for publication but before the publisher has applied formatting, typesetting and
                            branding.
                        </p>
                        <p>UQ eSpace will manage the required embargo period.</p>
                        <h3>UQ Publisher agreement</h3>

                        <p>
                            UQ Library may have{' '}
                            <a
                                href={
                                    'https://web.library.uq.edu.au/research-and-publish/open-research/open-access-publishing-agreements'
                                }
                                target={'blank'}
                            >
                                an agreement
                            </a>{' '}
                            with the publisher that covers the APC or provides a discount on the APC.
                        </p>
                    </>
                ),
                tooltip: 'Open help panel for journal open access options',
            },
        },
        discoverability: {
            title: 'Journal Discoverability',
            help: {
                text: (
                    <>
                        <p>
                            Having research indexed in major databases increases its visibility and discoverability,
                            enhancing the work’s credibility.
                        </p>
                        <p>Major databases that index journals are:</p>
                        <ul>
                            <li>Web of Science citation indexes</li>
                            <li>Scopus</li>
                            <li>PubMed</li>
                        </ul>
                    </>
                ),
                tooltip: 'Open help panel for journal discoverability',
            },
        },
        qualityByRanking: {
            title: 'Journal Quality By Ranking',
            help: {
                text: (
                    <>
                        <p>Journal quality rankings may identify reputable journals within a subject area.</p>

                        <p>
                            Higher ranked journals may be referred to as Q1 or in the top quartile of their subject
                            area.
                        </p>

                        <p>The main ranking journal quality schemas are based on citations and include:</p>

                        <ul>
                            <li>
                                Journal Citation Reports which includes journals from the Web of Science Core
                                Collection.
                            </li>
                            <li>CiteScore which calculates rankings using data from Scopus.</li>
                            <li>
                                SJR (SCImago Journal Rank) is based on Scopus data and measures the prestige of the
                                journal based on the reputation of citing journals.
                            </li>
                            <li>
                                SNIP (Source Normalized Impact per Paper) is based on Scopus data and citation potential
                                according to its specific subject field.
                            </li>
                        </ul>
                    </>
                ),
                tooltip: 'Open help panel for journal quality by ranking',
            },
        },
        listed: {
            title: 'Journal Quality By Recognised Listings',
            help: {
                text: (
                    <>
                        <p>
                            Journal listings indicate that a journal has met the quality indicators/requirements for a
                            list compiled by a specific group. They signify credibility of the journal and identify it
                            as a trustworthy source.
                        </p>

                        <p>Well known listings include:</p>
                        <ul>
                            <li>ABDC (Australian Business Deans Council)</li>
                            <li>CWTS (Centre of Science and Technology Studies at Leiden University)</li>
                            <li>ERA (Excellence in Research Australia)</li>
                            <li>Nature Index</li>
                        </ul>
                    </>
                ),
                tooltip: 'Open help panel for journal quality by recognised listings',
            },
        },
        uqConnections: {
            title: 'UQ Connections',
            authorCount: {
                heading: 'Number of UQ Authors',
            },
            authorPublications: {
                heading: 'UQ Authored Publications',
                ariaLabel: 'View articles published in the past 5 years in UQ eSpace in a new tab',
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
                tooltip: 'Open authors statistic page in a new tab',
                ariaLabel: author => `Open authors statistic page for ${author.aut_display_name} in a new tab`,
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
