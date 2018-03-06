import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import ViewRecordLinks from './ViewRecordLinks';

import {locale} from 'locale';

export default class ViewRecord extends Component {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
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
        const record = this.props.recordToView;
        if(this.props.loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }

        if(this.props.recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={this.props.recordToViewError} />
                </StandardPage>
            );
        }
        return (
            <StandardPage className="viewRecord" title={record && record.rek_title}>
                <PublicationCitation publication={record} hideTitle />
                {
                    record && (
                        (record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0) ||
                        (record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi) ||
                        (record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id)) &&
                        <ViewRecordLinks {...this.props} />
                }
                <StandardCard title={'Files'} />
                <StandardCard title={'Additional information'} />
            </StandardPage>
        );
    }
}
