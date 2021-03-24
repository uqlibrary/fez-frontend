import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const NotesData = ({ rowData, onChange }) => {
    const {
        header: {
            columns: { notes },
        },
    } = locale.components.manageAuthors;

    return (
        <StandardCard subCard noHeader>
            <Grid container spacing={2}>
                <AuthorFieldData
                    authorFieldDataId="aut-description"
                    data={rowData.aut_description}
                    name="aut_description"
                    multiline
                    rows={5}
                    onChange={onChange}
                    {...notes}
                />
            </Grid>
        </StandardCard>
    );
};

NotesData.propTypes = {
    rowData: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(NotesData);
