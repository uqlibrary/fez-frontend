import PublicationForm from './PublicationForm';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        onFormCancel: testProps.onFormCancel || jest.fn(),
        onFormSubmitSuccess: testProps.onFormSubmitSuccess || jest.fn(),
        submitting: testProps.submitting || false,
        pristine: testProps.pristine || false,
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {push: jest.fn()
        }
    };
    return getElement(PublicationForm, props, isShallow);
}

describe('Component PublicationForm', () => {

    it('should render component initialised with just one field - publication type', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });

    it('should render component with JournalArticleForm', () => {
        const wrapper = setup({initialValues: {rek_display_type: 179}});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('JournalArticleForm').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {hasFilesComponent = hasFilesComponent || field.props().name === 'files';});
        expect(hasFilesComponent).toEqual(true);
    });

    it('should render component with BookForm', () => {
        const wrapper = setup({initialValues: {rek_display_type: 174}});
        expect(wrapper.find('BookForm').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with GenericDocument', () => {
        const wrapper = setup({initialValues: {rek_display_type: 202}});
        expect(wrapper.find('GenericDocumentForm').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with ResearchReportForm', () => {
        const wrapper = setup({initialValues: {rek_display_type: 275}});
        expect(wrapper.find('ResearchReportForm').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onFormSubmitSuccess method', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onFormSubmitSuccess: testMethod});
        wrapper.setProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

});
