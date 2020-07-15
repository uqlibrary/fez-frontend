import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { default as formLocale } from 'locale/publicationForm';
import { routes } from 'config';

import Grid from '@material-ui/core/Grid';

export default class ThesisForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };
    constructor(props) {
        super(props);
    }

    _handleAction = () => {
        window.location.assign(routes.pathConfig.hdrSubmission);
        // this.props.history.replace(routes.pathConfig.hdrSubmission);
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
                                actionButtonLabel={txt.information.actionButtonLabel}
                                message={txt.information.message}
                                title={txt.information.alertTitle}
                                type="info"
                            />
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
