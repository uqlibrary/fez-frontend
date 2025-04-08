import React from 'react';
import PropTypes from 'prop-types';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { CONTENT_INDICATORS_DOCTYPE_BLACKLIST, CONTENT_INDICATORS_COLLECTIONS_BLACKLIST } from 'config/general';
import { useContentIndicators } from 'hooks';

export const getSelected = props => props?.value || [];

export const showContentIndicatorsField = record => {
    const isBlacklistedType =
        record && record.rek_display_type && CONTENT_INDICATORS_DOCTYPE_BLACKLIST.includes(record.rek_display_type);

    const recordCollectionPids =
        (record &&
            record.fez_record_search_key_ismemberof &&
            record.fez_record_search_key_ismemberof.map(item => item.rek_ismemberof)) ||
        [];
    const inBlacklistedCollection =
        recordCollectionPids &&
        CONTENT_INDICATORS_COLLECTIONS_BLACKLIST.some(collectionPid => recordCollectionPids.includes(collectionPid));

    return !isBlacklistedType && !inBlacklistedCollection;
};

export const getContentIndicatorsItemsList = (items, props = {}) => {
    return items.map(item => ({
        ...item,
        disabled: !props.canUnselect && !!props?.defaultValue?.includes?.(item?.value),
    }));
};

export const ContentIndicatorsField = props => {
    const items = useContentIndicators(props.displayType);
    return (
        <NewGenericSelectField
            itemsList={getContentIndicatorsItemsList(items, props)}
            locale={{ label: props.label }}
            value={getSelected(props)}
            onChange={(!!props && props.onChange) || undefined}
            errorText={(!!props.meta && props.meta.error) || ''}
            error={(!!props.meta && !!props.meta.error) || false}
            {...props}
            disabled={props.disabled || (!props.canUnselect && props?.defaultValue?.length === items.length)}
            genericSelectFieldId="rek-content-indicator"
        />
    );
};

ContentIndicatorsField.propTypes = {
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    meta: PropTypes.object,
    label: PropTypes.string,
    displayType: PropTypes.number,
    disabled: PropTypes.bool,
    canUnselect: PropTypes.bool,
};

export default ContentIndicatorsField;
