import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class PublicationSubtypeForm extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        subtypes: PropTypes.array,
        rek_subtype: PropTypes.string
    };

    static defaultProps = {
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

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) this.props.onChange(nextState.rek_subtype);
    }

    _onSubtypeSelected = (event, index, value) => {
        this.setState({
            rek_subtype: value
        });
    };

    render() {
        const { locale, subtypes } = this.props;

        const renderSubTypeItems = subtypes.map((item) => {
            return <MenuItem value={ item.controlled_vocab.cvo_title } primaryText={ item.controlled_vocab.cvo_title } key={ item.controlled_vocab.cvo_id }/>;
        });

        return (
            <div className="column">
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
            </div>
        );
    }
}

export default PublicationSubtypeForm;
