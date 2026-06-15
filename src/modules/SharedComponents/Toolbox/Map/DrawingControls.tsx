import * as React from 'react';
import type { TerraDraw } from 'terra-draw';
import { PanToolOutlined, PentagonTwoTone, RectangleTwoTone, Room } from '@mui/icons-material';
import { ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMap } from '@vis.gl/react-google-maps';

type DrawingControlsProps = {
    draw: TerraDraw | null;
} & React.ComponentPropsWithoutRef<typeof ButtonGroup>;

export type TerraDrawModeId = 'select' | 'marker' | 'polygon' | 'rectangle' | 'static';

const DrawingControls = ({ draw, ...props }: DrawingControlsProps) => {
    const [activeMode, setActiveMode] = React.useState<TerraDrawModeId>('static');
    const map = useMap();

    React.useEffect(() => {
        if (!draw || activeMode !== 'static') return;

        // default to `select` mode
        draw.setMode('select');
        setActiveMode('select');
    }, [draw, activeMode]);

    const handleModeChange = (modeId: TerraDrawModeId) => {
        if (!draw || !map) return;

        draw.setMode(modeId);
        // restore gesture handling when switching modes
        map.setOptions({ gestureHandling: 'greedy' });
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
            <ToggleButton value="select" aria-label="select" data-testid="select-button">
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
        </ToggleButtonGroup>
    );
};

export default React.memo(DrawingControls);
