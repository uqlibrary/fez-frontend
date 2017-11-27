/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

export default class Async extends React.Component {
    componentWillMount = () => {
        this.cancelUpdate = false;
        this.props.load.then((c) => {
            this.C = c;
            if (!this.cancelUpdate) {
                this.forceUpdate();
            }
        });
    }

    componentWillUnmount = () => {
        this.cancelUpdate = true;
    }

    render = () => {
        const {componentProps} = this.props;
        console.log('ASYNC:');
        console.log(this.C);
        return this.C
            ? this.C.default
                ? <this.C.default {...componentProps} />
                : <this.C {...componentProps} />
            : null;
    }
}

Async.propTypes = {
    load: PropTypes.instanceOf(Promise).isRequired,
}

// import React, { Component } from 'react';
//
// export default function asyncComponent(importComponent) {
//     class AsyncComponent extends Component {
//         constructor(props) {
//             super(props);
//
//             this.state = {
//                 component: null
//             };
//         }
//
//         async componentDidMount() {
//             const { default: component } = await importComponent();
//
//             this.setState({
//                 component: component
//             });
//         }
//
//         render() {
//             const C = this.state.component;
//
//             return C ? <C {...this.props} /> : null;
//         }
//     }
//
//     return AsyncComponent;
// }
