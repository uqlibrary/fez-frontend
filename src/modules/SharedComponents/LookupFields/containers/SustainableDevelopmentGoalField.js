import React, { useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import * as actions from 'actions';
import { matchSorter } from 'match-sorter';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';
import { SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID as sdgCVOTreeRootId } from '../../../../config/general';

const flattenSDGCVOTree = data =>
    data?.reduce?.((acc, item) => {
        const children = item.controlled_vocab.controlled_vocab_children;
        // SDGs themselves should not be allowed to be selected
        // in case, if there are no SDG sources, ignore it
        if (!children.length) {
            return acc;
        }
        // flatten children
        const { cvo_id: sdgCVOId, cvo_title: sdgName } = item.controlled_vocab;
        return acc.concat(
            children
                .map(child => ({
                    key: child.controlled_vocab.cvo_id,
                    value: child.controlled_vocab.cvo_title,
                    group: sdgName,
                    sdgCVOId,
                }))
                // sort to avoid group dups
                .sort((a, b) => a.value.localeCompare(b.value)),
        );
    }, []) || [];

const SustainableDevelopmentGoalField = props => {
    const dispatch = useDispatch();
    const { rawData, itemsLoading, itemsLoaded } = useSelector(
        state => state.get('controlledVocabulariesReducer')?.[sdgCVOTreeRootId],
    ) || { rawData: [], itemsLoading: false, itemsLoaded: false };
    const itemsLoadedLocalRef = useRef(itemsLoaded);

    const loadSuggestions = useCallback(() => {
        if (itemsLoadedLocalRef.current) return;
        itemsLoadedLocalRef.current = true;
        dispatch(actions.loadVocabulariesList(sdgCVOTreeRootId));
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const itemsList = useMemo(() => flattenSDGCVOTree(rawData), [rawData.length]);

    return (
        <AutoCompleteAsynchronousField
            id="sustainable-development-goal-input"
            autoCompleteAsynchronousFieldId={'rek-sustainable-development-goal'}
            onChange={props.input.onChange}
            errorText={props.meta ? props.meta.error : props.errorText}
            error={props.meta ? !!props.meta.error : !!props.error || null}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['group', 'value'] })}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            defaultValue={!!props.input && !!props.input.value ? { value: props.input.value } : null}
            getOptionLabel={() => ''}
            OptionTemplate={FoROptionTemplate}
            groupBy={option => option.group}
            onChange={value => props.input?.onChange({ ...value, value: `${value.group} - ${value.value}` })}
            clearOptionOnClose={false}
            loadSuggestions={loadSuggestions}
            {...props}
        />
    );
};

SustainableDevelopmentGoalField.propTypes = {
    input: PropTypes.object,
    ...PropTypes.any,
};

export default SustainableDevelopmentGoalField;
