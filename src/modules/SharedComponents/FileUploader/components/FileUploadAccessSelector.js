import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

export const OPEN_ACCESS_ID = 9;
export const CLOSED_ACCESS_ID = 8;

export default class FileUploadAccessSelector extends Component {
    static propTypes = {
        onAccessChanged: PropTypes.func,
        locale: PropTypes.object
    };

    static defaultProps = {
        locale: {
            fileMetaKey: 'access_condition_id',
            initialValue: 'Select access conditions',
            fieldName: 'accessDate',
            accessIds: [
                {
                    id: CLOSED_ACCESS_ID,
                    value: 'Closed Access'
                },
                {
                    id: OPEN_ACCESS_ID,
                    value: 'Open Access'
                }
            ]
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.value !== nextState.value) this.props.onAccessChanged({ key: [nextProps.locale.fileMetaKey], value: nextState.value });
    }

    _onChange = (event, index, value) => {
        this.setState({value: value});
    };

    render() {
        const {initialValue, fieldName, accessIds} = this.props.locale;

        const accessOptions = accessIds.map((access, index) => (<MenuItem value={ access.id } primaryText={ access.value } key={ index } />));

        return (
            <SelectField
                name={ fieldName }
                autoWidth
                className="selectField"
                hintText={ initialValue }
                maxHeight={ 250 }
                onChange={ this._onChange }
                value={ this.state.value }>
                <MenuItem value={ null } primaryText={ initialValue } key={ -1 } />
                { accessOptions }
            </SelectField>
        );
    }
}
