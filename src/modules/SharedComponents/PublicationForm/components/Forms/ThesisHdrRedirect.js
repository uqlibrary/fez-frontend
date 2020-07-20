import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { default as formLocale } from 'locale/publicationForm';
import { pathConfig } from 'config/routes';

import Grid from '@material-ui/core/Grid';

export default class ThesisHdrRedirect extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        history: PropTypes.object,
    };
    constructor(props) {
        super(props);
    }

    _handleAction = () => {
        this.props.history.push(pathConfig.hdrSubmission);
    };

    render() {
        const txt = formLocale.thesis;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Alert
                                action={this._handleAction}
                                actionButtonLabel={txt.information.hdrRedirectActionButtonLabel}
                                message={txt.information.hdrRedirectMessage}
                                title={txt.information.hdrRedirectAlertTitle}
                                type="info"
                            />
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
