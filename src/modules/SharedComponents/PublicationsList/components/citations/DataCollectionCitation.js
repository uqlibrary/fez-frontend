import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class DataCollectionCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            collectionType: this.props.publication.fez_record_search_key_ands_collection_type ?
                this.props.publication.fez_record_search_key_ands_collection_type.rek_ands_collection_type : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for DataCollection
        // {Creator name}{Publication Year| (|).}<i>{Dataset Title| |.}</i>{Publisher| |.} Collection Type. {doi| doi:|}

        return (
            <div className="citationContent citationDataCollection">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* {Creator} */}
                <Partials.AuthorsCitationView publication={this.props.publication} />

                {/* {Publication Year| (|).} */}
                <Partials.YearCitationView date={this.props.publication.rek_date} />

                {/* <i>{Dataset Title| |.}</i> */}
                <Partials.CitationView className="citationTitle" value={record.title} />

                {/* {Publisher| |.} */}
                <Partials.CitationView className="citationPublisher" value={record.publisher} />

                {/* {Collection Type| (|).} */}
                <Partials.CitationView className="citationCollectionType" value={record.collectionType} />

                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
