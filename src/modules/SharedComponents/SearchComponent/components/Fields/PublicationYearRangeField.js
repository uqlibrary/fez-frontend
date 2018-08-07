import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import locale from 'locale/components';

export default class PublicationYearRangeField extends PureComponent {
    static propTypes = {
        yearFilter: PropTypes.object,
        updateYearRangeFilter: PropTypes.func.isRequired,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        className: 'publicationyearrange menuitem',
        yearFilter: {
            from: null,
            to: null,
            valid: true
        },
        disabled: false
    };

    setValue = (key) => (event) => {
        const value = event.target.value.toString();
        let intValue = value.replace(/\D/g, '');
        intValue = parseInt(intValue, 10);
        this.props.updateYearRangeFilter({
            ...this.props.yearFilter,
            [key]: isNaN(intValue) ? 0 : intValue,
            invalid: !this.isValidText()
        });
    };

    isValidText = () => {
        const from = parseInt(this.props.yearFilter.from, 10);
        const to = parseInt(this.props.yearFilter.to, 10);
        return (from > to) || (from > 0 && !to) || (!from && to > 0) || (from > 9999) || (to > 9999)
            ? locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range.invalidText : null;
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range;
        return (
            <div className="columns is-gapless is-mobile ">
                <div className="column">
                    <TextField
                        id={'to'}
                        fullWidth
                        value={this.props.yearFilter.from ? `${this.props.yearFilter.from}` : ''}
                        floatingLabelText={txt.title}
                        floatingLabelFixed
                        onChange={this.setValue('from')}
                        errorText={this.isValidText()}
                        hintText={txt.fromHint}
                        aria-label={txt.fromAria}
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
                        id={'from'}
                        fullWidth
                        value={this.props.yearFilter.to ? `${this.props.yearFilter.to}` : ''}
                        floatingLabelText={' '}
                        floatingLabelFixed
                        onChange={this.setValue('to')}
                        errorText={this.isValidText() && ' '}
                        hintText={txt.toHint}
                        aria-label={txt.toAria}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }
}
