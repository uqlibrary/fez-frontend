import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

export class ScrollToTop extends Component {
    static propTypes = {
        children: PropTypes.any,
        location: PropTypes.object,
    };
    /* istanbul ignore next */
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location && document.getElementById('content-containers')) {
            document.getElementById('content-containers').scrollTop = 0;
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
