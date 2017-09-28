import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import {StandardPage, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationForm} from 'modules/PublicationForm';

import {locale} from 'config';


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

export class AddNewPublication extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,
        stepperIndex: PropTypes.number,
        initialValues: PropTypes.object
    };

    static defaultProps = {
        stepperIndex: 2
    };

    constructor(props) {
        super(props);
    }

    _recordSaved = () => {
        // reset stepper to publications search form
        this.props.history.push('/records/add/find');

        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _cancelWorkflow = () => {
        this.props.history.push('/records/add/find');
    };

    _claimPublication = (item) => {
        this.props.actions.setClaimPublication(item);
        this.props.history.push('/claim-publication-form');
    };

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToDashboard}
                    locale={txt.confirmationDialog}/>

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
                        <PublicationForm
                            onFormSubmitSuccess={this._recordSaved}
                            onFormCancel={this._cancelWorkflow}
                            initialValues={this.props.initialValues}/>
                    }
                </div>
            </StandardPage>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        ...state.get('searchRecordsReducer')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const AddNewPublicationContainer = connect(mapStateToProps, mapDispatchToProps)(AddNewPublication);
export default withRouter(AddNewPublicationContainer);
