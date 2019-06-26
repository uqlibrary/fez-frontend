import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import MUIDataTable from 'mui-datatables';

import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';

/* istanbul ignore next */
const handleGrantEditButton = () => { };
/* istanbul ignore next */
const handleGrantEditButtonSubmit = () => { };

const grantColumns = [
    {
        name: 'Grant agency',
        options: {
            display: true,
            sort: true,
        }
    },
    {
        name: 'Grant agency ID',
        options: {
            display: true,
            sort: true,
        }
    },
    {
        name: 'Grant ID',
        options: {
            display: true,
            sort: true,
        }
    },
    {
        name: 'Grant acronym',
        options: {
            display: true,
            sort: true,
        }
    },
    {
        name: 'Grant text',
        options: {
            display: 'false',
            sort: true,
        }
    },
    {
        name: 'Actions',
        options: {
            display: true,
            sort: false,
            filter: false
        }
    }
];

const grantData = [
    ['National Breast Cancer Foundation of Australia', 'NBCF: 2007003445', '1234', 'NBCF', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec ligula nec nulla sodales laoreet.', <IconButton onClick={handleGrantEditButton}><Edit /></IconButton>],
    ['Australian Research Council', 'ARC: DP0985025', '1234', 'NBCF', 'Gravida lectus quis, fermentum dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec quis interdum leo.', <IconButton onClick={handleGrantEditButton}><Edit /></IconButton>],
];

const grantOptions = {
    filterType: 'checkbox',
};

/* istanbul ignore next */
export const GrantInformationSection = ({ disabled }) => {
    return (
        <Grid container spacing={8} style={{ marginTop: -12 }}>
            <Grid item xs={12} sm={6}>
                <Field
                    component={GenericTextField}
                    name="grantagency"
                    disabled={disabled}
                    fullWidth
                    label="Grant agency"
                    placeholder="" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field
                    component={GenericTextField}
                    name="grantagencyid"
                    disabled={disabled}
                    fullWidth
                    label="Grant agency ID"
                    placeholder="" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field
                    component={GenericTextField}
                    disabled={disabled}
                    name="grantid"
                    fullWidth
                    label="Grant ID"
                    placeholder="" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Field
                    component={GenericTextField}
                    disabled={disabled}
                    name="grantacronym"
                    fullWidth
                    label="Grant acronym"
                    placeholder="" />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" component="span" style={{ opacity: 0.66 }}>Grant text</Typography>
                <Field
                    component={RichEditorField}
                    disabled={disabled}
                    name="granttext"
                    format={value => Immutable.Map(value)}
                    height={100} />
            </Grid>
            <Grid item xs={12} style={{ padding: 4 }}>
                <Grid container spacing={8}>
                    <Grid item xs />
                    <Grid item xs="auto">
                        <Button color="secondary">
                            Clear
                        </Button>
                    </Grid>
                    <Grid item xs="auto">
                        <Button variant="contained" color="primary" onClick={handleGrantEditButtonSubmit}>
                            Add new item
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <MUIDataTable
                    title="Grant list"
                    data={grantData}
                    columns={grantColumns}
                    options={grantOptions}
                />
            </Grid>
        </Grid>
    );
};

GrantInformationSection.propTypes = {
    disabled: PropTypes.bool
};

export default React.memo(GrantInformationSection);
