import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const QuickLinkAdmin = ({ item, onCancelClick }) => {
    const { handleSubmit, control } = useForm({ defaultValues: item });
    const [data, setData] = useState(null);
    console.log(data, item);
    return (
        <form onSubmit={handleSubmit(data => setData(data))} className="form">
            <Grid container mt={2} spacing={1}>
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
                    <Button fullWidth variant="contained" color="default" onClick={onCancelClick}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" fullWidth color="primary" variant="contained">
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

QuickLinkAdmin.propTypes = {
    item: PropTypes.object.isRequired,
    onCancelClick: PropTypes.func,
};

export default React.memo(QuickLinkAdmin);
