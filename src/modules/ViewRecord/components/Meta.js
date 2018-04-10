import React from 'react';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import {viewRecordsConfig} from 'config/viewRecord';

const moment = require('moment');
export default class Meta extends React.PureComponent {
    static propTypes = {
        publication: PropTypes.object
    };

    getMetaTag = (name, content) => {
        return (
            <meta name={name} content={content} {...(name === 'DC.Identifier' ? {scheme: 'URI'} : {})}/>
        );
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
                    '>': '&gt;'
                };
                return (!!object[key] && object[key] || !!publication.rek_formatted_abstract && publication.rek_formatted_abstract)
                    .replace(/[&<>]/g, (replace) => (replaceHtmlChars[replace] || replace));
            case 'rek_file_attachment_name':
                return object[key].split('.')[1] === 'pdf' &&
                    url(publication.rek_pid, object[key]);
            case 'rek_issn':
                return object[key];
            default:
                return !!object[`${key}_lookup`] && object[`${key}_lookup`] || object[key];
        }
    };

    getMultipleTagsForField = (tagName, field, subkey, url) => {
        const {publication} = this.props;

        return publication[field].map(fieldValue => {
            const content = this.getMetaTagContent(fieldValue, subkey, url);
            return content && this.getMetaTag(tagName, content);
        });
    };

    renderMetaTags = (publication) => {
        // Loop through each meta tag
        return viewRecordsConfig.metaTags.reduce((metaTags, metaTag) => {
            const {field, subkey, tags, url} = metaTag;

            // Push dublin core DC.* and/or citation_* meta tags for each field
            metaTags.push(tags.map(tag => {
                // Check field is one of the search keys of the publication and it exists (fez_record_search_key_*)
                if (!!field && !!publication[field]) {
                    // Check search key field has multiple values
                    if (publication[field].length > 0) {
                        // If multiple tags allowed then get meta tag for each value
                        if (tag.isMultiple) {
                            return this.getMultipleTagsForField(tag.name, field, subkey, url);
                        } else {
                            // Single meta tag for multiple values separated by semicolon
                            return this.getMetaTag(
                                tag.name,
                                publication[field].reduce((metaTagContent, fieldValue) => {
                                    metaTagContent.push(fieldValue[subkey]);
                                    return metaTagContent;
                                }, []).join('; ')
                            );
                        }
                    } else if (!!publication[field][subkey]) {
                        // Return meta tag if single value exists in search key
                        return this.getMetaTag(tag.name, publication[field][subkey]);
                    } else {
                        return [];
                    }
                } else {
                    // If field is null and subkey (rek_pid, rek_description, rek_date etc.) exists in publication
                    const content = !!publication[subkey] && this.getMetaTagContent(publication, subkey, url, tag.format);
                    return content && this.getMetaTag(tag.name, content);
                }
            }));
            return metaTags;
        }, []);
    };

    render() {
        const metaTags = this.renderMetaTags(this.props.publication);
        return (
            <Helmet>
                <title>{`${this.props.publication.rek_title} - UQ eSpace`}</title>
                <link rel="schema.DC" href="http://purl.org/DC/elements/1.0/" />
                {metaTags}
            </Helmet>
        );
    }
}
