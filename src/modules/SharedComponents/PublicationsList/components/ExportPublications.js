import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ExportPublications extends PureComponent {
    static propTypes = {
        format: PropTypes.string,
        disabled: PropTypes.bool,
        onFormatChanged: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            format: props.format || null,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            format: nextProps.format,
        });
    }

    formatChanged =  (event, index, value) => {
        this.setState({
            format: value
        });

        this.props.onFormatChanged(this.state.format, value);
    }

    render() {
        const txt = locale.components.export;
        return (
            <div className="exportPublications columns is-hidden-mobile">
                <div className="column is-6-mobile">
                    <SelectField
                        id="exportPublicationsFormat"
                        maxHeight={250}
                        onChange={this.formatChanged}
                        value={this.state.format}
                        disabled={this.props.disabled}
                        floatingLabelText={txt.label}>
                        {
                            txt.format.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} primaryText={item.label}/>);
                            })
                        }
                    </SelectField>
                </div>
            </div>
        );
    }
}
