import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, InlineLoader} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationForm} from 'modules/PublicationForm';

import {locale} from 'config';
import {searchPublications} from 'actions';

export default class AddRecord extends React.Component {

    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            stepperIndex: 0,
            searchQuery: ''
        };
    }

    componentWillUnmount() {
        this._cancelWorkflow();
    }

    _showNewRecordForm = () => {
        this.setState({
            stepperIndex: this.state.stepperIndex + 1
        });
    };

    _recordSaved = () => {
        // TODO: record has been saved... what to do?
        console.log('display a dialog box with options...');
        console.log(locale.pages.addRecord.confirmationDialog);

        // reset stepper to publications search form
        this.setState({
            stepperIndex: 0
        });
    };

    _cancelWorkflow = () => {
        this.setState({
            stepperIndex: 0,
            searchQuery: ''
        });
    };

    _claimPublication = (item) => {
        console.log('claim clicked... TODO: redirect to claim publication');
        console.log(item);
    }

    _performSearch = (values) => {
        this.props.dispatch(searchPublications(values.get('searchQuery')));

        this.setState({
            searchQuery: values.get('searchQuery'),
            stepperIndex: this.state.stepperIndex + 1
        });
    }

    renderSearchResultsStep() {
        const txt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: locale.claim,
                handleAction: this._claimPublication
            }
        ];
        return (
            <div>
                {this.props.loadingSearch &&
                    (<div className="is-centered">
                        {
                            // can be a nice component... search loading b
                        }
                        <span>{this.props.loadingPublicationSources ? this.props.loadingPublicationSources.totalSearchedCount : 0} out of 4 (WOS, Scopus, CrossRef, Pubmed)</span>
                        <div>
                            <span>WOS {this.props.loadingPublicationSources && this.props.loadingPublicationSources.wos ? 'done' : 'loading...'} </span>
                            <span>SCOPUS {this.props.loadingPublicationSources && this.props.loadingPublicationSources.scopus ? 'done' : 'loading...'} </span>
                            <span>PUBMED {this.props.loadingPublicationSources && this.props.loadingPublicationSources.pubmed ? 'done' : 'loading...'} </span>
                            <span>CROSSREF {this.props.loadingPublicationSources && this.props.loadingPublicationSources.crossref ? 'done' : 'loading...'} </span>
                        </div>
                        <InlineLoader message="Searching for your publications..." />
                    </div>)
                }

                {
                    (!this.props.loadingSearch || this.props.publicationsList.length > 0) &&
                    <StandardCard {...txt.searchResults}>
                        <div>{txt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length)}</div>
                        <PublicationsList publicationsList={this.props.publicationsList} actions={actions}/>
                    </StandardCard>
                }

                {!this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                    <StandardCard {...txt.noResultsFound} />
                }

                {!this.props.loadingSearch &&
                    <div className="layout-card">
                            <div className="columns">
                                <div className="column is-hidden-mobile"/>
                                <div className="column is-narrow-desktop">
                                <RaisedButton
                                    fullWidth
                                    label={txt.cancel}
                                    onTouchTap={this._cancelWorkflow}
                                />
                                </div>
                                <div className="column is-narrow-desktop">
                                <RaisedButton
                                    label={txt.submit}
                                    secondary
                                    fullWidth
                                    autoFocus={this.props.publicationsList.length === 0}
                                    keyboardFocused={this.props.publicationsList.length === 0}
                                    onTouchTap={this._showNewRecordForm}
                                />
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }

    render() {
        return (
            <StandardPage title={locale.pages.addRecord.title}>
                <div className="Stepper">
                    <Stepper activeStep={this.state.stepperIndex} style={{padding: '0', margin: '-10px auto' }}>
                        {
                            locale.pages.addRecord.stepper.map((step, index) => {
                                return (<Step key={index}>
                                    <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{step.label}</StepLabel>
                                </Step>);
                            })
                        }
                    </Stepper>
                </div>
                {
                    // TODO: remove all inline styles
                }
                <div style={{width: '100%', maxWidth: '1320px', margin: '0 auto'}}>
                    <div style={{margin: '0', overflow: 'hidden'}}>
                        {
                            this.state.stepperIndex === 0  &&
                            <PublicationSearchForm
                                locale={locale.pages.addRecord.step1}
                                onSubmit={this._performSearch} />
                        }
                        {
                            this.state.stepperIndex === 1 &&
                                this.renderSearchResultsStep() // TODO: should this be a separate component or it's ok like this?
                        }
                        {
                            this.state.stepperIndex === 2 &&
                            <PublicationForm
                                onFormSubmitSuccess={this._recordSaved}
                                onFormCancel={this._cancelWorkflow}
                                initialValues={{rek_title: this.state.searchQuery}} />
                        }

                    </div>
                </div>
            </StandardPage>
        );
    }
}
