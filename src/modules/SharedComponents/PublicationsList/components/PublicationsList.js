import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';

export default class PublicationsList extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListSubset: PropTypes.array,
        subsetCustomActions: PropTypes.array,
        customActions: PropTypes.array,
        showAdminActions: PropTypes.bool,
        showDefaultActions: PropTypes.bool,
        showSources: PropTypes.bool,
        showMetrics: PropTypes.bool,
        showSourceCountIcon: PropTypes.bool,
        showUnpublishedBufferFields: PropTypes.bool,
        hideCountDiff: PropTypes.bool,
        hideCountTotal: PropTypes.bool,
        publicationsLoading: PropTypes.bool,
    };

    static defaultProps = {
        publicationsListSubset: [],
        subsetCustomActions: [],
        showAdminActions: false,
        showSources: false,
        showDefaultActions: false,
        showSourceCountIcon: false,
        showMetrics: false,
        showUnpublishedBufferFields: false,
        hideCountDiff: false,
    };

    renderPublicationCitation(index, publication) {
        return (
            <PublicationCitation
                publicationsLoading={this.props.publicationsLoading}
                key={index + publication.rek_title + publication.rek_date}
                publication={publication}
                customActions={
                    !publication.rek_pid || this.props.publicationsListSubset.indexOf(publication.rek_pid) === -1
                        ? this.props.customActions
                        : this.props.subsetCustomActions
                }
                showSources={this.props.showSources}
                showAdminActions={!!this.props.showAdminActions}
                showDefaultActions={this.props.showDefaultActions}
                showMetrics={this.props.showMetrics}
                showSourceCountIcon={this.props.showSourceCountIcon}
                showUnpublishedBufferFields={this.props.showUnpublishedBufferFields}
                hideCountDiff={this.props.hideCountDiff}
                hideCountTotal={this.props.hideCountTotal}
                citationStyle="list"
            />
        );
    }

    render() {
        const publications = this.props.publicationsList.map((publication, index) => {
            return this.renderPublicationCitation(index, publication);
        });

        return <React.Fragment>{publications}</React.Fragment>;
    }
}
