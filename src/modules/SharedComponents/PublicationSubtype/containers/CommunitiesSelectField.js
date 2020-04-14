import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const noHtmlConfig = { ALLOWED_TAGS: [''] };
    const dompurify = require('dompurify');
    const translatedItemList =
        state.get('communitiesReducer') &&
        state.get('communitiesReducer').itemsList.map((item, index) => {
            return { text: dompurify.sanitize(item.rek_title, noHtmlConfig), value: item.rek_pid, index: index + 1 };
        });
    return {
        value: props.input.value || '',
        itemsList: translatedItemList || [],
        itemsLoading: (state.get('communitiesReducer') && state.get('communitiesReducer').itemsLoading) || false,
        itemsLoadingError:
            (state.get('communitiesReducer') && state.get('communitiesReducer').itemsLoadingError) || false,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        multiple: props.multiple,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadItemsList: () => dispatch(actions.communitiesList()),
    };
}

const CommunitiesList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GenericSelectField);

export default function CommunitiesSelectField(fieldProps) {
    return (
        <CommunitiesList
            onChange={
                (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange)
            }
            {...fieldProps}
        />
    );
}
