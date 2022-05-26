import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { SIGNIFICANCE } from 'config/general';

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

export const addItemCallbackFactory = (disabled, significance, contributionStatement, saveChangeToItem, resetForm) => {
    const callback = event => {
        // add item if user hits 'enter' key on input field
        if (disabled || !significance || !contributionStatement || (event && event.key && event.key !== 'Enter')) {
            return;
        }
        // pass on the selected item
        saveChangeToItem({ key: significance, value: contributionStatement });
        resetForm();
        // move focus to name as published text field after item was added
    };
    return [callback, [disabled, significance, contributionStatement, saveChangeToItem, resetForm]];
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
    input,
}) => {
    const [significance, setSignificance] = useState(null);
    const [contributionStatement, setContributionStatement] = useState(null);
    const contributionStatementInput = useRef(null);
    const contributionStatementEditor = useRef(null);

    React.useEffect(() => {
        if (itemIndexSelectedToEdit !== null && formMode === 'edit') {
            setSignificance(itemSelectedToEdit.key);
            setContributionStatement(itemSelectedToEdit.value);
            contributionStatementEditor.current.setData(itemSelectedToEdit.value.htmlText);
        } else {
            setSignificance(null); // '' // 0
            setContributionStatement('');
            contributionStatementEditor.current.setData('');
        }
    }, [itemIndexSelectedToEdit, itemSelectedToEdit, formMode]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleContributionStatement = useCallback(
        ...handleContributionStatementCallbackFactory(setContributionStatement),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSignificance = useCallback(...handleSignificanceCallbackFactory(setSignificance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetForm = useCallback(...resetFormCallbackFactory(contributionStatementEditor, setSignificance, showForm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addItem = useCallback(
        ...addItemCallbackFactory(disabled, significance, contributionStatement, saveChangeToItem, resetForm),
    );

    const {
        significanceInputFieldLabel,
        significanceInputFieldHint,
        contributionStatementInputFieldLabel,
        resetFormLabel,
        id,
        authorOrderAlert,
    } = locale;

    // const getCurrentStatementValue = () =>
    //     formMode === 'edit' && !!contributionStatement ? contributionStatement : '';

    const isValidSignificance = sig => !!sig;

    const isValidStatement = statement => !!statement.plainText?.trim();

    return (
        <Grid container spacing={2} display="row" alignItems="center" data-testid="rek-significance-form">
            <Grid item xs={12}>
                <Alert {...authorOrderAlert} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }} xs={12}>
                <NewGenericSelectField
                    fullWidth
                    name="key"
                    genericSelectFieldId="rek-significance"
                    label={significanceInputFieldLabel}
                    placeholder={significanceInputFieldHint}
                    onChange={handleSignificance}
                    disabled={disabled}
                    error={!!errorText || !isValidSignificance(significance)}
                    errorText={errorText}
                    value={significance}
                    itemsList={SIGNIFICANCE}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <RichEditorField
                    fullWidth
                    richEditorId="rek-creator-contribution-statement"
                    name="value"
                    id={(!!id && id) || ''}
                    onChange={handleContributionStatement}
                    onKeyPress={addItem}
                    error={!!errorText}
                    disabled={disabled}
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
                    data-testid="rek-significance-add"
                    color="primary"
                    variant="contained"
                    children={buttonLabel}
                    disabled={
                        disabled || !isValidSignificance(significance) || !isValidStatement(contributionStatement)
                    }
                    onClick={addItem}
                />
            </Grid>
            <Grid item xs={3}>
                <Button
                    fullWidth
                    id="clear-items"
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
    input: PropTypes.any,
    itemIndexSelectedToEdit: PropTypes.any,
    itemSelectedToEdit: PropTypes.object,
    locale: PropTypes.object,
    saveChangeToItem: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
};

export default React.memo(ScaleOfSignificanceForm);
