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
        initialValue: PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            initialValue: this.props.initialValue || '',
            searchField: this.props.searchField || 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.initialValue !== this.state.initialValue) {
            this.setState({
                ...this.state,
                initialValue: this.props.initialValue || ''
            });
        }
        if (!!nextProps.initialValue && nextProps.initialValue !== this.state.initialValue) {
            this.setState({
                ...this.state,
                initialValue: nextProps.initialValue || ''
            });
        }
    }

    textChanged = (event, value) => {
        this.setState({
            ...this.state,
            initialValue: value,
        });
    };

    searchFieldChanged = (event, index, value) => {
        this.setState({
            ...this.state,
            searchField: value,
        });
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
                    <span>contains</span>
                </div>
                <div className="column">
                    <TextField
                        type="search"
                        id="searchField"
                        fullWidth
                        hintText="Hint"
                        aria-label="Aria"
                        value={this.state.initialValue}
                        onChange={this.textChanged}
                    />
                </div>
                {
                    this.props.fieldIndex !== 0 &&
                    <div className="column is-narrow">
                        <IconButton className="deleteFieldButton">
                            <Close/>
                        </IconButton>
                    </div>
                }
            </div>
        );
    }
}
