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
        className: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: props.selectedValue,
            selectedValue: null
        };
        this.bounce = null;
    }

    componentDidMount() {
        if (!this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category);
        }
        if (this.props.selectedValue !== null) {
            this.updateSelectedValue(this.props.selectedValue);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selectedValue !== this.props.selectedValue) {
            this.setState({
                selectedValue: newProps.selectedValue,
                searchText: newProps.selectedValue
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value,
        }, () => {
            if (this.props.async && this.props.loadSuggestions && this.state.selectedValue
                && this.state.selectedValue.trim().length > 0) {
                if (this.bounce) {
                    clearTimeout(this.bounce);
                }
                this.bounce = setTimeout(this.props.loadSuggestions, this.props.debounceDelay,
                    this.props.category, this.state.selectedValue);
            }
        });
    };

    textUpdated = (searchText) => {
        this.setState({
            searchText: searchText.trim()
        });

        if (this.props.allowFreeText) {
            this.updateSelectedValue(searchText.trim());
        }
    };

    valueSelected = (value, index) => {
        if (index >= 0) {
            this.updateSelectedValue(this.props.itemsList[index]);
        } else if (this.props.allowFreeText) {
            this.updateSelectedValue(value);
        }

        // clean up input field
        if (!this.props.allowFreeText) {
            this.setState({
                searchText: ''
            });
        }
        // refocus on the field after selection
        if(this.state.input) {
            this.state.input.focus();
        }
    };

    setAutoCompleteInput = (input) => (
        this.setState({input})
    );

    render() {
        return (
            <AutoComplete
                id="textField"
                ref={this.setAutoCompleteInput}
                searchText={this.state.searchText}
                disabled={this.props.disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={!this.props.async ? this.props.filter || AutoComplete.caseInsensitiveFilter : () => (true)}
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
