import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {thesisSubTypes} from 'config/general';

export class PublicationThesisTypeList extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        selectedValue: PropTypes.any,
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
        const renderThesisTypeItems = thesisSubTypes.map((item, index) => {
            return <MenuItem value={item} primaryText={item} key={`pub_thesis_type_${index}`}/>;
        });
        return (
            <SelectField
                id="selectedValue"
                name="selectedValue"
                {...this.context.selectFieldMobileOverrides}
                className={this.props.className}
                value={this.state.selectedValue}
                maxHeight={250}
                onChange={this._onSubtypeSelected}
                disabled={this.props.disabled}
                dropDownMenuProps={{animated: false}}
                floatingLabelText={this.props.locale.label}>
                {renderThesisTypeItems}
            </SelectField>
        );
    }
}

export default connect()(PublicationThesisTypeList);
