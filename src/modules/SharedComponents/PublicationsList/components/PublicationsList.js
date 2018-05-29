import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {locale} from 'locale';

export default class PublicationsList extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListSubset: PropTypes.array,
        subsetCustomActions: PropTypes.array,
        customActions: PropTypes.array,
        showDefaultActions: PropTypes.bool,
        showSources: PropTypes.bool,
        showMetrics: PropTypes.bool,
        showSourceCountIcon: PropTypes.bool,
        hideCitationContent: PropTypes.bool,
        hideCountDiff: PropTypes.bool,
        missingText: PropTypes.string
    };

    static defaultProps = {
        publicationsListSubset: [],
        subsetCustomActions: [],
        showSources: false,
        showDefaultActions: false,
        showSourceCountIcon: false,
        showMetrics: false,
        hideCitationContent: false,
        hideCountDiff: false,
        missingText: locale.components.publicationCitation.missing
    };

    constructor(props) {
        super(props);
    }

    renderPublicationCitation(index, publication) {
        return (
            <PublicationCitation
                key={index + 1}
                publication={publication}
                customActions={!publication.rek_pid || this.props.publicationsListSubset.indexOf(publication.rek_pid) === -1 ? this.props.customActions : this.props.subsetCustomActions}
                showSources={this.props.showSources}
                showDefaultActions={this.props.showDefaultActions}
                showMetrics={this.props.showMetrics}
                hideCitationContent={this.props.hideCitationContent}
                showSourceCountIcon={this.props.showSourceCountIcon}
                hideCountDiff={this.props.hideCountDiff}
            />
        );
    }

    render() {
        const publications = this.props.publicationsList.map((publication, index) => {
            return this.renderPublicationCitation(index, publication);
        });


        if (publications.length < 1) {
            return (
                <div>
                    {this.props.missingText}
                </div>
            );
        }

        return (
            <div className="publicationsList">
                {publications}
            </div>
        );
    }
}
