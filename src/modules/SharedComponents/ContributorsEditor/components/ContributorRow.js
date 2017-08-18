import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import RadioButtonCheckedIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';


import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class ContributorRow extends Component {

    static propTypes = {
        index: PropTypes.number.isRequired,
        contributor: PropTypes.object.isRequired,
        canMoveUp: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        onMoveUp: PropTypes.func,
        onMoveDown: PropTypes.func,
        onDelete: PropTypes.func,
        showIdentifierLookup: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        onContributorAssigned: PropTypes.func,
        locale: PropTypes.object,
        contributorSuffix: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        contributorSuffix: ' listed contributor',
        locale: {
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth'],
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete record',
                confirmationMessage: 'Are you sure you want to delete this record?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    }

    _deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) this.props.onDelete(this.props.contributor, this.props.index);
    }

    _onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) this.props.onMoveUp(this.props.contributor, this.props.index);
    }

    _onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) this.props.onMoveDown(this.props.contributor, this.props.index);
    }

    _onContributorAssigned = () => {
        if (!this.props.disabled && this.props.onContributorAssigned) this.props.onContributorAssigned(this.props.contributor, this.props.index);
    }

    render() {
        const {ordinalData, deleteRecordConfirmation} = this.props.locale;
        const contributorOrder = (this.props.index < ordinalData.length ?
            ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.contributorSuffix;

        return (
            <div className="columns is-gapless is-mobile contributorsRow datalist datalist-row">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteRecord}
                    locale={deleteRecordConfirmation} />
                {
                    this.props.showContributorAssignment &&
                    <div className="column is-1-desktop is-1-tablet is-1-mobile contributorIdentifier datalist-text">
                       <Checkbox
                           name="contributorAssignment"
                           onCheck={this._onContributorAssigned}
                           checkedIcon={<RadioButtonCheckedIcon />}
                           uncheckedIcon={<RadioButtonUncheckedIcon />}
                           checked={this.props.contributor.selected}
                           value={this.props.index} />
                    </div>
                }
                <div className="column datalist-text">
                    <span className="contributorName">{this.props.contributor.nameAsPublished}</span>
                    <span className="contributorSubtitle datalist-text-subtitle">{contributorOrder}</span>
                </div>
                {
                    this.props.showIdentifierLookup &&
                    <div className="column is-3-desktop is-3-tablet is-5-mobile contributorIdentifier datalist-text">
                        <strong>{this.props.contributor.aut_title} {this.props.contributor.aut_display_name}</strong>
                        <br/>
                        <small>{this.props.contributor.aut_org_username}</small>
                    </div>
                }
                <div className="column is-narrow is-hidden-mobile contributorReorder datalist-buttons">
                    {this.props.canMoveUp &&
                    <IconButton
                        tooltip={this.props.locale.moveUpHint}
                        onTouchTap={this._onMoveUp}
                        className="reorderUp"
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">keyboard_arrow_up</FontIcon>
                    </IconButton>
                    }
                    {this.props.canMoveDown &&
                    <IconButton
                        tooltip={this.props.locale.moveDownHint}
                        onTouchTap={this._onMoveDown}
                        className="reorderDown"
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                    </IconButton>
                    }
                </div>
                <div className="column is-narrow contributorDelete datalist-buttons">
                    <IconButton
                        tooltip={this.props.locale.deleteHint}
                        onTouchTap={this._showConfirmation}
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

