import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class PreprintCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title
        };

        // eSpace citation view for Preprint
        // {Author}{Year| (|).}<i>{Title| |.}</i>
        return (
            <div className="citationContent citationPreprint">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* {Author}*/}
                <Partials.AuthorsCitationView publication={this.props.publication} />

                {/* {Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* <i>{Title| |.}</i> */}
                <Partials.CitationView className="citationTitle" value={record.title} />
            </div>
        );
    }
}
