import React from 'react';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import { Field } from 'redux-form/immutable';

export const NotesData = props => {
    const {
        editRow: {
            fields: { notes },
        },
    } = locale.components.manageAuthors;

    return (
        <StandardCard subCard noHeader>
            <Grid container spacing={2}>
                <Field
                    component={AuthorFieldData}
                    authorFieldDataId="aut-description"
                    name="aut_description"
                    multiline
                    rows={5}
                    {...notes}
                    {...props}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NotesData);
