import React from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@mui/material/Typography';
import { locale } from 'locale';

const GenAiTermsOfUse = () => {
    const txt = locale.components.genAiTermsOfUse;
    return (
        <StandardCard title={txt.title} primaryHeader>
            <Typography variant={'body2'}>{txt.text}</Typography>
        </StandardCard>
    );
};

export default GenAiTermsOfUse;
