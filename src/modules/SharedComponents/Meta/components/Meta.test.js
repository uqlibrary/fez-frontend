import * as records from 'mock/data/testing/records';
import Meta from './Meta';
import { pathConfig } from 'config';

function setup(testProps = {}) {
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
        location: { pathname: '/view/UQ:1234' },
        ...testProps,
    };

    return renderComponent(Meta, props, { isShadow: true });
}

describe('Meta Component ', () => {
    it('should render component with journal', () => {
        const renderer = setup({ publication: records.journal });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with journal with custom title for edit route', () => {
        const renderer = setup({
            publication: records.journal,
            routesConfig: [
                {
                    path: pathConfig.admin.edit,
                    pageTitle: 'Test',
                },
            ],
            location: { pathname: '/admin/edit/UQ:123456' },
        });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with data collection', () => {
        const renderer = setup({ publication: records.dataCollection });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with audio document', () => {
        const renderer = setup({ publication: records.audioDocument });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with book', () => {
        const renderer = setup({ publication: records.book });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with book chapter', () => {
        const renderer = setup({ publication: records.bookChapter });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with conference paper', () => {
        const renderer = setup({ publication: records.conferencePaper });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with conference proceedings', () => {
        const renderer = setup({ publication: records.conferenceProceedings });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with creative work', () => {
        const renderer = setup({ publication: records.creativeWork });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with design document', () => {
        const renderer = setup({ publication: records.design });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with digilib image', () => {
        const renderer = setup({ publication: records.digilibImage });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const renderer = setup({ publication: records.imageDocument });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with generic document', () => {
        const renderer = setup({ publication: records.generic });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with manuscript', () => {
        const renderer = setup({ publication: records.manuscript });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with newspaper', () => {
        const renderer = setup({ publication: records.newspaperArticle });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with patent', () => {
        const renderer = setup({ publication: records.patent });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with preprint', () => {
        const renderer = setup({ publication: records.preprint });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with reference entry', () => {
        const renderer = setup({ publication: records.referenceEntry });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with research report', () => {
        const renderer = setup({ publication: records.researchReport });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with thesis', () => {
        const renderer = setup({ publication: records.thesis });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with working paper', () => {
        const renderer = setup({ publication: records.workingPaper });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with video document', () => {
        const renderer = setup({ publication: records.videoDocument });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with coverage period data mapped to DC.Subject tag', () => {
        const renderer = setup({
            publication: {
                rek_title: 'Record with coverage period',
                fez_record_search_key_coverage_period: [
                    {
                        rek_coverage_period_id: 1,
                        rek_coverage_period_pid: 'UQ:719166',
                        rek_coverage_period_xsdmf_id: 17292,
                        rek_coverage_period_order: 1,
                        rek_coverage_period:
                            'Original records were on paper (Photo, heat sensitive, 35mm) then digital',
                    },
                ],
            },
        });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with coverage period data mapped to multiple DC.Subject tag', () => {
        const renderer = setup({
            publication: {
                rek_title: 'Record with coverage period',
                fez_record_search_key_coverage_period: [
                    {
                        rek_coverage_period_id: 1,
                        rek_coverage_period_pid: 'UQ:719166',
                        rek_coverage_period_xsdmf_id: 17292,
                        rek_coverage_period_order: 1,
                        rek_coverage_period:
                            'Original records were on paper (Photo, heat sensitive, 35mm) then digital',
                    },
                    {
                        rek_coverage_period_id: 2,
                        rek_coverage_period_pid: 'UQ:719166',
                        rek_coverage_period_xsdmf_id: 17292,
                        rek_coverage_period_order: 2,
                        rek_coverage_period: 'Original records were on paper then digital',
                    },
                ],
            },
        });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render component with rek_date year mapped to citation_date exactly as it is', () => {
        const renderer = setup({
            publication: {
                rek_title: 'Record with only year in rek_date',
                rek_date: '1999',
            },
        });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render title only', () => {
        const renderer = setup({ location: { pathname: '/' } });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render description from rek_description if rek_formatted_abstract has an empty tag', () => {
        const publication = {
            rek_formatted_abstract: '<p></p>',
            rek_description: 'desc',
        };
        const renderer = setup({ publication });
        expect(renderer._instance.getMetaTagContent(publication, 'rek_description', null, null)).toEqual('desc');
    });

    it('should return rek_formatted_abstract correctly with escaped special characters', () => {
        const publication = {
            rek_formatted_abstract: '<p>This is some description in <strong>HTML</strong></p>',
            rek_description: '',
        };
        const expectedValue = '&lt;p&gt;This is some description in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';
        const renderer = setup({ publication });

        expect(renderer._instance.getMetaTagContent(publication, 'rek_description', null, null)).toEqual(expectedValue);
    });

    it('should return rek_title correctly with escaped special characters', () => {
        const publication = {
            rek_formatted_title: '<p></p>',
            rek_title: '<p>This is some title in <strong>HTML</strong></p>',
        };
        const expectedValue = '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';
        const renderer = setup({ publication });

        expect(renderer._instance.getMetaTagContent(publication, 'rek_title', null, null)).toEqual(expectedValue);
    });

    it('should return rek_formatted_title correctly escaped characters when rek_title has empty value', () => {
        const publication = {
            rek_formatted_title: '<p>This is some title in <strong>HTML</strong></p>',
            rek_title: '',
        };
        const expectedValue = '&lt;p&gt;This is some title in &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';
        const renderer = setup({ publication });

        expect(renderer._instance.getMetaTagContent(publication, 'rek_title', null, null)).toEqual(expectedValue);
    });

    it('should return meta tags correctly', () => {
        const publication = {
            rek_formatted_title: '<p>This is some title in <strong>HTML</strong></p>',
            rek_title: '',
            rek_description: 'This is test description',
            rek_formatted_abstract: '<p></p>',
        };
        const renderer = setup({ publication });
        expect(renderer._instance.getMetaTags(publication)).toEqual([
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
        const renderer = setup({ publication });
        expect(renderer._instance.getMetaTags(publication)).toEqual([
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
        const renderer = setup({ publication });
        expect(renderer._instance.getMetaTags(publication)).toEqual([
            { name: 'DC.Identifier', content: 'http://localhost/view/UQ:222222' },
            // {name: 'citation_pdf_url', content: 'http://localhost/view/UQ:222222/abc.pdf'},
            { name: 'DC.Date', content: '2015-01-01' },
            { name: 'citation_date', content: '2015/01/01' },
        ]);
    });
});
