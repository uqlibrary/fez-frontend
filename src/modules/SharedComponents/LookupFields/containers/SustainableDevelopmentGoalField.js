import React from 'react';
import { ControlledAutoCompleteAsynchronousField } from './ControlledAutoCompleteAsynchronousField';
import { SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID } from '../../../../config/general';

export const SustainableDevelopmentGoalField = props => {
    return (
        <ControlledAutoCompleteAsynchronousField
            {...props}
            id="sustainable-development-goal-input"
            autoCompleteAsynchronousFieldId={'rek-sustainable-development-goal'}
            category={SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID}
        />
    );
};
