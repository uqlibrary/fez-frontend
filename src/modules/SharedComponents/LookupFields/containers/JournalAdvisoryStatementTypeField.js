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

const JournalAdvisoryStatementTypeField = props => {
    const dispatch = useDispatch();
    const { rawData, itemsLoading, itemsLoaded } = useSelector(
        state => state.get('controlledVocabulariesReducer')?.[cvoTreeRootId],
    ) || { rawData: [], itemsLoading: false, itemsLoaded: false };
    const itemsLoadedLocalRef = useRef(itemsLoaded);
    const { getValues, setValue, formState } = useFormContext();
    const isPrePopulated = get(formState.defaultValues, props.name);

    const loadSuggestions = useCallback(() => {
        if (itemsLoadedLocalRef.current) return;
        itemsLoadedLocalRef.current = true;
        dispatch(actions.loadVocabulariesList(cvoTreeRootId));
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const itemsList = useMemo(() => flattenCVOTree(rawData), [rawData.length]);

    // preload options in case the field pre-populated
    // e.g. editing a journal with advisory statement type
    useEffect(() => {
        if (!isPrePopulated || !props.value) return;
        loadSuggestions();
    }, [loadSuggestions, isPrePopulated, props.value]);

    return (
        <AutoCompleteAsynchronousField
            // trigger a re-render upon options are loaded when field is pre-populated
            {...((isPrePopulated && { key: `${props.name}-${itemsLoaded}` }) || {})}
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
                if (!currentTypeItem) {
                    props.onChange(item.key);
                    return;
                }
                // if current advisory statement field value is empty, or it's a default statement text,
                // then update it to the selected type's statement text (item.id - see flattenCVOTree method above)
                const currentStatement = getValues(props.advisoryStatementFieldName)?.plainText?.trim?.();
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
