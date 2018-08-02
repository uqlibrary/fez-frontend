import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import locale from 'locale/components';

export default class PublicationYearRangeField extends PureComponent {
    static propTypes = {
        yearFilter: PropTypes.object,
        updateYearRangeFilter: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        className: 'publicationyearrange menuitem',
        yearFilter: {
            from: null,
            to: null
        },
        disabled: false
    };

    setValue = (key) => (event) => {
        const value = event.target.value.toString();
        let intValue = value.replace(/\D/g, '');
        if(isNaN(intValue) || !intValue || intValue === null) {
            delete this.props.yearFilter[key];
            this.props.updateYearRangeFilter({
                ...this.props.yearFilter,
            });
        } else {
            intValue = parseInt(intValue, 10);
            this.props.updateYearRangeFilter({
                ...this.props.yearFilter,
                [key]: intValue,
            });
        }
    };

    isValidText = () => {
        return (this.props.yearFilter.from > this.props.yearFilter.to)
        || (this.props.yearFilter.from && !this.props.yearFilter.to) || (!this.props.yearFilter.from && this.props.yearFilter.to)
        || (this.props.yearFilter.from > 9999) || (this.props.yearFilter.to > 9999)
            ? locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range.invalidText : undefined;
    };

    render() {
        return (
            <div className="columns is-gapless is-mobile ">
                <div className="column">
                    <TextField
                        fullWidth
                        value={this.props.yearFilter.from ? `${this.props.yearFilter.from}` : ''}
                        floatingLabelText={'Published year range'}
                        floatingLabelFixed
                        onChange={this.setValue('from')}
                        errorText={this.isValidText()}
                        hintText="Start year"
                        disabled={this.props.disabled}
                    />
                </div>
                <div className="column is-narrow">
                    <TextField
                        value={' to '}
                        disabled
                        floatingLabelText={' '}
                        floatingLabelFixed
                        style={{width: 24}}
                        underlineDisabledStyle={{display: 'none'}}
                    />
                </div>
                <div className="column" >
                    <TextField
                        fullWidth
                        value={this.props.yearFilter.to ? `${this.props.yearFilter.to}` : ''}
                        floatingLabelText={' '}
                        floatingLabelFixed
                        onChange={this.setValue('to')}
                        errorText={this.isValidText() && ' '}
                        hintText="End year"
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }
}
