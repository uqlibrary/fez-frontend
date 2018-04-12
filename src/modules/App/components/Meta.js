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
        isTitleOnly: PropTypes.bool,
        title: PropTypes.string,
        children: PropTypes.any
    };

    getMetaTagContent = (object, key, url, dateFormat) => {
        const {publication} = this.props;

        switch (key) {
            case 'rek_pid':
                return url(publication.rek_pid);
            case 'rek_date':
                return !!object[key] && object[key].length === 4 && object[key] ||
                    moment.parseZone(object[key]).format(dateFormat);
            case 'rek_description':
                const replaceHtmlChars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                };
                const sanitisedFormattedAbstract = !!publication.rek_formatted_abstract &&
                    dompurify.sanitize(publication.rek_formatted_abstract, {ALLOWED_TAGS: ['']}).replace(/\s/g, '');
                const description = !!object[key] && object[key] || sanitisedFormattedAbstract && publication.rek_formatted_abstract;
                return description.length > 0 &&
                    description.replace(/[&<>]/g, (replace) => (replaceHtmlChars[replace] || replace));
            case 'fez_datastream_info':
                return object.dsi_mimetype === 'application/pdf' &&
                    url(publication.rek_pid, object.dsi_dsid);
            case 'rek_issn':
                return object[key];
            default:
                return !!object[`${key}_lookup`] && object[`${key}_lookup`] || object[key];
        }
    };

    renderMetaTags = (publication) => {
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
                                    const content = this.getMetaTagContent(fieldValue, subkey, url);
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
                                const content = this.getMetaTagContent(fieldValue, subkey, url);
                                content && tagsContent.push({name: tag.name, content});
                            });
                        } else {
                            const content = !!publication[subkey] && this.getMetaTagContent(publication, subkey, url, tag.format);
                            content && tagsContent.push({name: tag.name, content});
                        }
                    }
                    return [...tagsContent];
                }, []))
            );
            return metaTags;
        }, []);
    };

    render() {
        const {isTitleOnly, publication, title} = this.props;
        const metaTags = !isTitleOnly && this.renderMetaTags(publication);
        const pageTitle = !!publication && publication.rek_title || !!title && title;
        return (
            <div>
                <Helmet>
                    <title>{`${pageTitle ? pageTitle + ' - ' : ''}${locale.global.title}`}</title>
                    {
                        !isTitleOnly &&
                        <link rel="schema.DC" href="http://purl.org/DC/elements/1.0/" />
                    }
                    {
                        metaTags &&
                        metaTags.map((metaTag, index) => {
                            return metaTag ? (<meta key={`${metaTag.name}-${index}`} name={metaTag.name} content={metaTag.content} {...(metaTag.name === 'DC.Identifier' ? {scheme: 'URI'} : {})}/>) : null;
                        })
                    }
                </Helmet>
                {
                    this.props.children
                }
            </div>
        );
    }
}
