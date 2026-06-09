import * as React from 'react';
import { useTerraDraw, UseTerraDrawOptions } from './useTerraDraw';

type TerraDrawLayerProps = UseTerraDrawOptions & {
    children: (draw: ReturnType<typeof useTerraDraw>) => React.ReactNode;
};

const TerraDrawLayer = ({ children, ...props }: TerraDrawLayerProps) => {
    const draw = useTerraDraw(props);

    return <>{children(draw)}</>;
};

export default React.memo(TerraDrawLayer);
