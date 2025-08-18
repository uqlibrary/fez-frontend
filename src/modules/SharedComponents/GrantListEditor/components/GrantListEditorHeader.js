import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteForever from '@mui/icons-material/DeleteForever';

import Grid from '@mui/material/Grid';
import { useWidth } from 'hooks';

export const GrantListEditorHeader = ({
    onDeleteAll,
    locale = {
        GrantAgencyName: 'Grant name',
        GrantID: 'Funder/sponsor ID',
        GrantAgencyType: 'Funder/sponsor type',
        reorderColumn: 'Reorder entries',
        deleteAll: 'Remove all entries',
        deleteAllConfirmation: {
            confirmationTitle: 'Delete all',
            confirmationMessage: 'Are you sure you want to delete all entries?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    },
    disabled,
    hideType = false,
}) => {
    const width = useWidth();
    const [confirmationBox, setConfirmationBox] = React.useState();

    const showConfirmation = () => {
        confirmationBox.showConfirmation();
    };

    const { GrantAgencyName, GrantID, GrantAgencyType, deleteAll, deleteAllConfirmation, reorderColumn } = locale;

    return (
        <Fragment>
            <ConfirmDialogBox onRef={setConfirmationBox} onAction={onDeleteAll} locale={deleteAllConfirmation} />
            <ListItem
                sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
                    marginTop: 1,
                    padding: 0,
                    paddingBottom: '6px',
                }}
            >
                <Grid container spacing={0}>
                    <Grid item xs={10} sm={11} md={9}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={5}>
                                <ListItemText
                                    secondary={GrantAgencyName}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                    style={{ padding: 0 }}
                                />
                            </Grid>
                            <Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <ListItemText
                                    secondary={GrantID}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                    style={{ padding: 0 }}
                                />
                            </Grid>
                            {!hideType && (
                                <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <ListItemText
                                        secondary={GrantAgencyType}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                        style={{ padding: 0 }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={2} sm={1} md={3}>
                        <ListItemSecondaryAction style={{ position: 'relative', width: '100%', margin: '0 0 -32px 0' }}>
                            <Grid container spacing={0}>
                                <Grid item xs={8} sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <ListItemText
                                        secondary={reorderColumn}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                        style={{ padding: 0 }}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={width === 'xs' || width === 'sm' ? 12 : 4}
                                    style={{ textAlign: 'right' }}
                                >
                                    <Tooltip
                                        title={deleteAll}
                                        disableFocusListener={disabled}
                                        disableHoverListener={disabled}
                                        disableTouchListener={disabled}
                                    >
                                        <div style={{ display: 'inline' }}>
                                            <IconButton
                                                onClick={showConfirmation}
                                                disabled={disabled}
                                                aria-label={deleteAll}
                                                size="large"
                                            >
                                                <DeleteForever />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
        </Fragment>
    );
};
GrantListEditorHeader.propTypes = {
    onDeleteAll: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    hideType: PropTypes.bool,
};

export default React.memo(GrantListEditorHeader);
