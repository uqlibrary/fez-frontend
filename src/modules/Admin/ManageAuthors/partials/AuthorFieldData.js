import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    root: {
        '&::before': {
            borderBottom: '1px dashed rgba(0, 0, 0, 0.13)',
        },
    },
    underline: {},
}));

export const AuthorFieldData = ({ authorFieldDataId, data, title }) => {
    const classes = useStyles();
    return (
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
    );
};

AuthorFieldData.propTypes = {
    authorFieldDataId: PropTypes.string,
    data: PropTypes.string,
    title: PropTypes.string,
};

export default React.memo(AuthorFieldData);
