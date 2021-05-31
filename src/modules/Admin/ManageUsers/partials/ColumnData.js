import React from 'react';
import PropTypes from 'prop-types';
// import Typography from '@material-ui/core/Typography';
import Copy from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    columnData: {
        fontSize: 14,
        fontWeight: 400,
        width: '100%',
    },
}));

export const ColumnData = ({ columnDataId, data, copiable }) => {
    const classes = useStyles();
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
                data-testid={columnDataId}
                className={classes.columnData}
                value={!!data ? data : ''}
                readOnly
                fullwidth
                {...(!!copiable
                    ? {
                          endAdornment: (
                              <InputAdornment position="end">
                                  <Tooltip title="Copy to clipboard">
                                      <IconButton
                                          aria-label="Copy to clipboard"
                                          onClick={handleCopy}
                                          id={`${columnDataId}-copy-text`}
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
