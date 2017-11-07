import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';

import {StandardCard} from 'uqlibrary-react-toolbox';
import {OrgUnitsField, SeriesField, FieldOfResearchField} from 'modules/SharedComponents/AutoSuggestField';
import {ListEditorField} from 'modules/SharedComponents/ListEditor';

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
                        component={ListEditorField}
                        inputField={FieldOfResearchField}
                        hideReorder
                        maxCount={3}
                        name="forField"
                        disabled={this.props.submitting}

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
                    <FieldOfResearchField input={{onChange: (value) => { console.log(value); }}} selectedValue="ladjfljsdfljsdlfjlj" />

                    <Field
                        component={FieldOfResearchField}
                        name="singleForField"
                        disabled={this.props.submitting}
                        selectedValue="ladjfljsdfljsdlfjlj"
                    />

                </StandardCard>
            </div>
        );
    }
}
