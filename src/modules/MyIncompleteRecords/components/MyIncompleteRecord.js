import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import locale from 'locale/pages';
import ReactHtmlParser from 'react-html-parser';
import Grid from '@material-ui/core/Grid';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import JSONPretty from 'react-json-pretty';
import Button from '@material-ui/core/Button';
import {Field, propTypes} from 'redux-form/immutable';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';

export default class MyIncompleteRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        account: PropTypes.object
    };

    componentDidMount() {
        if (this.props.actions.loadRecordToView && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.pid !== newProps.match.params.pid) {
            this.props.actions.loadRecordToView(newProps.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        /* istanbul ignore else */
        if (this.props.actions.clearRecordToView) {
            this.props.actions.clearRecordToView();
        }
    }

    _handleDefaultSubmit = (event) => {
        /* istanbul ignore else */
        if(event) {
            event.preventDefault();
        }
    };

    render() {
        console.log('SUBMITTIUNING: ', this.props.submitting);
        console.log('INITIAL VALUES: ', this.props.initialValues);
        console.log('FORM VALUES: ', this.props.formValues.toJS());
        const txt = locale.pages.incompletePublication;
        const {loadingRecordToView, recordToViewError, recordToView} = this.props;
        if(loadingRecordToView) {
            return <InlineLoader message={txt.loadingMessage}/>;
        } else if(recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        } else if(!recordToView) {
            return <div className="empty"/>;
        }
        return (
            <form onSubmit={this._handleDefaultSubmit}>
                <StandardPage className="viewRecord" title={ReactHtmlParser(recordToView.rek_title)}>
                    <Grid container style={{marginTop: -24}}>
                        <Grid item xs={12}>
                            <PublicationCitation publication={recordToView} hideTitle />
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs>
                            <StandardCard title={`Loaded values for ${recordToView.rek_pid}`}>
                                <div style={{height: 300, overflow: 'scroll'}}>
                                    <JSONPretty data={this.props.initialValues} />
                                </div>
                            </StandardCard>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs>
                            <Field
                                component={TextField}
                                // disabled={this.props.submitting}
                                name="rek_title"
                                type="text"
                                fullWidth
                                label={'Title test'}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs />
                        <Grid item xs={12} sm="auto">
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={txt.submitButtonLabel}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </Grid>
                    </Grid>
                </StandardPage>
            </form>
        );
    }
}
