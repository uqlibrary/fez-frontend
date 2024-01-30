/* istanbul ignore file */
import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { isEmptyStr } from './helpers';

export default {
    fields: {
        cvo_id: {
            component: props => (
                <TextField variant="standard" {...props} inputProps={{ ...props.inputProps, maxLength: 8 }} />
            ),
            validate: (value, _, action) => {
                console.log(value, action);
                return action === 'edit' && !Number.isFinite(value);
            },
            fieldParams: { canEdit: false, renderInAdd: false },
        },
        cvo_title: {
            component: props => <TextField variant="standard" {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: {
                minWidth: 180,
                canEdit: true,
                canAdd: true,
                flex: 1,
            },
        },
        cvo_desc: {
            component: props => <TextField variant="standard" multiline minRows={2} {...props} />,
            fieldParams: {
                minWidth: 200,
                canEdit: true,
                canAdd: true,
                flex: 1,
            },
        },
        cvo_external_id: {
            component: props => <TextField variant="standard" {...props} />,
            fieldParams: {
                canEdit: true,
                canAdd: true,
            },
        },
        cvo_image_filename: {
            component: props => <TextField variant="standard" {...props} />,
            fieldParams: {
                minWidth: 150,
                canEdit: true,
                canAdd: true,
            },
        },
        cvo_order: {
            component: props => <TextField variant="standard" {...props} />,
            validate: value => {
                if (typeof value === 'string' && value === '') return false;
                else return !Number.isFinite(parseInt(value, 10));
            },
            fieldParams: {
                canEdit: true,
                canAdd: true,
            },
        },
        cvo_hide: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={props.label}
                />
            ),
            fieldParams: {
                minWidth: 100,
                canEdit: true,
                type: 'checkbox',
            },
        },
    },
};
