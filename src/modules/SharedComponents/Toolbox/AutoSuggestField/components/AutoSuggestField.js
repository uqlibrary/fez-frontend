import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

export class AutoSuggestField extends Component {
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
        allowFreeText: PropTypes.bool,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        errorText: PropTypes.string
    };

    static defaultProps = {
        maxResults: 7,
        allowFreeText: false,
        floatingLabelText: 'Enter text',
        hintText: 'Please type text',
        debounceDelay: 150,
        className: '',
        selectedValue: {value: ''}
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: !!props.selectedValue && props.selectedValue.value,
            selectedValue: !!props.selectedValue && props.selectedValue || {value: ''}
        };
        this.input = null;
        this.bounce = null;
    }

    componentDidMount() {
        if (!this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selectedValue.value !== this.props.selectedValue.value) {
            this.setState({
                selectedValue: newProps.selectedValue,
                searchText: newProps.selectedValue.value
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue.value !== this.state.selectedValue.value) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    trimLeadingSpaces = (text) => text.replace(/^\s+/g, '');

    updateSelectedValue = (value) => {
        this.setState({
            selectedValue: {value},
        }, () => {
            if (this.props.async && this.props.loadSuggestions && this.state.selectedValue.value
                && this.state.selectedValue.value.trim().length > 0) {
                if (this.bounce) {
                    clearTimeout(this.bounce);
                }
                this.bounce = setTimeout(this.props.loadSuggestions, this.props.debounceDelay,
                    this.props.category, this.state.selectedValue.value.trim());
            }
        });
    };

    textUpdated = (searchText) => {
        this.setState({
            searchText: this.trimLeadingSpaces(searchText)
        });

        if (this.props.allowFreeText) {
            this.updateSelectedValue(this.trimLeadingSpaces(searchText));
        }
    };

    valueSelected = (value, index) => {
        if (index >= 0 || this.props.allowFreeText) {
            this.setState({
                selectedValue: value
            });
        }

        // clean up input field
        if (!this.props.allowFreeText) {
            this.setState({
                searchText: ''
            });
        }
        // refocus on the field after selection
        if(this.input) {
            this.input.focus();
        }
    };


    render() {
        return (
            <AutoComplete
                id="textField"
                ref={(input) => (this.input = input)}
                searchText={this.state.searchText}
                disabled={this.props.disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={this.props.filter || this.props.async && AutoComplete.caseInsensitiveFilter || (() => true)}
                maxSearchResults={this.props.maxResults}
                floatingLabelText={this.props.floatingLabelText}
                hintText={this.props.hintText}
                dataSource={this.props.itemsList}
                fullWidth
                onUpdateInput={this.textUpdated}
                onNewRequest={this.valueSelected}
                className={this.props.className + ' mui-long-labels-fix'}
                dataSourceConfig={this.props.dataSourceConfig}
                errorText={this.props.errorText}
                menuProps={{menuItemStyle: {whiteSpace: 'normal', lineHeight: '18px', padding: '8px 0', minHeight: '18px', height: 'auto'}}}
            />
        );
    }
}
