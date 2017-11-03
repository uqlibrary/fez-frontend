import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as actions from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

export class PublicationThesisTypeList extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        itemsList: PropTypes.array,
        itemsLoading: PropTypes.bool,
        loadPublicationThesisTypeList: PropTypes.func,
        selectedValue: PropTypes.any,
        vocabId: PropTypes.number,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            label: 'Thesis type',
            loading: 'loading...'
        }
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: null,
            windowWidth: window.innerWidth
        };
    }

    componentDidMount() {
        if (this.props.itemsList.length === 0) {
            this.props.loadPublicationThesisTypeList(this.props.vocabId);
        }

        if (this.props.selectedValue !== null) {
            this._updateSelectedValue(this.props.selectedValue);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    _updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    _onSubtypeSelected = (event, index, value) => {
        this._updateSelectedValue(value);
    };

    render() {
        const renderThesisTypeItems = this.props.itemsList.map((item, index) => {
            return <MenuItem value={item} primaryText={item} key={`pub_thesis_type_${index}`}/>;
        });
        const loadingIndicationText = `${this.props.locale.label} ${this.props.itemsLoading ? this.props.locale.loading : ''}`;
        return (
            <SelectField
                id="selectedValue"
                name="selectedValue"
                {...this.context.selectFieldMobileOverrides}
                className={this.props.className}
                value={this.props.itemsLoading ? null : this.state.selectedValue}
                maxHeight={250}
                onChange={this._onSubtypeSelected}
                disabled={this.props.disabled || this.props.itemsLoading}
                dropDownMenuProps={{animated: false}}
                floatingLabelText={loadingIndicationText}>
                {renderThesisTypeItems}
            </SelectField>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[ownProps.vocabId]
            ? state.get('controlledVocabulariesReducer')[ownProps.vocabId].itemsList : [],
        itemsLoading: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[ownProps.vocabId]
            ? state.get('controlledVocabulariesReducer')[ownProps.vocabId].itemsLoading : false
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadPublicationThesisTypeList: (category) => dispatch(actions.loadVocabulariesList(category))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicationThesisTypeList);
