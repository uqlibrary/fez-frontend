import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popper from '@material-ui/core/Popper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { throttle } from 'throttle-debounce';


export const styles = () => ({
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
        hideLabel: PropTypes.bool,
        error: PropTypes.bool,
        errorText: PropTypes.string,
        hintText: PropTypes.string,
        allowFreeText: PropTypes.bool,
        async: PropTypes.bool,
        disabled: PropTypes.bool,
        maxResults: PropTypes.number,
        required: PropTypes.bool,
        selectedValue: PropTypes.any,
        filter: PropTypes.func,
        openOnFocus: PropTypes.bool,
        clearInput: PropTypes.bool,
        MenuItemComponent: PropTypes.func
    };

    static defaultProps = {
        maxResults: 7,
        required: false,
        filter: (searchText, key) => {
            const anyKey = isNaN(key) ? key : `${key}`;
            const regex = new RegExp(`(${searchText.split(' ').join('|').replace(/[()]/g, '')})`, 'gi');
            return regex.test(anyKey);
        },
        MenuItemComponent: ({suggestion}) => (
            <ListItemText
                primary={suggestion.value}
                secondary={suggestion.id}
                primaryTypographyProps={{
                    variant: 'body1'
                }}
                secondaryTypographyProps={{
                    variant: 'body2'
                }}
            />
        )
    };

    constructor(props) {
        super(props);
        this.throttledLoadSuggestions = throttle(1000, this.props.loadSuggestions);
    }

    componentDidMount() {
        if (!this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category);
        }
    }

    getSuggestions = (event) => {
        if (this.props.async && this.props.loadSuggestions) {
            this.throttledLoadSuggestions(this.props.category, event.target.value);
        }
    };

    renderInput = ({ inputProps, classes, openMenu, ...other }) => {
        return (
            <TextField
                InputProps={{
                    inputRef: node => {
                        this.textInputRef = node;
                        if (!!this.textInputRef && this.props.openOnFocus) {
                            this.textInputRef.addEventListener('focus', openMenu);
                        }
                    },
                    classes: {
                        root: classes.inputRoot,
                    },
                    ...inputProps,
                }}
                {...other}
            />
        );
    };

    renderMenuItemComponent = (suggestion) => (<this.props.MenuItemComponent suggestion={suggestion} />);

    renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) => {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem && selectedItem.value || '').indexOf(suggestion.value) > -1;
        return (
            <MenuItem
                button
                {...itemProps}
                key={suggestion.key || suggestion.id || suggestion.value}
                selected={isHighlighted}
                style={{
                    fontWeight: isSelected ? 500 : 400,
                    whiteSpace: 'normal',
                    height: 'auto'
                }}
            >
                {
                    this.renderMenuItemComponent(suggestion)
                }
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

    handleStateChange = () => (
        this.props.allowFreeText
            ? ({inputValue}) => {
                inputValue !== undefined && this.props.onChange({value: inputValue});
            }
            : () => {}
    );

    render() {
        const { classes, itemsList, error, errorText, hintText, floatingLabelText, hideLabel, disabled, maxResults, itemToString, required, selectedValue, itemsListLoading } = this.props;
        const selectedItemProps = this.props.clearInput ? {selectedItem: ''} : {};
        const labelText = floatingLabelText || 'autosuggest';
        return (
            <div className={classes.root}>
                <label id={`${labelText.replace(/[^\w]/g, '')}-label`} hidden>{floatingLabelText || ''}</label>
                <Downshift
                    {...selectedItemProps}
                    defaultInputValue={!!selectedValue && selectedValue.value || ''}
                    stateReducer={this.stateReducer}
                    onChange={this.props.onChange}
                    itemToString={itemToString}
                    id={labelText.replace(/[^\w]/g, '')}
                    aria-label={labelText}
                    onStateChange={this.handleStateChange()}
                >
                    {
                        ({ getInputProps, getMenuProps, isOpen, inputValue, getItemProps, selectedItem, highlightedIndex, openMenu }) => {
                            return (
                                <div className={classes.container}>
                                    <Grid container spacing={16} alignItems={'flex-end'} alignContent={'flex-end'}>
                                        <Grid item xs>
                                            {this.renderInput({
                                                fullWidth: true,
                                                classes,
                                                inputProps: getInputProps({
                                                    onChange: this.getSuggestions
                                                }),
                                                error: error,
                                                errorText: error && errorText || '',
                                                placeholder: hintText,
                                                label: !hideLabel ? labelText : undefined,
                                                id: `${labelText.replace(/[^\w]/g, '')}-input`,
                                                value: inputValue,
                                                disabled: disabled,
                                                required: required,
                                                openMenu: openMenu
                                            })}
                                        </Grid>
                                        {
                                            itemsListLoading &&
                                                <Grid item xs={'auto'}>
                                                    <CircularProgress size={16} color="primary" />
                                                </Grid>
                                        }
                                    </Grid>
                                    {isOpen && itemsList.length > 0 ? (
                                        <div {...getMenuProps()}>
                                            <Popper disablePortal id="downshift-popper" open anchorEl={this.textInputRef} placement="bottom-start">
                                                <Paper className={classes.paper} square style={{
                                                    width: this.textInputRef ? this.textInputRef.clientWidth : null
                                                }}>
                                                    {
                                                        itemsList
                                                            .filter(suggestion => this.props.filter(
                                                                inputValue,
                                                                isNaN(inputValue) ? suggestion.value : suggestion.id ||
                                                                    suggestion.value.toString()
                                                            ))
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
