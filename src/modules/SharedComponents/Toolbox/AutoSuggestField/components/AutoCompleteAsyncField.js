import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popper from '@material-ui/core/Popper';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        maxHeight: 250,
        overflowY: 'scroll',
        position: 'absolute',
        zIndex: 999
    },
    inputRoot: {
        flexWrap: 'wrap',
    }
});

export class AutoCompleteAsyncField extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        loadSuggestions: PropTypes.func,
        itemsList: PropTypes.array,
        itemsListLoading: PropTypes.bool,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        onChange: PropTypes.func,
        itemToString: PropTypes.func,
        floatingLabelText: PropTypes.string,
        error: PropTypes.bool,
        errorText: PropTypes.string,
        hintText: PropTypes.string,
        allowFreeText: PropTypes.bool,
        async: PropTypes.bool,
        disabled: PropTypes.bool,
        maxResults: PropTypes.number,
        required: PropTypes.bool,
        selectedValue: PropTypes.any,
        filter: PropTypes.func
    };

    static defaultProps = {
        maxResults: 7,
        required: false,
        filter: (searchText, key) => {
            return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        }
    };

    componentDidMount() {
        if (!this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category);
        }
    }

    getSuggestions = (event) => {
        if (this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category, event.target.value);
        }
    };

    handleSelected = (value) => {
        this.props.onChange(value);
    };

    renderInput = ({ inputProps, classes, ...other }) => {
        return (
            <TextField
                InputProps={{
                    inputRef: node => {this.textInputRef = node;},
                    classes: {
                        root: classes.inputRoot,
                    },
                    ...inputProps,
                }}
                {...other}
            />
        );
    };

    renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) => {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem && selectedItem.value || '').indexOf(suggestion.value) > -1;

        return (
            <MenuItem
                button
                {...itemProps}
                key={suggestion.value}
                selected={isHighlighted}
                style={{
                    fontWeight: isSelected ? 500 : 400,
                    whiteSpace: 'normal',
                    height: 'auto'
                }}
            >
                <ListItemText
                    primary={suggestion.value}
                    secondary={suggestion.id}
                    primaryTypographyProps={{
                        variant: 'body2'
                    }}
                    secondaryTypographyProps={{
                        variant: 'body1'
                    }}
                />
            </MenuItem>
        );
    };

    stateReducer = (state, changes) => {
        if (this.props.allowFreeText) {
            switch (changes.type) {
                case Downshift.stateChangeTypes.blurInput:
                case Downshift.stateChangeTypes.mouseUp:
                    return {
                        ...changes,
                        inputValue: state.inputValue
                    };
                default:
                    return changes;
            }
        } else {
            switch (changes.type) {
                case Downshift.stateChangeTypes.blurInput:
                case Downshift.stateChangeTypes.clickItem:
                case Downshift.stateChangeTypes.keyDownEnter:
                case Downshift.stateChangeTypes.mouseUp:
                    return {
                        ...changes,
                        inputValue: ''
                    };
                default:
                    return changes;
            }
        }
    };

    render() {
        const { classes, itemsList, error, errorText, hintText, floatingLabelText, disabled, maxResults, itemToString, allowFreeText, required, selectedValue } = this.props;
        return (
            <div className={classes.root}>
                <Downshift
                    defaultInputValue={selectedValue}
                    stateReducer={this.stateReducer}
                    onChange={this.handleSelected}
                    itemToString={itemToString}
                    onStateChange={allowFreeText
                        ? ({inputValue}) => !!inputValue && this.props.onChange({value: inputValue})
                        : () => {}
                    }
                >
                    {
                        ({ getInputProps, getMenuProps, isOpen, inputValue, getItemProps, selectedItem, highlightedIndex }) => {
                            return (
                                <div className={classes.container}>
                                    {this.renderInput({
                                        fullWidth: true,
                                        classes,
                                        inputProps: getInputProps({
                                            onChange: this.getSuggestions
                                        }),
                                        error: error,
                                        helperText: error && errorText || '',
                                        placeholder: hintText,
                                        label: floatingLabelText,
                                        value: inputValue,
                                        disabled: disabled,
                                        required: required
                                    })}
                                    {isOpen && itemsList.length > 0 ? (
                                        <div {...getMenuProps()}>
                                            <Popper disablePortal id="downshift-popper" open anchorEl={this.textInputRef} placement="bottom-start">
                                                <Paper className={classes.paper} square style={{width: this.textInputRef ? this.textInputRef.clientWidth : null}}>
                                                    {
                                                        itemsList
                                                            .filter(suggestion => this.props.filter(inputValue, suggestion.value))
                                                            .slice(0, maxResults).map((suggestion, index) => {
                                                                return !!suggestion && this.renderSuggestion({
                                                                    suggestion,
                                                                    index,
                                                                    itemProps: getItemProps({ item: suggestion }),
                                                                    highlightedIndex,
                                                                    selectedItem,
                                                                });
                                                            })
                                                    }
                                                </Paper>
                                            </Popper>
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }
                    }
                </Downshift>
            </div>
        );
    }
}

export default withStyles(styles)(AutoCompleteAsyncField);
