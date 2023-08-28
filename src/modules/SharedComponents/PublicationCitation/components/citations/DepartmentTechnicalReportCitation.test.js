import React from 'react';
import { departmentTechnicalReport } from 'mock/data/testing/records';
import DepartmentTechnicalReportCitation from './DepartmentTechnicalReportCitation';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <DepartmentTechnicalReportCitation {...props} />
        </WithRouter>,
    );
}

describe('DepartmentTechnicalReportCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: departmentTechnicalReport });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view and report number', () => {
        const { container } = setup({
            publication: {
                ...departmentTechnicalReport,
                fez_record_search_key_doi: { rek_doi: null },
                fez_record_search_key_report_number: { rek_report_number: null },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
