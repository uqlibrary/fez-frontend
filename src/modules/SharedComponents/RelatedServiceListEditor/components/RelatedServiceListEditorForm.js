import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import validationLocale from 'locale/validationErrors';
import { RelatedServiceIdField } from 'modules/SharedComponents/LookupFields/containers/RelatedServiceIdField';

export const RelatedServiceListEditorForm = ({
    disabled,
    relatedServiceSelectedToEdit,
    isPopulated,
    locale = {
        relatedServiceIdLabel: 'Related Service ID',
        relatedServiceIdHint: "Enter related service's ROR or DOI",
        relatedServiceDescLabel: 'Related Service Description',
        relatedServiceDescHint: 'Description for this related service',
        addButton: 'Add related service',
        editButton: 'Edit related service',
        description:
            "Add the Related Service's ID and description - then click the ADD RELATED SERVICE button to add to the list",
        remindToAdd: (
            <span>
                &nbsp;<b>* REMINDER:</b> Click ADD RELATED SERVICE to add this item to your list or it will not be
                included.
            </span>
        ),
    },
    onAdd,
    required,
}) => {
    const [relatedService, setRelatedService] = React.useState({
        relatedServiceId: '',
        relatedServiceDesc: '',
    });
    const [dirty, setDirty] = React.useState(null);
    const [key, setKey] = useState(0);

    React.useEffect(() => {
        if (!!relatedServiceSelectedToEdit) {
            setRelatedService(relatedService => ({
                ...relatedService,
                ...relatedServiceSelectedToEdit,
            }));
            setKey(key + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relatedServiceSelectedToEdit]);

    React.useEffect(() => {
        if (!!isPopulated && dirty) {
            isPopulated(true);
        } else {
            isPopulated(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirty]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChange = React.useCallback(event => {
        const { name, value } = event.target;
        setRelatedService(relatedService => ({
            ...relatedService,
            [name]: value,
        }));
        setDirty(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSelect = React.useCallback(item => {
        if (item) {
            setRelatedService({
                relatedServiceId: item.value,
                relatedServiceDesc: item.title || relatedService.relatedServiceDesc,
            });
            setDirty(true);
        } else {
            setRelatedService({
                ...relatedService,
                relatedServiceId: '',
            });
        }
    });

    const _addRelatedService = event => {
        if (
            (event && event.key && (event.key !== 'Enter' || !relatedService.relatedServiceId)) ||
            (event && event.key && event.key === 'Enter' && !relatedService.relatedServiceId)
        ) {
            return;
        }

        // pass on the selected related service
        onAdd(relatedService);
        setDirty(false);
        setKey(key + 1);
        setRelatedService({ relatedServiceId: null, relatedServiceDesc: '' });
    };

    const {
        addButton,
        editButton,
        description,
        relatedServiceIdLabel,
        relatedServiceIdHint,
        relatedServiceDescLabel,
        relatedServiceDescHint,
    } = locale;

    const { relatedServiceId, relatedServiceDesc } = relatedService;

    return (
        <React.Fragment>
            {description}
            <Grid container spacing={1} style={{ marginTop: 8 }}>
                <Grid item xs={12} sm={12} md>
                    <RelatedServiceIdField
                        key={key}
                        fullWidth
                        allowFreeText
                        clearOnInputClear
                        name="relatedServiceId"
                        floatingLabelText={relatedServiceIdLabel}
                        placeholder={relatedServiceIdHint}
                        value={relatedServiceId}
                        onChange={handleSelect}
                        disabled={disabled}
                        required={required}
                        error={required && !relatedServiceId}
                        errorText={required && !relatedServiceId && validationLocale.validationErrors.required}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <TextField
                        fullWidth
                        name="relatedServiceDesc"
                        textFieldId="rek-related-service-desc"
                        label={relatedServiceDescLabel}
                        placeholder={relatedServiceDescHint}
                        value={relatedServiceDesc}
                        onChange={handleChange}
                        onKeyDown={_addRelatedService}
                        disabled={disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        id={
                            (!!relatedServiceSelectedToEdit && 'rek-related-service-update') ||
                            'rek-related-service-add'
                        }
                        data-analyticsid={
                            (!!relatedServiceSelectedToEdit && 'rek-related-service-update') ||
                            'rek-related-service-add'
                        }
                        data-testid={
                            (!!relatedServiceSelectedToEdit && 'rek-related-service-update') ||
                            'rek-related-service-add'
                        }
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={disabled || !relatedServiceId || relatedServiceId.trim().length === 0}
                        onClick={_addRelatedService}
                    >
                        {(!!relatedServiceSelectedToEdit && editButton) || addButton}
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

RelatedServiceListEditorForm.propTypes = {
    disabled: PropTypes.bool,
    relatedServiceSelectedToEdit: PropTypes.object,
    isPopulated: PropTypes.func.isRequired,
    locale: PropTypes.object,
    meta: PropTypes.object,
    input: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    required: PropTypes.bool,
};

export default React.memo(RelatedServiceListEditorForm);
