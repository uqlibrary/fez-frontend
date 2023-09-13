import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { HelpIcon } from '../../HelpDrawer';

const StyledCard = styled(Card)(({ theme }) => ({
    overflow: 'unset',
    fontWeight: theme.typography.fontWeightRegular,
}));
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    borderRadius: '4px 4px 0px 0px',
    padding: '12px 24px',
    '& .MuiCardHeader-title': {
        [theme.breakpoints.down('sm')]: {
            ...theme.typography.h6,
        },
    },
}));

export const StandardCard = ({
    accentHeader,
    children,
    customBackgroundColor,
    customTitleBgColor,
    customTitleColor,
    fullHeight,
    help,
    noHeader,
    noPadding,
    primaryHeader,
    smallTitle = false,
    squareTop,
    standardCardId,
    subCard = false,
    title,
}) => {
    const customBG = !!customBackgroundColor ? { backgroundColor: customBackgroundColor } : null;
    const customTitleBG = !!customTitleBgColor ? { backgroundColor: customTitleBgColor } : null;
    const customTitle = !!customTitleColor ? { color: customTitleColor } : null;
    const fullHeightActual = !!fullHeight ? { height: '100%' } : null;
    const squareTopActual = !!squareTop ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : null;
    const standardCardIdActual = !!standardCardId
        ? standardCardId
        : `standard-card${typeof title === 'string' ? '-' + title.replace(/ /g, '-').toLowerCase() : ''}`;

    return (
        <StyledCard
            id={standardCardIdActual}
            data-testid={standardCardIdActual}
            className={'StandardCard'}
            sx={{ ...customBG, ...customTitle, ...fullHeightActual }}
        >
            {!noHeader && (
                <StyledCardHeader
                    sx={{
                        ...(accentHeader || primaryHeader
                            ? { color: 'white.main', backgroundColor: `${primaryHeader ? 'primary' : 'accent'}.main` }
                            : {}),
                        ...squareTopActual,
                        ...customTitleBG,
                    }}
                    title={title}
                    titleTypographyProps={{
                        variant: smallTitle ? 'h6' : 'h5',
                        component: subCard ? 'h4' : 'h3',
                        color: 'inherit',
                        'data-testid': `${standardCardIdActual}-header`,
                        id: `${standardCardIdActual}-header`,
                    }}
                    action={!!help && !!help.text && <HelpIcon {...help} />}
                />
            )}
            <CardContent
                id={`${standardCardIdActual}-content`}
                data-analyticsid={`${standardCardIdActual}-content`}
                data-testid={`${standardCardIdActual}-content`}
                sx={{ ...(noPadding ? { padding: 0 } : {}) }}
            >
                {children}
            </CardContent>
        </StyledCard>
    );
};

StandardCard.propTypes = {
    accentHeader: PropTypes.bool,
    children: PropTypes.any,
    customBackgroundColor: PropTypes.any,
    customTitleBgColor: PropTypes.any,
    customTitleColor: PropTypes.any,
    fullHeight: PropTypes.bool,
    help: PropTypes.object,
    noHeader: PropTypes.bool,
    noPadding: PropTypes.bool,
    primaryHeader: PropTypes.bool,
    smallTitle: PropTypes.bool,
    squareTop: PropTypes.bool,
    standardCardId: PropTypes.string,
    subCard: PropTypes.bool,
    title: PropTypes.any,
};

export default StandardCard;
