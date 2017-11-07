import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';
import {validation} from 'config';
import {StandardCard} from 'uqlibrary-react-toolbox';
import {OrgUnitNameField, OrgNameField, JournalNameField, SeriesField, ReportNumberField} from 'modules/SharedComponents/AutoSuggestField';

export default class WorkingPaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <StandardCard title="Placeholder for working paper">
                    <Field
                        component={OrgUnitNameField}
                        name="testField"
                        floatingLabelText="School, Institute or Centre"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                    <Field
                        component={OrgNameField}
                        name="testField3"
                        floatingLabelText="Institute"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                    <Field
                        component={SeriesField}
                        name="testField4"
                        floatingLabelText="Series"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                    <Field
                        component={JournalNameField}
                        name="testField4"
                        floatingLabelText="Journal name"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                    <Field
                        component={ReportNumberField}
                        name="testField45"
                        floatingLabelText="Report number"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                </StandardCard>
            </div>
        );
    }
}
