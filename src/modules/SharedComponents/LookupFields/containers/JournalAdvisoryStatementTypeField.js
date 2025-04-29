/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';
import { JOURNAL_ADVISORY_STATEMENT_TYPE as cvoTreeRootId } from '../../../../config/general';
import { useFormContext } from 'react-hook-form';

const flattenCVOTree = data =>
    data
        .map(item => ({
            key: item.controlled_vocab.cvo_id,
            value: item.controlled_vocab.cvo_title,
            // store CVO's desc as `id` to allow using GenericOptionTemplate for option rendering
            id: item.controlled_vocab.cvo_desc,
        }))
        .sort((a, b) => a.value.localeCompare(b.value) && a.id.localeCompare(b.id)) || [];

const JournalAdvisoryStatementTypeField = props => {
    const { getValues, setValue } = useFormContext();
    const dispatch = useDispatch();
    const { rawData, itemsLoading, itemsLoaded } = useSelector(
        state => state.get('controlledVocabulariesReducer')?.[cvoTreeRootId],
    ) || { rawData: [], itemsLoading: false, itemsLoaded: false };
    const itemsLoadedLocalRef = useRef(itemsLoaded);

    const loadSuggestions = useCallback(() => {
        if (itemsLoadedLocalRef.current) return;
        itemsLoadedLocalRef.current = true;
        dispatch(actions.loadVocabulariesList(cvoTreeRootId));
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const itemsList = useMemo(() => flattenCVOTree(rawData), [rawData.length]);

    // pre-load options in case the field is set
    useEffect(() => {
        if (!props.value) return;
        loadSuggestions();
    }, [loadSuggestions, props.value]);

    return (
        <AutoCompleteAsynchronousField
            key={props.value + rawData.length}
            id="jnl-advisory-statement-type-input"
            autoCompleteAsynchronousFieldId={'jnl-advisory-statement-type'}
            errorText={props.meta?.error ? props.meta.error : props.errorText}
            error={!!props.meta?.error}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value', 'id'] })}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            defaultValue={props.value && itemsList.find(item => item.key === props.value)}
            getOptionLabel={item => item.value || ''}
            OptionTemplate={GenericOptionTemplate}
            onClear={() => props.onChange(null)}
            clearSuggestionsOnClose={false}
            loadSuggestions={loadSuggestions}
            {...props}
            onChange={item => {
                const currentTypeItem = itemsList.find(item => item.key === props.value);
                const currentStatement = getValues(props.advisoryStatementFieldName)?.plainText?.trim?.();
                // if current advisory statement field value is empty or it's a default statement text,
                // updated it to the selected type's statement text
                if (!currentStatement || currentStatement === currentTypeItem?.id) {
                    setValue(props.advisoryStatementFieldName, item.id);
                }
                props.onChange(item.key);
            }}
        />
    );
};

JournalAdvisoryStatementTypeField.propTypes = {
    props: PropTypes.object,
};

export default JournalAdvisoryStatementTypeField;
