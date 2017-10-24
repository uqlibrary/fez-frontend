import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class GenericDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const genericDocument = {
            id: this.props.publication.rek_pid,
            contributor: this.props.publication.fez_record_search_key_contributor,
            publisher: this.props.publication.fez_record_search_key_publisher,
            title: this.props.publication.rek_title,
        };

        // eSpace citation view for Generic article
        // {7630}{7660| (|)}. {7623}. {7638|Edited by |. }{7658||.}
        // Author (Date). Title. Edited by <span class="citation_contributor">Editor</span>. <span class="citation_publisher">Publisher</span>.

        return (
            <div className="citationContent citationGenericDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>
                <AuthorsCitationView publication={this.props.publication} /> <YearCitationView publication={this.props.publication} />.
                {
                    genericDocument.contributor &&
                    <span className="citationTitle"> Edited by {genericDocument.contributor}.</span>
                }
                {
                    genericDocument.publisher &&
                    <span className="citationTitle"> {genericDocument.publisher}.</span>
                }
            </div>
        );
    }
}
