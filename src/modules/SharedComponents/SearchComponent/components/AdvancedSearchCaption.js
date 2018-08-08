import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {documentTypesLookup} from 'config/general';
import {locale} from 'locale';

export default class AdvancedSearchCaption extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        fieldRows: PropTypes.array,
        docTypes: PropTypes.array,
        yearFilter: PropTypes.object,
        isOpenAccess: PropTypes.bool,
    };

    static defaultProps = {
        fieldRows: [{
            searchField: '0',
            value: '',
            label: ''
        }],
        yearFilter: {
            from: null,
            to: null,
            invalid: true
        },
        isOpenAccess: false,
    };

    renderCaptions = (items) => {
        return items
            .filter((item) => item.title !== 'Select a field') // Dont render caption for select a field
            .filter((item) => item.value !== '') // Dont render caption until it has a value
            .map((item, index) => {
                return (
                    <span key={index}>
                        <span className="and"> {index !== 0 && ' AND '}</span>
                        <span className="title">{item.title} </span>
                        <span className="combiner"> {item.combiner} </span>
                        <span className="value"> {item.value}</span>
                    </span>
                );
            });
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const {fieldRows, docTypes, isOpenAccess, yearFilter}  = this.props;
        const allCaptions = [];

        // All general searchFields
        let flattenedArrayValue = null;
        fieldRows.filter(item => item.searchField !== 'rek_display_type')
            .map((item) => {
                // If the value is an array of objects, lets make it read nicely
                if(Array.isArray(item.value)) {
                    flattenedArrayValue = (
                        <span>
                            {item.value.map((value, index) => {
                                if (index === 0) {
                                    return <span key={index}>{value}</span>;
                                } else if (index + 1 !== item.value.length) {
                                    return <span key={index}>, {value}</span>;
                                } else {
                                    return <span key={index}> or {value}</span>;
                                }
                            })}
                        </span>
                    );
                }
                if(item.searchField === 'all' && item.value === '') {
                    allCaptions.push({title: txt[item.searchField].title, combiner: txt[item.searchField].combiner, value: 'anything'});
                } else {
                    allCaptions.push({title: txt[item.searchField].title, combiner: txt[item.searchField].combiner, value: Array.isArray(item.value) ? flattenedArrayValue : item.value});
                }
            });

        // Document types caption
        const docTypeList =  docTypes && docTypes.map((item, index) => {
            if(index === 0) {
                return <span key={index}>{documentTypesLookup[item]}</span>;
            }else if(index + 1 !== docTypes.length) {
                return <span key={index}>, {documentTypesLookup[item]}</span>;
            } else {
                return <span key={index}> or {documentTypesLookup[item]}</span>;
            }
        });
        docTypeList.length !== 0 && allCaptions.push({title: txt.rek_display_type.title, combiner: txt.rek_display_type.combiner, value: docTypeList});

        // Year range caption
        if(yearFilter.from && yearFilter.to && !yearFilter.invalid) {
            const yearRange = yearFilter.from + ' and ' + yearFilter.to;
            allCaptions.push({title: 'Published', combiner: txt.facet_year_range.combiner, value: yearRange});
        }

        // Open Access caption
        if(isOpenAccess) {
            allCaptions.push({title: '', combiner: 'is', value: (<span className="value">open access/full text</span>)});
        }

        return (
            <div className={`${this.props.className} searchQueryCaption`}>
                {this.renderCaptions(allCaptions)}
            </div>
        );
    }
}
