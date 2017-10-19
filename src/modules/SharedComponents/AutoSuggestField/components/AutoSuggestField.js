import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import {locale} from 'config';

export class AutoSuggestField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        itemsList: PropTypes.array,
        itemsListLoading: PropTypes.bool,
        selectedValue: PropTypes.any,
        category: PropTypes.number,
        loadSuggestions: PropTypes.func,
        dataSourceConfig: PropTypes.object,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        maxResults: PropTypes.number
    };

    static defaultProps = {
        maxResults: 7,
        dataSourceConfig: {
            text: 'controlled_vocab.cvo_title'
        },
        locale: {
            fieldLabel: 'Enter text',
            fieldHint: 'Please type text'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedValue: null,
            transformedItemsList: [locale.global.loading]
        };
    }

    componentDidMount() {
        // TODO: if request to return too many items - maybe it'll be worth sending requests as user types
        this.props.loadSuggestions(this.props.category);

        if (this.props.selectedValue !== null) {
            this.updateSelectedValue(this.props.selectedValue);
        }

        // TODO: fix this hack!
        // I need to catch scrolling event of scrolled container (which is not a window) to set position of autosuggest list when user scrolls
        // another solution, close the box when user tries to scroll
        const div = document.querySelector('div.layout-fill.align-stretch');
        if (div) div.addEventListener('scroll', this.handleParentContainerScroll());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.itemsList && this.props.itemsList.length !== nextProps.itemsList.length) {
            this.setState({
                transformedItemsList: nextProps.itemsList.map((item) => this.getValue(item, this.props.dataSourceConfig.text))
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    componentWillUnmount() {
        const div = document.querySelector('div.layout-fill.align-stretch');
        if (div) div.removeEventListener('scroll', this.handleParentContainerScroll());
    }

    handleParentContainerScroll = () => {
        if (this.refs.textField) this.refs.textField.close();
    };

    updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    textUpdated = (searchText) => {
        this.updateSelectedValue(searchText);
    };

    valueSelected = (value) => {
        this.updateSelectedValue(value);
    };

    getValue = (item, path) => {
        return path.split('.').reduce((objectValue, pathProperty) => objectValue[pathProperty], item);
    };

    render() {
        console.log(this.props);
        return (
            <AutoComplete
                disabled={this.props.disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={AutoComplete.caseInsensitiveFilter}
                ref="textField"
                id="textField"
                maxSearchResults={this.props.maxResults}
                floatingLabelText={this.props.locale.fieldLabel}
                hintText={this.props.locale.fieldHint}
                dataSource={this.state.transformedItemsList}
                fullWidth
                onUpdateInput={this.textUpdated}
                onNewRequest={this.valueSelected}
                className={this.props.className}
            />
        );
    }
}
