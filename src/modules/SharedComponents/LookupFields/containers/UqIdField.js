/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';
import Fuse from 'fuse.js';

export const UqIdField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = '') => dispatch(actions.searchAuthors(searchQuery));

    const getUqUsername = item => {
        if (item.aut_org_username) return ` (${item.aut_org_username})`;
        else if (item.aut_student_username) return ` (${item.aut_student_username})`;
        else if (item.aut_ref_num) return ` (${item.aut_ref_num})`;
        else return '';
    };
    const fuseOptions = {
        useExtendedSearch: true,
        ignoreLocation: false,
        ignoreFieldNorm: false,
        keys: [
            'id',
            'aut_id',
            'aut_display_name',
            'aut_org_username',
            'aut_student_username',
            'aut_ref_num',
            'aut_orcid_id',
        ],
    };

    const { authorsListLoading, authorsList } = useSelector(state => state.get('authorsReducer'));
    const itemsList = React.useMemo(
        () =>
            (authorsList || [])
                .filter(
                    item =>
                        !!item.aut_org_username || !!item.aut_student_username || !!item.aut_ref_num || !item.aut_id,
                )
                .map(item => ({
                    value: `${item.aut_title} ${item.aut_display_name}${getUqUsername(item)}`,
                    id: item.aut_id,
                    ...item,
                })),
        [authorsList],
    );

    return (
        <AutoCompleteAsynchronousField
            {...props}
            autoCompleteAsynchronousFieldId={props.uqIdFieldId || 'aut-id'}
            itemsList={itemsList}
            itemsLoading={authorsListLoading}
            defaultValue={(!!props.value && { value: props.value }) || null}
            getOptionLabel={
                (!!props.getOptionLabel && props.getOptionLabel) || (option => (option && option.value) || '')
            }
            filterOptions={(options, { inputValue }) => {
                const fuseAutocompleteOptions = new Fuse(options, fuseOptions);
                return fuseAutocompleteOptions.search(inputValue).map(item => item.item);
            }}
            error={!!props.meta && !!props.meta.error}
            errorText={(!!props.meta && props.meta.error) || props.hintText || 'Enter a value to search'}
            floatingLabelText={props.floatingLabelText || 'UQ Identifier'}
            OptionTemplate={GenericOptionTemplate}
            disabled={props.disabled}
            loadSuggestions={loadSuggestions}
            clearSuggestions={() => dispatch(actions.clearAuthorsSuggestions())}
            onChange={props.onChange || (!!props.input && props.input.onChange)}
            onClear={!!props.value || (!!props.input && !!props.input.value) ? props.onClear : () => {}}
        />
    );
};

UqIdField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(UqIdField);
