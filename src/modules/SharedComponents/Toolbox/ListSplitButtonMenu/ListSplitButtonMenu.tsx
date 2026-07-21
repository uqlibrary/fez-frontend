import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from 'modules/SharedComponents/Toolbox/ListSplitButtonMenu/ListItemText';
import Add from '@mui/icons-material/Add';
import { Box } from '@mui/material';

export type ListSplitButtonItem = {
    id: string | number;
    label: string;
};

export type ListSplitButtonMenuProps = {
    id?: string;
    items: ListSplitButtonItem[];
    selectedIndex: number;
    onItemSelect: (index: number) => void;
    onClick: () => void;
    onAdd?: () => void;
    label: (selectedItem: ListSplitButtonItem) => string;
    loading?: boolean;
    disabled?: boolean;
    sx?: object;
    // optional controlled open state - falls back to internal state when omitted
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    clickAwayExcludeRef?: React.RefObject<Element | null> | null;
};

const ListSplitButtonMenu: React.FC<ListSplitButtonMenuProps> = ({
    id = 'split-button-menu',
    items,
    selectedIndex,
    onItemSelect,
    onClick,
    onAdd,
    label,
    loading = false,
    disabled = false,
    sx = {},
    open: openProp,
    onOpenChange,
    clickAwayExcludeRef = null,
}) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const setOpen = (value: boolean) => (isControlled ? onOpenChange?.(value) : setInternalOpen(value));
    const selectedItem = items[selectedIndex];

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = (event: Event) => {
        const target = event.target as HTMLElement;
        if (
            (anchorRef.current && anchorRef.current.contains(target)) ||
            clickAwayExcludeRef?.current?.contains?.(target)
        ) {
            return;
        }
        setOpen(false);
    };

    const handleItemSelection = (index: number) => {
        onItemSelect(index);
        setOpen(false);
    };

    const handleAdd = () => onAdd?.();

    return (
        <>
            <ButtonGroup ref={anchorRef} variant="contained" sx={sx}>
                {/* action button */}
                <Button
                    onClick={onClick}
                    aria-label={selectedItem ? undefined : 'Add to list'}
                    sx={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        minWidth: 0,
                    }}
                    disabled={disabled}
                >
                    <span
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {selectedItem ? label(selectedItem) : ''}
                    </span>
                </Button>
                {/* list trigger button */}
                <Button
                    size="small"
                    onClick={handleToggle}
                    aria-haspopup="menu"
                    aria-expanded={open ? 'true' : undefined}
                    aria-controls={open ? id : undefined}
                    aria-label={open ? 'Close list options' : 'Open list options'}
                >
                    {loading ? (
                        <CircularProgress aria-label="Loading..." size={16} style={{ marginLeft: 8 }} />
                    ) : (
                        <ArrowDropDownIcon aria-label="Open list options" />
                    )}
                </Button>
            </ButtonGroup>

            {/* list */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
                sx={{
                    zIndex: 1300,
                    width: anchorRef.current?.offsetWidth,
                }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? /* istanbul ignore next */ 'center top' : 'center bottom',
                        }}
                    >
                        <Paper sx={{ mt: 1, width: '100%' }} elevation={8}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    {/* add button */}
                                    {onAdd && (
                                        <MenuList sx={{ pb: 0 }}>
                                            <MenuItem onClick={handleAdd} key="add-new">
                                                <ListItemIcon>
                                                    <Add fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>Add new</ListItemText>
                                            </MenuItem>
                                            <Divider sx={{ pb: 0 }} />
                                        </MenuList>
                                    )}
                                    {/* list items */}
                                    <MenuList
                                        sx={{
                                            pt: 0,
                                            maxHeight: 360,
                                            overflowX: 'hidden',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {items.map((item, index) => (
                                            <MenuItem
                                                key={item.id}
                                                selected={selectedIndex === index}
                                                onClick={() => handleItemSelection(index)}
                                            >
                                                <ListItemIcon>
                                                    {selectedIndex === index ? <CheckIcon fontSize="small" /> : null}
                                                </ListItemIcon>
                                                <ListItemText>{item.label}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default React.memo(ListSplitButtonMenu);
