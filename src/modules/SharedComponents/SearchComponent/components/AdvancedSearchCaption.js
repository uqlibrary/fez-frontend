import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DOCUMENT_TYPES_LOOKUP } from 'config/general';
import { locale } from 'locale';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    and: {
        ...theme.typography.caption,
    },
    title: {
        ...theme.typography.caption,
    },
    combiner: {
        ...theme.typography.caption,
        fontStyle: 'italic',
    },
    value: {
        ...theme.typography.caption,
        fontWeight: 'bold',
    },
});

export class AdvancedSearchCaption extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        fieldRows: PropTypes.array,
        docTypes: PropTypes.array,
        yearFilter: PropTypes.object,
        isOpenAccess: PropTypes.bool,
        classes: PropTypes.object,
    };

    static defaultProps = {
        fieldRows: [
            {
                searchField: '0',
                value: '',
                label: '',
            },
        ],
        yearFilter: {
            from: null,
            to: null,
            invalid: true,
        },
        isOpenAccess: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            captionData: this.updateStateData(props),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            captionData: this.updateStateData(nextProps),
        });
    }

    getCleanValue = item => {
        // Receives an object in format {title: string, combiner: string, value: string||array}
        if (Array.isArray(item.value)) {
            const values = [...item.value];
            const lastValue = values.pop();
            return { ...item, value: values.length > 0 ? `${values.join(', ')} or ${lastValue}` : lastValue };
        }
        if (item.title === 'Any field' && item.value === '') {
            return { ...item, value: 'anything' };
        } else {
            return item;
        }
    };

    getSearchFieldData = fieldRows => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const rows = fieldRows
            .filter(item => item.searchField !== 'rek_display_type')
            .map(item => {
                if (!!txt[item.searchField].captionFn) {
                    return txt[item.searchField].captionFn(item.value);
                } else {
                    return this.getCleanValue({
                        title: txt[item.searchField].title,
                        combiner: txt[item.searchField].combiner,
                        value: item.value,
                    });
                }
            });
        return rows;
    };

    getDocTypeData = docTypes => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const converteddocTypes = docTypes.map(item => DOCUMENT_TYPES_LOOKUP[item]);
        const lastItem = converteddocTypes.pop();
        const docsString = converteddocTypes.length > 0 ? `${converteddocTypes.join(', ')} or ${lastItem}` : lastItem;
        return this.getCleanValue({
            title: txt.rek_display_type.title,
            combiner: txt.rek_display_type.combiner,
            value: docsString,
        });
    };

    getOpenAccessData = isOpenAccess => {
        const txt = locale.components.searchComponent.advancedSearch.openAccess;
        return isOpenAccess ? { title: '', combiner: txt.combiner, value: txt.captionText } : null;
    };

    getYearFilterData = yearFilter => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        return yearFilter.from && yearFilter.to
            ? {
                title: txt.facet_year_range.captionTitle,
                combiner: txt.facet_year_range.combiner,
                value: `${yearFilter.from} to ${yearFilter.to}`,
            }
            : null;
    };

    updateStateData = props => {
        return [
            ...this.getSearchFieldData(props.fieldRows),
            this.getDocTypeData(props.docTypes),
            this.getOpenAccessData(props.isOpenAccess),
            this.getYearFilterData(props.yearFilter),
        ];
    };

    renderCaptions = items => {
        const { classes } = this.props;
        return items
            .filter(item => item !== null) // Dont render nulls
            .filter(item => item.title !== 'Select a field') // Dont render caption for select a field
            .filter(item => !!item.value) // Dont render caption until it has a value
            .map((item, index) => {
                return (
                    <span key={index}>
                        <span className={classes.and}> {index !== 0 && ' AND '} </span>
                        <span className={classes.title}>{item.title} </span>
                        <span className={classes.combiner}> {item.combiner} </span>
                        <span className={classes.value}> {item.value}</span>
                    </span>
                );
            });
    };

    render() {
        console.log('CAPTION =====> ', this.props);
        return (
            <div className={`${this.props.className} searchQueryCaption`}>
                {this.renderCaptions(this.state.captionData)}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AdvancedSearchCaption);
