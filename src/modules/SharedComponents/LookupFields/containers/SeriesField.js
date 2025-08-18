/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

const category = 'series';

export const SeriesField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            loadSuggestions={loadSuggestions}
            autoCompleteAsynchronousFieldId={props.seriesFieldId || 'rek-series'}
            allowFreeText
            defaultValue={(!!props?.value && { value: props.value, id: 1 }) || null}
            errorText={props.state?.error}
            error={!!props.state?.error}
            filterOptions={options => options}
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            id={'series-field-input'}
            onChange={item => props.onChange(item.value)}
            onClear={() => props.onChange(null)}
        />
    );
};

SeriesField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(SeriesField);
