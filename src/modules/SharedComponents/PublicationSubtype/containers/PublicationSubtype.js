import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PublicationSubtypeForm from '../components/PublicationSubtypeForm';

class PublicationSubtypeContainer extends Component {
    static propTypes = {
        list: PropTypes.array,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (<PublicationSubtypeForm onChange={ this.props.onChange } { ...this.props }/>);
    }
}

export default PublicationSubtypeContainer;
