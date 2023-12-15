import React from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Tooltip from '@mui/material/Tooltip';
import { sanitiseId } from 'helpers/general';

const JournalsListHeaderCol2Min = ({ journal }) => {
    const id = sanitiseId(`journal-list-header-min-${journal.key}`);
    return (
        <Grid item key={journal.key} id={id} data-testid={id} style={{ width: journal.size, height: 34 }}>
            <Tooltip title={journal.titleTooltip || ''}>
                <InputLabel
                    shrink
                    style={{ lineHeight: 2, whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}
                >
                    {journal.label}
                    <span style={{ display: 'block', fontWeight: 400 }}>{journal.subLabel}</span>
                </InputLabel>
            </Tooltip>
            {!!journal.titleHelp && (
                <Grid
                    item
                    xs={2}
                    style={{
                        marginTop: -37,
                        marginRight: journal.size < 250 ? 10 : 0,
                        paddingRight: 15,
                        float: 'right',
                    }}
                >
                    <HelpIcon {...journal.titleHelp} testId={journal.key} iconSize={'small'} />
                </Grid>
            )}
        </Grid>
    );
};

JournalsListHeaderCol2Min.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2Min);
