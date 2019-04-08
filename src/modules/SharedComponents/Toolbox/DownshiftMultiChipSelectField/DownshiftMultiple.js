import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import MultiSelectWithChip from './MultiSelectWithChip';

/**
 * Component allows entry of multiple keywords via
 * autocomplete with dropdown. Has keyboard support for
 * accessibility.
 */
export class DownshiftMultiple extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        optionsList: PropTypes.array.isRequired,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.string,
        initialValue: PropTypes.any,
        renderSuggestions: PropTypes.func
    };

    state = {
        inputValue: '',
        selectedItems: this.props.initialValue || [],
    };

    handleKeyDown = event => {
        const { inputValue, selectedItems } = this.state;
        if (
            selectedItems.length &&
            !inputValue.length &&
            keycode(event) === 'backspace'
        ) {
            this.setState({
                selectedItems: selectedItems.slice(0, -1),
            });
        }
    };

    handleInputChange = event => {
        this.setState(
            { inputValue: event.target.value },
            () => {
                this.props.onChange(this.state.selectedItems);
            }
        );
    };

    handleChange = item => {
        const { selectedItems } = this.state;
        if (selectedItems.indexOf(item) === -1) {
            selectedItems.push(item);
        }
        this.setState({
            inputValue: '',
            selectedItems,
        }, () => {
            this.props.onChange(this.state.selectedItems);
        });
    };

    handleDelete = item => () => {
        this.setState(state => {
            const { selectedItems } = state;
            return selectedItems.splice(selectedItems.indexOf(item), 1);
        }, () => {
            this.props.onChange(this.state.selectedItems);
        });
    };

    handleClearAll = () => {
        this.setState(
            { selectedItems: [] },
            () => {
                this.props.onChange([]);
            }
        );
    };

    sendData = value => {
        if(value) {
            this.props.onChange(value);
        }
    };

    render() {
        const { inputValue, selectedItems } = this.state;
        return (
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={this.handleChange}
                selectedItems={selectedItems}
                itemToString={() => ''}
            >
                {/* istanbul ignore next */({
                    isOpen,
                    getRootProps,
                    getInputProps,
                    getItemProps,
                    highlightedIndex,
                    inputValue: inputValue2,
                    selectedItems: selectedItems2,
                }) => {
                    const rootProps = getRootProps({ refKey: 'innerRef' });
                    return (
                        <MultiSelectWithChip
                            {...{...rootProps}}
                            {...{
                                ...this.props,
                                handleChange: this.handleChange,
                                handleClearAll: this.handleClearAll,
                                handleDelete: this.handleDelete,
                                handleInputChange: this.handleInputChange,
                                handleKeyDown: this.handleKeyDown,
                                isOpen,
                                getInputProps,
                                getItemProps,
                                highlightedIndex,
                                inputValue: inputValue2,
                                selectedItems: selectedItems2,
                            }}

                        />
                    );
                }}
            </Downshift>
        );
    }
}

export const styles = theme => ({
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
