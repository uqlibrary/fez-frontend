import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Dialog from '@material-ui/core/Dialog';
import ErrorIcon from '@material-ui/icons/Error';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import componentsLocale from 'locale/components';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogBody: {
        gap: '1rem',
        marginBottom: '2rem',
        maxWidth: '40em',
    },
    exportButton: {
        width: '100%',
        '&.loading': {
            background: theme.palette.accent.dark,
            color: theme.palette.primary.contrastText,
        },
        '&.success svg': {
            color: theme.palette.success.dark,
        },
        '&.error': {
            background: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
        },
    },
}));

const BulkExport = ({
    locale: { buttonText, rowLabel, sizeMessage, successMessage },
    exportPublications,
    pageSize,
    totalMatches,
}) => {
    const { loadingByPage, loadedByPage } = useSelector(state => state.get('exportPublicationsReducer'));
    const [open, setOpen] = React.useState(false);
    const [exportPages, setExportPages] = React.useState([]);
    const hasSuccess = React.useRef(false);

    const classes = useStyles();

    const openDialog = () => {
        setOpen(true);
    };
    const closeDialog = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        hasSuccess.current = false;
        const newExportPages = [];
        for (let start = 1; start < totalMatches; start += pageSize) {
            const end = Math.min(start + pageSize - 1, totalMatches);
            newExportPages.push({ start, end, number: newExportPages.length + 1 });
        }
        setExportPages(newExportPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMatches]);

    const exportConfig = componentsLocale.components.export;

    const exportButtonsRender = (format, page) => {
        const exportConfigKey = `${format.value}-page-${page.number}`;
        let statusClass = '';
        let statusIcon = (
            <CloudDownloadIcon
                size="2rem"
                id={`${exportConfigKey}-available`}
                data-testid={`${exportConfigKey}-available`}
            />
        );
        if (loadingByPage[exportConfigKey] === true) {
            statusClass = 'loading';
            statusIcon = (
                <CircularProgress
                    size="1.25rem"
                    id={`${exportConfigKey}-loading`}
                    data-testid={`${exportConfigKey}-loading`}
                    color="inherit"
                />
            );
        } else if (loadedByPage[exportConfigKey] === true) {
            hasSuccess.current = true;
            statusClass = 'success';
            statusIcon = (
                <CloudDoneIcon size="2rem" id={`${exportConfigKey}-loaded`} data-testid={`${exportConfigKey}-loaded`} />
            );
        } else if (loadingByPage[exportConfigKey] === false) {
            statusClass = 'error';
            statusIcon = (
                <ErrorIcon size="2rem" id={`${exportConfigKey}-error`} data-testid={`${exportConfigKey}-error`} />
            );
        }

        const id = `bulk-export-${format.value}-${page.start}-to-${page.end}`;
        return (
            <Button
                children={format.label}
                className={`${classes.exportButton} ${statusClass}`}
                data-testid={id}
                disabled={['success', 'loading'].includes(statusClass)}
                endIcon={statusIcon}
                fullwidth
                id={id}
                key={format.value}
                onClick={() => {
                    exportPublications({
                        exportPublicationsFormat: format.value,
                        page: page.number,
                        pageSize,
                        bulkExportSelected: true,
                    });
                }}
                variant="contained"
            />
        );
    };

    const exportOptionRender = exportPages.map(page => {
        const id = `bulk-export-row-heading-${page.number}`;
        return (
            <Grid item data-testid={id} id={id} xs={12} key={page.number}>
                <Grid container spacing={2}>
                    <Grid item xs="auto" sm={6} md={5}>
                        {rowLabel.replace('[start]', page.start).replace('[end]', page.end)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={7}>
                        <Grid container spacing={2}>
                            {exportConfig.format.map(format => (
                                <Grid item xs={12} md={6} key={`page-${page.start}-${format.value}`}>
                                    {exportButtonsRender(format, page)}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    });

    return (
        <div id="bulk-export" data-testid="bulk-export">
            <Button
                variant="contained"
                children={buttonText}
                disabled={open}
                onClick={openDialog}
                data-testid="bulk-export-open"
                id="bulk-export-open"
            />
            <Dialog
                open={open}
                aria-labelledby="bulk-export-dialog-title"
                aria-describedby="bulk-export-instructions"
                className={classes.root}
                maxWidth="md"
            >
                <MuiDialogTitle disableTypography>
                    <Typography variant="h4" id="bulk-export-dialog-title">
                        {buttonText}
                    </Typography>
                    <IconButton aria-label="close" onClick={closeDialog} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>
                <MuiDialogContent>
                    <Grid container spacing={2} className={classes.dialogBody}>
                        <Grid item xs={12} id="bulk-export-instructions">
                            {sizeMessage.replace('[bulkExportSize]', pageSize)}
                        </Grid>
                        {hasSuccess.current && (
                            <Grid item xs={12}>
                                <Alert message={successMessage} type="info" />
                            </Grid>
                        )}
                        {exportOptionRender}
                    </Grid>
                </MuiDialogContent>
            </Dialog>
        </div>
    );
};

BulkExport.propTypes = {
    exportPublications: PropTypes.func,
    locale: PropTypes.shape({
        buttonText: PropTypes.string,
        rowLabel: PropTypes.string,
        sizeMessage: PropTypes.string,
        successMessage: PropTypes.string,
    }),
    pageSize: PropTypes.number,
    totalMatches: PropTypes.number,
};

export default BulkExport;
