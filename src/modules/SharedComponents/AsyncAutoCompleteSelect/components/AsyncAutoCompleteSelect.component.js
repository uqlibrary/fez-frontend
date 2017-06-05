import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import AutoSuggest from 'react-autosuggest';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextFieldUnderline from 'material-ui/TextField/TextFieldUnderline';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';
import CircularProgress from 'material-ui/CircularProgress';

import AsyncAutoSuggestInput from './AsyncAutoSuggestInput.component';

import './AsyncAutoCompleteSelect.scss';

export default class AsyncAutoCompleteSelect extends React.PureComponent {
    static propTypes = {
        dataSource: PropTypes.func,
        dataSourceLabel: PropTypes.string,
        disabled: PropTypes.bool.isRequired,
        errorText: PropTypes.string,
        value: PropTypes.any,
        label: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        alwaysRenderSuggestions: PropTypes.bool,
        minLength: PropTypes.number
    };

    static defaultProps = {
        dataSourceLabel: 'label',
        disabled: false,
        errorText: '',
        value: null,
        alwaysRenderSuggestions: false,
        minLength: 2
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };

    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isLoading: false,
            isFocused: false,
            searchValue: '',
            suggestions: [],
            pendingBounce: null
        };
    }

    openModal = () => {
        if (!this.props.disabled) {
            this.setState({
                isModalOpen: true,
                searchValue: ''
            });
        }
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false
        });
    };

    onChange = (event, { newValue }) => {
        this.setState({
            searchValue: newValue
        });
    };

    renderSuggestion = suggestion => suggestion[this.props.dataSourceLabel];

    onSuggestionsFetchRequested = ({ value }) => {
        if (this.state.pendingBounce) {
            clearTimeout(this.state.pendingBounce);
        }

        if (this.shouldRenderSuggestions(value)) {
            this.setState({
                suggestions: [],
                pendingBounce: setTimeout(this.updateSuggestions, 500),
                isLoading: true
            });
        }
    };

    updateSuggestions = () => {
        this.props.dataSource(this.state.searchValue).then(data => {
            this.setState({suggestions: data, isLoading: false});
        });
    };

    onSuggestionSelected = (event, { suggestion }) => {
        this.closeModal();
        console.log('yo', typeof this.props.onChange);
        this.props.onChange(suggestion);
    };

    onSuggestionsClearRequested = () => {
        if (!this.props.alwaysRenderSuggestions) {
            this.setState({
                suggestions: []
            });
        }
    };

    getSuggestionValue = suggestion => suggestion;

    shouldRenderSuggestions = value => {
        return typeof value === 'string' && value.trim().length >= this.props.minLength;
    };

    onFocus = () => {
        if (!this.props.disabled) {
            this.setState({isFocused: true});
        }
    };

    onBlur = () => {
        this.setState({isFocused: false});
    };

    render() {
        const { isModalOpen, searchValue, suggestions, isLoading } = this.state;
        const { disabled, label, value, dataSourceLabel, alwaysRenderSuggestions, errorText } = this.props;

        const inputProps = {
            placeholder: 'Type to filter',
            value: searchValue + '',
            onChange: this.onChange
        };

        const theme = this.context.muiTheme;
        const tabIndex = disabled ? -1 : 0;

        return (
            <div className="auto-complete-select">
                <div className="base-input-container" onTouchTap={this.openModal} onKeyDown={this.openModal} tabIndex={tabIndex} onFocus={this.onFocus} onBlur={this.onBlur}>
                    <TextFieldLabel muiTheme={theme}
                                    style={{color: 'rgb(224, 224, 224)', top: '12px', cursor: 'pointer', fontSize: '16px'}}
                                    shrink={!!value}>
                        {label}
                    </TextFieldLabel>
                    <TextFieldUnderline error={!!errorText}
                                        focus={this.state.isFocused}
                                        muiTheme={theme}
                                        disabled={false} />
                    {value && (
                        <span className="value" style={{color: disabled ? theme.textField.disabledTextColor : theme.textField.textColor}}>
                            {value[dataSourceLabel]}
                        </span>
                    )}
                    {errorText && (
                        <div className="errorLabel">{errorText}</div>
                    )}
                </div>
                <Modal
                    className="auto-complete-select-content"
                    overlayClassName="auto-complete-select-overlay"
                    isOpen={isModalOpen}
                    contentLabel="Modal"
                    onRequestClose={this.closeModal}
                    shouldCloseOnOverlayClick
                    closeTimeoutMS={1}
                >
                    <div>
                        <AutoSuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            inputProps={inputProps}
                            renderSuggestion={this.renderSuggestion}
                            renderInputComponent={AsyncAutoSuggestInput}
                            shouldRenderSuggestions={this.shouldRenderSuggestions}
                            alwaysRenderSuggestions={alwaysRenderSuggestions}
                        />
                    </div>
                    {isLoading && (
                        <div className="has-text-centered" style={{padding: '80px 0 40px'}}>
                            <CircularProgress/><br /><br />
                            <span className="subhead">Loading results...</span>
                        </div>
                    )}
                    {!isLoading && suggestions.length === 0 && searchValue !== '' && (
                        <span className="subhead">Could not find a result with the given search parameter</span>
                    )}
                    <div className="auto-complete-select-close">
                        <IconButton onClick={this.closeModal}>
                            <FontIcon className="material-icons" color="#999">clear</FontIcon>
                        </IconButton>
                    </div>
                </Modal>
            </div>
        );
    }
}
