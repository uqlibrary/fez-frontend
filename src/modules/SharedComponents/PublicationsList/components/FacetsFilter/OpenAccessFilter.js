import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FacetFilterListItem from './FacetFilterListItem';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

export const OpenAccessFilter = ({ onChange, disabled, isActive, locale }) => {
    const txt = locale;

    const updateFilter = useCallback(() => {
        onChange(!isActive);
    }, [isActive, onChange]);

    return (
        <FacetFilterListItem
            id="facet-category-open-access"
            key="open-access"
            title={txt.displayTitle}
            disabled={disabled}
            isActive={isActive}
            nestedItems={
                <FacetFilterNestedListItem
                    onFacetClick={updateFilter}
                    isActive={isActive}
                    primaryText={txt.activeFilter}
                    disabled={disabled}
                    index="open-access"
                />
            }
        />
    );
};

OpenAccessFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    locale: PropTypes.object,
};

export default React.memo(OpenAccessFilter);
