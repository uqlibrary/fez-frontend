import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

const SpecialCharactersGrid = ({ characters, onHover, onSelect }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 32px)',
                justifyContent: 'space-between',
                gap: 0.5,
                overflowY: 'auto',
                alignContent: 'start',
            }}
        >
            {characters.map(character => (
                <ButtonBase
                    key={character.unicode}
                    onMouseEnter={() => onHover(character)}
                    onClick={() => onSelect(character.char)}
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: 18,
                        borderRadius: 0.5,

                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    {character.char}
                </ButtonBase>
            ))}
        </Box>
    );
};

SpecialCharactersGrid.propTypes = {
    characters: PropTypes.arrayOf(
        PropTypes.shape({
            char: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            unicode: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onHover: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default React.memo(SpecialCharactersGrid);
