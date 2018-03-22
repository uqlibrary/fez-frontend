/**
 * Returns the data for graph - count of unique publication types
 *
 * @param {array} data - raw data
 * @param {number} keepPublicationTypes -  keep X of pub types, sum others
 * @returns {Array} in format [ ['Journal articles', 429], ['Conference papers', 112], ['Other', 129] ]
 */
export function getPublicationsPerType(data, keepPublicationTypes) {
    const rawData = [...data];
    const values = rawData.reduce((a, b) => {return a.concat(b.stats_display_type_i_lookup_exact.buckets);}, []);
    const publicationTypesCountObject = values
        .reduce((a, b) => {
            a[b.key] = (a[b.key] >= 0) ? (a[b.key] + b.doc_count) : b.doc_count;
            return a;
        }, {});

    // transform object to array and sort in descending order
    const publicationTypesCount = Object.keys(publicationTypesCountObject)
        .map(publicationType => [publicationType, publicationTypesCountObject[publicationType]])
        .sort((item1, item2) => item2[1] - item1[1]);

    if (!keepPublicationTypes || publicationTypesCount.length <= keepPublicationTypes) {
        return publicationTypesCount;
    } else {
        // get top publications, create 'Other' publication type
        const topCounts = publicationTypesCount.slice(0, keepPublicationTypes);
        const otherCounts = publicationTypesCount
            .slice(keepPublicationTypes)
            .reduce((init, item) => {
                return init + item[1];
            }, 0);
        topCounts.push(['Other', otherCounts]);
        return topCounts;
    }
}

/**
 * getCategories - transforms raw academic publication years data into categories, eg years
 * eg [1977, 1980, 1982]
 * @param {array} data - raw data
 * @returns {Array}
 */
export function getPublicationsPerYearCategories(data) {
    const rawData = [...data];
    // extract years and parse year value into int
    const categories = rawData.map((yearData) => { return parseInt(yearData.key, 10); });

    // sort years in ascending order
    categories.sort((yearFirst, yearNext) => { return yearFirst - yearNext; });
    return categories;
}

/**
 * getSeries - transforms raw academic publication years data into series formatted data, eg publication type and publications count per year
 * eg [{ 'name': 'Journal Article', 'data': [1, 1, 3]}]
 * @param {object} data - raw data
 * @param {Array} topPublicationTypes - output of getPublicationsPerType()
 * @returns {Array}
 */
export function getPublicationsPerYearSeries(data, topPublicationTypes) {
    const rawData = [...data];
    // initialise data structure
    const initialValues = new Array(rawData.length).fill(0);

    const fields = topPublicationTypes.reduce((initObject, item) => {
        initObject[item[0]] = [...initialValues];
        return initObject;
    }, {});

    // sort all data by year
    rawData.sort((yearFirst, yearNext) => { return parseInt(yearFirst.key, 10) - parseInt(yearNext.key, 10); });

    // for each year/publication type - extract publication type count
    rawData.map((yearData, yearIndex) => {
        yearData.stats_display_type_i_lookup_exact.buckets.map((publicationType) => {
            if (fields[publicationType.key]) {
                fields[publicationType.key][yearIndex] = publicationType.doc_count;
            } else {
                fields.Other[yearIndex] += publicationType.doc_count;
            }
        });
    });

    const series = [];

    // construct final data structure
    Object.keys(fields).map(publicationType => {
        series.push({
            name: publicationType,
            data: fields[publicationType]
        });
    });

    return series;
}

/**
 * WOS/SCOPUS stats
 * @param {Array} years
 * @param {array} data - raw data
 * @returns {object}
 */
export function getPublicationsStats(years, data) {
    return {
        thomson_citation_count_i: {
            ...data.stats_thomson_citation_count_i,
            years: `${years[0]} - ${years[years.length - 1]}`
        },
        scopus_citation_count_i: {
            ...data.stats_scopus_citation_count_i,
            years: `${years[0]} - ${years[years.length - 1]}`
        }
    };
}

