import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

export class OrgUnitForm extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        orgUnitsList: PropTypes.array,
        orgUnitAsPublished: PropTypes.any,
        vocabId: PropTypes.number,
        dataSourceConfig: PropTypes.object,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        dataSourceConfig: {
            text: 'controlled_vocab.cvo_title'
        },
        locale: {
            orgUnitAsPublishedLabel: 'School, department or centre as published',
            orgUnitAsPublishedHint: 'Please type organisation unit'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            orgUnitAsPublished: null
        };
    }

    componentDidMount() {
        this.props.actions.loadOrgUnits(this.props.vocabId);

        if (this.props.orgUnitAsPublished !== null) {
            this.updateOrgUnitValue(this.props.orgUnitAsPublished);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.orgUnitAsPublished !== this.state.orgUnitAsPublished) this.props.onChange(nextState.orgUnitAsPublished);
    }

    updateOrgUnitValue = (value) => {
        this.setState({
            orgUnitAsPublished: value
        });
    };

    _onOrgUnitUpdated = (searchText) => {
        this.updateOrgUnitValue(searchText);
    };

    _onOrgUnitSelected = (chosenRequest, index) => {
        if (index === -1) {
            this.updateOrgUnitValue(chosenRequest);
        } else {
            this.updateOrgUnitValue(chosenRequest);
        }
    };

    getValue = (item, path) => {
        return path.split('.').reduce((objectValue, pathProperty) => objectValue[pathProperty], item);
    };

    render() {
        const {disabled, locale, className, orgUnitsList, dataSourceConfig} = this.props;

        const orgUnitsDataSource = orgUnitsList.map((item) => this.getValue(item, dataSourceConfig.text));

        return (
            <AutoComplete
                disabled={disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={AutoComplete.fuzzyFilter}
                id="orgUnitAsPublishedField"
                floatingLabelText={locale.orgUnitAsPublishedLabel}
                hintText={locale.orgUnitAsPublishedHint}
                dataSource={orgUnitsDataSource}
                fullWidth
                onUpdateInput={this._onOrgUnitUpdated}
                onNewRequest={this._onOrgUnitSelected}
                className={className}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        orgUnitsList: state.get('orgUnitsReducer') ? state.get('orgUnitsReducer').orgUnitsList : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgUnitForm);
