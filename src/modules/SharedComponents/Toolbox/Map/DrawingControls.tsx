import * as React from 'react';
import type { TerraDraw } from 'terra-draw';
import { PanToolOutlined, PentagonTwoTone, RectangleTwoTone, Room, DeleteForever } from '@mui/icons-material';
import { ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMap } from '@vis.gl/react-google-maps';

type DrawingControlsProps = {
    draw: TerraDraw | null;
} & React.ComponentPropsWithoutRef<typeof ButtonGroup>;

export type ModeId = 'marker' | 'polygon' | 'rectangle' | 'static' | 'clear';

const DrawingControls = ({ draw, ...props }: DrawingControlsProps) => {
    const [activeMode, setActiveMode] = React.useState<ModeId>('static');
    const map = useMap();

    const handleModeChange = (modeId: ModeId) => {
        if (!draw || !map) return;

        if (modeId === 'clear') {
            draw.clear();
            setActiveMode(modeId);
            return;
        }

        draw.setMode(modeId);
        setActiveMode(modeId);
    };

    return (
        <ToggleButtonGroup
            data-testid="map-drawing-controls"
            exclusive
            value={activeMode}
            onChange={(_, value) => value && handleModeChange(value)}
            sx={{
                bgcolor: '#fff',
                height: 40,
                ...(props?.sx || {}),
            }}
        >
            <ToggleButton value="static" aria-label="static" data-testid="static-button">
                <PanToolOutlined fontSize="small" />
            </ToggleButton>
            <ToggleButton value="marker" aria-label="marker" data-testid="marker-button">
                <Room fontSize="small" />
            </ToggleButton>
            <ToggleButton value="polygon" aria-label="polygon" data-testid="polygon-button">
                <PentagonTwoTone fontSize="small" />
            </ToggleButton>
            <ToggleButton value="rectangle" aria-label="rectangle" data-testid="rectangle-button">
                <RectangleTwoTone fontSize="small" />
            </ToggleButton>
            <ToggleButton value="clear" aria-label="clear" data-testid="clear-button">
                <DeleteForever fontSize="small" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default React.memo(DrawingControls);
