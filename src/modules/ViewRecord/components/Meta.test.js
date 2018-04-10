import * as records from 'mock/data/testing/records';
import Meta from "./Meta";

function setup(testProps, isShallow = true){
    const props = {
        publication: testProps.publication || {},
    };
    return getElement(Meta, props, isShallow);
}


describe('Meta Component ', () => {
    it('should not render component with empty publication', () => {
        const wrapper = setup({publication: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with journal', () => {
        const wrapper = setup({publication: records.journal});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with data collection', () => {
        const wrapper = setup({publication: records.dataCollection});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with audio document', () => {
        const wrapper = setup({publication: records.audioDocument});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with book', () => {
        const wrapper = setup({publication: records.book});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with book chapter', () => {
        const wrapper = setup({publication: records.bookChapter});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with conference paper', () => {
        const wrapper = setup({publication: records.conferencePaper});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with conference proceedings', () => {
        const wrapper = setup({publication: records.conferenceProceedings});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with creative work', () => {
        const wrapper = setup({publication: records.creativeWork});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with design document', () => {
        const wrapper = setup({publication: records.design});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with digilib image', () => {
        const wrapper = setup({publication: records.digilibImage});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const wrapper = setup({publication: records.imageDocument});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with generic document', () => {
        const wrapper = setup({publication: records.generic});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with manuscript', () => {
        const wrapper = setup({publication: records.manuscript});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with newspaper', () => {
        const wrapper = setup({publication: records.newspaper});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with patent', () => {
        const wrapper = setup({publication: records.patent});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with preprint', () => {
        const wrapper = setup({publication: records.preprint});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with reference entry', () => {
        const wrapper = setup({publication: records.referenceEntry});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with research report', () => {
        const wrapper = setup({publication: records.researchReport});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with thesis', () => {
        const wrapper = setup({publication: records.thesis});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with working paper', () => {
        const wrapper = setup({publication: records.workingPaper});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with video document', () => {
        const wrapper = setup({publication: records.videoDocument});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with coverage period data mapped to DC.Subject tag', () => {
        const wrapper = setup({publication: {
            rek_title: 'Record with coverage period',
            fez_record_search_key_coverage_period: [
                {
                    rek_coverage_period_id: 1,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 1,
                    rek_coverage_period: 'Original records were on paper (Photo, heat sensitive, 35mm) then digital'
                }
            ]
        }});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with coverage period data mapped to multiple DC.Subject tag', () => {
        const wrapper = setup({publication: {
            rek_title: 'Record with coverage period',
            fez_record_search_key_coverage_period: [
                {
                    rek_coverage_period_id: 1,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 1,
                    rek_coverage_period: 'Original records were on paper (Photo, heat sensitive, 35mm) then digital'
                },
                {
                    rek_coverage_period_id: 2,
                    rek_coverage_period_pid: 'UQ:719166',
                    rek_coverage_period_xsdmf_id: 17292,
                    rek_coverage_period_order: 2,
                    rek_coverage_period: 'Original records were on paper then digital'
                }
            ]
        }});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with rek_date year mapped to citation_date exactly as it is', () => {
        const wrapper = setup({publication: {
            rek_title: 'Record with only year in rek_date',
            rek_date: '1999'
        }});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});