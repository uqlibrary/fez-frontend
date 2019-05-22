import React, {PureComponent} from 'react';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import {viewRecordsConfig} from 'config/viewRecord';
import {locale} from 'locale';

const dompurify = require('dompurify');
const moment = require('moment');
export default class Meta extends PureComponent {
    static propTypes = {
        publication: PropTypes.object,
        routesConfig: PropTypes.array,
        location: PropTypes.object.isRequired
    };

    sanitiseAndReplaceHtmlChars = (object, key, alternateKey) => {
        const replaceHtmlChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
        };
        const sanitisedFormattedText = !!object[alternateKey] &&
            dompurify.sanitize(object[alternateKey], {ALLOWED_TAGS: ['']}).replace(/\s/g, '');
        const text = !!object[key] && object[key].length > 0 && object[key] || sanitisedFormattedText && object[alternateKey];
        return text.length > 0 &&
            text.replace(/[&<>]/g, (replace) => (replaceHtmlChars[replace] || /* istanbul ignore next */ replace));
    };

    getMetaTagContent = (object, key, url, dateFormat) => {
        if (!!object) {
            switch (key) {
                case 'rek_pid':
                    return !!object[key] && url(object[key]);
                case 'rek_date':
                    return !!object[key] && (object[key].length === 4 && object[key] ||
                        moment.parseZone(object[key]).format(dateFormat));
                case 'rek_description':
                    return this.sanitiseAndReplaceHtmlChars(object, key, 'rek_formatted_abstract');
                case 'rek_title':
                    return this.sanitiseAndReplaceHtmlChars(object, key, 'rek_formatted_title');
                // Removing file list metatagging to avoid inconsistencies between googlebot and google scholar
                // case 'fez_datastream_info':
                //     return !!object.dsi_dsid && object.dsi_mimetype === 'application/pdf' &&
                //         url(this.props.publication.rek_pid, object.dsi_dsid);
                case 'rek_issn':
                    return object[key];
                default:
                    return !!object[`${key}_lookup`] && object[`${key}_lookup`] || !!object[key] && object[key];
            }
        }

        return null;
    };

    getSingleTagForSingleValue = (name, object, key, url, format) => {
        const content = this.getMetaTagContent(object, key, url, format);
        return content && {name, content};
    };

    getMultipleTagsForMultipleValues = (searchKey, subkey, url, tag) => {
        const {name, format} = tag;
        return !!searchKey && searchKey.length > 0 && searchKey.map(object => this.getSingleTagForSingleValue(name, object, subkey, url, format));
    };

    getSingleTagForMultipleValues = (searchKey, subkey, tag) => {
        return [{
            name: tag.name,
            content: !!searchKey && searchKey.length > 0 && searchKey.reduce((metaTagContent, fieldValue) => {
                metaTagContent.push(fieldValue[subkey]);
                return metaTagContent;
            }, []).join('; ')
        }];
    };

    getMetaTagsForFezRecordSearchKeys = (searchKey, subkey, url, tag) => {
        const {name, isMultiple, format} = tag;
        if (!!searchKey && searchKey.length > 0) {
            return isMultiple
                ? this.getMultipleTagsForMultipleValues(searchKey, subkey, url, tag)  // If multiple tags allowed then get meta tag for each value
                : this.getSingleTagForMultipleValues(searchKey, subkey, tag);     // Single meta tag for multiple values separated by semicolon
        } else {
            // Return meta tag if single value exists in search key
            return [this.getSingleTagForSingleValue(name, searchKey, subkey, url, format)];
        }
    };

    getMetaTagsForOtherFields = (values, subkey, url, tag) => {
        const {name, isMultiple, format} = tag;
        if (isMultiple) {
            return this.getMultipleTagsForMultipleValues(values, subkey, url, tag);
        } else {
            return [this.getSingleTagForSingleValue(name, this.props.publication, subkey, url, format)];
        }
    };

    getMetaTags = (publication) => {
        // Loop through each meta tag
        return viewRecordsConfig.metaTags.reduce((metaTags, metaTag) => {
            const {searchKey, subkey, tags, url} = metaTag;
            // Push dublin core DC.* and/or citation_* meta tags for each field
            metaTags.push(
                ...(tags.reduce((tagsContent, tag) => {
                    const metaTagsContent = !!searchKey
                        ? publication.hasOwnProperty(searchKey) && this.getMetaTagsForFezRecordSearchKeys(publication[searchKey], subkey, url, tag)
                        : publication.hasOwnProperty(subkey) && this.getMetaTagsForOtherFields(publication[subkey], subkey, url, tag);

                    return [...tagsContent, ...(metaTagsContent || [])];
                }, []))
            );
            return metaTags;
        }, []).filter(tag => tag);
    };

    render() {
        const {publication, routesConfig} = this.props;
        const metaTags = !!publication && this.getMetaTags(publication);
        const filteredRoutes = !publication && routesConfig.filter(route => !!route.regExPath
            ? (new RegExp(route.regExPath, 'i')).test(this.props.location.pathname)
            : route.path === this.props.location.pathname);
        const pageTitle = !!publication
            ? publication.rek_title
            : filteredRoutes.length > 0 && filteredRoutes[0].pageTitle;
        return (
            <Helmet>
                <title>{`${pageTitle ? `${pageTitle} - ` : ''}${locale.global.title}`}</title>
                {
                    !!publication &&
                    <link rel="schema.DC" href="http://purl.org/DC/elements/1.0/" />
                }
                {
                    metaTags &&
                    metaTags.map((metaTag, index) => {
                        const {name} = metaTag;
                        const scheme = name === 'DC.Identifier' ? {scheme: 'URI'} : {};
                        return <meta key={`${name}-${index}`} {...metaTag} {...scheme} />;
                    })
                }
            </Helmet>
        );
    }
}
