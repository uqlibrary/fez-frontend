import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import { SelectField } from 'uqlibrary-react-toolbox';

class PublicationSubtypeForm extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        vocabId: PropTypes.number.isRequired,
        locale: PropTypes.object,
        subtypeList: PropTypes.array
    };

    static defaultProps = {
        locale: {
            label: 'Publication subtype'
        },
        subtypeList: []
    };

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) this.props.onChange(nextState);
    }

    render() {
        const { locale, subtypeList } = this.props;

        const renderSubTypeItems = subtypeList.map((item) => {
            return <MenuItem value={ item.controlled_vocab.cvo_title } primaryText={ item.controlled_vocab.cvo_title } key={ item.controlled_vocab.cvo_id }/>;
        });

        return (
            <div className="column">
                <SelectField
                       name="rek_subtype"
                       fullWidth
                       className="requiredField"
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
