import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import RelatedServiceListEditorHeader from './RelatedServiceListEditorHeader';
import RelatedServiceListEditorRow from './RelatedServiceListEditorRow';
import RelatedServiceListEditorForm from './RelatedServiceListEditorForm';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import { useFormContext } from 'react-hook-form';

const getItemsFromProps = (name, value) => (name && value?.items) || [];

const RelatedServiceListEditor = ({
    canEdit = false,
    disabled,
    state,
    locale,
    name,
    value,
    required,
    disableDeleteAllRelatedServices = false,
}) => {
    const hasPropagatedInputValueChanges = useRef(null);
    const [relatedServices, setRelatedServices] = useState([]);
    const [relatedServiceSelectedToEdit, setRelatedServiceSelectedToEdit] = useState(null);
    const [relatedServiceIndexSelectedToEdit, setRelatedServiceIndexSelectedToEdit] = useState(null);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const isEditing = !!relatedServiceSelectedToEdit;
    const hasError = !!state?.error;
    const form = useFormContext();

    const handleChange = useCallback(
        (items, isDirty) => {
            form?.setValue?.(name, { items, ...(isDirty ? { isDirty: true } : {}) }, { shouldValidate: true });
        },
        [form, name],
    );

    // propagate dirty state
    useEffect(() => {
        handleChange(relatedServices, isFormDirty && !isEditing);
        // clear dirty state onUnmount
        return () => handleChange(relatedServices, false);
    }, [isFormDirty, isEditing]);

    // propagate input changes to `related services`
    useEffect(() => {
        const updated = getItemsFromProps(name, value);
        // only update `related services` once, when value has been updated
        if (!!relatedServices.length || !updated.length || hasPropagatedInputValueChanges.current) {
            return;
        }
        hasPropagatedInputValueChanges.current = true;
        setRelatedServices(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(relatedServices), value, hasPropagatedInputValueChanges.current]);

    const addRelatedService = useCallback(
        relatedService => {
            const newList =
                relatedServiceIndexSelectedToEdit !== null && relatedServiceIndexSelectedToEdit > -1
                    ? [
                          ...relatedServices.slice(0, relatedServiceIndexSelectedToEdit),
                          relatedService,
                          ...relatedServices.slice(relatedServiceIndexSelectedToEdit + 1),
                      ]
                    : [...relatedServices, relatedService];
            setRelatedServices(newList);
            handleChange(newList);
            setRelatedServiceIndexSelectedToEdit(null);
            setRelatedServiceSelectedToEdit(null);
        },
        [relatedServiceIndexSelectedToEdit, relatedServices, handleChange],
    );

    const editRelatedService = useCallback((relatedService, index) => {
        setRelatedServiceSelectedToEdit(relatedService);
        setRelatedServiceIndexSelectedToEdit(index);
    }, []);

    const moveUpRelatedService = useCallback(
        (relatedService, index) => {
            /* istanbul ignore next */
            if (index === 0) return;
            const previousRelatedService = relatedServices[index - 1];
            if (previousRelatedService.hasOwnProperty('disabled') && previousRelatedService.disabled) {
                return;
            }
            const newList = [
                ...relatedServices.slice(0, index - 1),
                relatedService,
                previousRelatedService,
                ...relatedServices.slice(index + 1),
            ];
            setRelatedServices(newList);
            handleChange(newList);
        },
        [handleChange, relatedServices],
    );

    const moveDownRelatedService = useCallback(
        (relatedService, index) => {
            /* istanbul ignore next */
            if (index === relatedServices.length - 1) return;
            const nextRelatedService = relatedServices[index + 1];
            const newList = [
                ...relatedServices.slice(0, index),
                nextRelatedService,
                relatedService,
                ...relatedServices.slice(index + 2),
            ];
            setRelatedServices(newList);
            handleChange(newList);
        },
        [handleChange, relatedServices],
    );

    const deleteRelatedService = useCallback(
        (_, index) => {
            const newList = relatedServices.filter((__, i) => i !== index);
            handleChange(newList);
            setRelatedServices(newList);
        },
        [handleChange, relatedServices],
    );

    const deleteAllRelatedServices = useCallback(() => {
        setRelatedServices([]);
        handleChange([]);
    }, [handleChange]);

    const renderRelatedServicesRows = relatedServices?.map?.((relatedService, index) => (
        <RelatedServiceListEditorRow
            key={`RelatedServiceListRow_${index}`}
            index={index}
            disabled={disabled || (relatedService && relatedService.disabled)}
            relatedService={relatedService}
            canMoveDown={index !== relatedServices?.length - 1}
            canMoveUp={index !== 0}
            canEdit={canEdit}
            onMoveUp={moveUpRelatedService}
            onMoveDown={moveDownRelatedService}
            onDelete={deleteRelatedService}
            onEdit={editRelatedService}
        />
    ));

    return (
        <div>
            <RelatedServiceListEditorForm
                onAdd={addRelatedService}
                onDirty={setIsFormDirty}
                required={required}
                disabled={disabled}
                {...(locale?.form || {})}
                {...(relatedServiceIndexSelectedToEdit !== null && relatedServiceIndexSelectedToEdit > -1
                    ? { relatedServiceSelectedToEdit: relatedServiceSelectedToEdit }
                    : {})}
            />
            {relatedServices?.length > 0 && (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <List>
                            <RelatedServiceListEditorHeader
                                onDeleteAll={deleteAllRelatedServices}
                                disabled={disabled || disableDeleteAllRelatedServices}
                                {...(locale?.header || {})}
                            />
                        </List>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: -8 }}>
                        <List
                            sx={{
                                width: '100%',
                                maxHeight: '200px',
                                overflow: 'hidden',
                                ...(relatedServices?.length > 3 && { overflowY: 'scroll' }),
                            }}
                            data-testid="rek-related-service-list"
                        >
                            {renderRelatedServicesRows}
                        </List>
                    </Grid>
                </Grid>
            )}
            {hasError && (
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Typography color="error" variant="caption">
                            {state.error}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

RelatedServiceListEditor.propTypes = {
    canEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    state: PropTypes.object,
    locale: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disableDeleteAllRelatedServices: PropTypes.bool,
};

export default React.memo(RelatedServiceListEditor);
