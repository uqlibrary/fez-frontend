import React from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationForm} from 'modules/SharedComponents/PublicationForm';
import {locale, validation, routes} from 'config';

export default class NewRecord extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        rawSearchQuery: PropTypes.string
    };

    static defaultProps = {
        rawSearchQuery: ''
    };

    constructor(props) {
        super(props);
    }

    _recordSaved = () => {
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
        this.props.history.push(routes.pathConfig.records.add.find);
    };

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    }

    render() {
        const txt = locale.pages.addRecord;
        const {rawSearchQuery} = this.props;

        // set initial value only if it's a title (not pubmed/DOI)
        const initialValues = {
            rek_title: (!validation.isValidDOIValue(rawSearchQuery) && !validation.isValidPubMedValue(rawSearchQuery)) ? rawSearchQuery : ''
        };

        return (
            <div>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToMyResearch}
                    onCancelAction={this._restartWorkflow}
                    locale={txt.successWorkflowConfirmation}
                />
                <PublicationForm
                    onFormSubmitSuccess={this._recordSaved}
                    onFormCancel={this._restartWorkflow}
                    initialValues={initialValues}
                />
            </div>
        );
    }
}
