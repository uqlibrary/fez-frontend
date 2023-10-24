import React from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { sanitiseId } from 'helpers/general';

const JournalsListHeaderCol2Full = ({ journal }) => {
    const id = sanitiseId(`journal-list-header-full-${journal.key}`);
    return (
        <Grid item key={journal.key} id={id} data-testid={id} style={{ width: journal.size, height: 34 }}>
            <Tooltip title={journal.titleTooltip || ''}>
                <InputLabel
                    shrink
                    style={{ lineHeight: 1.1, whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}
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
                        paddingRight: journal.size < 120 ? 15 : 0,
                        float: 'right',
                    }}
                >
                    <HelpIcon {...journal.titleHelp} testId={journal.key} iconSize={'small'} />
                </Grid>
            )}
        </Grid>
    );
};

JournalsListHeaderCol2Full.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2Full);
