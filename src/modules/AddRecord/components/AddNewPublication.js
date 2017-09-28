import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

// forms & custom components
import AddRecordStepper from './AddRecordStepper';
import {PublicationForm} from 'modules/PublicationForm';

import {locale} from 'config';

export default class AddNewPublication extends React.Component {
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
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
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
                    onCancelAction={this._restartWorkflow}
                    locale={txt.confirmationDialog}/>

                <AddRecordStepper activeStep={this.props.stepperIndex} txt={txt} />
                <div>
                    {
                        <PublicationForm
                            onFormSubmitSuccess={this._recordSaved}
                            onFormCancel={this._restartWorkflow}
                            initialValues={this.props.initialValues}/>
                    }
                </div>
            </StandardPage>
        );
    }
}
