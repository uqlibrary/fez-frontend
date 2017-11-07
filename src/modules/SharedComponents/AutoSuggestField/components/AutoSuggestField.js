import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

export class AutoSuggestField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        async: PropTypes.bool,
        itemsList: PropTypes.array,
        dataSourceConfig: PropTypes.object,
        itemsListLoading: PropTypes.bool,
        selectedValue: PropTypes.any,
        category: PropTypes.any,
        loadSuggestions: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        maxResults: PropTypes.number,
        debounceDelay: PropTypes.number,
        forceItemSelection: PropTypes.bool
    };

    static defaultProps = {
        maxResults: 7,
        locale: {
            fieldLabel: 'Enter text',
            fieldHint: 'Please type text'
        },
        debounceDelay: 150
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
            console.log(newProps.selectedValue);
            this.setState({
                selectedValue: newProps.selectedValue,
                searchText: newProps.selectedValue
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && !!nextState.selectedValue && nextState.selectedValue !== this.state.selectedValue) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value,
        }, () => {
            if (this.props.async && this.props.loadSuggestions && this.state.selectedValue && this.state.selectedValue.trim().length > 0) {
                if (this.bounce) {
                    clearTimeout(this.bounce);
                }
                this.bounce = setTimeout(this.props.loadSuggestions, this.props.debounceDelay, this.props.category, this.state.selectedValue);
            }
        });
    };

    textUpdated = (searchText) => {
        this.setState({
            searchText: searchText
        });

        if (!this.props.forceItemSelection) {
            this.updateSelectedValue(searchText);
        }
    };

    clearField = (value, index) => {
        this.setState({
            searchText: ''
        });
        if (index >= 0) {
            this.updateSelectedValue(this.props.itemsList[index]);
        } else if (!this.props.forceItemSelection) {
            this.updateSelectedValue(value);
        }
    };

    render() {
        return (
            <AutoComplete
                id="itemName"
                searchText={this.state.searchText}
                disabled={this.props.disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={!this.props.async ? AutoComplete.caseInsensitiveFilter : () => (true)}
                maxSearchResults={this.props.maxResults}
                floatingLabelText={this.props.locale.fieldLabel}
                hintText={this.props.locale.fieldHint}
                dataSource={this.props.itemsList}
                fullWidth
                onUpdateInput={this.textUpdated}
                onNewRequest={this.clearField}
                className={this.props.className}
                dataSourceConfig={this.props.dataSourceConfig}
            />
        );
    }
}
