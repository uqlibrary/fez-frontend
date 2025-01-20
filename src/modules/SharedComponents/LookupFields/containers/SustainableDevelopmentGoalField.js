import React from 'react';
import { ControlledAutoCompleteAsynchronousField } from './ControlledAutoCompleteAsynchronousField';
import { SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID } from '../../../../config/general';
import PropTypes from 'prop-types';
import { matchSorter } from 'match-sorter';

const flattenSDGCVOTree = data => {
    // console.log(data);
    // Memoize this function based on data reference changes, not stringified version
    return (
        data?.reduce?.((acc, item) => {
            // TODO add memoization
            // console.log(item); // This will now log only when data changes at reference level
            const children = item.controlled_vocab.controlled_vocab_children;
            // SDG itself should not be allowed to be selected
            // in this case, if there are no children (SDG source), don't display it
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
        }, []) || []
    );
};

const SustainableDevelopmentGoalField = props => {
    return (
        <ControlledAutoCompleteAsynchronousField
            {...props}
            id="sustainable-development-goal-input"
            autoCompleteAsynchronousFieldId={'rek-sustainable-development-goal'}
            category={SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID}
            dataTransformer={flattenSDGCVOTree}
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['group', 'value'] })}
            getOptionLabel={option => option.value}
            groupBy={option => option.group}
            onChange={value => props.input?.onChange({ ...value, value: `${value.group} - ${value.value}` })}
        />
    );
};

SustainableDevelopmentGoalField.propTypes = {
    input: PropTypes.object,
    ...PropTypes.any,
};

export default SustainableDevelopmentGoalField;
