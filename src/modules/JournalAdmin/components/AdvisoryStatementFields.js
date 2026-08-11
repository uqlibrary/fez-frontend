/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import JournalAdvisoryStatementTypeField from '../../SharedComponents/LookupFields/containers/JournalAdvisoryStatementTypeField';
import { RichTextEditorField } from '../../SharedComponents/RichTextEditor';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import { useFormContext, useWatch } from 'react-hook-form';
import Grid from '@mui/material/GridLegacy';
import { useControlledVocabs } from '../../../hooks/useControlledVocabs';
import { JOURNAL_ADVISORY_STATEMENT_TYPE as cvoId } from '../../../config/general';
import get from 'lodash/get';

const flattenCVOTree = data =>
    data
        .map(item => ({
            key: item.controlled_vocab.cvo_id,
            value: item.controlled_vocab.cvo_title,
            // store CVO's desc as `id` to allow using GenericOptionTemplate for option rendering
            id: item.controlled_vocab.cvo_desc,
        }))
        .sort((a, b) => a.value.localeCompare(b.value) && a.id?.localeCompare(b.id));

export const AdvisoryStatementFields = props => {
    const { control, setValue, getValues, formState } = useFormContext();
    const type = useWatch({ name: props.type.name });

    const lastAppliedDefault = useRef(null);
    const previousTypeDefault = useRef(null);

    const statementValue = getValues(props.text.name);
    const statement =
        typeof statementValue === 'string' ? statementValue.trim() : (statementValue?.plainText?.trim() ?? '');

    const cvoList = useControlledVocabs(cvoId, flattenCVOTree);
    const isPrePopulated = !!get(formState.defaultValues, props.type.name);

    // preload options in case the field pre-populated
    // e.g. editing a journal with advisory statement type
    useEffect(() => {
        if (!isPrePopulated) return;
        cvoList.fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPrePopulated]);

    // handle type changes
    useEffect(() => {
        const currentTypeItem = cvoList.items.find(item => item.key === type);
        const currentDefault = currentTypeItem?.id || '';

        /*
         * Initialize tracking when editing an existing record where the current
         * value already matches the selected type's default.
         */
        if (currentTypeItem && !lastAppliedDefault.current && statement === currentDefault) {
            lastAppliedDefault.current = currentDefault;
        }

        /*
         * Type cleared:
         * Restore the previous default only if the user has not replaced it.
         */
        if (!currentTypeItem) {
            if (statement === lastAppliedDefault.current) {
                const previousDefault = previousTypeDefault.current || '';
                setValue(props.text.name, {
                    htmlText: `<p>${previousDefault}</p>`,
                    plainText: previousDefault,
                });

                lastAppliedDefault.current = previousDefault;
            }

            return;
        }

        /*
         * Type changed:
         * Replace only empty values or previously generated defaults.
         */
        const shouldUpdate = !statement || statement === lastAppliedDefault.current;
        if (!shouldUpdate) {
            return;
        }

        previousTypeDefault.current = lastAppliedDefault.current;

        setValue(props.text.name, {
            htmlText: `<p>${currentDefault}</p>`,
            plainText: currentDefault,
        });

        lastAppliedDefault.current = currentDefault;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, cvoList.items]);

    return (
        <>
            <Grid item xs={12} md={12}>
                <Field
                    control={control}
                    component={JournalAdvisoryStatementTypeField}
                    list={cvoList}
                    disable={props.disable}
                    {...props.type}
                    // trigger a re-render upon options are loaded when field is pre-populated
                    {...((isPrePopulated && { key: `${props.name}-${cvoList.itemsLoaded}` }) || {})}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Field control={control} component={RichTextEditorField} disabled={props.disabled} {...props.text} />
            </Grid>
        </>
    );
};

AdvisoryStatementFields.propTypes = {
    props: PropTypes.any,
};

export default AdvisoryStatementFields;
