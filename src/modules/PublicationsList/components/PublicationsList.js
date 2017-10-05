import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PublicationCitation from './PublicationCitation';

export default class PublicationsList extends Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListSubset: PropTypes.array,
        subsetCustomActions: PropTypes.array,
        customActions: PropTypes.array,
        showDefaultActions: PropTypes.bool
    };

    static defaultProps = {
        publicationsListSubset: [],
        subsetCustomActions: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.publicationsListSubset);
        const publications = this.props.publicationsList.map((publication, index) => {
            return (
                <PublicationCitation
                    key={index + 1}
                    publication={publication}
                    customActions={!publication.rek_pid || this.props.publicationsListSubset.indexOf(publication.rek_pid) === -1 ? this.props.customActions : this.props.subsetCustomActions}
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
