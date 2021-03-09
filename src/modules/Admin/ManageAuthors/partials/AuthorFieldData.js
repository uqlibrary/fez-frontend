import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    root: {
        '&$before': {
            borderBottom: '1px solid red',
        },
    },
    underline: {},
}));

export const AuthorFieldData = ({ authorFieldDataId, data, title }) => {
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12}>
                {/* <Typography
                    className={classes.cellEditable}
                    variant="body2"
                    {...(!!authorFieldDataId
                        ? {
                              'data-testid': authorFieldDataId,
                              id: authorFieldDataId,
                          }
                        : {})}
                >
                    {data || '-'}
                </Typography> */}
                <TextField
                    textFieldId={authorFieldDataId}
                    label={title}
                    InputProps={{
                        style: {
                            fontSize: 14,
                            fontWeight: 400,
                        },
                        readOnly: true,
                        classes: {
                            root: classes.root,
                            underline: classes.underline,
                        },
                    }}
                    InputLabelProps={{
                        style: {
                            fontSize: '0.8rem',
                        },
                        shrink: true,
                        disableAnimation: true,
                    }}
                    value={data}
                />
            </Grid>
            {/* <Grid item>
                <Typography variant="caption" color="secondary" className={classes.fieldTitle}>
                    {title}
                </Typography>
            </Grid> */}
        </Grid>
    );
};

AuthorFieldData.propTypes = {
    authorFieldDataId: PropTypes.string,
    data: PropTypes.string,
    title: PropTypes.string,
};

export default React.memo(AuthorFieldData);
