import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    '& .MuiListItem-gutters': {
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
    },
}));

export const FacetsFilterListItem = ({ title, disabled, nestedItems, id, isActive }) => {
    const [isOpen, setIsOpen] = useState(isActive || false);
    const handleIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    return (
        <Fragment key={`facet_fragment_${id}`}>
            <StyledListItem
                button
                disabled={disabled}
                id={`clickable-${id}`}
                data-testid={`clickable-${id}`}
                key={`facet_filter_${id}`}
                onClick={handleIsOpen}
                aria-expanded={isOpen}
            >
                <ListItemText disableTypography>
                    <Typography
                        id={id}
                        data-testid={id}
                        variant={'body2'}
                        color={'textPrimary'}
                        sx={{ fontWeight: 400 }}
                    >
                        {title}
                    </Typography>
                </ListItemText>
                {isOpen ? (
                    <ExpandLess id={`expand-less-${id}`} data-testid={`expand-less-${id}`} />
                ) : (
                    <ExpandMore id={`expand-more-${id}`} data-testid={`expand-more-${id}`} />
                )}
            </StyledListItem>
            {isOpen && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    {nestedItems}
                </Collapse>
            )}
        </Fragment>
    );
};

FacetsFilterListItem.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    nestedItems: PropTypes.any,
    title: PropTypes.string,
    isActive: PropTypes.bool,
};

export default React.memo(FacetsFilterListItem);
