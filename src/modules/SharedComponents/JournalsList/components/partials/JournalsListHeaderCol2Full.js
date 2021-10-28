import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const JournalsListHeaderCol2Full = ({ journal }) => {
    return (
        <Grid
            item
            key={journal.key}
            id={`journal-list-header-full-${journal.key}`}
            style={{ width: journal.size, height: 34 }}
        >
            <Tooltip title={journal.titleTooltip || ''}>
                <InputLabel
                    shrink
                    style={{ lineHeight: 1.3, whiteSpace: 'normal', textOverflow: 'ellipsis', fontWeight: 600 }}
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
                        marginTop: -45,
                        marginRight: journal.size < 250 ? 20 : 0,
                        paddingRight: journal.size < 120 ? 20 : 0,
                        float: 'right',
                    }}
                >
                    <HelpIcon {...journal.titleHelp} />
                </Grid>
            )}
        </Grid>
    );
};

JournalsListHeaderCol2Full.propTypes = {
    journal: PropTypes.object.isRequired,
};

export default React.memo(JournalsListHeaderCol2Full);
