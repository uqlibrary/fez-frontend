import ThesisSubmission from './ThesisSubmission';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission test', () => {
    it('should render thesis submission form', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(12);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should display successfull submission screen', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
