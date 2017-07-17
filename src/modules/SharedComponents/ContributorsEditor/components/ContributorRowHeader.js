import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class ContributorRowHeader extends Component {

    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        locale: PropTypes.object
    };

    static defaultProps = {
        locale: {
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
        const {nameColumn, identifierColumn, reorderColumn, deleteAll, deleteAllConfirmation} = this.props.locale;

        return (
            <div className="columns is-gapless is-mobile">
                <ConfirmDialogBox onRef={ref => (this.confirmationBox = ref)}
                                  onAction={this.props.onDeleteAll}
                                  locale={deleteAllConfirmation} />

                <div className="column">
                    <strong>{nameColumn}</strong>
                </div>
                {this.props.showIdentifierLookup &&
                <div className="column is-3-desktop is-3-tablet is-5-mobile">
                    <strong>{identifierColumn}</strong>
                </div>
                }
                <div className="column is-2-desktop is-2-tablet is-hidden-mobile is-centered">
                    <strong>{reorderColumn}</strong>
                </div>
                <div className="column is-1-desktop is-1-tablet is-1-mobile is-delete is-centered">
                    <IconButton tooltip={deleteAll} onTouchTap={this._showConfirmation}>
                        <FontIcon className="material-icons deleteIcon">delete_icon</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

