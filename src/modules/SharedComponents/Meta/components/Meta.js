import React from 'react';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import {viewRecordsConfig} from 'config/viewRecord';
import {locale} from 'locale';

const dompurify = require('dompurify');
const moment = require('moment');
export default class Meta extends React.PureComponent {
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
            text.replace(/[&<>]/g, (replace) => (replaceHtmlChars[replace] || replace));
    };

    getMetaTagContent = (object, key, url, dateFormat, pid) => {
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
            case 'fez_datastream_info':
                return !!object.dsi_dsid && object.dsi_mimetype === 'application/pdf' &&
                    url(pid, object.dsi_dsid);
            case 'rek_issn':
                return object[key];
            default:
                return !!object[`${key}_lookup`] && object[`${key}_lookup`] || !!object[key] && object[key];
        }
    };

    getMetaTags = (publication) => {
        // Loop through each meta tag
        return viewRecordsConfig.metaTags.reduce((metaTags, metaTag) => {
            const {field, subkey, tags, url} = metaTag;
            // Push dublin core DC.* and/or citation_* meta tags for each field
            metaTags.push(
                ...(tags.reduce((tagsContent, tag) => {
                    // Check field is one of the search keys of the publication and it exists (fez_record_search_key_*)
                    if (!!field && !!publication[field]) {
                        // Check search key field has multiple values
                        if (publication[field].length > 0) {
                            // If multiple tags allowed then get meta tag for each value
                            if (tag.isMultiple) {
                                publication[field].map(fieldValue => {
                                    const content = this.getMetaTagContent(fieldValue, subkey, url, null, publication.rek_pid);
                                    content && tagsContent.push({name: tag.name, content});
                                });
                            } else {
                                // Single meta tag for multiple values separated by semicolon
                                tagsContent.push({
                                    name: tag.name,
                                    content: publication[field].reduce((metaTagContent, fieldValue) => {
                                        metaTagContent.push(fieldValue[subkey]);
                                        return metaTagContent;
                                    }, []).join('; ')
                                });
                            }
                        } else if (!!publication[field][subkey]) {
                            // Return meta tag if single value exists in search key
                            tagsContent.push({name: tag.name, content: publication[field][subkey]});
                        }
                    } else {
                        // If field is null and subkey (rek_pid, rek_description, rek_date etc.) exists in publication
                        if (tag.isMultiple) {
                            !!publication[subkey] && publication[subkey].map(fieldValue => {
                                const content = this.getMetaTagContent(fieldValue, subkey, url, null, publication.rek_pid);
                                content && tagsContent.push({name: tag.name, content});
                            });
                        } else {
                            const content = this.getMetaTagContent(publication, subkey, url, tag.format, publication.rek_pid);
                            content && tagsContent.push({name: tag.name, content});
                        }
                    }
                    return [...tagsContent];
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
