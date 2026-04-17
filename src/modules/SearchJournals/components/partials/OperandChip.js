import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { JOURNAL_SEARCH_OPERANDS } from 'config/general';
import { getDefaultOperand } from 'helpers/journalSearch';
import { sanitiseId } from 'helpers/general';

export const OperandChip = ({ onMenuItemClick, keyword }) => {
    const operand = keyword.operand || getDefaultOperand(keyword.type);

    const [anchorEl, setAnchorEl] = useState(null);
    const [label, setLabel] = useState(operand); // default chip text
    const open = Boolean(anchorEl);

    const handleChipClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = value => {
        setLabel(value);
        onMenuItemClick({ ...keyword, operand: value });
        setAnchorEl(null);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const idValue = sanitiseId(`operand-chip-${keyword.type}-${keyword.text}`);
    return (
        <>
            <Chip
                sx={theme => ({
                    [theme.breakpoints.down('sm')]: {
                        margin: '0 6px',
                    },
                })}
                id={idValue}
                data-testid={idValue}
                key={`${idValue}-${operand}`}
                label={label}
                variant="outlined"
                clickable
                onClick={handleChipClick}
            />

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {JOURNAL_SEARCH_OPERANDS.map(item => (
                    <MenuItem key={item} onClick={() => handleMenuItemClick(item)}>
                        {item}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

OperandChip.propTypes = {
    onMenuItemClick: PropTypes.func.isRequired,
    keyword: PropTypes.shape({
        type: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        operand: PropTypes.string,
    }).isRequired,
};

export default OperandChip;
