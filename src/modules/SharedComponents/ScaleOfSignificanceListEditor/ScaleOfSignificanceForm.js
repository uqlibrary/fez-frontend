import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { SIGNIFICANCE } from 'config/general';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const handleContributionStatementCallbackFactory = setContributionStatement => {
    const callback = value => setContributionStatement(value);
    return [callback, [setContributionStatement]];
};

export const handleSignificanceCallbackFactory = setSignificance => {
    const callback = value => setSignificance(value);
    return [callback, [setSignificance]];
};

export const resetFormCallbackFactory = (setSignificance, showForm) => {
    const callback = () => {
        setSignificance(null);
        showForm(false);
    };
    return [callback, [setSignificance]];
};

export const saveCallbackFactory = (
    disabled,
    emptySignificance,
    significance,
    contributionStatement,
    saveChangeToItem,
    resetForm,
) => {
    const callback = event => {
        if (emptySignificance) {
            saveChangeToItem({ key: 0, value: { plainText: 'Missing', htmlText: 'Missing' } });
            resetForm && resetForm();
            return;
        }
        // add item if user hits 'enter' key on input field
        /* istanbul ignore next */
        if (
            !emptySignificance &&
            (disabled || !significance || !contributionStatement || (event && event.key && event.key !== 'Enter'))
        ) {
            /* istanbul ignore next */
            return;
        }
        // pass on the selected item
        saveChangeToItem({ key: significance, value: contributionStatement });
        resetForm();
        // move focus to name as published text field after item was added
    };
    return [callback, [disabled, emptySignificance, significance, contributionStatement, saveChangeToItem, resetForm]];
};

export const ScaleOfSignificanceForm = ({
    disabled,
    locale,
    errorText,
    saveChangeToItem,
    showForm,
    formMode,
    itemIndexSelectedToEdit,
    itemSelectedToEdit,
    buttonLabel,
    hidden,
}) => {
    const [emptySignificance, setEmptySignificance] = useState(false);
    const [significance, setSignificance] = useState(null);
    const [contributionStatement, setContributionStatement] = useState(null);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (itemIndexSelectedToEdit !== null && formMode === 'edit') {
            setSignificance(itemSelectedToEdit.key);
            setContributionStatement(itemSelectedToEdit.value);
        } else {
            setSignificance(null);
            setContributionStatement('');
        }
    }, [itemIndexSelectedToEdit, itemSelectedToEdit, formMode]);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (showForm) {
            setEmptySignificance(false);
        }
    }, [showForm]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleContributionStatement = useCallback(
        ...handleContributionStatementCallbackFactory(setContributionStatement),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSignificance = useCallback(...handleSignificanceCallbackFactory(setSignificance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetForm = useCallback(...resetFormCallbackFactory(setSignificance, showForm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const saveChanges = useCallback(
        ...saveCallbackFactory(
            disabled,
            emptySignificance,
            significance,
            contributionStatement,
            saveChangeToItem,
            resetForm,
        ),
    );

    const {
        significanceInputFieldLabel,
        contributionStatementInputFieldLabel,
        resetFormLabel,
        id,
        emptySignificanceLabel,
    } = locale;

    const isValidSignificance = sig => !!sig;
    const handleEmptySignificance = event => {
        setEmptySignificance(event.target.checked ? true : false);
    };

    const isValidStatement = statement => !!statement?.plainText?.trim();

    function getContributionStatement() {
        return contributionStatement.plainText === 'Missing' ? '' : contributionStatement;
    }

    return (
        <Grid
            container
            spacing={2}
            display={hidden ? 'none' : 'row'}
            alignItems="center"
            data-testid="rek-significance-form"
        >
            <Grid item xs={12}>
                <FormControlLabel
                    sx={{ margin: 0 }}
                    control={
                        <Checkbox
                            inputProps={{
                                'data-analyticsid': 'empty-significance-statement-input',
                                'data-testid': 'empty-significance-statement-input',
                                id: 'empty-significance-statement-input',
                            }}
                            checked={emptySignificance}
                            onChange={handleEmptySignificance}
                        />
                    }
                    label={
                        <Typography
                            sx={{ textAlign: 'justify', fontSize: 16, fontWeight: 300, lineHeight: '24px' }}
                            component="div"
                            id={'empty-significance-statement-label'}
                            data-testid={'empty-significance-statement-label'}
                        >
                            {emptySignificanceLabel}
                        </Typography>
                    }
                />
            </Grid>
            <Grid item style={{ flexGrow: 1 }} xs={12}>
                <NewGenericSelectField
                    genericSelectFieldId="rek-significance"
                    label={significanceInputFieldLabel}
                    onChange={handleSignificance}
                    disabled={disabled || emptySignificance}
                    error={!emptySignificance && (!!errorText || !isValidSignificance(significance))}
                    errorText={errorText}
                    value={significance || null}
                    itemsList={SIGNIFICANCE}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <RichEditorField
                    richEditorId="rek-creator-contribution-statement"
                    name="value"
                    id={(!!id && /* istanbul ignore next */ id) || ''}
                    onChange={handleContributionStatement}
                    onKeyPress={saveChanges}
                    error={!!errorText}
                    disabled={disabled || emptySignificance}
                    title={contributionStatementInputFieldLabel}
                    titleProps={{
                        variant: 'caption',
                        style: {
                            opacity: 0.666,
                        },
                    }}
                    value={formMode === 'edit' && !!contributionStatement ? getContributionStatement() : ''}
                    required
                />
            </Grid>
            <Grid item xs={9}>
                <Button
                    fullWidth
                    id="add-items"
                    data-analyticsid="rek-significance-add"
                    data-testid="rek-significance-add"
                    color="primary"
                    variant="contained"
                    children={buttonLabel}
                    disabled={
                        !emptySignificance &&
                        (disabled || !isValidSignificance(significance) || !isValidStatement(contributionStatement))
                    }
                    onClick={saveChanges}
                />
            </Grid>
            <Grid item xs={3}>
                <Button
                    fullWidth
                    id="clear-items"
                    data-analyticsid="rek-significance-clear"
                    data-testid="rek-significance-clear"
                    variant="contained"
                    children={resetFormLabel}
                    disabled={disabled}
                    onClick={resetForm}
                />
            </Grid>
        </Grid>
    );
};

ScaleOfSignificanceForm.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    formMode: PropTypes.string,
    hidden: PropTypes.bool,
    itemIndexSelectedToEdit: PropTypes.any,
    itemSelectedToEdit: PropTypes.object,
    locale: PropTypes.object,
    saveChangeToItem: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
};

export default React.memo(ScaleOfSignificanceForm);
