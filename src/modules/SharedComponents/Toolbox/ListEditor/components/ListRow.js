import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import Typography from '@material-ui/core/Typography';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { GenericTemplate } from './GenericTemplate';

export class ListRow extends PureComponent {
    static propTypes = {
        canEdit: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        canMoveUp: PropTypes.bool,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        form: PropTypes.string,
        hideReorder: PropTypes.bool,
        index: PropTypes.number.isRequired,
        item: PropTypes.any.isRequired,
        itemTemplate: PropTypes.func,
        locale: PropTypes.object,
        onDelete: PropTypes.func,
        onEdit: PropTypes.func,
        onMoveDown: PropTypes.func,
        onMoveUp: PropTypes.func,
    };

    static defaultProps = {
        locale: {
            moveUpHint: 'Move item up the order',
            moveDownHint: 'Move item down the order',
            deleteHint: 'Remove this item',
            editHint: 'Edit this item',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete item',
                confirmationMessage: 'Are you sure you want to delete this item?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        },
        itemTemplate: GenericTemplate,
        form: 'Form',
    };

    showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) {
            this.props.onDelete(this.props.item, this.props.index);
        }
    };

    _handleEdit = () => {
        const { onEdit, index } = this.props;
        !!onEdit && onEdit(index);
    };

    onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) {
            this.props.onMoveUp(this.props.item, this.props.index);
        }
    };

    onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) {
            this.props.onMoveDown(this.props.item, this.props.index);
        }
    };

    render() {
        const { item, disabled, hideReorder, canMoveUp, canMoveDown, classes, canEdit, index } = this.props;
        const {
            moveDownHint,
            moveUpHint,
            deleteHint,
            deleteRecordConfirmation,
            editHint,
            editButtonId,
        } = this.props.locale;
        const componentID = this.props.form.replace(/\s+/g, '');
        return (
            <div
                style={{ flexGrow: 1, padding: 8 }}
                className={`ListRow-${componentID} ListRow-${componentID}-${item.value || item}`}
            >
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.deleteRecord}
                    locale={deleteRecordConfirmation}
                />
                <Grid container alignItems="center" spacing={8} className={classes.row}>
                    <Grid item xs={hideReorder ? 10 : 5} sm={hideReorder ? 11 : 6} md={hideReorder ? 11 : 9}>
                        <this.props.itemTemplate item={item} />
                    </Grid>
                    {!hideReorder && (
                        <Grid item xs={5} sm={5} md={2} className={classes.center}>
                            <Grid container justify="flex-end">
                                {canMoveUp && (
                                    <Grid item>
                                        <Tooltip title={moveUpHint}>
                                            <IconButton onClick={this.onMoveUp} disabled={disabled}>
                                                <KeyboardArrowUp />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )}
                                {canMoveDown && (
                                    <Grid item>
                                        <Tooltip title={moveDownHint}>
                                            <IconButton onClick={this.onMoveDown} disabled={disabled}>
                                                <KeyboardArrowDown />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )}

                                {canEdit && (
                                    <Tooltip
                                        title={editHint}
                                        disableFocusListener={disabled}
                                        disableHoverListener={disabled}
                                        disableTouchListener={disabled}
                                    >
                                        <span>
                                            <IconButton
                                                aria-label={editHint}
                                                onClick={this._handleEdit}
                                                disabled={disabled}
                                                id={`${editButtonId}-${index}`}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                )}
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={2} sm={1} className={classes.center}>
                        <Tooltip title={deleteHint}>
                            <IconButton
                                onClick={this.showConfirmation}
                                disabled={disabled}
                                id={`delete-${this.props.index}`}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = () => ({
    center: {
        textAlign: 'center',
    },
    row: {
        marginLeft: 0,
        marginRight: 0,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
});

export default withStyles(styles)(ListRow);
