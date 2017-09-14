import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

export class PublicationSubtypesList extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        subtypesList: PropTypes.array,
        subtypesLoading: PropTypes.bool,
        selectedValue: PropTypes.any,
        dataSourceConfig: PropTypes.object,
        vocabId: PropTypes.number,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        actions: PropTypes.object.isRequired
    };

    static defaultProps = {
        dataSourceConfig: {
            text: 'controlled_vocab.cvo_title',
            value: 'controlled_vocab.cvo_title'
        },
        locale: {
            label: 'Publication subtype',
            loading: 'loading...'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: null
        };
    }

    componentDidMount() {
        this.props.actions.loadPublicationSubtypesList(this.props.vocabId);

        if (this.props.selectedValue !== null) {
            this._updateSelectedValue(this.props.selectedValue);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) this.props.onChange(nextState.selectedValue);
    }

    _updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    _onSubtypeSelected = (event, index, value) => {
        this._updateSelectedValue(value);
    };

    getValue = (item, path) => {
        return path.split('.').reduce((objectValue, pathProperty) => objectValue[pathProperty], item);
    };

    render() {
        const { locale, subtypesList, dataSourceConfig, subtypesLoading } = this.props;
        const renderSubTypeItems = subtypesList.map((item) => {
            const value = this.getValue(item, dataSourceConfig.value);
            const text = this.getValue(item, dataSourceConfig.text);
            return <MenuItem value={ value } primaryText={ text } key={ value }/>;
        });
        const loadingIndicationText = `${locale.label} ${subtypesLoading ? locale.loading : ''}`;
        return (
            <SelectField
                id="selectedValue"
                name="selectedValue"
                style={{width: '100%'}}
                autoWidth
                className={ this.props.className }
                value={ subtypesLoading ? null : this.state.selectedValue }
                maxHeight={ 250 }
                onChange={ this._onSubtypeSelected }
                disabled={this.props.disabled}
                dropDownMenuProps={{animated: false}}
                floatingLabelText={ loadingIndicationText }>
                { renderSubTypeItems }
            </SelectField>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subtypesList: state.get('publicationSubtypesReducer').subtypesList || [],
        subtypesLoading: state.get('publicationSubtypesReducer').subtypesLoading || false
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicationSubtypesList);
