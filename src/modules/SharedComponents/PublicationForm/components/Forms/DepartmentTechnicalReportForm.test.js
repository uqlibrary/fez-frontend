jest.dontMock('./DepartmentTechnicalReportForm');

import DepartmentTechnicalReportForm from './DepartmentTechnicalReportForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(DepartmentTechnicalReportForm, props);
}

describe('DepartmentTechnicalReportForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(11);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });
});
