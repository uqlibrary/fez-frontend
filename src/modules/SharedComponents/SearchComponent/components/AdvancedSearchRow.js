import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';


export default class AdvancedSearchRow extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.string,
        fieldIndex: PropTypes.number,
        searchField: PropTypes.number,
        value: PropTypes.any,
        updateValueFunc: PropTypes.func,
        deleteFunc: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            searchField: props.searchField || 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.value !== nextProps.value
            || this.state.searchField !== nextProps.searchField) {
            this.setState({
                value: nextProps.value,
                searchField: nextProps.searchField
            });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousState !== this.state) {
            this.props.updateValueFunc(this.props.fieldIndex, this.state);
        }
    }

    textChanged = (event, value) => {
        this.setState({
            ...this.state,
            value: value,
        });
    };

    searchFieldChanged = (event, value) => {
        this.setState({
            ...this.state,
            searchField: value,
        });
    };

    deleteRow = () => {
        this.props.deleteFunc(this.props.fieldIndex);
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch;
        return (
            <div className="columns is-gapless is-mobile advancedSearchField">
                <div className="column is-3">
                    <SelectField
                        value={this.state.searchField}
                        onChange={this.searchFieldChanged}
                        fullWidth>
                        {
                            txt.fieldTypes.map((item, index) => (
                                <MenuItem key={index} value={index} primaryText={txt.fieldTypes[index].title}/>
                            ))
                        }
                    </SelectField>
                </div>
                <div className="column is-narrow combiner">
                    <span>{txt.fieldTypes[this.state.searchField].combiner}</span>
                </div>
                <div className="column">
                    <TextField
                        type="search"
                        name={`textSearchField${this.props.fieldIndex}`}
                        id="searchField"
                        fullWidth
                        hintText={txt.fieldTypes[this.state.searchField].hint}
                        aria-label="Aria"
                        value={this.state.value}
                        onChange={this.textChanged}
                    />
                </div>
                {
                    this.props.fieldIndex !== 0 &&
                    <div className="column is-narrow">
                        <IconButton
                            className="deleteFieldButton"
                            onClick={this.deleteRow}
                        >
                            <Close/>
                        </IconButton>
                    </div>
                }
            </div>
        );
    }
}
