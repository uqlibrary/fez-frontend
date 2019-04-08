import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

export const renderInput = ({ InputProps, classes, ref, ...other }) => {
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
};

renderInput.propTypes = {
    InputProps: PropTypes.object,
    classes: PropTypes.object,
    ref: PropTypes.object,
};

export const getSuggestions = (value, suggestions) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 5 && suggestion.label
                    .slice(0, inputLength)
                    .toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
};

export const renderSuggestion = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItems
}) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItems || []).indexOf(suggestion.label) > -1;

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
};

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItems: PropTypes.array,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

export const renderSuggestions = ({
    inputValue,
    optionsList,
    getItemProps,
    highlightedIndex,
    selectedItems
}) =>  {
    const suggestions = getSuggestions(inputValue, optionsList);
    return suggestions.map((suggestion, index) =>
        renderSuggestion({
            highlightedIndex,
            index,
            itemProps: getItemProps({ item: suggestion.label }),
            selectedItems,
            suggestion,
        })
    );
};

renderSuggestions.propTypes = {
    inputValue: PropTypes.string,
    optionsList: PropTypes.array,
    getItemProps: PropTypes.func,
    highlightedIndex: PropTypes.number,
    selectedItems: PropTypes.array,
};

export const getAdornment = ({ classes, handleDelete, selectedItems }) => {
    return selectedItems && selectedItems.map(item => (
        <Chip
            key={item}
            tabIndex={-1}
            label={item}
            className={classes.chip}
            onDelete={handleDelete(item)}
        />
    ));
};

getAdornment.propTypes = {
    selectedItems: PropTypes.array,
    classes: PropTypes.object,
    handleDelete: PropTypes.func
};

export class MultiSelectWithChip extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        getInputProps: PropTypes.func,
        getItemProps: PropTypes.func,
        handleClearAll: PropTypes.func,
        handleDelete: PropTypes.func,
        handleInputChange: PropTypes.func,
        handleKeyDown: PropTypes.func,
        highlightedIndex: PropTypes.number,
        inputValue: PropTypes.string,
        isOpen: PropTypes.bool,
        label: PropTypes.string,
        optionsList: PropTypes.array,
        placeholder: PropTypes.string,
        selectedItems: PropTypes.array,
    };

    render() {
        const {
            classes,
            getInputProps,
            getItemProps,
            handleClearAll,
            handleDelete,
            handleInputChange,
            handleKeyDown,
            highlightedIndex,
            inputValue,
            isOpen,
            label,
            optionsList,
            placeholder,
            selectedItems,
        } = this.props;
        return (
            <div className={classes.container}>
                <Grid container alignContent={'flex-end'} alignItems={'flex-end'}>
                    <Grid item xs>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: getInputProps({
                                startAdornment: getAdornment({
                                    classes,
                                    handleDelete,
                                    selectedItems
                                }),
                                onChange: handleInputChange,
                                onKeyDown: handleKeyDown,
                                placeholder: placeholder,
                            }),
                            label: label,
                        })}
                    </Grid>
                    {
                        (selectedItems || []).length > 0 &&
                        <Grid item xs={'auto'}>
                            <Tooltip title={'Clear all selections'}>
                                <IconButton
                                    color="secondary"
                                    component="span"
                                    className={classes.clearAll}
                                    onClick={handleClearAll}
                                >
                                    <Close/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    }
                    {isOpen ? (
                        <Paper className={classes.paper} square>
                            {renderSuggestions({
                                inputValue,
                                optionsList,
                                getItemProps,
                                highlightedIndex,
                                selectedItems
                            })}
                        </Paper>
                    ) : null}
                </Grid>
            </div>
        );
    }
}

export default MultiSelectWithChip;

