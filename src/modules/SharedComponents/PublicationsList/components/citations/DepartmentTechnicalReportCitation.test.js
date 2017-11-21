import {departmentTechnicalReport} from "../../../../../mock/data/testing/records";

jest.dontMock('./DepartmentTechnicalReportCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DepartmentTechnicalReportCitation from './DepartmentTechnicalReportCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {journalArticle} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<DepartmentTechnicalReportCitation {...props} />);
    }

    return mount(<DepartmentTechnicalReportCitation {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('DepartmentTechnicalReportCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
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
                fez_record_search_key_doi: {rek_doi: null},
                fez_record_search_key_report_number: {rek_report_number: null}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
