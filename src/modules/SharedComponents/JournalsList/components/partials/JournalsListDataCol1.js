import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import PropTypes from 'prop-types';
import { sanitiseId } from 'helpers/general';

const JournalsListDataCol1 = ({ journal, index, onChange, checked = false, isSelectable = true }) => {
    return (
        <Grid
            container
            spacing={1}
            direction="row"
            id={`journal-list-data-col-1-${index}`}
            data-testid={`journal-list-data-col-1-${index}`}
            style={{
                borderBottom: '1px dashed #e6e6e6',
                borderRight: '1px dashed #e6e6e6',
                padding: 0,
                height: 48,
                overflow: 'hidden',
                minWidth: '50%',
            }}
            sx={{
                padding: 0,
                alignItems: 'center',
                alignContent: 'center',
            }}
        >
            {isSelectable && (
                <Grid style={{ height: 48 }} size={1}>
                    <Tooltip title={`Select ${journal.jnl_title}`} placement="right">
                        <Checkbox
                            id={`journal-list-data-col-1-checkbox-${index}`}
                            style={{ padding: 2, marginTop: 10 }}
                            value={journal.jnl_jid}
                            onChange={onChange}
                            checked={checked}
                            label={`Select ${journal.jnl_title}`}
                            inputProps={{
                                'aria-label': `Select ${journal.jnl_title}`,
                                'data-testid': `journal-list-data-col-1-checkbox-${index}`,
                            }}
                        />
                    </Tooltip>
                </Grid>
            )}
            <Grid
                id={`journal-list-data-col-1-title-${index}`}
                data-testid={`journal-list-data-col-1-title-${index}`}
                style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    paddingLeft: 12,
                    paddingRight: 16,
                    lineHeight: 2,
                }}
                size={11}
            >
                <Tooltip title={`Click for detailed view of ${journal.jnl_title}`} placement="right">
                    <Typography
                        variant="body1"
                        component="span"
                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        <ExternalLink
                            href={`/journal/view/${journal.jnl_jid}`}
                            title={journal.jnl_title}
                            id={sanitiseId(`${journal.jnl_jid}-${journal.jnl_title}`)}
                        >
                            {journal.jnl_title}
                        </ExternalLink>
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid size="grow" />
        </Grid>
    );
};

JournalsListDataCol1.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    isSelectable: PropTypes.bool,
};

export default React.memo(JournalsListDataCol1);
