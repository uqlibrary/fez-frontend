/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_OF_RESEARCH_VOCAB_ID } from 'config/general';

import { ControlledAutoCompleteAsynchronousField } from './ControlledAutoCompleteAsynchronousField';

const FieldOfResearch = props => {
    return (
        <ControlledAutoCompleteAsynchronousField
            {...props}
            id="field-of-research-field-input"
            autoCompleteAsynchronousFieldId={'rek-subject'}
            category={FIELD_OF_RESEARCH_VOCAB_ID}
        />
    );
};

const FilteredFieldOfResearch = props => {
    return (
        <FieldOfResearch
            {...props}
            filterOptions={(options, { inputValue }) => {
                return options.filter(option => {
                    const textMatchKey =
                        !!option.value &&
                        option.value
                            .toString()
                            .toLowerCase()
                            .includes(!!inputValue && inputValue.toString().toLowerCase());
                    const testKey = new RegExp(/^[0-9]{4}\s.*/gi); // Only return items from the list that match this regex of 4 digits, then a space, then anything
                    return testKey.test(option.value.toString()) && textMatchKey;
                });
            }}
            id="filtered-field-of-research-input"
        />
    );
};

FieldOfResearch.propTypes = {
    props: PropTypes.object,
};
FilteredFieldOfResearch.propTypes = {
    props: PropTypes.object,
};

const FieldOfResearchField = React.memo(FieldOfResearch);
const FilteredFieldOfResearchField = React.memo(FilteredFieldOfResearch);

export { FieldOfResearchField, FilteredFieldOfResearchField };
