import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import {StandardPage} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';

import {locale, validation} from 'config';

export class PublicationSearchRecord extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
        stepperIndex: PropTypes.number
    };

    static defaultProps = {
        stepperIndex: 0
    };

    constructor(props) {
        super(props);

        this.state = {
            initialValues: {}
        };
    }

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));

        this.setState({
            initialValues: {
                // set initial value only if it's a title (not pubmed/DOI)
                rek_title: (!validation.isValidDOIValue(values.get('searchQuery')) && !validation.isValidPubMedValue(values.get('searchQuery'))) ? values.get('searchQuery') : ''
            }
        });

        this.props.history.push('/records/add/results');
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <div className="Stepper">
                    <Stepper activeStep={this.props.stepperIndex} style={{padding: '0', margin: '-10px auto'}}>
                        {
                            txt.stepper.map((step, index) => {
                                return (<Step key={index}>
                                    <StepLabel
                                        style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{step.label}</StepLabel>
                                </Step>);
                            })
                        }
                    </Stepper>
                </div>
                <div>
                    {
                        <PublicationSearchForm
                            locale={txt.step1}
                            onSubmit={this._performSearch}/>
                    }
                </div>
            </StandardPage>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const PublicationSearchRecordContainer = connect(() => ({}), mapDispatchToProps)(PublicationSearchRecord);
export default withRouter(PublicationSearchRecordContainer);
