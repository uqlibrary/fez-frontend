jest.dontMock('./PublicationForm');

import {shallow, mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationForm from './PublicationForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';

function setup({submitting, vocabId, initialValues, pristine, onFormCancel, onFormSubmitSuccess, isShallow = true}) {

    const props = {
        formValues: initialValues ? Immutable.Map(initialValues) : Immutable.Map({}),
        onFormCancel: onFormCancel || jest.fn(),
        onFormSubmitSuccess: onFormSubmitSuccess || jest.fn(),
        submitting: submitting || false, // : PropTypes.bool
        pristine: pristine || false, // : PropTypes.bool
    };

    if (isShallow) {
        return shallow(<PublicationForm {...props} />);
    }

    return mount(<PublicationForm {...props} />, {
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

describe('PublicationForm test', () => {
    it('should render component initialised with just one field - publication type', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });

    it('should render component with JournalArticleForm', () => {
        const wrapper = setup({initialValues: {rek_display_type: 179}});

        expect(wrapper.find('JournalArticleForm').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(2);

        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });

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
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should call  onFormSubmitSuccess method', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onFormSubmitSuccess: testMethod});
        wrapper.setProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });
});
