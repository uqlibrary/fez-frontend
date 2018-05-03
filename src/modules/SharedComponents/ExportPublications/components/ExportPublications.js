import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ExportPublications extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        disabled: PropTypes.bool,
        actions: PropTypes.object,
    };

    formatChanged =  (event, index, value) => {
        this.props.actions.exportPublications(this.props.publicationsList, value);
    }

    render() {
        const txt = locale.components.export;
        return (
            <SelectField
                id="exportPublicationsFormat"
                maxHeight={250}
                onChange={this.formatChanged}
                disabled={this.props.disabled || !this.props.publicationsList.length}
                floatingLabelText={txt.label}>
                {
                    txt.format.map((item, index) => {
                        return (<MenuItem key={index} value={item.value} primaryText={item.label}/>);
                    })
                }
            </SelectField>
        );
    }
}
