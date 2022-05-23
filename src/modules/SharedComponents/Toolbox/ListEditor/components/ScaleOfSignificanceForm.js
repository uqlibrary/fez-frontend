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

export const resetFormCallbackFactory = (contributionStatementEditor, setSignificance, showScaleAdditionForm) => {
    const callback = () => {
        console.log('resetFormCallbackFactory');
        setSignificance(null);
        contributionStatementEditor.current.setData(null);
        showScaleAdditionForm(false);
    };
    return [callback, [contributionStatementEditor, setSignificance]];
};

export const addItemCallbackFactory = (disabled, significance, contributionStatement, onAdd, resetForm) => {
    const callback = event => {
        // add item if user hits 'enter' key on input field
        if (disabled || !significance || !contributionStatement || (event && event.key && event.key !== 'Enter')) {
            return;
        }
        // pass on the selected item
        onAdd({ key: significance, value: contributionStatement });
        resetForm();
        // move focus to name as published text field after item was added
    };
    return [callback, [disabled, significance, contributionStatement, onAdd, resetForm]];
};

export const ScaleOfSignificanceForm = propFields => {
    const { disabled, locale, errorText, onAdd, showScaleAdditionForm } = propFields;
    console.log('ScaleOfSignificanceForm::propFields=', propFields);
    // const { significance, contributionStatement } = fieldsToEdit;
    // console.log('ScaleOfSignificanceForm::significance=', significance);
    // console.log('ScaleOfSignificanceForm::contributionStatement=', contributionStatement);

    const [significance, setSignificance] = useState(null);
    const [contributionStatement, setContributionStatement] = useState(null);
    const contributionStatementInput = useRef(null);
    const contributionStatementEditor = useRef(null);

    React.useEffect(() => {
        console.log('itemIndexSelectedToEdit is now ', propFields.itemIndexSelectedToEdit);
        if (propFields.itemIndexSelectedToEdit !== null) {
            setSignificance(propFields.itemSelectedToEdit.key);
            setContributionStatement(propFields.itemSelectedToEdit.value);
            console.log('trying to write this into field:', propFields.itemSelectedToEdit.value);
            contributionStatementEditor.current.setData(propFields.itemSelectedToEdit.value.htmlText);
            console.log('ScaleOfSignificanceForm::usefffect ', propFields.itemSelectedToEdit.value);
        }
    }, [propFields.itemIndexSelectedToEdit, propFields.itemSelectedToEdit]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleContributionStatement = useCallback(
        ...handleContributionStatementCallbackFactory(setContributionStatement),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSignificance = useCallback(...handleSignificanceCallbackFactory(setSignificance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetForm = useCallback(
        ...resetFormCallbackFactory(contributionStatementEditor, setSignificance, showScaleAdditionForm),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const addItem = useCallback(
        ...addItemCallbackFactory(disabled, significance, contributionStatement, onAdd, resetForm),
    );

    const {
        significanceInputFieldLabel,
        significanceInputFieldHint,
        contributionStatementInputFieldLabel,
        // addButtonLabel,
        resetFormLabel,
        id,
        authorOrderAlert,
    } = locale;

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
                    error={!!errorText}
                    disabled={disabled}
                    value={significance}
                    itemsList={SIGNIFICANCE}
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
                    value={contributionStatement || ''}
                    input={propFields.input}
                />
            </Grid>
            <Grid item xs={9}>
                <Button
                    fullWidth
                    id="add-items"
                    data-testid="rek-significance-add"
                    color="primary"
                    variant="contained"
                    children={propFields.buttonLabel}
                    disabled={disabled}
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
    onAdd: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    buttonLabel: PropTypes.string.isRequired,
};

export default React.memo(ScaleOfSignificanceForm);
