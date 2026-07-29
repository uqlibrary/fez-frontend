import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import { useRichTextEditorContext } from 'mui-tiptap';

import { categories } from './characters';
import SpecialCharactersGrid from './SpecialCharactersGrid';

const PANEL_WIDTH = 324;
const PANEL_HEIGHT = 352;

const SpecialCharactersPicker = ({ open, position, onClose }) => {
    const editor = useRichTextEditorContext();

    const [category, setCategory] = useState('all');
    const [hoverCharacter, setHoverCharacter] = useState(null);

    const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });

    const dragging = useRef(false);
    const dragOffset = useRef({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        if (position) {
            setPanelPosition(position);
        }
    }, [position]);

    useEffect(() => {
        const handleMouseMove = event => {
            if (!dragging.current) {
                return;
            }

            setPanelPosition({
                x: event.clientX - dragOffset.current.x,
                y: event.clientY - dragOffset.current.y,
            });
        };

        const handleMouseUp = () => {
            dragging.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const insertCharacter = useCallback(
        character => {
            editor.chain().focus().insertContent(character).run();
        },
        [editor],
    );

    if (!open) {
        return null;
    }

    const selectedCategory = categories.find(item => item.id === category) ?? categories[0];

    const handleDragStart = event => {
        // only allow left mouse button
        if (event.button !== 0) {
            return;
        }

        dragging.current = true;

        dragOffset.current = {
            x: event.clientX - panelPosition.x,
            y: event.clientY - panelPosition.y,
        };
    };

    return (
        <Paper
            elevation={8}
            onMouseDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            sx={{
                position: 'fixed',

                top: panelPosition.y,
                left: panelPosition.x,

                width: PANEL_WIDTH,
                height: PANEL_HEIGHT,

                backgroundColor: 'background.paper',

                zIndex: theme => theme.zIndex.modal,

                display: 'flex',
                flexDirection: 'column',

                overflow: 'hidden',

                borderRadius: 1,

                // force paint above editor pseudo elements
                isolation: 'isolate',
            }}
        >
            {/* Header / Drag handle */}
            <Box
                onMouseDown={handleDragStart}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                    px: 1,
                    py: 0.5,

                    cursor: 'move',

                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        userSelect: 'none',
                    }}
                >
                    Special characters
                </Typography>

                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Body */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,

                    display: 'flex',
                    flexDirection: 'column',

                    p: 1,
                }}
            >
                <Select
                    value={category}
                    size="small"
                    variant="outlined"
                    onChange={event => setCategory(event.target.value)}
                    sx={{
                        width: '100%',
                        mb: 1,

                        fontSize: 12,

                        '& .MuiSelect-select': {
                            py: 0.5,
                        },
                    }}
                >
                    {categories.map(item => (
                        <MenuItem
                            key={item.id}
                            value={item.id}
                            sx={{
                                fontSize: 12,
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>

                <SpecialCharactersGrid
                    characters={selectedCategory.characters}
                    onHover={setHoverCharacter}
                    onSelect={insertCharacter}
                />
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                    px: 1,
                    py: 0.5,

                    minHeight: 24,

                    borderTop: theme => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 11,
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {hoverCharacter?.name ?? ''}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 11,
                        color: 'text.secondary',
                    }}
                >
                    {hoverCharacter?.unicode ?? ''}
                </Typography>
            </Box>
        </Paper>
    );
};

SpecialCharactersPicker.propTypes = {
    open: PropTypes.bool.isRequired,
    position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    editor: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default SpecialCharactersPicker;
