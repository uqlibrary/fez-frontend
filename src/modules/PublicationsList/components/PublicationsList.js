import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PublicationCitation from './PublicationCitation';

export default class PublicationsList extends Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        excludePublicationsList: PropTypes.array,
        customActions: PropTypes.array,
        showDefaultActions: PropTypes.bool
    };

    static defaultProps = {
        excludePublicationsList: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        const publications = this.props.publicationsList.map((publication, index) => {
            return (
                <PublicationCitation
                    key={index + 1}
                    publication={publication}
                    customActions={this.props.excludePublicationsList.indexOf(publication.rek_pid) === -1 ? this.props.customActions : []}
                    className={this.props.excludePublicationsList.indexOf(publication.rek_pid) > -1 ? 'highlight' : ''}
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
