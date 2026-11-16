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
            <ToggleButton value="static" aria-label="Pan the map view" data-testid="static-button">
                <PanToolOutlined fontSize="medium" />
            </ToggleButton>
            <ToggleButton value="marker" aria-label="Drop a marker on to the map" data-testid="marker-button">
                <Room fontSize="medium" />
            </ToggleButton>
            <ToggleButton
                value="polygon"
                aria-label="Draw a polygon-shaped boundary area on the map"
                data-testid="polygon-button"
            >
                <PentagonTwoTone fontSize="medium" />
            </ToggleButton>
            <ToggleButton
                value="rectangle"
                aria-label="Draw a rectangular-shaped boundary area on the map"
                data-testid="rectangle-button"
            >
                <RectangleTwoTone fontSize="medium" />
            </ToggleButton>
            <ToggleButton value="clear" aria-label="Clear all drawings from the map" data-testid="clear-button">
                <DeleteForever fontSize="medium" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default React.memo(DrawingControls);
