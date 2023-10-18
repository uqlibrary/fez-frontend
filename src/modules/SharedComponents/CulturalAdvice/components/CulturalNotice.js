import React from 'react';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { locale } from 'locale';

const StyledCulturalNoticeParent = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('xs')]: {
        minHeight: 85,
    },
    [theme.breakpoints.up('sm')]: {
        minHeight: 85,
    },
}));
const StyledCulturalNoticeImage = styled('img')(({ theme }) => ({
    float: 'left',
    display: 'inline-block',
    padding: '0 15px 5px 0',
    [theme.breakpoints.up('xs')]: {
        height: 100,
    },
    [theme.breakpoints.up('sm')]: {
        height: 85,
    },
    [theme.breakpoints.up('md')]: {
        height: 70,
    },
}));

const CulturalNotice = () => {
    const txt = locale.components.culturalNoticeOC;
    return (
        <StandardCard title={txt.title} primaryHeader>
            <StyledCulturalNoticeParent>
                <StyledCulturalNoticeImage src={txt.imagePath} alt={txt.title} />
                <Typography variant={'body2'}>{txt.text}</Typography>
            </StyledCulturalNoticeParent>
        </StandardCard>
    );
};

export default CulturalNotice;
