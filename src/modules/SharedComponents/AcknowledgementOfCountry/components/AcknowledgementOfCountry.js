import React from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@material-ui/core/Typography';
import { locale } from 'locale';

const AcknowledgementOfCountry = () => {
    const txt = locale.components.acknowledgementOfCountry;
    return (
        <StandardCard title={txt.title} primaryHeader>
            <Typography variant={'body2'}>{txt.text}</Typography>
        </StandardCard>
    );
};

export default AcknowledgementOfCountry;
