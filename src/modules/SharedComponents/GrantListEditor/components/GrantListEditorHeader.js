import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteForever from '@material-ui/icons/DeleteForever';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid/Grid';
import Hidden from '@material-ui/core/Hidden';

export class GrantListEditorHeader extends PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        classes: PropTypes.object,
        width: PropTypes.string,
        hideType: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
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
        hideType: false,
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    handleConfirmationBoxRef = ref => (this.confirmationBox = ref);

    render() {
        const {
            GrantAgencyName,
            GrantID,
            GrantAgencyType,
            deleteAll,
            deleteAllConfirmation,
            reorderColumn,
        } = this.props.locale;
        const { classes } = this.props;
        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={this.handleConfirmationBoxRef}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                <ListItem classes={{ root: classes.header }}>
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
                                <Hidden xsDown>
                                    <Grid item sm={3}>
                                        <ListItemText
                                            secondary={GrantID}
                                            secondaryTypographyProps={{ variant: 'caption' }}
                                            style={{ padding: 0 }}
                                        />
                                    </Grid>
                                    {!this.props.hideType && (
                                        <Grid item sm={4}>
                                            <ListItemText
                                                secondary={GrantAgencyType}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                                style={{ padding: 0 }}
                                            />
                                        </Grid>
                                    )}
                                </Hidden>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} sm={1} md={3}>
                            <ListItemSecondaryAction
                                style={{ position: 'relative', width: '100%', margin: '0 0 -32px 0' }}
                            >
                                <Grid container spacing={0}>
                                    <Hidden smDown>
                                        <Grid item xs={8}>
                                            <ListItemText
                                                secondary={reorderColumn}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                                style={{ padding: 0 }}
                                                classes={{ root: classes.right }}
                                            />
                                        </Grid>
                                    </Hidden>
                                    <Grid
                                        item
                                        xs={this.props.width === 'xs' || this.props.width === 'sm' ? 12 : 4}
                                        style={{ textAlign: 'right' }}
                                    >
                                        <Tooltip
                                            title={deleteAll}
                                            disableFocusListener={this.props.disabled}
                                            disableHoverListener={this.props.disabled}
                                            disableTouchListener={this.props.disabled}
                                        >
                                            <div style={{ display: 'inline' }}>
                                                <IconButton
                                                    onClick={this._showConfirmation}
                                                    disabled={this.props.disabled}
                                                    aria-label={deleteAll}
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
    }
}

export const styles = () => ({
    right: {
        textAlign: 'right',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        marginTop: 8,
        padding: 0,
        paddingBottom: 6,
    },
    paddingRight24: {
        paddingRight: 24,
    },
    paddingRight36: {
        paddingRight: 36,
    },
    paddingRight14: {
        paddingRight: 14,
    },
});

export default withStyles(styles)(withWidth()(GrantListEditorHeader));
