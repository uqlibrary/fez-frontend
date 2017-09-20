import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'uqlibrary-react-toolbox';
import {locale} from 'config';

export default class PublicationFormAlert extends Component {
    static propTypes = {
        authorLinked: PropTypes.bool,
        status: PropTypes.object,
        locale: PropTypes.object,
        overrideProps: PropTypes.object
    };

    static defaultProps = {
        locale: {
            error: 'error',
            warning: 'warning',
            info: 'info',
            infoOutline: 'info_outline',
            errorOutline: 'error_outline'
        }
    };

    constructor(props) {
        super(props);
        const initialState = this.getDisplayMessage(props.status);
        this.state = {
            ...initialState
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({...this.getDisplayMessage(nextProps.status)});
    }

    getDisplayMessage = (status) => {
        const txt = locale.components.claimPublicationForm;
        const {error, warning, info, infoOutline, errorOutline} = this.props.locale;

        if (status.submitFailed && status.error) {
            return {type: errorOutline, ...txt.errorAlert};
        }

        if (!status.submitFailed && status.dirty && status.invalid) {
            return {type: warning, ...txt.validationAlert};
        }

        if (status.submitting) {
            return {type: infoOutline, ...txt.progressAlert};
        }

        if (status.submitSucceeded) {
            return {type: info, ...txt.successAlert};
        }

        if (this.props.authorLinked) {
            return {type: error, ...txt.alreadyClaimedAlert};
        }

        return {
            type: null,
            title: null,
            message: null
        };
    };

    render() {
        return (
            this.state.type &&
            <Alert {...this.state} />
        );
    }
}
