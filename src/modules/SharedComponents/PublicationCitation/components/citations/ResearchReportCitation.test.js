import ResearchReportCitation from './ResearchReportCitation';
import { researchReport } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ResearchReportCitation, props, args);
}

describe('ResearchReportCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: researchReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record 1', () => {
        const wrapper = setup({ publication: researchReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty series view', () => {
        const wrapper = setup({
            publication: {
                ...researchReport,
                fez_record_search_key_series: { rek_series: null },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
