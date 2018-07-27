import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

export class AdvancedSearchAutoComplete extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        async: PropTypes.bool,
        itemsList: PropTypes.array,
        filter: PropTypes.func,
        itemsListLoading: PropTypes.bool,
        dataSourceConfig: PropTypes.object,
        selectedValue: PropTypes.any,
        category: PropTypes.any,
        loadSuggestions: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        maxResults: PropTypes.number,
        debounceDelay: PropTypes.number,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        errorText: PropTypes.string
    };

    static defaultProps = {
        maxResults: 7,
        floatingLabelText: 'Enter text',
        hintText: 'Please type text',
        debounceDelay: 150,
        className: ''
    };

    constructor(props) {
        super(props);
        this.bounce = null;
        this.state = {
            searchText: props.selectedValue
        };
    }

    updateSelectedValue = (value) => {
        this.setState({
            searchText: value
        }, () => {
            if (this.props.async && this.props.loadSuggestions && value
                && value.trim().length > 0) {
                if (this.bounce) {
                    clearTimeout(this.bounce);
                }
                this.bounce = setTimeout(this.props.loadSuggestions, this.props.debounceDelay,
                    this.props.category, value);
            }
        });
    };

    valueSelected = (value) => {
        this.props.onChange(value);
    };

    render() {
        return (
            <AutoComplete
                id="textField"
                ref={this.setAutoCompleteInput}
                searchText={this.state.searchText}
                disabled={this.props.disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={this.props.filter}
                maxSearchResults={this.props.maxResults}
                floatingLabelText={this.props.floatingLabelText}
                hintText={this.props.hintText}
                dataSource={this.props.itemsList}
                fullWidth
                onUpdateInput={this.updateSelectedValue}
                onNewRequest={this.valueSelected}
                className={this.props.className + ' mui-long-labels-fix'}
                dataSourceConfig={this.props.dataSourceConfig}
                errorText={this.props.errorText}
                menuProps={{menuItemStyle: {whiteSpace: 'normal', lineHeight: '18px', padding: '8px 0', minHeight: '18px', height: 'auto'}}}
            />
        );
    }
}
