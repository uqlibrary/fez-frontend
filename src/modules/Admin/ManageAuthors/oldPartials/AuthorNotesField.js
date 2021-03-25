import React from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import AuthorFieldData from './AuthorFieldData';
import { default as locale } from 'locale/components';

import { useEditableContext } from 'context';

export const AuthorNotesField = ({ rowData, onChange }) => {
    const { editable } = useEditableContext();
    const {
        form: {
            locale: { updateNotesButton },
        },

        header: {
            columns: { notes: notesLabel },
        },
    } = locale.components.manageAuthors;
    const [notes, setNotes] = React.useState(rowData.aut_description || '');

    const handleNotesUpdate = e => {
        e.preventDefault();
        onChange(notes);
    };

    return (
        <StandardCard noHeader>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AuthorFieldData
                        authorFieldDataId={`aut-description-${rowData.tableData.id}`}
                        name="aut_description"
                        onChange={(name, value) => setNotes(value)}
                        data={notes}
                        multiline
                        rows={5}
                        fullWidth
                        InputProps={{
                            style: {
                                fontSize: 14,
                                fontWeight: 400,
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                fontSize: '0.8rem',
                            },
                            shrink: true,
                            disableAnimation: true,
                        }}
                        {...notesLabel}
                    />
                </Grid>
                {editable && (
                    <Grid item xs={12}>
                        <Button
                            color="primary"
                            onClick={handleNotesUpdate}
                            size="small"
                            id={`aut-description-${rowData.tableData.id}-update`}
                            data-testid={`aut-description-${rowData.tableData.id}-update`}
                        >
                            {updateNotesButton}
                        </Button>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

AuthorNotesField.propTypes = {
    onChange: PropTypes.func,
    rowData: PropTypes.object,
};

export default React.memo(AuthorNotesField);
