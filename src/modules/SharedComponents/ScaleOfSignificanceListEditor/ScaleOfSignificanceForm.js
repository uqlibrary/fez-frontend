import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
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

export const resetFormCallbackFactory = (contributionStatementEditor, setSignificance, showForm) => {
    const callback = () => {
        setSignificance(null);
        contributionStatementEditor.current.setData(null);
        showForm(false);
    };
    return [callback, [contributionStatementEditor, setSignificance]];
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
        console.log('checking if empty', significance, contributionStatement);
        if (emptySignificance) {
            console.log('was it missing?');
            saveChangeToItem({ key: 0, value: { plainText: 'Missing', htmlText: 'Missing' } });
            resetForm();
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
        console.log('The correct shape:', significance, contributionStatement);
        saveChangeToItem({ key: significance, value: contributionStatement });
        resetForm();
        // move focus to name as published text field after item was added
    };
    return [callback, [disabled, emptySignificance, significance, contributionStatement, saveChangeToItem, resetForm]];
};

export const ScaleOfSignificanceForm = ({
    contributors,
    disabled,
    locale,
    errorText,
    saveChangeToItem,
    showForm,
    formMode,
    itemIndexSelectedToEdit,
    itemSelectedToEdit,
    buttonLabel,
    input,
}) => {
    const [emptySignificance, setEmptySignificance] = useState(false);
    const [significance, setSignificance] = useState(null);
    const [contributionStatement, setContributionStatement] = useState(null);
    const contributionStatementInput = useRef(null);
    const contributionStatementEditor = useRef(null);
    console.log('sos form', contributors);
    console.log('significance', emptySignificance);

    React.useEffect(() => {
        if (itemIndexSelectedToEdit !== null && formMode === 'edit') {
            setSignificance(itemSelectedToEdit.key);
            setContributionStatement(itemSelectedToEdit.value);
            contributionStatementEditor.current.setData(itemSelectedToEdit.value.htmlText);
        } else {
            setSignificance(null);
            setContributionStatement('');
            contributionStatementEditor.current.setData('');
        }
    }, [itemIndexSelectedToEdit, itemSelectedToEdit, formMode]);

    React.useEffect(() => {
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
    const resetForm = useCallback(...resetFormCallbackFactory(contributionStatementEditor, setSignificance, showForm));
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
        authorOrderAlert,
    } = locale;

    const isValidSignificance = sig => !!sig;
    const handleEmptySignificance = event => {
        setEmptySignificance(event.target.checked ? true : false);
    };

    const isValidStatement = statement => !!statement?.plainText?.trim();

    return (
        <Grid container spacing={2} display="row" alignItems="center" data-testid="rek-significance-form">
            {!!authorOrderAlert && (
                <Grid item xs={12}>
                    <Alert {...authorOrderAlert} />
                </Grid>
            )}

            <Grid item xs={12}>
                <FormControlLabel
                    sx={{ margin: 0 }}
                    control={
                        <Checkbox
                            inputProps={{
                                'data-analyticsid': 'attributionIncomplete-input',
                                'data-testid': 'attributionIncomplete-input',
                                id: 'attributionIncomplete-input',
                            }}
                            checked={emptySignificance}
                            onChange={handleEmptySignificance}
                        />
                    }
                    label={
                        <Typography
                            sx={{ textAlign: 'justify', fontSize: 16, fontWeight: 300, lineHeight: '24px' }}
                            component="div"
                            id={'attributionIncomplete-label'}
                            data-testid={'attributionIncomplete-label'}
                        >
                            Create a Missing Statement
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
                    fullWidth
                    richEditorId="rek-creator-contribution-statement"
                    name="value"
                    id={(!!id && /* istanbul ignore next */ id) || ''}
                    onChange={handleContributionStatement}
                    onKeyPress={saveChanges}
                    error={!!errorText}
                    disabled={disabled || emptySignificance}
                    inputRef={contributionStatementInput}
                    instanceRef={contributionStatementEditor}
                    title={contributionStatementInputFieldLabel}
                    titleProps={{
                        variant: 'caption',
                        style: {
                            opacity: 0.666,
                        },
                    }}
                    value={formMode === 'edit' && !!contributionStatement ? contributionStatement : ''}
                    input={input}
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
    contributors: PropTypes.object,
    buttonLabel: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    formMode: PropTypes.string,
    input: PropTypes.any,
    itemIndexSelectedToEdit: PropTypes.any,
    itemSelectedToEdit: PropTypes.object,
    locale: PropTypes.object,
    saveChangeToItem: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
};

export default React.memo(ScaleOfSignificanceForm);
