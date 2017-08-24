import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListRowHeader from './ListRowHeader';
import ListRow from './ListRow';
import ListForm from './ListForm';

export default class ListsEditor extends Component {

    static propTypes = {
        className: PropTypes.string,
        searchKey: PropTypes.object.isRequired,
        maxCount: PropTypes.number,
        isValid: PropTypes.func,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        locale: PropTypes.object
    };

    static defaultProps = {
        maxCount: 0,
        searchKey: {
            value: 'rek_value',
            order: 'rek_order'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            itemList: []
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // notify parent component when local state has been updated, eg itemList added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(this.transformOutput(nextState.itemList));
        }
    }

    transformOutput = (items) => {
        return items.map((item, index) => {
            return {
                [this.props.searchKey.value]: item,
                [this.props.searchKey.order]: index + 1
            };
        });
    }

    addItem = (item) => {
        if (this.props.maxCount === 0 || this.state.itemList.length < this.props.maxCount) {
            this.setState({
                itemList: [ ...this.state.itemList, item]
            });
        }
    }

    moveUpList = (item, index) => {
        if (index === 0) return;
        const nextList = this.state.itemList[index - 1];
        this.setState({
            itemList: [
                ...this.state.itemList.slice(0, index - 1),
                item, nextList,
                ...this.state.itemList.slice(index + 1)]
        });
    }

    moveDownList = (item, index) => {
        if (index === (this.state.itemList.length - 1)) return;
        const nextList = this.state.itemList[index + 1];
        this.setState({
            itemList: [
                ...this.state.itemList.slice(0, index),
                nextList, item,
                ...this.state.itemList.slice(index + 2)]
        });
    }

    deleteItem = (item, index) => {
        this.setState({
            itemList: this.state.itemList.filter((_, i) => i !== index),
        });
    }

    deleteAllItems = () => {
        this.setState({
            itemList: []
        });
    }

    render() {
        const renderListsRows = this.state.itemList.map((item, index) =>
            <ListRow
                key={index}
                index={index}
                item={item}
                canMoveDown={index !== this.state.itemList.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpList}
                onMoveDown={this.moveDownList}
                onDelete={this.deleteItem}
                {...(this.props.locale && this.props.locale.row ? this.props.locale.row : {})}
                disabled={this.props.disabled} />
        );

        return (
            <div className={this.props.className}>
                <ListForm
                    onAdd={this.addItem}
                    {...(this.props.locale && this.props.locale.form ? this.props.locale.form : {})}
                    isValid={this.props.isValid}
                    disabled={this.props.disabled || (this.props.maxCount > 0 && this.state.itemList.length >= this.props.maxCount)} />
                {
                    this.state.itemList.length > 0 &&
                    <ListRowHeader
                        {...(this.props.locale && this.props.locale.header ? this.props.locale.header : {})}
                        onDeleteAll={this.deleteAllItems}
                        disabled={this.props.disabled} />
                }
                {renderListsRows}
            </div>
        );
    }
}
