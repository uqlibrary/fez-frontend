import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';

export default class ContributorRowHeader extends React.PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        isInfinite: PropTypes.bool
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
            },
            descriptionStep2: 'Step 2 - Select your name from the list below'
        },
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.showContributorAssignment !== nextProps.showContributorAssignment ||
        this.props.disabled !== nextProps.disabled ||
        this.props.isInfinite !== nextProps.isInfinite;
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {
            nameColumn, identifierColumn, reorderColumn, deleteAll, deleteAllConfirmation} = this.props.locale;
        return (
            <div>
                {this.props.showContributorAssignment && (<div><br/>{this.props.locale.descriptionStep2}</div>)}
                <div className="columns is-gapless is-mobile contributorsHeader datalist datalist-header">
                    <ConfirmDialogBox
                        onRef={ref => (this.confirmationBox = ref)}
                        onAction={this.props.onDeleteAll}
                        locale={deleteAllConfirmation}/>
                    <div className="column is-narrow iconSpacer is-hidden-mobile" />
                    <div className="column description datalist-title">{nameColumn}</div>
                    {
                        this.props.showIdentifierLookup &&
                        <div className="column identifier datalist-title is-hidden-mobile">{identifierColumn}</div>
                    }
                    <div className="column is-narrow is-hidden-mobile order datalist-title">{reorderColumn}</div>

                    <div className="column is-narrow buttons datalist-buttons">
                        <IconButton
                            tooltip={deleteAll}
                            tooltipPosition="top-left"
                            onTouchTap={this._showConfirmation}
                            disabled={this.props.disabled}>
                            <FontIcon className="material-icons">delete_forever</FontIcon>
                        </IconButton>
                    </div>
                    <div className={`column is-narrow scrollbar-spacer${this.props.isInfinite ? '-infinite' : ''}`} />
                </div>
            </div>
        );
    }
}

