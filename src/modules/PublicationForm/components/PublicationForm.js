import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import {FileUploader} from 'modules/SharedComponents';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {SelectField, StandardCard} from 'uqlibrary-react-toolbox';

import {locale} from 'config';

// import {createNewRecord, resetRecordState} from 'actions';
// TODO: refactor this:
// import {resetStepper} from '../../../AddRecord/actions';
// import {showDialogBox} from 'modules/App';

import {BookForm, JournalArticleForm } from './Forms';

export default class PublicationForm extends Component {

    static propTypes = {
        ...propTypes // all redux-form props
    }

    constructor(props) {
        super(props);
    }

    _getPublicationTypeForm = (publicationTypeId) => {
        switch(publicationTypeId) {
            case 179:
                return (<JournalArticleForm />);
            case 174:
                return (<BookForm />);
            default:
                return (<div/>);
        }
    };

    render() {
        const publicationTypeItems = locale.mapping.publicationTypes.map((item, index) => {
            return <MenuItem value={item.documentId} primaryText={item.name} key={index}/>;
        });
        const txt = locale.components.publicationForm;
        return (
            <form>
                <StandardCard title={txt.publicationType.title}  help={txt.publicationType.help}>
                    <Field component={SelectField}
                           name="rek_display_type"
                           fullWidth
                           floatingLabelText={txt.publicationType.inputLabelText}
                           floatingLabelFixed
                           hintText={txt.publicationType.inputLabelText}>
                        {publicationTypeItems}
                    </Field>
                </StandardCard>
                {
                    this._getPublicationTypeForm(this.props.formValues.get('rek_display_type'))
                }
                {
                    this.props.formValues.get('rek_display_type') > 0 &&
                    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                        <FileUploader/>
                    </StandardCard>
                }

                <div className="layout-card">
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop" style={{marginBottom: 24}}>
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                onTouchTap={() => { console.log('canceled clicked'); }} />
                        </div>
                        {this.props.formValues.get('rek_display_type') > 0 &&
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={txt.submit}
                                onTouchTap={this.props.handleSubmit}
                            />
                        </div>
                        }
                    </div>
                </div>
            </form>
        );
    }
}
