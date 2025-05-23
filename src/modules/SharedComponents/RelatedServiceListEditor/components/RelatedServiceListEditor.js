import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import RelatedServiceListEditorHeader from './RelatedServiceListEditorHeader';
import RelatedServiceListEditorRow from './RelatedServiceListEditorRow';
import RelatedServiceListEditorForm from './RelatedServiceListEditorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useFormContext } from 'react-hook-form';

const getRelatedServicesFromProps = input => {
    if (input?.name && input?.value) {
        return input.value instanceof Immutable.List ? input.value.toJS() : input.value;
    }
    return [];
};

const RelatedServiceListEditor = ({
    canEdit = false,
    disabled,
    meta,
    onChange,
    locale,
    input,
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
        const updated = getRelatedServicesFromProps(input);
        // only update `related services` once, when input.value has been updated
        if (!!relatedServices.length || !updated.length || hasPropagatedInputValueChanges.current) {
            return;
        }
        hasPropagatedInputValueChanges.current = true;
        setRelatedServices(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(relatedServices), input?.value, hasPropagatedInputValueChanges.current]);

    // propagate `relatedServiceFormPopulated` changes to input
    useEffect(() => {
        if (relatedServiceFormPopulated) {
            // TODO remove upon removing redux-form
            /* istanbul ignore else */
            if (onChange) {
                onChange(relatedServiceFormPopulated);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relatedServiceFormPopulated, form?.setValue, onChange]);

    // propagate `related service` changes to input
    useEffect(() => {
        // TODO remove upon removing redux-form
        /* istanbul ignore else */
        if (onChange) {
            onChange(relatedServices);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(relatedServices), form?.setValue, onChange]);

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
    if (meta?.error) {
        error =
            !!meta.error.props &&
            React.Children.map(meta.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, { key: index });
                }
                return child;
            });
    }

    return (
        <div>
            {errorMessage && (
                /* istanbul ignore next */ <Alert
                    title={this.props.locale.errorTitle}
                    message={errorMessage}
                    type="warning"
                />
            )}
            <RelatedServiceListEditorForm
                meta={meta}
                input={input}
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
            {meta?.error && (
                <Typography color="error" variant="caption">
                    {error || meta.error}
                </Typography>
            )}
        </div>
    );
};

RelatedServiceListEditor.propTypes = {
    canEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    locale: PropTypes.object,
    input: PropTypes.object,
    required: PropTypes.bool,
    disableDeleteAllRelatedServices: PropTypes.bool,
};

export default React.memo(RelatedServiceListEditor);
