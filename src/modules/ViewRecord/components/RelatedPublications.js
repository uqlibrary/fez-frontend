import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import StandardCard from 'modules/SharedComponents/Toolbox/StandardCard';
import {Link} from 'react-router-dom';

export default class RelatedPublications extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        title: PropTypes.string,
        className: PropTypes.string,
        parentSearchKey: PropTypes.object,
        childrenSearchKey: PropTypes.object.isRequired,
        showPublicationTitle: PropTypes.bool
    };

    static defaultProps = {
        title: locale.viewRecord.sections.relatedPublications.title,
        className: 'relatedPublications',
        childrenSearchKey: {
            key: 'fez_record_search_key_has_related_datasets',
            pid: 'rek_has_related_datasets',
            title: 'rek_has_related_datasets_lookup',
            order: 'rek_has_related_datasets_order'
        },
        showPublicationTitle: false
    };

    renderList = (publication, parentSearchKey, childrenSearchKey, showPublicationTitle) => {
        const parents = parentSearchKey && publication[parentSearchKey.key] || [];
        const children = publication[childrenSearchKey.key];

        return(
            <ul className="publicationList">
                {
                    this.renderSubList(parents, parentSearchKey)
                }
                {
                    showPublicationTitle &&
                    <li key={'current'}>
                        {publication.rek_title}<b>{' (' + locale.viewRecord.sections.relatedPublications.currentRecord + ')'}</b>
                    </li>
                }
                {
                    this.renderSubList(children, childrenSearchKey)
                }
            </ul>
        );
    }

    renderSubList = (subList, searchKey) => {
        return (
            subList.filter(item => (
                item[searchKey.title] && item[searchKey.title].trim().length > 0
            )).sort((item1, item2) => (
                item1[searchKey.order] - item2[searchKey.order]
            )).map((item, index)=> {
                return (
                    <li key={`${searchKey.key}-${index}`}>
                        {
                            this.renderTitle(item, searchKey)
                        }
                    </li>
                );
            })
        );
    }

    renderTitle = (item, searchKey) => {
        const pid = item[searchKey.pid];
        return (
            <Link to={pathConfig.records.view(pid)}>{item[searchKey.title]}</Link>
        );
    }

    render() {
        const {publication, parentSearchKey, childrenSearchKey, title, className, showPublicationTitle} = this.props;

        if ((!parentSearchKey || !publication[parentSearchKey.key] || publication[parentSearchKey.key].length === 0) &&
            (!publication[childrenSearchKey.key] || publication[childrenSearchKey.key].length === 0)) {
            return null;
        }

        return (
            <StandardCard title={title} className={className}>
                {
                    this.renderList(publication, parentSearchKey, childrenSearchKey, showPublicationTitle)
                }
            </StandardCard>
        );
    }
}
