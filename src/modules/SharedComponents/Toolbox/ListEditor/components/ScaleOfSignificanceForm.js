import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import RichEditor from 'modules/SharedComponents/RichEditor/components/RichEditor';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { SIGNIFICANCE } from 'config/general';

export const ScaleOfSignificanceForm = ({ disabled, locale, errorText, onAdd }) => {
    const [significance, setSignificance] = useState(null);
    const [contributionStatement, setContributionStatement] = useState(null);
    const contributionStatementInput = useRef(null);
    const contributionStatementEditor = useRef(null);

    const handleContributionStatement = useCallback(value => {
        setContributionStatement(value);
    }, []);

    const handleSignificance = useCallback(value => {
        setSignificance(value);
    }, []);

    const resetForm = useCallback(() => {
        setSignificance(null);
        contributionStatementEditor.current.setData(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addItem = useCallback(
        event => {
            // add item if user hits 'enter' key on input field
            if (disabled || !significance || !contributionStatement || (event && event.key && event.key !== 'Enter')) {
                return;
            }
            // pass on the selected item
            onAdd({ key: significance, value: contributionStatement });
            resetForm();
            // move focus to name as published text field after item was added
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled, significance, contributionStatement],
    );

    const {
        significanceInputFieldLabel,
        significanceInputFieldHint,
        contributionStatementInputFieldLabel,
        addButtonLabel,
        id,
        authorOrderAlert,
    } = locale;

    return (
        <Grid container spacing={16} display="row" alignItems="center">
            <Grid item xs={12}>
                <Alert {...authorOrderAlert} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }} xs={12}>
                <GenericSelectField
                    fullWidth
                    name="key"
                    SelectDisplayProps={{
                        id: 'scaleOfSignificance',
                    }}
                    label={significanceInputFieldLabel}
                    placeholder={significanceInputFieldHint}
                    onChange={handleSignificance}
                    error={!!errorText}
                    disabled={disabled}
                    selectedValue={significance}
                    itemsList={SIGNIFICANCE}
                />
            </Grid>
            <Grid item xs={12}>
                <RichEditor
                    fullWidth
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
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    id="add-items"
                    color="primary"
                    variant="contained"
                    children={addButtonLabel}
                    disabled={disabled}
                    onClick={addItem}
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
};

export default React.memo(ScaleOfSignificanceForm);
