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
        hideZeroDifferences: PropTypes.bool, // if there are zero differences in the trending count, hide citation
        missingText: PropTypes.string // text to display if no publications are found
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
        hideZeroDifferences: false,
        missingText: locale.components.publicationCitation.missing
    };

    constructor(props) {
        super(props);
    }

    render() {
        const publications = [];
        this.props.publicationsList.map((publication, index) => {
            if (!this.props.hideZeroDifferences || publication.metricData.difference > 0) {
                publications.push(
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
        });

        if (publications.length > 0) {
            return (
                <div className="publicationsList">
                    {publications}
                </div>
            );
        } else {
            return (
                <div>
                    {this.props.missingText}
                </div>
            );
        }
    }
}
