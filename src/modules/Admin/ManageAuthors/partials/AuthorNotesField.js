import React from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import AuthorFieldData from './AuthorFieldData';

import { useEditableContext } from 'context';

export const AuthorNotesField = ({ rowData, onChange }) => {
    const { editable } = useEditableContext();
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
                        label="Notes"
                    />
                </Grid>
                {editable && (
                    <Grid item xs={12}>
                        <Button color="primary" onClick={handleNotesUpdate} size="small">
                            {'Update notes'}
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
