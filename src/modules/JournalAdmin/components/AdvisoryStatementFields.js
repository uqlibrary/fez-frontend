/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import JournalAdvisoryStatementTypeField from '../../SharedComponents/LookupFields/containers/JournalAdvisoryStatementTypeField';
import { RichEditorField } from '../../SharedComponents/RichEditor';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import { useFormContext, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import { useControlledVocabs } from '../../../hooks/useControlledVocabs';
import { JOURNAL_ADVISORY_STATEMENT_TYPE as cvoId } from '../../../config/general';
import { usePrevious } from '../../../hooks/usePrevious';
import get from 'lodash/get';

const flattenCVOTree = data =>
    data
        .map(item => ({
            key: item.controlled_vocab.cvo_id,
            value: item.controlled_vocab.cvo_title,
            // store CVO's desc as `id` to allow using GenericOptionTemplate for option rendering
            id: item.controlled_vocab.cvo_desc,
        }))
        .sort((a, b) => a.value.localeCompare(b.value) && a.id?.localeCompare(b.id)) || [];

export const AdvisoryStatementFields = props => {
    const { control, setValue, getValues, formState } = useFormContext();
    const type = useWatch({ name: props.type.name });
    const statement = getValues(props.text.name)?.plainText?.trim?.();
    const prevType = usePrevious(type);
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
        const prevTypeItem = cvoList.items.find(item => item.key === prevType);
        const currentTypeItem = cvoList.items.find(item => item.key === type);
        // if current advisory statement text is empty, or it has type's default statement value,
        // then update it to the corresponding selected type's statement text (item.id - see flattenCVOTree)
        if (!statement || statement === prevTypeItem?.id) {
            setValue(props.text.name, currentTypeItem?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

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
                <Field control={control} component={RichEditorField} disable={props.disable} {...props.text} />
            </Grid>
        </>
    );
};

AdvisoryStatementFields.propTypes = {
    props: PropTypes.any,
};

export default React.memo(AdvisoryStatementFields);
