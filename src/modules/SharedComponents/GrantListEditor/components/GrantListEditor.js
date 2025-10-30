import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import GrantListEditorHeader from './GrantListEditorHeader';
import GrantListEditorRow from './GrantListEditorRow';
import GrantListEditorForm from './GrantListEditorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import { useFormContext } from 'react-hook-form';

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
    const [errorMessage, setErrorMessage] = useState('');
    const [grantFormPopulated, setGrantFormPopulated] = useState(false);
    const form = useFormContext();

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

    // propagate `grantFormPopulated` changes to input
    useEffect(() => {
        if (!grantFormPopulated) return;
        form?.setValue?.(name, grantFormPopulated, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grantFormPopulated]);

    // propagate `grants` changes to input
    useEffect(() => {
        form?.setValue?.(name, grants, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(grants)]);

    const addGrant = useCallback(
        grant => {
            setGrants(prevGrants => {
                if (grantIndexSelectedToEdit !== null && grantIndexSelectedToEdit > -1) {
                    return [
                        ...prevGrants.slice(0, grantIndexSelectedToEdit),
                        grant,
                        ...prevGrants.slice(grantIndexSelectedToEdit + 1),
                    ];
                }
                return [...prevGrants, grant];
            });
            setGrantIndexSelectedToEdit(null);
            setGrantSelectedToEdit(null);
            setErrorMessage('');
        },
        [grantIndexSelectedToEdit],
    );

    const editGrant = useCallback((grant, index) => {
        setGrantSelectedToEdit(grant);
        setGrantIndexSelectedToEdit(index);
    }, []);

    const moveUpGrant = useCallback((grant, index) => {
        /* c8 ignore next */
        if (index === 0) return;

        setGrants(prevGrants => {
            const previousGrant = prevGrants[index - 1];
            if (previousGrant.hasOwnProperty('disabled') && previousGrant.disabled) return prevGrants;

            return [...prevGrants.slice(0, index - 1), grant, previousGrant, ...prevGrants.slice(index + 1)];
        });
    }, []);

    const moveDownGrant = useCallback((grant, index) => {
        setGrants(prevGrants => {
            /* c8 ignore next */
            if (index === prevGrants.length - 1) return prevGrants;
            const nextGrant = prevGrants[index + 1];
            return [...prevGrants.slice(0, index), nextGrant, grant, ...prevGrants.slice(index + 2)];
        });
    }, []);

    const deleteGrant = useCallback((_, index) => {
        setGrants(prevGrants => prevGrants.filter((__, i) => i !== index));
    }, []);

    const deleteAllGrants = useCallback(() => {
        setGrants([]);
        setErrorMessage('');
    }, []);

    const isFormPopulated = useCallback(value => {
        setGrantFormPopulated(!!value);
    }, []);

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
            {errorMessage && (
                /* c8 ignore next */ <Alert
                    title={this.props.locale.errorTitle}
                    message={errorMessage}
                    type="warning"
                />
            )}
            <GrantListEditorForm
                onAdd={addGrant}
                isPopulated={isFormPopulated}
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
                <Typography color="error" variant="caption">
                    {error || state.error}
                </Typography>
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
