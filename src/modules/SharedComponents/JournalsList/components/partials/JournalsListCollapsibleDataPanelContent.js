import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { sanitiseId } from 'helpers/general';

const classes = {
    inputLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        overflow: 'hidden',
        fontSize: '0.75rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.1,
        whiteSpace: 'normal',
        textOverflow: 'ellipsis',
        fontWeight: 600,
    },
    subLabel: {
        display: 'block',
        fontWeight: 400,
    },
    collapsibleContainerDataRowTop: {
        paddingTop: 2,
    },
    collapsibleContainerDataRowBottom: {
        paddingBottom: 1,
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
};

const JournalsListCollapsibleDataPanelContent = ({ item, index, data, isFirstRow = false, isLastRow = false }) => {
    const id = sanitiseId(item.key);
    return (
        <Grid
            xs={12}
            sm={6}
            item
            size="small"
            sx={{
                ...(!isFirstRow ? classes.collapsibleContainerDataRowTop : {}),
                ...(!isLastRow ? classes.collapsibleContainerDataRowBottom : {}),
            }}
        >
            <Box
                key={item.key}
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{ ...classes.inputLabel }}
                    component="span"
                    id={`journal-list-header-${id}-${index}`}
                    data-testid={`journal-list-header-${id}-${index}`}
                >
                    {item.label}
                    {!!item.subLabel && (
                        <Box component={'span'} sx={{ ...classes.subLabel }}>
                            {item.subLabel}
                        </Box>
                    )}
                </Typography>
                {!!item.titleHelp && (
                    <HelpIcon {...item.titleHelp} testId={`${item.key}-${index}`} iconSize={'small'} />
                )}
            </Box>
            <Typography
                variant="body1"
                id={`journal-list-data-${id}-${index}`}
                data-testid={`journal-list-data-${id}-${index}`}
            >
                {(data && item.prefix) || ''}
                {data || /* istanbul ignore next */ ''}
                {(data && item.suffix) || ''}
            </Typography>
        </Grid>
    );
};

JournalsListCollapsibleDataPanelContent.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.any.isRequired,
    isFirstRow: PropTypes.bool,
    isLastRow: PropTypes.bool,
};
export default React.memo(JournalsListCollapsibleDataPanelContent);
