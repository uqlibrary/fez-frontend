import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PublicationCitation from './PublicationCitation';

export default class PublicationsList extends Component {

    static propTypes = {
        publicationsList: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        const publications = this.props.publicationsList.map((publication, index) => {
            return (<PublicationCitation key={index} publication={publication} />);
        });

        return (
            <div className="publicationsList">
                {publications}
            </div>
        );
    }
}
