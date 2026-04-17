import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/GridLegacy';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from 'locale/pages';
import { pathConfig } from 'config';

const Masquerade = ({ account }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const txt = locale.pages.masquerade;

    const masqueradeAs = event => {
        if ((event && event.key && event.key !== 'Enter') || userName.length === 0) return;

        setLoading(true);

        const redirectUrl = `${window.location.protocol}//${window.location.hostname}${pathConfig.dashboard}`;
        window.location.assign(
            `https://auth.library.uq.edu.au/masquerade?user=${userName}&return=${window.btoa(redirectUrl)}`,
        );
    };

    const usernameChanged = event => {
        setUserName(event.target.value);
    };

    return (
        <StandardPage>
            <StandardCard title={txt.title} help={txt.help}>
                {account.canMasqueradeType && account.canMasqueradeType === 'readonly' ? (
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
                            value={userName}
                            onChange={usernameChanged}
                            slotProps={{
                                input: { onKeyPress: masqueradeAs },
                            }}
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
                            disabled={loading}
                            onClick={masqueradeAs}
                            onKeyUp={masqueradeAs}
                        />
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

Masquerade.propTypes = {
    account: PropTypes.object.isRequired,
};

export default React.memo(Masquerade);
