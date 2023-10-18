import React from 'react';
import PropTypes from 'prop-types';

import Copy from '@mui/icons-material/FileCopyOutlined';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';

export const ColumnData = ({ columnDataId, data, copiable }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = event => {
        event.stopPropagation();
        navigator.clipboard.writeText(data).then(() => setCopied(true));
    };

    /* istanbul ignore next */
    const handleClose = () => setCopied(false);

    return (
        <React.Fragment>
            <InputBase
                id={columnDataId}
                inputProps={{
                    'data-testid': columnDataId,
                }}
                sx={{ fontSize: '14px', fontWeight: 400 }}
                value={!!data ? data : ''}
                readOnly
                {...(!!copiable
                    ? {
                          endAdornment: (
                              <InputAdornment position="end">
                                  <Tooltip title="Copy to clipboard">
                                      <IconButton
                                          aria-label="Copy to clipboard"
                                          onClick={handleCopy}
                                          id={`${columnDataId}-copy-text`}
                                          data-analyticsid={`${columnDataId}-copy-text`}
                                          data-testid={`${columnDataId}-copy-text`}
                                          size="small"
                                      >
                                          <Copy color="secondary" fontSize="small" />
                                      </IconButton>
                                  </Tooltip>
                              </InputAdornment>
                          ),
                      }
                    : {})}
            />
            <Snackbar
                id="copied-text-snackbar"
                data-testid="copied-text-snackbar"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={copied}
                onClose={handleClose}
                message="Text copied to Clipboard!"
                autoHideDuration={2000}
            />
        </React.Fragment>
    );
};

ColumnData.propTypes = {
    columnDataId: PropTypes.string.isRequired,
    copiable: PropTypes.bool,
    data: PropTypes.any,
};

export default React.memo(ColumnData);
