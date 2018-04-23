import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from '../../ConfirmDialogBox';

export default class ListRow extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        item: PropTypes.any.isRequired,
        canMoveUp: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        onMoveUp: PropTypes.func,
        onMoveDown: PropTypes.func,
        onDelete: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        hideReorder: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            moveUpHint: 'Move item up the order',
            moveDownHint: 'Move item down the order',
            deleteHint: 'Remove this item',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete item',
                confirmationMessage: 'Are you sure you want to delete this item?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    };

    constructor(props) {
        super(props);
    }

    showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    }

    deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) this.props.onDelete(this.props.item, this.props.index);
    }

    onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) this.props.onMoveUp(this.props.item, this.props.index);
    }

    onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) this.props.onMoveDown(this.props.item, this.props.index);
    }

    render() {
        return (
            <div className="columns is-gapless is-mobile listRow datalist datalist-row">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.deleteRecord}
                    locale={this.props.locale.deleteRecordConfirmation}/>
                <div className="column datalist-text">
                    {
                        this.props.item.value ? this.props.item.value : this.props.item
                    }
                </div>
                <div className="column is-narrow is-hidden-mobile listReorder datalist-buttons">
                    {!this.props.hideReorder && this.props.canMoveUp &&
                    <IconButton
                        tooltip={this.props.locale.moveUpHint}
                        onTouchTap={this.onMoveUp}
                        className="reorderUp"
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">keyboard_arrow_up</FontIcon>
                    </IconButton>
                    }
                    {!this.props.hideReorder && this.props.canMoveDown &&
                    <IconButton
                        tooltip={this.props.locale.moveDownHint}
                        onTouchTap={this.onMoveDown}
                        className="reorderDown"
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                    </IconButton>
                    }
                </div>
                <div className="column is-narrow listDelete datalist-buttons">
                    <IconButton
                        className="itemDelete"
                        tooltip={this.props.locale.deleteHint}
                        onTouchTap={this.showConfirmation}
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

