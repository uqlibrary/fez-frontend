import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadPublicationSubtypesList } from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class PublicationSubtypeForm extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        subtypes: PropTypes.array,
        rek_subtype: PropTypes.string,
        valueFrom: PropTypes.string,
        dispatch: PropTypes.func,
        vocabId: PropTypes.number
    };

    static defaultProps = {
        valueFrom: 'cvo_title',
        locale: {
            label: 'Publication subtype'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            rek_subtype: props.rek_subtype || null
        };
    }

    componentDidMount() {
        this.props.dispatch(loadPublicationSubtypesList(this.props.vocabId));
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.rek_subtype !== this.state.rek_subtype) this.props.onChange(nextState.rek_subtype);
    }

    _onSubtypeSelected = (event, index, value) => {
        this.setState({
            rek_subtype: value
        });
    };

    render() {
        const { locale, subtypes, valueFrom } = this.props;
        const renderSubTypeItems = subtypes.map((item) => {
            return <MenuItem value={ item.controlled_vocab[valueFrom] } primaryText={ item.controlled_vocab.cvo_title } key={ item.controlled_vocab.cvo_id }/>;
        });

        return (
            <SelectField
                name="rek_subtype"
                fullWidth
                value={ this.state.rek_subtype }
                className="requiredField"
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
        subtypes: state.get('publicationSubtypesReducer').subtypes || []
    };
};

export default connect(mapStateToProps)(PublicationSubtypeForm);
