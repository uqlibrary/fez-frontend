import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { sanitiseId } from 'helpers/general';

const JournalsListCollapsibleDataPanelContent = ({
    item,
    index,
    data,
    classes,
    isFirstRow = false,
    isLastRow = false,
}) => {
    const id = sanitiseId(item.key);
    return (
        <Grid
            xs={12}
            sm={6}
            item
            size="small"
            className={`${!isFirstRow ? classes?.collapsibleContainerDataRowTop : ''} ${
                !isLastRow ? classes?.collapsibleContainerDataRowBottom : ''
            }`}
        >
            <Box display="flex" alignItems="flex-end" key={item.key}>
                <Typography
                    variant="body1"
                    className={classes?.inputLabel}
                    component="span"
                    id={`journal-list-header-${id}-${index}`}
                    data-testid={`journal-list-header-${id}-${index}`}
                >
                    {item.label}
                    {!!item.subLabel && <span className={classes?.subLabel}>{item.subLabel}</span>}
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
    classes: PropTypes.object,
};
export default React.memo(JournalsListCollapsibleDataPanelContent);
