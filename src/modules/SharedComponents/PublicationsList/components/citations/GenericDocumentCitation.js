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
            publisher: this.props.publication.fez_record_search_key_publisher ? this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            title: this.props.publication.rek_title,
        };
        console.log('id          : ' + genericDocument.id);
        console.log('title       : ' + genericDocument.title);
        console.log('contributor : ' + genericDocument.contributor);
        console.log('publisher   : ' + genericDocument.publisher);

        // eSpace citation view for Generic article
        // {7630}{7660| (|)}. {7623}. {7638|Edited by |. }{7658||.}
        // Author (Date). Title. Edited by <span class="citation_contributor">Editor</span>. <span class="citation_publisher">Publisher</span>.

        return (
            <div className="citationContent citationGenericDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>
                <AuthorsCitationView publication={this.props.publication} /> <YearCitationView publication={this.props.publication} />
                <span className="citationTitle"> {genericDocument.title}.</span>
                <AuthorsCitationView
                    className="citationContributors"
                    prefix=" Edited by "
                    suffix="."
                    publication={this.props.publication}
                    searchKey={{key: 'fez_record_search_key_contributor', order: 'rek_contributor_order', subkey: 'rek_contributor'}}
                />
                {
                    genericDocument.publisher &&
                    <span className="citationPublisher"> {genericDocument.publisher}.</span>
                }
            </div>
        );
    }
}
