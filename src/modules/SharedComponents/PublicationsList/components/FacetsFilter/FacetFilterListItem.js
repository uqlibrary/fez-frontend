import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

export const FacetsFilterListItem = ({ title, disabled, nestedItems, id, isActive }) => {
    const [isOpen, setIsOpen] = useState(isActive || false);
    const handleIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    return (
        <Fragment key={`facet_fragment_${id}`}>
            <ListItem key={`facet_filter_${id}`} disablePadding>
                <ListItemButton
                    disabled={disabled}
                    id={`clickable-${id}`}
                    data-testid={`clickable-${id}`}
                    onClick={handleIsOpen}
                    aria-expanded={isOpen}
                    sx={{ pl: 1, pr: 1 }}
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
                </ListItemButton>
            </ListItem>
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
