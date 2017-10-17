import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

export class VocabAutoSuggestField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        orgUnitsList: PropTypes.array,
        orgUnitsListLoading: PropTypes.bool,
        selectedValue: PropTypes.any,
        vocabId: PropTypes.number,
        dataSourceConfig: PropTypes.object,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        actions: PropTypes.object.isRequired,
    };

    static defaultProps = {
        dataSourceConfig: {
            text: 'controlled_vocab.cvo_title'
        },
        locale: {
            fieldLabel: 'Enter text',
            fieldHint: 'Please type text'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedValue: null
        };
    }

    componentDidMount() {
        this.props.actions.loadOrgUnits(this.props.vocabId);

        if (this.props.selectedValue !== null) {
            this.updateSelectedValue(this.props.selectedValue);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) this.props.onChange(nextState.selectedValue);
    }

    updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    textUpdated = (searchText) => {
        this.updateSelectedValue(searchText);
    };

    valueSelected = (value) => {
        this.updateSelectedValue(value);
    };

    getValue = (item, path) => {
        return path.split('.').reduce((objectValue, pathProperty) => objectValue[pathProperty], item);
    };

    render() {
        const {disabled, locale, className, orgUnitsList, dataSourceConfig} = this.props;

        const vocabDataSource = orgUnitsList.map((item) => this.getValue(item, dataSourceConfig.text));

        return (
            <AutoComplete
                disabled={disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={AutoComplete.fuzzyFilter}
                id="textField"
                floatingLabelText={locale.fieldLabel}
                hintText={locale.fieldHint}
                dataSource={vocabDataSource}
                fullWidth
                onUpdateInput={this.textUpdated}
                onNewRequest={this.valueSelected}
                className={className}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.get('orgUnitsReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VocabAutoSuggestField);
