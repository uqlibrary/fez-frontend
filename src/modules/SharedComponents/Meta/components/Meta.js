import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet, HelmetProvider } from '@dr.pogodin/react-helmet';
import PropTypes from 'prop-types';
import { viewRecordsConfig } from 'config/viewRecord';
import { locale } from 'locale';
import { useLocation } from 'react-router-dom';

const dompurify = require('dompurify');
const moment = require('moment');

const sanitiseAndReplaceHtmlChars = (object, key, alternateKey) => {
    const replaceHtmlChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    };
    const sanitisedFormattedText =
        !!object[alternateKey] && dompurify.sanitize(object[alternateKey], { ALLOWED_TAGS: [''] }).replace(/\s/g, '');
    const text =
        (!!object[key] && object[key].length > 0 && object[key]) || (sanitisedFormattedText && object[alternateKey]);
    return (text.length > 0 && text.replace(/[&<>]/g, replace => replaceHtmlChars[replace] || /* istanbul ignore next */ replace));
};

export const getMetaTagContent = (object, key, url, dateFormat) => {
    if (!!object) {
        switch (key) {
            case 'rek_pid':
                return !!object[key] && url(object[key]);
            case 'rek_date':
                return (
                    !!object[key] &&
                    ((object[key].length === 4 && object[key]) || moment.parseZone(object[key]).format(dateFormat))
                );
            case 'rek_description':
                return sanitiseAndReplaceHtmlChars(object, key, 'rek_formatted_abstract');
            case 'rek_title':
                return sanitiseAndReplaceHtmlChars(object, key, 'rek_formatted_title');
            case 'rek_issn':
                return object[key];
            default:
                return (!!object[`${key}_lookup`] && object[`${key}_lookup`]) || (!!object[key] && object[key]);
        }
    }

    return null;
};

const getSingleTagForSingleValue = (name, object, key, url, format) => {
    const content = getMetaTagContent(object, key, url, format);
    return content && { name, content };
};

const getMultipleTagsForMultipleValues = (searchKey, subkey, url, tag) => {
    const { name, format } = tag;
    return (
        !!searchKey &&
        searchKey.length > 0 &&
        searchKey.map(object => getSingleTagForSingleValue(name, object, subkey, url, format))
    );
};

const getSingleTagForMultipleValues = (searchKey, subkey, tag) => {
    return [
        {
            name: tag.name,
            content:
                !!searchKey &&
                searchKey.length > 0 &&
                searchKey
                    .reduce((metaTagContent, fieldValue) => {
                        metaTagContent.push(fieldValue[subkey]);
                        return metaTagContent;
                    }, [])
                    .join('; '),
        },
    ];
};

const getMetaTagsForFezRecordSearchKeys = (searchKey, subkey, url, tag) => {
    const { name, isMultiple, format } = tag;
    if (!!searchKey && searchKey.length > 0) {
        // If multiple tags allowed then get meta tag for each value
        // Otherwise single meta tag for multiple values separated by semicolon
        return isMultiple
            ? getMultipleTagsForMultipleValues(searchKey, subkey, url, tag)
            : getSingleTagForMultipleValues(searchKey, subkey, tag);
    } else {
        // Return meta tag if single value exists in search key
        return [getSingleTagForSingleValue(name, searchKey, subkey, url, format)];
    }
};

const getMetaTagsForOtherFields = (publication, values, subkey, url, tag) => {
    const { name, isMultiple, format } = tag;
    if (isMultiple) {
        return getMultipleTagsForMultipleValues(values, subkey, url, tag);
    } else {
        return [getSingleTagForSingleValue(name, publication, subkey, url, format)];
    }
};

export const getMetaTags = publication => {
    // Loop through each meta tag
    return viewRecordsConfig.metaTags
        .reduce((metaTags, metaTag) => {
            const { searchKey, subkey, tags, url } = metaTag;
            // Push dublin core DC.* and/or citation_* meta tags for each field
            metaTags.push(
                ...tags.reduce((tagsContent, tag) => {
                    const metaTagsContent = !!searchKey
                        ? publication.hasOwnProperty(searchKey) &&
                          getMetaTagsForFezRecordSearchKeys(publication[searchKey], subkey, url, tag)
                        : publication.hasOwnProperty(subkey) &&
                          getMetaTagsForOtherFields(publication, publication[subkey], subkey, url, tag);

                    return [...tagsContent, ...(metaTagsContent || [])];
                }, []),
            );
            return metaTags;
        }, [])
        .filter(tag => tag);
};

const Meta = ({ routesConfig }) => {
    const location = useLocation();

    const publication = useSelector(state => state.get('viewRecordReducer')?.recordToView) || null;

    // remove the container and adjust index, tests

    const metaTags = !!publication && getMetaTags(publication);
    const filteredRoutes =
        !publication &&
        routesConfig.filter(route =>
            !!route.regExPath
                ? new RegExp(route.regExPath, 'i').test(location.pathname)
                : route.path === location.pathname,
        );

    let pageTitle = '';

    if (!!publication) {
        if (location.pathname.indexOf('/admin/edit/') >= 0) {
            pageTitle = `Edit ${publication.rek_display_type_lookup} - ${publication.rek_title}`;
        } else {
            pageTitle = publication.rek_title;
        }
    } else {
        pageTitle = filteredRoutes.length > 0 && filteredRoutes[0].pageTitle;
    }

    const linkProps = !!publication
        ? {
              link: [
                  {
                      rel: 'schema.DC',
                      href: 'http://purl.org/DC/elements/1.0/',
                  },
              ],
          }
        : {};
    const metaTagsProps =
        (metaTags.length > 0 && {
            meta: metaTags.map((tag, index) => ({
                key: `${tag.name}-${index}`,
                ...tag,
                ...(tag.name === 'DC.Identifier' ? { scheme: 'URI' } : {}),
            })),
        }) ||
        {};

    return (
        <HelmetProvider>
            <Helmet
                prioritizeSeoTags
                title={`${pageTitle ? `${pageTitle} - ` : ''}${locale.global.title}`}
                {...linkProps}
                {...metaTagsProps}
            />
        </HelmetProvider>
    );
};
Meta.propTypes = {
    routesConfig: PropTypes.array,
};

export default React.memo(Meta);
