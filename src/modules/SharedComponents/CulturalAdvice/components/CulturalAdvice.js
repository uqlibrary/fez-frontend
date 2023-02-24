import React from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { locale } from 'locale';
import Typography from '@mui/material/Typography';

const CulturalAdvice = () => {
    const txt = locale.components.culturalAdvice;
    return (
        <StandardCard title={txt.title} primaryHeader>
            <Typography variant={'body2'}>{txt.text}</Typography>
        </StandardCard>
    );
};

export default CulturalAdvice;
