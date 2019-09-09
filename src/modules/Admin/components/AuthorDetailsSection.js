import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PersonAdd from '@material-ui/icons/PersonAdd';

import MUIDataTable from 'mui-datatables';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';

const authorRecColumns = [
    {
        name: 'Author name',
        options: {
            display: true,
            sort: true,
        },
    },
    {
        name: 'Author UQ ID',
        options: {
            display: true,
            sort: true,
        },
    },
    {
        name: 'Affiliation %',
        options: {
            display: true,
            sort: true,
        },
    },
    {
        name: '',
        options: {
            display: true,
            sort: false,
            filter: false,
        },
    },
];
const authorRecData = [
    [
        'John Smith',
        'UQ12345',
        <TextField fullWidth placeholder="1% - 100%" autoComplete="off" />,
        <IconButton style={{ float: 'right', marginRight: -24 }}>
            <PersonAdd />
        </IconButton>,
    ],
];

/* istanbul ignore next */
const authorRecOptions = {
    sort: false,
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: false,
    rowHover: false,
    customToolbar: () => <div />,
};

/* istanbul ignore next */
export const AuthorDetailsSection = ({ disabled = false }) => (
    <React.Fragment>
        <Grid item xs={12}>
            <Field
                component={ContributorsEditorField}
                disabled={disabled}
                showIdentifierLookup
                name="authoraffiliation"
                locale={{
                    errorTitle: 'Error',
                    errorMessage: 'Unable to add an item with the same identifier.',
                    form: {
                        locale: {
                            nameAsPublishedLabel: 'Author name',
                            nameAsPublishedHint: '',
                            identifierLabel: 'UQ identifier (if available)',
                            descriptionStep1NoStep2: 'Enter each author and add affiliation data to each.',
                            addButton: <span>Add&nbsp;affiliation</span>,
                        },
                    },
                }}
            />
        </Grid>
        <Grid item xs={12}>
            <StandardCard title="Author affiliation recommendations">
                <MUIDataTable data={authorRecData} columns={authorRecColumns} options={authorRecOptions} />
            </StandardCard>
        </Grid>
    </React.Fragment>
);

AuthorDetailsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorDetailsSection);
