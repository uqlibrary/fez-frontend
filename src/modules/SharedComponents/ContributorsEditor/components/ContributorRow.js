import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';

export default class ContributorRow extends React.PureComponent {
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
        disabledContributorAssignment: PropTypes.bool,
        onContributorAssigned: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            suffix: ' listed contributor',
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
            selectHint: 'Select this record ([name]) to assign it to you',
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

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    _deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) this.props.onDelete(this.props.contributor, this.props.index);
    };

    _onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) this.props.onMoveUp(this.props.contributor, this.props.index);
    };

    _onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) this.props.onMoveDown(this.props.contributor, this.props.index);
    };

    _onContributorAssignedKeyboard = (event) => {
        if (event.key === 'Enter') {
            this._assignContributor();
        }
    };

    _onContributorAssigned = (event) => {
        this._assignContributor();
        event && event.currentTarget.blur();
    };

    _assignContributor = () => {
        if(this.props.contributor.selected) {
            // deselect this contributor
            if (!this.props.disabled && this.props.onContributorAssigned) this.props.onContributorAssigned(null, null);
        } else {
            // select this contributor
            if (!this.props.disabled && this.props.onContributorAssigned) this.props.onContributorAssigned(this.props.contributor, this.props.index);
        }
    };

    render() {
        const {ordinalData, deleteRecordConfirmation} = this.props.locale;
        const contributorOrder = (this.props.index < ordinalData.length ?
            ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.locale.suffix;
        const ariaLabel = this.props.locale.selectHint && this.props.locale.selectHint.indexOf('[name]') > -1 ? this.props.locale.selectHint.replace('[name]', this.props.contributor.nameAsPublished) : null;
        return (
            <div id={this.props.index} className={`contributorsRow datalist datalist-row ${this.props.contributor.selected ? 'selected' : ''}` }>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteRecord}
                    locale={deleteRecordConfirmation} />
                <div className="columns is-gapless is-mobile">
                    <div className="column no-overflow">
                        {
                            this.props.showContributorAssignment && !this.props.disabledContributorAssignment ?
                                <div className="columns is-gapless contributorDetails"
                                    onClick={this._onContributorAssigned}
                                    onKeyDown={this._onContributorAssignedKeyboard}
                                    aria-label={ariaLabel}
                                    tabIndex="0" >
                                    <div className="column is-narrow is-hidden-mobile">
                                        <FontIcon className="authorIcon material-icons">{this.props.contributor.selected ? 'person' : 'person_outline'}</FontIcon>
                                    </div>
                                    <div className="column datalist-text contributor">
                                        <div className="contributorName no-overflow">
                                            <div className="columns is-gapless is-mobile">
                                                <div className="column is-narrow name">
                                                    {this.props.contributor.nameAsPublished}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="contributorSubtitle datalist-text-subtitle">{contributorOrder}</div>
                                    </div>
                                    {
                                        this.props.showIdentifierLookup &&
                                        <div className="column contributorIdentifier datalist-text">
                                            <div className="identifierName">{this.props.contributor.aut_title} {this.props.contributor.aut_display_name}</div>
                                            <div className="identifierSubtitle datalist-text-subtitle">{this.props.contributor.aut_org_username || this.props.contributor.aut_student_username}</div>
                                        </div>
                                    }
                                </div>
                                :
                                <div className="columns is-gapless contributorDetails is-mobile">
                                    <div className="column is-narrow is-hidden-mobile">
                                        <FontIcon className="authorIcon material-icons">person_outline</FontIcon>
                                    </div>
                                    <div className="column datalist-text contributor">
                                        <div className="contributorName no-overflow">{this.props.contributor.nameAsPublished}</div>
                                        <div className="contributorSubtitle datalist-text-subtitle">{contributorOrder}</div>
                                    </div>
                                    {
                                        this.props.showIdentifierLookup &&
                                        <div
                                            className="column contributorIdentifier datalist-text is-hidden-mobile">
                                            <div className="identifierName">{this.props.contributor.aut_title} {this.props.contributor.aut_display_name}</div>
                                            <div className="identifierSubtitle datalist-text-subtitle">{this.props.contributor.aut_org_username || this.props.contributor.aut_student_username}</div>
                                        </div>
                                    }
                                </div>
                        }
                    </div>
                    <div className="column is-narrow">
                        <div className="columns is-gapless contributorActions">
                            <div className="column is-narrow is-hidden-mobile contributorReorder datalist-buttons">
                                {this.props.canMoveUp ?
                                    <IconButton
                                        tooltip={this.props.locale.moveUpHint}
                                        tooltipPosition="bottom-left"
                                        onTouchTap={this._onMoveUp}
                                        className="reorderUp"
                                        disabled={this.props.disabled}
                                        aria-label={this.props.locale.moveUpHint}>
                                        <FontIcon className="material-icons">keyboard_arrow_up</FontIcon>
                                    </IconButton>
                                    :
                                    <div style={{width: '50px', height: '50px'}} />
                                }
                            </div>
                            <div className="column is-narrow is-hidden-mobile contributorReorder datalist-buttons">
                                {this.props.canMoveDown ?
                                    <IconButton
                                        tooltip={this.props.locale.moveDownHint}
                                        tooltipPosition="bottom-left"
                                        onTouchTap={this._onMoveDown}
                                        className="reorderDown"
                                        disabled={this.props.disabled}
                                        aria-label={this.props.locale.moveDownHint}>
                                        <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                                    </IconButton>
                                    :
                                    <div style={{width: '50px', height: '50px'}} />
                                }
                            </div>
                            <div className="column is-narrow contributorDelete datalist-buttons">
                                <IconButton
                                    className="contributorDelete"
                                    tooltip={this.props.locale.deleteHint}
                                    tooltipPosition="bottom-left"
                                    onTouchTap={this._showConfirmation}
                                    disabled={this.props.disabled}
                                    aria-label={this.props.locale.deleteHint}>
                                    <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

