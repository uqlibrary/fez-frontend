import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
// import DateCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DateCitationView';
// import CitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/CitationView';
import {Link} from 'react-router-dom';

export default class RelatedPublications extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        subKey: PropTypes.string.isRequired,
        showPublicationTitle: PropTypes.bool
    };

    static defaultProps = {
        showPublicationTitle: false
    }

    renderList = (list, subKey) => {
        return(
            <ul className={'publicationList'}>
                {
                    list.sort((item1, item2) => (
                        item1[subKey + '_order'] - item2[subKey + '_order']
                    )).map((item, index)=> {
                        return (
                            <li key={`related-publications-${index}`}>
                                {
                                    this.renderTitle(item, subKey)
                                }
                                {/*
                                    <CitationView suffix={' '} value={item.rek_display_type_lookup} className={'displayType'} />
                                    <DateCitationView prefix={'(' + locale.viewRecord.sections.relatedPublications.depositedBy + ' '} suffix={')'} format={'DD-MM-YYYY'} date={item.rek_created_date} />
                                */}
                            </li>
                        );
                    })
                }
            </ul>

        );
    }

    viewRecord = (pid) => {
        this.props.actions.loadRecordToView(pid);
    }

    renderTitle = (item, subKey) => {
        const pid = item[subKey];
        return (
            <Link to={pathConfig.records.view(pid)} onClick={()=>this.viewRecord(pid)}>{item[subKey + '_lookup']}</Link>
        );
    }

    render() {
        const {publication, field, subKey, title, showPublicationTitle} = this.props;

        if (!publication[field] || publication[field].length === 0) {
            return null;
        }

        return (
            <StandardCard title={title} className={'relatedPublications'}>
                {
                    showPublicationTitle &&
                        <div>
                            <span>{publication.rek_title}</span>
                            <span><b>{' (' + locale.viewRecord.sections.relatedPublications.currentRecord + ')'}</b></span>
                        </div>
                }
                {
                    publication[field] &&
                    this.renderList(publication[field], subKey)
                }
            </StandardCard>
        );
    }
}
