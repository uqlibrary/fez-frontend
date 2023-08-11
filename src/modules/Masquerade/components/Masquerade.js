import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from 'locale/pages';
import { pathConfig } from 'config';

export default class Masquerade extends PureComponent {
    static propTypes = {
        account: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            loading: false,
        };
    }

    _masqueradeAs = event => {
        if ((event && event.key && event.key !== 'Enter') || this.state.userName.length === 0) return;

        this.setState({
            loading: true,
        });

        const redirectUrl = `${window.location.protocol}//${window.location.hostname}${pathConfig.dashboard}`;
        window.location.assign(
            `https://auth.library.uq.edu.au/masquerade?user=${this.state.userName}&return=${window.btoa(redirectUrl)}`,
        );
    };

    _usernameChanged = event => {
        this.setState({
            userName: event.target.value,
        });
    };

    render() {
        const txt = locale.pages.masquerade;

        return (
            <StandardPage>
                <StandardCard title={txt.title} help={txt.help}>
                    {this.props.account.canMasqueradeType && this.props.account.canMasqueradeType === 'readonly' ? (
                        <Typography>{txt.description.readonly}</Typography>
                    ) : (
                        <Typography>{txt.description.full}</Typography>
                    )}
                    <Grid container spacing={3} alignItems={'flex-end'} style={{ marginTop: 12 }}>
                        <Grid item xs>
                            <TextField
                                variant="standard"
                                fullWidth
                                id="userName"
                                label={txt.labels.hint}
                                value={this.state.userName}
                                onChange={this._usernameChanged}
                                onKeyPress={this._masqueradeAs}
                            />
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant="contained"
                                id="submitMasquerade"
                                data-analyticsid="submitMasquerade"
                                data-testid="submit-masquerade"
                                fullWidth
                                color="primary"
                                children={txt.labels.submit}
                                disabled={this.state.loading}
                                onClick={this._masqueradeAs}
                                onKeyPress={this._masqueradeAs}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </StandardPage>
        );
    }
}
