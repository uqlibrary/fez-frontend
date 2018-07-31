import React, {PureComponent} from 'react';
import {publicationSubtypes} from 'config/general';
import AdvancedSearchSelectInput from '../AdvancedSearchSelectInput';

export default class SubTypeField extends PureComponent {
    render() {
        return (
            <AdvancedSearchSelectInput {...this.props} options={publicationSubtypes} className="subtype menuitem" />
        );
    }
}

