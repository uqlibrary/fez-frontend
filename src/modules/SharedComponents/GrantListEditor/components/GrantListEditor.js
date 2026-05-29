import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import GrantListEditorHeader from './GrantListEditorHeader';
import GrantListEditorRow from './GrantListEditorRow';
import GrantListEditorForm from './GrantListEditorForm';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import { useFormContext } from 'react-hook-form';
import { isEmptyAttributesObject } from '../../../../helpers/general';
import { locale as globalLocale } from 'locale';
import debounce from 'lodash/debounce';

const getGrantsFromProps = (name, value) => (name && value) || [];

const GrantListEditor = ({
    canEdit = false,
    disabled,
    state,
    locale,
    name,
    value,
    required,
    hideType = false,
    disableDeleteAllGrants = false,
}) => {
    const hasPropagatedInputValueChanges = useRef(null);
    const [grants, setGrants] = useState([]);
    const [grantSelectedToEdit, setGrantSelectedToEdit] = useState(null);
    const [grantIndexSelectedToEdit, setGrantIndexSelectedToEdit] = useState(null);
    const form = useFormContext();

    const handleGrantsChange = useCallback(
        grants => {
            form?.setValue?.(name, grants, { shouldValidate: true });
        },
        [form, name],
    );
    // propagate input changes to `grants`
    useEffect(() => {
        const updated = getGrantsFromProps(name, value);
        // only update `grants` once, when value has been updated
        if (!!grants.length || !updated.length || hasPropagatedInputValueChanges.current) {
            return;
        }
        hasPropagatedInputValueChanges.current = true;
        setGrants(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(grants), value, hasPropagatedInputValueChanges.current]);

    const addGrant = useCallback(
        grant => {
            const newList =
                grantIndexSelectedToEdit !== null && grantIndexSelectedToEdit > -1
                    ? [
                          ...grants.slice(0, grantIndexSelectedToEdit),
                          grant,
                          ...grants.slice(grantIndexSelectedToEdit + 1),
                      ]
                    : [...grants, grant];

            setGrants(newList);
            handleGrantsChange(newList);
            setGrantIndexSelectedToEdit(null);
            setGrantSelectedToEdit(null);
        },
        [grantIndexSelectedToEdit, grants, handleGrantsChange],
    );

    const editGrant = useCallback((grant, index) => {
        setGrantSelectedToEdit(grant);
        setGrantIndexSelectedToEdit(index);
    }, []);

    const moveUpGrant = useCallback(
        (grant, index) => {
            /* istanbul ignore next */
            if (index === 0) return;
            const previousGrant = grants[index - 1];
            if (previousGrant.hasOwnProperty('disabled') && previousGrant.disabled) return;
            const newList = [...grants.slice(0, index - 1), grant, previousGrant, ...grants.slice(index + 1)];
            setGrants(newList);
            handleGrantsChange(newList);
        },
        [grants, handleGrantsChange],
    );

    const moveDownGrant = useCallback(
        (grant, index) => {
            /* istanbul ignore next */
            if (index === grants.length - 1) return;
            const nextGrant = grants[index + 1];

            const newList = [...grants.slice(0, index), nextGrant, grant, ...grants.slice(index + 2)];
            setGrants(newList);
            handleGrantsChange(newList);
        },
        [grants, handleGrantsChange],
    );

    const deleteGrant = useCallback(
        (_, index) => {
            const newList = grants.filter((__, i) => i !== index);
            setGrants(newList);
            handleGrantsChange(newList);
        },
        [grants, handleGrantsChange],
    );

    const deleteAllGrants = useCallback(() => {
        setGrants([]);
        handleGrantsChange([]);
    }, [handleGrantsChange]);

    const handleFormChanges = useMemo(
        () =>
            debounce(
                row => {
                    // can't use state.error, it's stale in here
                    const hasError = form?.getFieldState?.(name).error;

                    // in case form is on it's default state
                    if (isEmptyAttributesObject(row)) {
                        // bail if there is no error to be cleared
                        if (!hasError) return;

                        form?.clearErrors?.(name);
                        return;
                    }

                    // bail in case error has already been set
                    if (hasError) return;
                    form?.setError?.(name, { type: 'manual', message: globalLocale.validationErrors.grants });
                },
                150,
                {
                    leading: true,
                    trailing: true,
                },
            ),
        [form, name],
    );

    const renderGrantsRows = grants?.map?.((grant, index) => (
        <GrantListEditorRow
            key={`GrantListRow_${index}`}
            index={index}
            disabled={disabled || (grant && grant.disabled)}
            grant={grant}
            canMoveDown={index !== grants?.length - 1}
            canMoveUp={index !== 0}
            canEdit={canEdit}
            onMoveUp={moveUpGrant}
            onMoveDown={moveDownGrant}
            onDelete={deleteGrant}
            onEdit={editGrant}
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
            <GrantListEditorForm
                onAdd={addGrant}
                onChange={handleFormChanges}
                required={required}
                disabled={disabled}
                hideType={hideType}
                {...(locale?.form || {})}
                {...(grantIndexSelectedToEdit !== null && grantIndexSelectedToEdit > -1
                    ? { grantSelectedToEdit: grantSelectedToEdit }
                    : {})}
            />
            {grants?.length > 0 && (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <List>
                            <GrantListEditorHeader
                                onDeleteAll={deleteAllGrants}
                                disabled={disabled || disableDeleteAllGrants}
                                hideType={hideType}
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
                                ...(grants?.length > 3 && { overflowY: 'scroll' }),
                            }}
                            data-testid="rek-grant-list"
                        >
                            {renderGrantsRows}
                        </List>
                    </Grid>
                </Grid>
            )}
            {state?.error && (
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Typography color="error" variant="caption">
                            {error || state.error}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

GrantListEditor.propTypes = {
    canEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    state: PropTypes.object,
    locale: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    hideType: PropTypes.bool,
    disableDeleteAllGrants: PropTypes.bool,
};

export default React.memo(GrantListEditor);
