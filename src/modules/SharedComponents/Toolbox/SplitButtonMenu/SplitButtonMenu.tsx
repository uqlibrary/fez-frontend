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
import ListItemText from 'modules/SharedComponents/Toolbox/SplitButtonMenu/ListItemText';
import { Settings } from '@mui/icons-material';

export type SplitButtonItem = {
    id: string | number;
    label: string;
};

export type SplitButtonMenuProps = {
    id?: string;
    items: SplitButtonItem[];
    selectedIndex: number;
    onItemSelect: (index: number) => void;
    onClick: () => void;
    onSettings?: () => void;
    label: (selectedItem: SplitButtonItem) => string;
    loading?: boolean;
    disabled?: boolean;
    sx?: object;
};

const SplitButtonMenu: React.FC<SplitButtonMenuProps> = ({
    id = 'split-button-menu',
    items,
    selectedIndex,
    onItemSelect,
    onClick,
    onSettings,
    label,
    loading = false,
    disabled = false,
    sx = {},
}) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const selectedItem = items[selectedIndex];

    const handleToggle = () => {
        setOpen(prev => !prev);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    const handleItemSelection = (index: number) => {
        onItemSelect(index);
        setOpen(false);
    };

    const handleSettings = () => {
        onSettings?.();
        setOpen(false);
    };

    return (
        <>
            <ButtonGroup ref={anchorRef} variant="contained" sx={sx}>
                <Button
                    onClick={onClick}
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

                <Button
                    size="small"
                    onClick={handleToggle}
                    aria-haspopup="menu"
                    aria-expanded={open ? 'true' : undefined}
                    aria-controls={open ? id : undefined}
                >
                    {loading ? <CircularProgress size={16} style={{ marginLeft: 8 }} /> : <ArrowDropDownIcon />}
                </Button>
            </ButtonGroup>

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
                                <MenuList
                                    id={id}
                                    autoFocusItem
                                    sx={{
                                        maxHeight: 360,
                                        overflowY: 'auto',
                                    }}
                                >
                                    {onSettings && [
                                        <MenuItem key={`${id}-settings`} onClick={handleSettings}>
                                            <ListItemIcon>
                                                <Settings fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Manage lists</ListItemText>
                                        </MenuItem>,
                                        <Divider key={`${id}-settings-divider`} />,
                                    ]}

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
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default React.memo(SplitButtonMenu);
