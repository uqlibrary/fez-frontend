import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadPublicationSubtypesList } from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

export class PublicationSubtypeForm extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        subtypesList: PropTypes.array,
        selectedValue: PropTypes.string,
        dataSourceConfig: PropTypes.object,
        dispatch: PropTypes.func,
        vocabId: PropTypes.number,
        className: PropTypes.string
    };

    static defaultProps = {
        dataSourceConfig: {
            text: 'controlled_vocab.cvo_title',
            value: 'controlled_vocab.cvo_title'
        },
        locale: {
            label: 'Publication subtype'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.selectedValue || null
        };
    }

    componentDidMount() {
        this.props.dispatch(loadPublicationSubtypesList(this.props.vocabId));
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) this.props.onChange(nextState.selectedValue);
    }

    _onSubtypeSelected = (event, index, value) => {
        this.setState({
            selectedValue: value
        });
    };

    getValue = (item, path) => {
        return path.split('.').reduce((objectValue, pathProperty) => objectValue[pathProperty], item);
    };

    render() {
        const { locale, subtypesList, dataSourceConfig } = this.props;
        const renderSubTypeItems = subtypesList.map((item) => {
            const value = this.getValue(item, dataSourceConfig.value);
            const text = this.getValue(item, dataSourceConfig.text);
            return <MenuItem value={ value } primaryText={ text } key={ value }/>;
        });

        return (
            <SelectField
                name="selectedValue"
                fullWidth
                className={ this.props.className }
                value={ this.state.selectedValue }
                maxHeight={ 250 }
                onChange={ this._onSubtypeSelected }
                floatingLabelText={ locale.label }>
                <MenuItem
                    primaryText={ locale.label }
                    disabled/>
                { renderSubTypeItems }
            </SelectField>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subtypesList: state.get('publicationSubtypesReducer').subtypesList || []
    };
};

export default connect(mapStateToProps)(PublicationSubtypeForm);
