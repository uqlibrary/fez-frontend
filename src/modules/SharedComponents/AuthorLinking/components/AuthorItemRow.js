import React from 'react';
import PropTypes from 'prop-types';

export default class AuthorItem extends React.Component {
    static propTypes = {
        items: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="columns is-multiline is-gapless">
                {this.props.items}
            </div>
        );
    }
}
