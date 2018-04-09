import React from 'react';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import {viewRecordsConfig} from 'config/viewRecord';

const moment = require('moment');
export default class Meta extends React.PureComponent {
    static propTypes = {
        publication: PropTypes.object
    };

    getMetaTag = (name, content, scheme = false) => {
        const replacements = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};
        return (
            <meta name={name} content={content.replace(/[&<>]/g, (replace) => (replacements[replace] || replace))} {...(scheme ? {scheme: 'URI'} : {})}/>
        );
    };

    renderMetaTags = (publication) => {
        const metaTags = [];

        viewRecordsConfig.metaTags.map(metaTag => {
            const {field, subkey, tags, url} = metaTag;

            metaTags.push(tags.map(tag => {
                if (!!field && !!publication[field]) {
                    if (publication[field].length > 0) {
                        if (tag.multiple) {
                            return publication[field].map(fieldValue => {
                                if (!!fieldValue[subkey] && !!url && subkey === 'rek_file_attachment_name' && fieldValue[subkey].split('.')[1] === 'pdf') {
                                    return this.getMetaTag(tag.name, url(publication.rek_pid, fieldValue[subkey]));
                                } else {
                                    return this.getMetaTag(tag.name, subkey !== 'rek_issn' && fieldValue[`${subkey}_lookup`] || fieldValue[subkey]);
                                }
                            });
                        } else {
                            return this.getMetaTag(tag.name, publication[field].reduce((metaTagContent, fieldValue) => {
                                metaTagContent.push(fieldValue[subkey]);
                                return metaTagContent;
                            }, []).join('; '));
                        }
                    } else if (!!publication[field][subkey]) {
                        return this.getMetaTag(tag.name, publication[field][subkey]);
                    } else {
                        return '';
                    }
                } else {
                    return !!publication[subkey] &&
                        (
                            subkey === 'rek_pid' && url && this.getMetaTag(tag.name, url(publication.rek_pid), true) ||
                            subkey === 'rek_date' && this.getMetaTag(tag.name, moment(publication[subkey]).format(tag.format)) ||
                            this.getMetaTag(tag.name, publication[subkey])
                        );
                }
            }));
        });

        return metaTags;
    };

    render() {
        const metaTags = this.renderMetaTags(this.props.publication);
        return (
            <Helmet>
                <title>{`${this.props.publication.rek_title} - UQ eSpace`} </title>
                <link rel="schema.DC" href="http://purl.org/DC/elements/1.0/" />
                {metaTags}
            </Helmet>
        );
    }
}
