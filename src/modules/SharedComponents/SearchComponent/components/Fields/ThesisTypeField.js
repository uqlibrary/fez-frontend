import React, {PureComponent} from 'react';
import {thesisSubtypes} from 'config/general';
import AdvancedSearchSelectInput from '../AdvancedSearchSelectInput';

export default class ThesisTypeField extends PureComponent {
    render() {
        return (
            <AdvancedSearchSelectInput {...this.props} options={thesisSubtypes} className="thesistype menuitem" />
        );
    }
}
