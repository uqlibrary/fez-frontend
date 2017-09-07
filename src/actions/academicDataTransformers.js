/**
 * Returns the data for graph - count of unique publication types
 *
 * @param {object} raw data
 * @param {number} keepPublicationTypes -  keep X of pub types, sum others
 * @returns {array} in format [ ['Journal articles', 429], ['Conference papers', 112], ['Other', 129] ]
 */
export function getPublicationsPerType(data, keepPublicationTypes) {
    const values = data.reduce((a, b) => {return a.concat(b.pivot);}, []);
    const publicationTypesCountObject = values
        .reduce((a, b) => {
            a[b.value] = (a[b.value] >= 0) ? (a[b.value] + b.count) : b.count;
            return a;
        }, {});

    // transform object to array
    const publicationTypesCount = [];
    Object.keys(publicationTypesCountObject)
        .map(publicationType => {
            publicationTypesCount.push([publicationType, publicationTypesCountObject[publicationType]]);
        })
        .sort((item1, item2) => {
            return item1[1] < item2[1];
        });

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
 * @param {object} raw data
 * @returns {Array}
 */
export function getPublicationsPerYearCategories(rawData) {
    // extract years and parse year value into int
    const categories = rawData.map((yearData) => { return parseInt(yearData.value, 10); });

    // sort years in ascending order
    categories.sort((yearFirst, yearNext) => { return yearFirst - yearNext; });
    return categories;
}

/**
 * getSeries - transforms raw academic publication years data into series formatted data, eg publication type and publications count per year
 * eg [{ 'name': 'Journal Article', 'data': [1, 1, 3]}]
 * @param {object} raw data
 * @param {array} output of getPublicationsPerType()
 * @returns {Array}
 */
export function getPublicationsPerYearSeries(rawData, topPublicationTypes) {
    // initialise data structure
    const initialValues = new Array(rawData.length).fill(0);

    const fields = topPublicationTypes.reduce((initObject, item) => {
        initObject[item[0]] = [...initialValues];
        return initObject;
    }, {});

    // sort all data by year
    rawData.sort((yearFirst, yearNext) => { return parseInt(yearFirst.value, 10) - parseInt(yearNext.value, 10); });

    // for each year/publication type - extract publication type count
    rawData.map((yearData, yearIndex) => {
        yearData.pivot.map((publicationType) => {
            if (fields[publicationType.value]) {
                fields[publicationType.value][yearIndex] = publicationType.count;
            } else {
                fields.Other[yearIndex] += publicationType.count;
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
 * @param {object} raw data
 * @returns {object}
 */
export function getPublicationsStats(rawData) {
    const years = rawData.aggregations.date_year_t.buckets
        .map(item => { return item.key; })
        .sort((item1, item2) => { return item1 - item2; });
    const formattedStats = {
        thomson_citation_count_i: {
            ...rawData.aggregations.thomson_citation_count_i,
            years: `${years[0]} - ${years[years.length - 1]}`

        },
        scopus_citation_count_i: {
            ...rawData.aggregations.scopus_citation_count_i,
            years: `${years[0]} - ${years[years.length - 1]}`
        }
    };
    return formattedStats;
}
