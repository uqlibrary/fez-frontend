import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';

import {locale} from 'locale';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';

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
            <StandardPage className="viewRecord" title={this.props.recordToView && this.props.recordToView.rek_title}>
                <PublicationCitation publication={this.props.recordToView} hideTitle />
                <StandardCard title={'Links'}>
                    Include PubmedCentral link if available: <PubmedCentralLink pubmedCentralId={'PMC123232'} />
                </StandardCard>
                <StandardCard title={'Files'} />
                {
                    this.props.recordToView && (this.props.recordToView.rek_formatted_abstract || this.props.recordToView.rek_description) &&
                    <StandardCard title={locale.viewRecord.sections.abstract}>
                        <p dangerouslySetInnerHTML={{__html: this.props.recordToView.rek_formatted_abstract || this.props.recordToView.rek_description}} />
                    </StandardCard>
                }
                {
                    this.props.recordToView && this.props.recordToView.rek_display_type_lookup &&
                    <AdditionalInformation publication={this.props.recordToView} />
                }
                {
                    this.props.recordToView && this.props.recordToView.rek_display_type_lookup &&
                    <PublicationDetails publication={this.props.recordToView} />
                }
            </StandardPage>
        );
    }
}
