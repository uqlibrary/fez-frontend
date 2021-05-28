import React from 'react';
import PropTypes from 'prop-types';

import { nodeJoin } from '../JournalView';

const WosCategories = ({ categoryData }) => {
    return categoryData.map((categoryList, categoryListIndex) => {
        const categoryListType = categoryList.jnl_wos_category_index.toLowerCase();
        const idPrefix = `wos-${categoryListType}${categoryListIndex}-category`;
        const categoryNames = (categoryList.jnl_wos_category || '').split('|');
        return nodeJoin(
            categoryNames.map((categoryName, categoryIndex) => (
                <span key={`${idPrefix}${categoryIndex}`} data-testid={`${idPrefix}${categoryIndex}`}>
                    {categoryName.trim()}
                </span>
            )),
            ', ',
        );
    });
};

WosCategories.propTypes = {
    categoryData: PropTypes.arrayOf(PropTypes.object),
};

export default WosCategories;
