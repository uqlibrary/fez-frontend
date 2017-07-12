import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ConfirmDialogBox from '../../ConfirmDialogBox/ConfirmDialogBox';

export default class ContributorRow extends Component {

    static propTypes = {
        index: PropTypes.number.isRequired,
        contributor: PropTypes.object.isRequired,
        contributorSuffix: PropTypes.string,
        canMoveUp: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        onMoveUp: PropTypes.func,
        onMoveDown: PropTypes.func,
        onDelete: PropTypes.func
    };

    static defaultProps = {
        contributorSuffix: 'listed contributor'
    };

    constructor(props) {
        super(props);

        this._showConfirmation = this._showConfirmation.bind(this);
        this._deleteRecord = this._deleteRecord.bind(this);
        this._onMoveUp = this._onMoveUp.bind(this);
        this._onMoveDown = this._onMoveDown.bind(this);
    }

    _showConfirmation() {
        this.confirmationBox.showConfirmation();
    }

    _deleteRecord() {
        if (this.props.onDelete) this.props.onDelete(this.props.contributor, this.props.index);
    }

    _onMoveUp() {
        if (this.props.onMoveUp) this.props.onMoveUp(this.props.contributor, this.props.index);
    }

    _onMoveDown() {
        if (this.props.onMoveDown) this.props.onMoveDown(this.props.contributor, this.props.index);
    }

    render() {
        const txt = {
            moveUp: 'Move record up the order',
            moveDown: 'Move record down the order',
            delete: 'Remove this record'
        };

        const ordinalData = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth'];

        const contributorOrder = (this.props.index < ordinalData.length ?
            ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.contributorSuffix;

        return (
            <div className="columns is-gapless is-mobile">
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteRecord}
                />
                <div className="column is-6-desktop is-6-tablet is-6-mobile">
                    <strong>{this.props.contributor.nameAsPublished}</strong>
                    <br/>
                    <small>{contributorOrder}</small>
                </div>
                <div className="column is-3-desktop is-3-tablet is-5-mobile">
                    <strong>{this.props.contributor.aut_title} {this.props.contributor.aut_display_name}</strong>
                    <br/>
                    <small>{this.props.contributor.aut_org_username}</small>
                </div>
                <div className="column is-1-desktop is-1-tablet is-hidden-mobile is-centered">
                    {this.props.canMoveUp &&
                    <IconButton tooltip={txt.moveUp} onTouchTap={this._onMoveUp}>
                        <FontIcon className="material-icons">keyboard_arrow_up</FontIcon>
                    </IconButton>
                    }
                </div>
                <div className="column is-1-desktop is-1-tablet is-hidden-mobile is-centered">
                    {this.props.canMoveDown &&
                    <IconButton tooltip={txt.moveDown} onTouchTap={this._onMoveDown}>
                        <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                    </IconButton>
                    }
                </div>
                <div className="column is-1-desktop is-1-tablet is-1-mobile is-delete is-centered">
                    <IconButton tooltip={txt.delete} onTouchTap={this._showConfirmation}>
                        <FontIcon className="material-icons">delete</FontIcon>
                    </IconButton>
                </div>
            </div>
        );
    }
}

