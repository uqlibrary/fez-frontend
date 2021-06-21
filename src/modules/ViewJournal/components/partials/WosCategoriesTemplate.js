import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const WosCategoriesTemplate = ({ data, templateProps }) => {
    const { filterFn, categoryId } = templateProps;

    return data.filter(filterFn).map((categoryItem, index) => {
        const idPrefix = `wos-${categoryId}-${index}-category`;
        const categoryNames = (categoryItem.jnl_wos_category_lookup || '').split('|');
        const categoryIssns = (categoryItem.jnl_wos_category_issn || '').split('|');
        return categoryNames.map((categoryName, categoryIndex) => (
            <Typography variant="body2" key={`${idPrefix}${categoryName}`} data-testid={`${idPrefix}${categoryIndex}`}>
                {`${categoryName.trim()}${(!!categoryIssns[categoryIndex] &&
                    ' (' + categoryIssns[categoryIndex] + ')') ||
                    ''}`}
            </Typography>
        ));
    });
};

WosCategoriesTemplate.propTypes = {
    data: PropTypes.array,
    templateProps: PropTypes.object,
};

export default WosCategoriesTemplate;
