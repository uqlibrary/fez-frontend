import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { HelpIcon } from '../../HelpDrawer';
import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    card: {
        overflow: 'unset',
        fontWeight: theme.typography.fontWeightRegular,
    },
    cardContentNoPadding: {
        padding: 0,
    },
    cardHeaderPrimary: {
        color: theme?.palette?.white?.main,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    cardHeaderAccent: {
        color: theme?.palette?.white?.main,
        backgroundColor: theme?.palette?.accent?.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    fullHeight: {
        border: '10px solid red',
        height: '100%',
    },
    responsiveHeader: {
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
    const classes = useStyles();
    const customBG = !!customBackgroundColor ? { backgroundColor: customBackgroundColor } : null;
    const customTitleBG = !!customTitleBgColor ? { backgroundColor: customTitleBgColor } : null;
    const customTitle = !!customTitleColor ? { color: customTitleColor } : null;
    const fullHeightActual = !!fullHeight ? { height: '100%' } : null;
    const squareTopActual = !!squareTop ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : null;
    const standardCardIdActual = !!standardCardId
        ? standardCardId
        : `standard-card${typeof title === 'string' ? '-' + title.replace(/ /g, '-').toLowerCase() : ''}`;
    return (
        <Card
            id={standardCardIdActual}
            data-testid={standardCardIdActual}
            className={`${classes.card} StandardCard`}
            style={{ ...customBG, ...customTitle, ...fullHeightActual }}
        >
            {!noHeader && (
                <CardHeader
                    style={{ ...squareTopActual, ...customTitleBG }}
                    title={title}
                    titleTypographyProps={{
                        variant: smallTitle ? 'h6' : 'h5',
                        component: subCard ? 'h4' : 'h3',
                        color: 'inherit',
                        'data-testid': `${standardCardIdActual}-header`,
                        id: `${standardCardIdActual}-header`,
                    }}
                    action={!!help && !!help.text && <HelpIcon {...help} />}
                    classes={{
                        root:
                            (primaryHeader && classes.cardHeaderPrimary) || (accentHeader && classes.cardHeaderAccent),
                        title: classes.responsiveHeader,
                    }}
                />
            )}
            <CardContent
                id={`${standardCardIdActual}-content`}
                data-analyticsid={`${standardCardIdActual}-content`}
                data-testid={`${standardCardIdActual}-content`}
                className={(noPadding && classes.cardContentNoPadding) || ''}
            >
                {children}
            </CardContent>
        </Card>
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
