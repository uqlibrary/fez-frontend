import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class ListRowHeader extends Component {

    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            nameColumn: 'Name',
            reorderColumn: 'Reorder items',
            deleteAll: 'Remove all items',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all items?',
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

    render() {
        const {nameColumn, reorderColumn, deleteAll, deleteAllConfirmation} = this.props.locale;

        return (
            <div className="columns is-gapless is-mobile listHeader datalist datalist-header">
                <ConfirmDialogBox onRef={ref => (this.confirmationBox = ref)}
                                  onAction={this.props.onDeleteAll}
                                  locale={deleteAllConfirmation} />
                <div className="column name datalist-title">{nameColumn}</div>
                <div className="column is-narrow is-hidden-mobile order datalist-title">{reorderColumn}</div>
                <div className="column is-narrow buttons datalist-buttons">
                    <IconButton
                        tooltip={deleteAll}
                        onTouchTap={this.showConfirmation}
                        disabled={this.props.disabled}>
                        <FontIcon className="material-icons">delete_forever</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

