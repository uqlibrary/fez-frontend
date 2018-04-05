import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Link} from 'react-router-dom';

export default class RelatedPublications extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        title: PropTypes.string,
        className: PropTypes.string,
        searchKey: PropTypes.object,
        showPublicationTitle: PropTypes.bool
    };

    static defaultProps = {
        title: locale.viewRecord.sections.relatedPublications.title,
        className: 'relatedPublications',
        searchKey: {
            key: 'fez_record_search_key_has_related_datasets',
            pid: 'rek_has_related_datasets',
            title: 'rek_has_related_datasets_lookup',
            order: 'rek_has_related_datasets_order'
        },
        showPublicationTitle: false
    };

    renderList = (list, searchKey, className) => {
        return(
            <ul className={'publicationList'}>
                {
                    list.sort((item1, item2) => (
                        item1[searchKey.order] - item2[searchKey.order]
                    )).map((item, index)=> {
                        return (
                            <li key={`${className}-${index}`}>
                                {
                                    this.renderTitle(item, searchKey)
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    renderTitle = (item, searchKey) => {
        const pid = item[searchKey.pid];
        return (
            <Link to={pathConfig.records.view(pid)}>{item[searchKey.title]}</Link>
        );
    }

    render() {
        const {publication, searchKey, title, className, showPublicationTitle} = this.props;

        if (!publication[searchKey.key] || publication[searchKey.key].length === 0) {
            return null;
        }

        return (
            <StandardCard title={title} className={className}>
                {
                    showPublicationTitle &&
                    <div>
                        <span>{publication.rek_title}</span>
                        <span><b>{' (' + locale.viewRecord.sections.relatedPublications.currentRecord + ')'}</b></span>
                    </div>
                }
                {
                    this.renderList(publication[searchKey.key], searchKey, className)
                }
            </StandardCard>
        );
    }
}
