import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';

export default class PublicationsList extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListSubset: PropTypes.array,
        subsetCustomActions: PropTypes.array,
        customActions: PropTypes.array,
        showDefaultActions: PropTypes.bool,
        showSources: PropTypes.bool
    };

    static defaultProps = {
        publicationsListSubset: [],
        subsetCustomActions: [],
        showSources: false,
        showDefaultActions: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        const publications = this.props.publicationsList.map((publication, index) => {
            return (
                <PublicationCitation
                    linkTitle
                    key={index + 1}
                    publication={publication}
                    customActions={!publication.rek_pid || this.props.publicationsListSubset.indexOf(publication.rek_pid) === -1 ? this.props.customActions : this.props.subsetCustomActions}
                    showSources={this.props.showSources}
                    showDefaultActions={this.props.showDefaultActions} />
            );
        });

        return (
            <div className="publicationsList">
                {publications}
            </div>
        );
    }
}
