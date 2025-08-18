import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Clear from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';

import { sanitiseId } from 'helpers/general';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    '&.MuiListItem-gutters': {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    ...theme.typography.body2,
    '&.MuiListItemText-inset': {
        '&:first-of-type ': {
            paddingLeft: theme.spacing(2),
        },
    },
}));

export function FacetsFilterNestedListItem({ onFacetClick, index, disabled, facet, primaryText, isActive }) {
    const itemText = primaryText.indexOf('(') > 0 ? primaryText.slice(0, primaryText.indexOf('(')) : primaryText;
    const idText = sanitiseId(`${facet}-${itemText}`);
    return (
        <StyledListItem
            id={`facet-filter-nested-item-${idText}`}
            data-testid={`facet-filter-nested-item-${idText}`}
            key={`facet-filter-nested-item-${index}`}
            button
            onClick={onFacetClick}
            disabled={disabled}
            aria-label={!isActive ? `${primaryText} add filter` : `${primaryText} remove filter`}
        >
            {isActive && (
                <ListItemIcon>
                    <Clear
                        id={`clear-facet-filter-nested-item-${typeof index === 'string' ? index : idText}`}
                        data-testid={`clear-facet-filter-nested-item-${typeof index === 'string' ? index : idText}`}
                        disabled={disabled}
                    />
                </ListItemIcon>
            )}
            <StyledListItemText {...(!isActive ? { inset: true } : { inset: false })} disableTypography>
                <Typography variant={'body2'} color={isActive ? 'primary' : 'inherit'}>
                    {primaryText}
                </Typography>
            </StyledListItemText>
        </StyledListItem>
    );
}

FacetsFilterNestedListItem.propTypes = {
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    facet: PropTypes.string,
    primaryText: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    onFacetClick: PropTypes.func.isRequired,
};

export default React.memo(FacetsFilterNestedListItem);
