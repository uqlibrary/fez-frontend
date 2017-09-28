import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class ContributorRowHeader extends Component {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            contributorAssignmentColumn: 'Select your name',
            nameColumn: 'Name as published',
            identifierColumn: 'UQ identifier',
            reorderColumn: 'Reorder records',
            deleteAll: 'Remove all records',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all records?',
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

    render() {
        const {
            nameColumn, identifierColumn, reorderColumn,
            deleteAll, deleteAllConfirmation, contributorAssignmentColumn
        } = this.props.locale;

        return (
            <div className="columns is-gapless is-mobile contributorsHeader datalist datalist-header">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllConfirmation}/>
                {
                    this.props.showContributorAssignment &&
                    <div className="column is-1-desktop is-1-tablet is-3-mobile authorAssignment datalist-title">
                        <label aria-hidden htmlFor="contributorAssignment">{contributorAssignmentColumn}</label>
                    </div>
                }
                <div className="column name datalist-title">{nameColumn}</div>
                {
                    this.props.showIdentifierLookup &&
                    <div
                        className="column is-3-desktop is-3-tablet is-5-mobile identifier datalist-title">{identifierColumn}</div>
                }
                <div className="column is-narrow is-hidden-mobile order datalist-title">{reorderColumn}</div>

                <div className="column is-narrow buttons datalist-buttons">
                    <IconButton
                        tooltip={deleteAll}
                        onTouchTap={this._showConfirmation}
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">delete_forever</FontIcon>
                    </IconButton>
                </div>
                <div className="column is-narrow scrollbar-spacer is-hidden-mobile" />
            </div>
        );
    }
}

