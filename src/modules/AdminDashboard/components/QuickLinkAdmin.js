import React from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const QuickLinkAdmin = ({ item, onSubmitClick, onCancelClick, busy = false }) => {
    const { handleSubmit, control } = useForm({ defaultValues: item });
    return (
        <form onSubmit={handleSubmit(data => onSubmitClick(data))} className="form">
            <Grid container mt={2} spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="standard"
                                label="Title"
                                required
                                multiline
                                maxRows={2}
                            />
                        )}
                        name="title"
                        control={control}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="standard"
                                label="Link"
                                required
                                multiline
                                maxRows={3}
                            />
                        )}
                        name="target"
                        control={control}
                    />
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        color="primary"
                        variant="contained"
                        loading={busy}
                        loadingPosition="start"
                    >
                        Save
                    </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="default" onClick={onCancelClick} disabled={busy}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

QuickLinkAdmin.propTypes = {
    item: PropTypes.object.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    busy: PropTypes.bool,
};

export default React.memo(QuickLinkAdmin);
