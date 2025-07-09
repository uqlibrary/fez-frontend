/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { matchSorter } from 'match-sorter';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';
import { SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID as cvoId } from '../../../../config/general';
import { useControlledVocabs } from 'hooks/useControlledVocabs';

const flattenSDGCVOTree = data =>
    data?.reduce?.((acc, item) => {
        const children = item.controlled_vocab.controlled_vocab_children;
        // SDGs themselves should not be allowed to be selected
        // in case there are no SDG sources, ignore it
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
    const { items, itemsLoading, fetch } = useControlledVocabs(cvoId, flattenSDGCVOTree);
    return (
        <AutoCompleteAsynchronousField
            id="sustainable-development-goal-input"
            autoCompleteAsynchronousFieldId={'rek-sustainable-development-goal'}
            errorText={props.state?.error || props.errorText}
            error={!!props.state?.error}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['group', 'value'] })}
            itemsList={items}
            itemsLoading={itemsLoading}
            defaultValue={!!props?.value ? { value: props.value } : null}
            getOptionLabel={() => ''}
            OptionTemplate={FoROptionTemplate}
            groupBy={option => option.group}
            onChange={value => props?.onChange?.({ ...value, value: `${value.group} - ${value.value}` })}
            onClear={() => {}}
            clearSuggestionsOnClose={false}
            loadSuggestions={fetch}
            {...props}
        />
    );
};

SustainableDevelopmentGoalField.propTypes = {
    props: PropTypes.object,
};

export default SustainableDevelopmentGoalField;
