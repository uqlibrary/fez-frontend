import * as actions from 'actions/actionTypes';
import myTrendingPublicationsReducer from './myTrendingPublications';

const initialState = {
    trendingPublicationsList: [],
    loadingTrendingPublications: true,
};

const trendingPubsPayload = [
    {
        key: 'altmetric',
        values: [
            {
                id: '17708',
                count: '4',
                difference: '0.5',
                created: '1424093618',
                last_checked: '1511253466',
                citation_url: 'https://queensland.altmetric.com/details/3445881',
                rek_pid: 'UQ:242578',
                rek_date: '2011-05-01 00:00:00',
                title:
                    'SNORD-host RNA Zfas1 is a regulator of mammary development ' +
                    'and a potential marker for breast cancer',
                authors: '...Vargas, Ana C.;Campbell, Ian G.;Brown, Melissa A.',
            },
            {
                id: '82067',
                count: '4',
                difference: '3.85',
                created: '1502853372',
                last_checked: '1510823330',
                citation_url: 'https://queensland.altmetric.com/details/23460021',
                rek_pid: 'UQ:678947',
                rek_date: '2017-08-03 00:00:00',
                title:
                    'Long noncoding RNAs CUPID1 and CUPID2 mediate breast cancer risk at ' +
                    '11q13 by modulating the response to DNA damage',
                authors: '...Cloonan, Nicole;Pearson,John;Brown, Melissa A....',
            },
            {
                id: '2100',
                count: '1',
                difference: '0.25',
                created: '1372746648',
                last_checked: '1507654457',
                citation_url: 'https://queensland.altmetric.com/details/888611',
                rek_pid: 'UQ:282686',
                rek_date: '2012-08-01 00:00:00',
                title:
                    'BRCA1 R1699Q variant displaying ambiguous functional abrogation ' +
                    'confers intermediate breast and ovarian cancer risk',
                authors: '...Feng, Bingjian;Healey, Sue;Brown, Melissa A....',
            },
        ],
    },
    {
        key: 'thomson',
        values: [
            {
                id: '22173067',
                count: '3',
                difference: '1',
                created: '1506802198',
                last_checked: '1506802198',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000393077300011&SrcAuth=uqueensland',
                rek_pid: 'UQ:396321',
                rek_date: '2016-07-04 00:00:00',
                title: 'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer',
                authors: '...Clark, Susan J.;Lakhani, Sunil R.;Brown, Melissa A.',
            },
            {
                id: '21720066',
                count: '20',
                difference: '1',
                created: '1506799026',
                last_checked: '1506799026',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000347707800001&SrcAuth=uqueensland',
                rek_pid: 'UQ:348436',
                rek_date: '2015-01-08 00:00:00',
                title:
                    'Fine-scale mapping of the 5q11.2 breast cancer locus reveals at least three independent ' +
                    'risk variants regulating MAP3K1',
                authors: '...Ahmed, Shahana;Healey, Catherine S.;Brown, Melissa A....',
            },
            {
                id: '21581479',
                count: '34',
                difference: '1',
                created: '1506798769',
                last_checked: '1506798769',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000342985700003&SrcAuth=uqueensland',
                rek_pid: 'UQ:345184',
                rek_date: '2014-09-01 00:00:00',
                title: 'Evidence that breast cancer risk at the 2q35 locus is mediated through IGFBP5 regulation',
                authors: '...Carroll, Jason;Caldas, Carlos;Brown, Melissa A....',
            },
        ],
    },
    {
        key: 'scopus',
        values: [
            {
                id: '16078609',
                count: '1',
                difference: '1',
                created: '1506800059',
                last_checked: '1506800059',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84962771937&src=s&sot=cite&sdt=a',
                rek_pid: 'UQ:384236',
                rek_date: '2016-04-04 00:00:00',
                title:
                    'MicroRNA-206 is differentially expressed in Brca1-deficient mice and regulates epithelial' +
                    ' and stromal cell compartments of the mouse mammary gland',
                authors: '...Edwards, S. L.;French, J. D.;Brown, M. A.',
            },
            {
                id: '15777783',
                count: '6',
                difference: '1',
                created: '1506797607',
                last_checked: '1506797607',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84930766350&src=s&sot=cite&sdt=a',
                rek_pid: 'UQ:328887',
                rek_date: '2013-01-01 00:00:00',
                title:
                    'Consequences of germline variation disrupting the constitutional translational initiation' +
                    ' codon start sites of MLH1 and BRCA2: Use of potential alternative start sites and ' +
                    'implications for predicting variant pathogenicity',
                authors: '...Hopper, John L.;Jenkins, Mark A.;Brown, Melissa A....',
            },
            {
                id: '15743381',
                count: '46',
                difference: '1',
                created: '1506795654',
                last_checked: '1506795654',
                citation_url:
                    'http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84867485246&src=s&sot=cite&sdt=a',
                rek_pid: 'UQ:286101',
                rek_date: '2012-01-01 00:00:00',
                title: 'A guide for functional analysis of BRCA1 variants of uncertain significance',
                authors: '...Caputo, Sandrine M.;Vreeswijk, Maaike P. G.;Brown, Melissa A....',
            },
        ],
    },
];

describe('Trending publications reducer', () => {
    it('returns the correct state while trending publications are loading', () => {
        const test = myTrendingPublicationsReducer(initialState, { type: actions.TRENDING_PUBLICATIONS_LOADING });
        expect(test.trendingPublicationsList).toEqual([]);
        expect(test.loadingTrendingPublications).toBeTruthy();
    });

    it('returns the correct state when trending publications are loaded 1', () => {
        const altmetricPubs = trendingPubsPayload[0].values;
        const test = myTrendingPublicationsReducer(initialState, {
            type: `${actions.TRENDING_PUBLICATIONS_LOADED}@altmetric`,
            payload: { data: altmetricPubs },
        });

        expect(test.trendingPublicationsList).toEqual([{ key: 'altmetric', values: altmetricPubs }]);
        expect(test.loadingTrendingPublications).toBeFalsy();
    });

    it('returns the correct state when trending publications are loaded 2', () => {
        const altmetricPubs = trendingPubsPayload[0].values;
        const scopusPubs = trendingPubsPayload[2].values;

        const test = myTrendingPublicationsReducer(
            {
                ...initialState,
                trendingPublicationsList: [{ key: 'altmetric', values: altmetricPubs }],
            },
            {
                type: `${actions.TRENDING_PUBLICATIONS_LOADED}@scopus`,
                payload: { data: scopusPubs },
            },
        );

        expect(test.trendingPublicationsList).toEqual([
            { key: 'altmetric', values: altmetricPubs },
            { key: 'scopus', values: scopusPubs },
        ]);
        expect(test.loadingTrendingPublications).toBeFalsy();
    });

    it('returns the correct state when trending publications are loaded but 0 publications found', () => {
        const test = myTrendingPublicationsReducer(initialState, {
            type: actions.TRENDING_PUBLICATIONS_LOADED,
            payload: { data: [] },
        });
        expect(test.trendingPublicationsList.length).toEqual(0);
        expect(test.loadingTrendingPublications).toBeFalsy();
    });

    it('returns the correct state when trending publications fail to load', () => {
        const test = myTrendingPublicationsReducer(initialState, { type: actions.TRENDING_PUBLICATIONS_FAILED });
        expect(test.trendingPublicationsList).toEqual([]);
        expect(test.loadingTrendingPublications).toBeFalsy();
    });
});
