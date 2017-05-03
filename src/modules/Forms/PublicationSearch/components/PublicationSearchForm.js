import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {isDOIValue, isPubMedValue} from '../validator';

import './PublicationSearchForm.scss';

export default class PublicationSearchForm extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        explanationText: PropTypes.string.isRequired,
        defaultSearchFieldLabel: PropTypes.string,
        defaultButtonLabel: PropTypes.string,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadDoiResultsList: PropTypes.func,
        loadPubmedResultsList: PropTypes.func,
        loadTitleResultsList: PropTypes.func,
        formValues: PropTypes.object,
        help: PropTypes.object
    };

    static defaultProps = {
        defaultSearchFieldLabel: 'Search for publication',
        defaultButtonLabel: 'Search',
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            buttonLabel: this.props.defaultButtonLabel
        };
    }

    updateButtonLabel = (event) => {
        let label = ' Search';
        const fieldValue = event.target.value;
        if (fieldValue) {
            label = 'Title Search';

            if (isDOIValue(fieldValue)) {
                label = 'Doi Search';
            } else if (isPubMedValue(fieldValue)) {
                label = 'Pubmed Id Search';
            }
        }

        this.setState({buttonLabel: label});
    };

    performSearch = () => {
        const { formValues } = this.props;
        const fieldValue = formValues.get('doiSearch');

        if (isDOIValue(fieldValue)) {
            this.props.loadDoiResultsList(fieldValue);
        } else if (isPubMedValue(fieldValue)) {
            this.props.loadPubmedResultsList(fieldValue);
        } else {
            this.props.loadTitleResultsList(179, fieldValue);
        }
    };

    render() {
        const {pristine, handleSubmit, title, help} = this.props;
        return (
            <form ref="publicationSearchForm" onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{title ? title : 'This is the card title'}</h2>
                            </div>
                            <div className="column">
                                {help && (
                                    <HelpIcon
                                        title={help.title}
                                        text={help.text}
                                        buttonLabel={help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <br />
                        <div>{this.props.explanationText}</div>
                        <Field component={TextField}
                               name="doiSearch"
                               fullWidth
                               floatingLabelText={this.props.defaultSearchFieldLabel}
                               onChange={this.updateButtonLabel}
                               autoComplete="off"
                        />
                        <div style={{textAlign: 'right', marginTop: '20px'}}>
                            <RaisedButton
                                label={this.state.buttonLabel}
                                secondary
                                onTouchTap={this.performSearch}
                                type="submit"
                                disabled={pristine}
                            />
                        </div>
                    </CardText>
                </Card>
            </form>
        );
    }
}
