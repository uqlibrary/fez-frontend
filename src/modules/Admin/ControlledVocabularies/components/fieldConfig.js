/* istanbul ignore file */
import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { isEmptyStr } from './helpers';

const rxWholeNumberOnly = new RegExp(/^\d+$/);

export default {
    fields: {
        cvo_title: {
            component: props => (
                <TextField
                    variant="standard"
                    {...props}
                    required
                    inputProps={{ ...props.inputProps, maxLength: 255 }}
                />
            ),
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
            component: props => <TextField variant="standard" {...props} fullWidth={false} />,
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
            component: props => (
                <TextField variant="standard" {...props} fullWidth={false} inputProps={{ pattern: '[0-9]{1,4}' }} />
            ),
            validate: value => {
                if (typeof value === 'undefined' || value === '') return false;
                return !rxWholeNumberOnly.test(value);
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
                renderInAdd: false,
                type: 'checkbox',
            },
        },
    },
};
