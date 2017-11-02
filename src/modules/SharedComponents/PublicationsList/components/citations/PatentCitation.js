import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class PatentCitation extends Component {
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
            patentNumber: this.props.publication.fez_record_search_key_patent_number ?
                this.props.publication.fez_record_search_key_patent_number.rek_patent_number : null,
        };

        // eSpace citation view for Patent
        // {Creator}{Date of issue| (|).|y}<i>{Patent title| |.}</i>{Patent number| |.}
        return (
            <div className="citationContent citationPatent">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* {Creator} */}
                <Partials.AuthorsCitationView publication={this.props.publication} />

                {/* {Date of issue| (|).|y} */}
                <Partials.YearCitationView date={this.props.publication.rek_date} />

                {/* {Title of patent} */}
                <Partials.CitationView className="citationPatentTitle" value={record.title} prefix=" " suffix="." />

                {/* {Patent number| |.}*/}
                <Partials.CitationView className="citationPatentNumber" value={record.patentNumber} prefix=" " suffix="."/>
            </div>
        );
    }
}
