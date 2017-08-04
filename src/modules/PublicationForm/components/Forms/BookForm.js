import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';

import {TextField, StandardCard} from 'uqlibrary-react-toolbox';
import {ContributorsEditorField, PublicationSubtypeField} from 'modules/SharedComponents';
import {validation, locale} from 'config';
import PropTypes from 'prop-types';

export default class BookForm extends Component {

    static propTypes = {
        vocabId: PropTypes.number
    }

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.components.publicationForm.book;
        return (
            <div>
                <StandardCard title={txt.information.title} help={txt.information.help}>
                    <div className="columns" style={{marginTop: '-12px'}}>
                        <div className="column">
                            <Field component={TextField}
                                   autoFocus
                                   name="rek_title"
                                   type="text"
                                   fullWidth
                                   multiLine
                                   rows={1}
                                   floatingLabelText={txt.information.fieldLabels.bookTitle}
                                   validate={[validation.required]}
                                   style={{marginBottom: '-12px'}}
                            />
                        </div>
                    </div>

                    <Field name="rek_subtype"
                           locale={{label: 'Book publication subtype'}}
                           component={ PublicationSubtypeField }
                           vocabId={ this.props.vocabId }
                           className="requiredField"
                           validate={[validation.required]}
                           selectedValue={'Creative work'}
                    />

                </StandardCard>

                <StandardCard title={txt.authors.title} help={txt.authors.help}>
                    <Field component={ContributorsEditorField} name="authors" locale={{contributorSuffix: txt.authors.suffix}}/>
                </StandardCard>

                <StandardCard title={txt.editors.title} help={txt.editors.help}>
                    <Field component={ContributorsEditorField} name="editors" locale={{contributorSuffix: txt.editors.suffix}}/>
                </StandardCard>

            </div>
        );
    }
}
