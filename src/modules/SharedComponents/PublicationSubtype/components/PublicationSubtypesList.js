import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as actions from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

export class PublicationSubtypesList extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        itemsList: PropTypes.array,
        itemsLoading: PropTypes.bool,
        loadPublicationSubtypesList: PropTypes.func,
        selectedValue: PropTypes.any,
        vocabId: PropTypes.number,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            label: 'Publication subtype',
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
            this.props.loadPublicationSubtypesList(this.props.vocabId);
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
        const renderSubTypeItems = this.props.itemsList.map((item, index) => {
            return <MenuItem value={item} primaryText={item} key={`pub_subtype_${index}`}/>;
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
                {renderSubTypeItems}
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
        loadPublicationSubtypesList: (category) => dispatch(actions.loadVocabulariesList(category))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicationSubtypesList);
