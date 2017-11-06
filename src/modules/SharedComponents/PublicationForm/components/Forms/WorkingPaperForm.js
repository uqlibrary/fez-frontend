import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {StandardCard} from 'uqlibrary-react-toolbox';
import {OrgUnitsField, SeriesField, FieldOfResearchField} from 'modules/SharedComponents/AutoSuggestField';

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
                        component={FieldOfResearchField}
                        name="fez_record_search_key_subject"
                        disabled={this.props.submitting}

                    />
                    <Field
                        component={OrgUnitsField}
                        name="testField"
                        disabled={this.props.submitting}

                    />
                    <Field
                        component={SeriesField}
                        name="testField2"
                        disabled={this.props.submitting}

                    />
                </StandardCard>
            </div>
        );
    }
}
