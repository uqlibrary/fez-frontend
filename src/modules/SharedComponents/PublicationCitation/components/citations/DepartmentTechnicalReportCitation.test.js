import { departmentTechnicalReport } from '../../../../../mock/data/testing/records';
import DepartmentTechnicalReportCitation from './DepartmentTechnicalReportCitation';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(DepartmentTechnicalReportCitation, props, args);
}

describe('DepartmentTechnicalReportCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: departmentTechnicalReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view and report number', () => {
        const wrapper = setup({
            publication: {
                ...departmentTechnicalReport,
                fez_record_search_key_doi: { rek_doi: null },
                fez_record_search_key_report_number: { rek_report_number: null },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
