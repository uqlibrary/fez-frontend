import React from 'react';
import * as records from 'mock/data/testing/records';
import Meta, { getMetaTagContent, getMetaTags } from './Meta';
import { pathConfig } from 'config';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { metaExpected } from 'mock/data/testing/meta';
import { useLocation } from 'react-router';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(() => jest.fn()),
    useLocation: jest.fn(() => ({ pathname: '/', search: '' })),
}));

const mockHelmet = jest.fn();

jest.mock('@dr.pogodin/react-helmet', () => ({
    ...jest.requireActual('@dr.pogodin/react-helmet'),
    Helmet: props => {
        mockHelmet(props);
    },
}));

function setup(testProps = {}, testState = {}, renderer = render) {
    const props = {
        routesConfig: [
            {
                path: pathConfig.index,
                pageTitle: 'Index page',
            },
            {
                regExPath: pathConfig.records.fix('(UQ:\\d+)'),
                pageTitle: 'Fix my record page title',
            },
            {
                path: pathConfig.hdrSubmission,
                pageTitle: 'RHD submission page title',
            },
        ],
        ...testProps,
    };
    const _state =
        Object.keys(testState).length > 0
            ? {
                  recordToView: {
                      ...testState,
                  },
              }
            : {};

    const state = {
        viewRecordReducer: {
            ..._state,
        },
    };

    return renderer(
        <WithRouter>
            <WithReduxStore initialState={state}>
                <Meta {...props} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('Meta Component ', () => {
    beforeEach(() => {
        useLocation.mockClear();
        useLocation.mockImplementation(() => ({ pathname: '/view/UQ:1234', search: '', state: {} }));
    });

    it('should render component with journal', () => {
        const expected = metaExpected['should render component with journal'];
        setup(null, { ...records.journal });

        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with journal with custom title for edit route', () => {
        const expected = metaExpected['should render component with journal with custom title for edit route'];
        useLocation.mockImplementation(() => ({ pathname: '/admin/edit/UQ:123456' }));
        setup(
            {
                routesConfig: [
                    {
                        path: pathConfig.admin.edit,
                        pageTitle: 'Test',
                    },
                ],
            },
            { ...records.journal },
        );
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with data collection', () => {
        const expected = metaExpected['should render component with data collection'];
        setup(null, { ...records.dataCollection });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with audio document', () => {
        const expected = metaExpected['should render component with audio document'];

        setup(null, { ...records.audioDocument });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with book', () => {
        const expected = metaExpected['should render component with book'];
        setup(null, { ...records.book });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with book chapter', () => {
        const expected = metaExpected['should render component with book chapter'];
        setup(null, { ...records.bookChapter });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with conference paper', () => {
        const expected = metaExpected['should render component with conference paper'];
        setup(null, { ...records.conferencePaper });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with conference proceedings', () => {
        const expected = metaExpected['should render component with conference proceedings'];
        setup(null, { ...records.conferenceProceedings });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with creative work', () => {
        const expected = metaExpected['should render component with creative work'];
        setup(null, { ...records.creativeWork });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with design document', () => {
        const expected = metaExpected['should render component with design document'];
        setup(null, { ...records.design });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with digilib image', () => {
        const expected = metaExpected['should render component with digilib image'];
        setup(null, { ...records.digilibImage });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with image', () => {
        const expected = metaExpected['should render component with image'];
        setup(null, { ...records.imageDocument });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with generic document', () => {
        const expected = metaExpected['should render component with generic document'];
        setup(null, { ...records.generic });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with manuscript', () => {
        const expected = metaExpected['should render component with manuscript'];
        setup(null, { ...records.manuscript });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with newspaper', () => {
        const expected = metaExpected['should render component with newspaper'];
        setup(null, { ...records.newspaperArticle });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with patent', () => {
        const expected = metaExpected['should render component with patent'];
        setup(null, { ...records.patent });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with preprint', () => {
        const expected = metaExpected['should render component with preprint'];
        setup(null, { ...records.preprint });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with reference entry', () => {
        const expected = metaExpected['should render component with reference entry'];
        setup(null, { ...records.referenceEntry });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with research report', () => {
        const expected = metaExpected['should render component with research report'];
        setup(null, { ...records.researchReport });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with thesis', () => {
        const expected = metaExpected['should render component with thesis'];
        setup(null, { ...records.thesis });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with working paper', () => {
        const expected = metaExpected['should render component with working paper'];
        setup(null, { ...records.workingPaper });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with video document', () => {
        const expected = metaExpected['should render component with video document'];
        setup(null, { ...records.videoDocument });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with coverage period data mapped to DC.Subject tag', () => {
        const expected = metaExpected['should render component with coverage period data mapped to DC.Subject tag'];
        setup(null, {
            rek_title: 'Record with coverage period',
            fez_record_search_key_coverage_period: [
                {
                    rek_coverage_period_id: 1,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 1,
                    rek_coverage_period: 'Original records were on paper (Photo, heat sensitive, 35mm) then digital',
                },
            ],
        });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with coverage period data mapped to multiple DC.Subject tag', () => {
        const expected =
            metaExpected['should render component with coverage period data mapped to multiple DC.Subject tag'];
        setup(null, {
            rek_title: 'Record with coverage period',
            fez_record_search_key_coverage_period: [
                {
                    rek_coverage_period_id: 1,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 1,
                    rek_coverage_period: 'Original records were on paper (Photo, heat sensitive, 35mm) then digital',
                },
                {
                    rek_coverage_period_id: 2,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 2,
                    rek_coverage_period: 'Original records were on paper then digital',
                },
            ],
        });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render component with rek_date year mapped to citation_date exactly as it is', () => {
        const expected =
            metaExpected['should render component with rek_date year mapped to citation_date exactly as it is'];
        setup(null, {
            rek_title: 'Record with only year in rek_date',
            rek_date: '1999',
        });
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render title only', () => {
        const expected = metaExpected['should render title only'];
        useLocation.mockImplementation(() => ({ pathname: '/', search: '', state: {} }));
        setup();
        expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should render description from rek_description if rek_formatted_abstract has an empty tag', () => {
        const publication = {
            rek_formatted_abstract: '<p></p>',
            rek_description: 'desc',
        };

        expect(getMetaTagContent(publication, 'rek_description', null, null)).toEqual('desc');
    });

    it('should return rek_formatted_abstract correctly with escaped special characters', () => {
        const publication = {
            rek_formatted_abstract: '<p>This is some description in <strong>HTML</strong></p>',
            rek_description: '',
        };
        const expectedValue = '&lt;p&gt;This is some description in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';

        expect(getMetaTagContent(publication, 'rek_description', null, null)).toEqual(expectedValue);
    });

    it('should return rek_title correctly with escaped special characters', () => {
        const publication = {
            rek_formatted_title: '<p></p>',
            rek_title: '<p>This is some title in <strong>HTML</strong></p>',
        };
        const expectedValue = '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';

        expect(getMetaTagContent(publication, 'rek_title', null, null)).toEqual(expectedValue);
    });

    it('should return rek_formatted_title correctly escaped characters when rek_title has empty value', () => {
        const publication = {
            rek_formatted_title: '<p>This is some title in <strong>HTML</strong></p>',
            rek_title: '',
        };
        const expectedValue = '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';

        expect(getMetaTagContent(publication, 'rek_title', null, null)).toEqual(expectedValue);
    });

    it('should return meta tags correctly', () => {
        const publication = {
            rek_formatted_title: '<p>This is some title in <strong>HTML</strong></p>',
            rek_title: '',
            rek_description: 'This is test description',
            rek_formatted_abstract: '<p></p>',
        };

        expect(getMetaTags(publication)).toEqual([
            { name: 'DC.Title', content: '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;' },
            {
                name: 'citation_title',
                content: '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;',
            },
            { name: 'DC.Description', content: 'This is test description' },
            { name: 'citation_abstract', content: 'This is test description' },
        ]);
    });

    it('should return meta tags correctly 2', () => {
        const publication = {
            rek_pid: 'UQ:111111',
            rek_date: '2015-01-01T10:00:00Z',
        };

        expect(getMetaTags(publication)).toEqual([
            { name: 'DC.Identifier', content: 'http://localhost/view/UQ:111111' },
            { name: 'DC.Date', content: '2015-01-01' },
            { name: 'citation_date', content: '2015/01/01' },
        ]);
    });

    it('should return 4 meta tags', () => {
        const publication = {
            rek_pid: 'UQ:222222',
            rek_date: '2015-01-01T10:00:00Z',
            fez_datastream_info: [
                {
                    dsi_dsid: 'abc.pdf',
                    dsi_mimetype: 'application/pdf',
                },
                {
                    dsi_dsid: 'abc.xml',
                    dsi_mimetype: 'text/xml',
                },
            ],
        };

        expect(getMetaTags(publication)).toEqual([
            { name: 'DC.Identifier', content: 'http://localhost/view/UQ:222222' },
            // {name: 'citation_pdf_url', content: 'http://localhost/view/UQ:222222/abc.pdf'},
            { name: 'DC.Date', content: '2015-01-01' },
            { name: 'citation_date', content: '2015/01/01' },
        ]);
    });
});
