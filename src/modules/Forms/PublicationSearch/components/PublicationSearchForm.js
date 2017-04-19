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
        helpTitle: PropTypes.string.isRequired,
        helpText: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        explanationText: PropTypes.string.isRequired,
        defaultSearchFieldLabel: PropTypes.string.isRequired,
        defaultButtonLabel: PropTypes.string.isRequired,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        doiSearch: PropTypes.func,
        pubMedSearch: PropTypes.func,
        titleSearch: PropTypes.func,
        formValues: PropTypes.object
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
                label = 'DOI Search';
            } else if (isPubMedValue(fieldValue)) {
                label = 'Pubmed ID Search';
            }
        }

        this.setState({buttonLabel: label});
    };

    performSearch = () => {
        const { formValues } = this.props;
        const fieldValue = formValues.get('doiSearch');

        if (isDOIValue(fieldValue)) {
            this.props.doiSearch(fieldValue);
        } else if (isPubMedValue(fieldValue)) {
            this.props.pubMedSearch(fieldValue);
        } else {
            this.props.titleSearch(179, fieldValue);
        }
    };

    render() {
        const {pristine, handleSubmit} = this.props;
        return (
            <form ref="publicationSearchForm" onSubmit={handleSubmit}>
                <div>
                    <Card className="layout-card">
                        <CardHeader>
                            <div className="row">
                                <div className="flex-100">
                                    <h2 className="headline">{this.props.title}</h2>
                                </div>
                                <div className="flex">
                                    <HelpIcon
                                        text={this.props.helpText}
                                        title={this.props.helpTitle} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardText className="body-1">
                            <p>{this.props.explanationText}</p>
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
                </div>
            </form>
        );
    }
}
