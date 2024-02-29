import { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigate } from 'helpers/withNavigate';

export class ScrollToTop extends Component {
    static propTypes = {
        children: PropTypes.any,
        location: PropTypes.object,
    };

    componentDidUpdate(prevProps) {
        const element = document.getElementById('content-container');
        if (
            this.props.location?.state?.scrollToTop !== false &&
            this.props.location !== prevProps.location &&
            element
        ) {
            element.scrollTop = 0;
        }
    }

    render() {
        return this.props.children;
    }
}

export default withNavigate(ScrollToTop);
