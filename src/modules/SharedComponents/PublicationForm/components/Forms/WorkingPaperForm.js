import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {StandardCard} from 'uqlibrary-react-toolbox';
import {OrgUnitsField, SeriesField, FieldOfResearchField} from 'modules/SharedComponents/AutoSuggestField';
import {ListEditorField, LookupListEditorField} from 'modules/SharedComponents/ListEditor';
import {validation, locale} from 'config';

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
                        className="requiredField"
                        component={LookupListEditorField}
                        inputField={FieldOfResearchField}
                        hideReorder
                        distinctOnly
                        maxCount={3}
                        name="forField"
                        disabled={this.props.submitting}
                        validate={[validation.requiredList]}
                    />
                    <Field
                        component={OrgUnitsField}
                        name="OrgUnitsField"
                        disabled={this.props.submitting}

                    />
                    <Field
                        component={SeriesField}
                        name="testField2"
                        disabled={this.props.submitting}
                    />
                    <FieldOfResearchField input={{onChange: (value) => { console.log(value); }}} />

                    <Field
                        component={ListEditorField}
                        name="fez_record_search_key_isbn"
                        isValid={validation.isValidIssn}
                        validate={[validation.requiredList]}
                        maxCount={5}
                        searchKey={{value: 'rek_isbn', order: 'rek_isbn_order'}}
                        locale={locale.components.isbnForm.field}
                        disabled={this.props.submitting} />

                    <Field
                        className="requiredField"
                        component={FieldOfResearchField}
                        name="singleForField"
                        disabled={this.props.submitting}
                    />

                </StandardCard>
            </div>
        );
    }
}
