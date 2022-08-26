import React from 'react';
import PropTypes from 'prop-types';

export default class Async extends React.Component {
    static propTypes = {
        load: PropTypes.instanceOf(Promise).isRequired,
        componentProps: PropTypes.any,
    };

    componentDidMount = () => {
        this.cancelUpdate = false;
        this.props.load.then(c => {
            this.C = c;
            if (!this.cancelUpdate) {
                this.forceUpdate();
            }
        });
    };

    componentWillUnmount = () => {
        this.cancelUpdate = true;
    };

    render = () => {
        const { componentProps } = this.props;
        if (this.C) {
            return this.C.default ? <this.C.default {...componentProps} /> : <this.C {...componentProps} />;
        } else {
            return null;
        }
    };
}
