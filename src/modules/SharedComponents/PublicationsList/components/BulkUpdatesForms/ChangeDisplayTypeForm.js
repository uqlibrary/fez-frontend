import React from 'react';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { DocumentTypeSingleField, PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import Grid from '@material-ui/core/Grid';
import { locale } from 'locale';

export const ChangeDisplayTypeForm = React.forwardRef(({}, ref) => {
    const [newDisplayType, setNewDisplayType] = React.useState(null);
    const [newSubtype, setNewSubtype] = React.useState(null);

    const handleDisplayTypeChange = value => {
        setNewDisplayType(value);
        setNewSubtype(null);
    };

    const handleSubtypeChange = value => setNewSubtype(value);

    const txt = locale.components.bulkUpdates;
    React.useEffect(() => {
        ref.current = {
            values: { rek_display_type: newDisplayType, rek_subtype: null },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newDisplayType]);

    React.useEffect(() => {
        if (!!newSubtype) {
            ref.current = {
                values: {
                    ...ref.current.values,
                    rek_subtype: newSubtype,
                },
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newSubtype]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert alertId="alert-info-change-display-type" {...txt.bulkUpdatesForms.changeDisplayTypeForm} />
            </Grid>
            <Grid item xs={12}>
                <DocumentTypeSingleField
                    label="New display type"
                    onChange={handleDisplayTypeChange}
                    value={newDisplayType}
                />
            </Grid>
            <Grid item xs={12}>
                <PublicationSubtypeField
                    label="New subtype type"
                    onChange={handleSubtypeChange}
                    displayType={newDisplayType}
                    value={newSubtype}
                />
            </Grid>
        </Grid>
    );
});

export default React.memo(ChangeDisplayTypeForm);
