/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';
import { RelatedServiceIdOptionTemplate } from 'modules/SharedComponents/LookupFields';
import { isValidDOIValue, isValidROR } from 'config/validation';

export const RelatedServiceIdField = props => {
    const dispatch = useDispatch();

    const loadSuggestions = (id = ' ') => {
        return (isValidROR(id) || isValidDOIValue(id)) && dispatch(actions.loadRelatedServiceList(id));
    };

    const { itemsList, itemsLoading } = useSelector(state => state.get('relatedServicesReducer'));

    return (
        <AutoCompleteAsynchronousField
            {...props}
            id={props.id}
            loadSuggestions={loadSuggestions}
            autoCompleteAsynchronousFieldId={'rek-related-service-id'}
            itemsList={itemsList.map(item => ({
                id: item.id || item.fez_record_search_key_doi?.rek_doi,
                value: item.id || item.fez_record_search_key_doi?.rek_doi,
                title: item.title || item.rek_title,
                ...item,
            }))}
            itemsLoading={itemsLoading}
            getOptionLabel={item => (!!item.value && item.value) || ''}
            filterOptions={(options, { inputValue }) => options.filter(option => option.value === inputValue)}
            defaultValue={(!!props.value && { value: props.value }) || null}
            OptionTemplate={RelatedServiceIdOptionTemplate}
            onChange={item => props.onChange(item)}
            onClear={() => props.onChange(null)}
            error={props.error}
            errorText={props.errorText || ''}
        />
    );
};

RelatedServiceIdField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(RelatedServiceIdField);
