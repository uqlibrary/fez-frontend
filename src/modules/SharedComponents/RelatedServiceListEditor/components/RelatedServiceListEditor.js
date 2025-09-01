import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import RelatedServiceListEditorHeader from './RelatedServiceListEditorHeader';
import RelatedServiceListEditorRow from './RelatedServiceListEditorRow';
import RelatedServiceListEditorForm from './RelatedServiceListEditorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import { useFormContext } from 'react-hook-form';

const getRelatedServicesFromProps = (name, value) => (name && value) || [];

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
    const [errorMessage, setErrorMessage] = useState('');
    const [relatedServiceFormPopulated, setRelatedServiceFormPopulated] = useState(false);
    const form = useFormContext();

    // propagate input changes to `related services`
    useEffect(() => {
        const updated = getRelatedServicesFromProps(name, value);
        // only update `related services` once, when value has been updated
        if (!!relatedServices.length || !updated.length || hasPropagatedInputValueChanges.current) {
            return;
        }
        hasPropagatedInputValueChanges.current = true;
        setRelatedServices(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(relatedServices), value, hasPropagatedInputValueChanges.current]);

    // propagate `relatedServiceFormPopulated` changes to input
    useEffect(() => {
        if (!relatedServiceFormPopulated) return;
        form?.setValue?.(name, relatedServiceFormPopulated, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relatedServiceFormPopulated]);

    // propagate `related service` changes to input
    useEffect(() => {
        form?.setValue?.(name, relatedServices, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(relatedServices)]);

    const addRelatedService = useCallback(
        relatedService => {
            setRelatedServices(prevRelatedServices => {
                if (relatedServiceIndexSelectedToEdit !== null && relatedServiceIndexSelectedToEdit > -1) {
                    return [
                        ...prevRelatedServices.slice(0, relatedServiceIndexSelectedToEdit),
                        relatedService,
                        ...prevRelatedServices.slice(relatedServiceIndexSelectedToEdit + 1),
                    ];
                }
                return [...prevRelatedServices, relatedService];
            });
            setRelatedServiceIndexSelectedToEdit(null);
            setRelatedServiceSelectedToEdit(null);
            setErrorMessage('');
        },
        [relatedServiceIndexSelectedToEdit],
    );

    const editRelatedService = useCallback((relatedService, index) => {
        setRelatedServiceSelectedToEdit(relatedService);
        setRelatedServiceIndexSelectedToEdit(index);
    }, []);

    const moveUpRelatedService = useCallback((relatedService, index) => {
        /* istanbul ignore next */
        if (index === 0) return;

        setRelatedServices(prevRelatedServices => {
            const previousRelatedService = prevRelatedServices[index - 1];
            if (previousRelatedService.hasOwnProperty('disabled') && previousRelatedService.disabled) {
                return prevRelatedServices;
            }

            return [
                ...prevRelatedServices.slice(0, index - 1),
                relatedService,
                previousRelatedService,
                ...prevRelatedServices.slice(index + 1),
            ];
        });
    }, []);

    const moveDownRelatedService = useCallback((relatedService, index) => {
        setRelatedServices(prevRelatedServices => {
            /* istanbul ignore next */
            if (index === prevRelatedServices.length - 1) return prevRelatedServices;
            const nextRelatedService = prevRelatedServices[index + 1];
            return [
                ...prevRelatedServices.slice(0, index),
                nextRelatedService,
                relatedService,
                ...prevRelatedServices.slice(index + 2),
            ];
        });
    }, []);

    const deleteRelatedService = useCallback((_, index) => {
        setRelatedServices(prevRelatedServices => prevRelatedServices.filter((__, i) => i !== index));
    }, []);

    const deleteAllRelatedServices = useCallback(() => {
        setRelatedServices([]);
        setErrorMessage('');
    }, []);

    const isFormPopulated = useCallback(value => {
        setRelatedServiceFormPopulated(!!value);
    }, []);

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

    let error = null;
    if (state?.error) {
        error =
            !!state.error.props &&
            React.Children.map(state.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, { key: index });
                }
                return child;
            });
    }

    return (
        <div>
            {errorMessage && (
                /* istanbul ignore next */ (<Alert
                    title={this.props.locale.errorTitle}
                    message={errorMessage}
                    type="warning"
                />)
            )}
            <RelatedServiceListEditorForm
                onAdd={addRelatedService}
                isPopulated={isFormPopulated}
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
            {state?.error && (
                <Typography color="error" variant="caption">
                    {error || state.error}
                </Typography>
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
