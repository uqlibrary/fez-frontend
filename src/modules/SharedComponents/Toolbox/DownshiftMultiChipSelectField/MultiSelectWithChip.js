import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;
    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.label}
        </MenuItem>
    );
}
renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, suggestions) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

class DownshiftMultiple extends React.Component {
    state = {
        inputValue: '',
        selectedItem: this.props.initialValue || [],
    };

    handleKeyDown = event => {
        const { inputValue, selectedItem } = this.state;
        if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
            this.setState({
                selectedItem: selectedItem.slice(0, selectedItem.length - 1),
            });
        }
    };

    handleInputChange = event => {
        this.setState(
            { inputValue: event.target.value }, () => {
                this.props.onChange(this.state.selectedItem);
            });
    };

    handleChange = item => {
        let { selectedItem } = this.state;
        if (selectedItem.indexOf(item) === -1) {
            selectedItem = [...selectedItem, item];
        }
        this.setState({
            inputValue: '',
            selectedItem,
        }, () => {
            this.props.onChange(this.state.selectedItem);
        });
    };

    handleDelete = item => () => {
        this.setState(state => {
            const selectedItem = [...state.selectedItem];
            selectedItem.splice(selectedItem.indexOf(item), 1);
            return { selectedItem };
        }, () => {
            this.props.onChange(this.state.selectedItem);
        });
    };

    handleClearAll = () => {
        this.setState(
            { selectedItem: [] }, () => {
                this.props.onChange([]);
            });
    };

    sendData = value => {
        if(value) {
            this.props.onChange(value);
        }
    };

    render() {
        const { classes, label, placeholder, optionsList } = this.props;
        const { inputValue, selectedItem } = this.state;
        return (
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={this.handleChange}
                selectedItem={selectedItem}
                itemToString={() => ''}
            >
                {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue: inputValue2,
                    selectedItem: selectedItem2,
                    highlightedIndex,
                }) => (
                    <div className={classes.container}>
                        <Grid container alignContent={'flex-end'} alignItems={'flex-end'}>
                            <Grid item xs>
                                {renderInput({
                                    fullWidth: true,
                                    classes,
                                    InputProps: getInputProps({
                                        startAdornment: selectedItem.map(item => (
                                            <Chip
                                                key={item}
                                                tabIndex={-1}
                                                label={item}
                                                className={classes.chip}
                                                onDelete={this.handleDelete(item)}
                                            />
                                        )),
                                        onChange: this.handleInputChange,
                                        onKeyDown: this.handleKeyDown,
                                        placeholder: placeholder,
                                    }),
                                    label: label,
                                })}
                            </Grid>
                            {
                                this.state.selectedItem.length > 0 &&
                                <Grid item xs={'auto'}>
                                    <Tooltip title={'Clear all selections'}>
                                        <IconButton color="secondary" component="span" className={classes.clearAll} onClick={this.handleClearAll}>
                                            <Close/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            }
                            {isOpen ? (
                                <Paper className={classes.paper} square>
                                    {getSuggestions(inputValue2, optionsList).map((suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({ item: suggestion.label }),
                                            highlightedIndex,
                                            selectedItem: selectedItem2,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </Grid>
                    </div>
                )}
            </Downshift>
        );
    }
}

DownshiftMultiple.propTypes = {
    classes: PropTypes.object.isRequired,
    optionsList: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    initialValue: PropTypes.any
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
    clearAll: {
        marginBottom: -12,
        marginTop: 12,
        marginRight: -12,
        opacity: 0.66,
        '&:hover': {
            opacity: 1
        }
    }
});

export default withStyles(styles)(DownshiftMultiple);
