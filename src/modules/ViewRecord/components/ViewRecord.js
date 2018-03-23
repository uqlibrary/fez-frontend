import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {locale} from 'locale';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';
import GrantInformation from './GrantInformation';
import {AddThis} from 'modules/SharedComponents/AddThis';

export default class ViewRecord extends Component {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        showAddThis: PropTypes.bool
    };

    static defaultProps = {
        showAddThis: true
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    render() {
        const txt = locale.pages.viewRecord;
        const {loadingRecordToView, recordToViewError, recordToView} = this.props;

        if(loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }

        if(recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        }

        return (
            <StandardPage className="viewRecord" title={recordToView && recordToView.rek_title}>
                <PublicationCitation publication={recordToView} hideTitle />

                <AddThis show={this.props.showAddThis} />

                {
                    recordToView && recordToView.rek_display_type_lookup &&
                    <AdditionalInformation publication={recordToView} />
                }
                {
                    recordToView && recordToView.fez_record_search_key_grant_agency && recordToView.fez_record_search_key_grant_agency.length > 0 &&
                    <GrantInformation publication={recordToView} />
                }
                {
                    recordToView && recordToView.rek_display_type_lookup &&
                    <PublicationDetails publication={recordToView} />
                }
            </StandardPage>
        );
    }
}
