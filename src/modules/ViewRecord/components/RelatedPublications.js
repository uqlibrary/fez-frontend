import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import DateCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DateCitationView';

export default class RelatedPublications extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderDepositedDate = (date) => {
        return(
            <span>
                (
                {locale.viewRecord.sections.relatedPublications.depositedBy}
                &nbsp;
                <DateCitationView format={'DD-MM-YYYY'} prefix={''} suffix={''} date={date} />
                )
            </span>
        );
    }

    renderList = (list) => {
        return(
            <ul>
                {
                    list.map((item, index)=> {
                        console.log(item);
                        console.log(pathConfig.records.view(item.rek_pid));
                        return (
                            <li key={`related-publications-${index}`}>
                                <a href={pathConfig.records.view(item.rek_pid)}>{item.rek_title}</a> <i>{item.rek_display_type_lookup}</i> {this.renderDepositedDate(item.rek_created_date)}
                            </li>
                        );
                    })
                }
            </ul>

        );
    }

    getPublications = (publications, subkey) => {
        const list = [];
        if (Array.isArray(publications)) {
            publications.sort((publication1, publication2) => (
                publication1[subkey + '_order'] - publication2[subkey + '_order']
            )).map((publication) => {
                list.push(publication[subkey]);
            });
        }
        return list;
    }

    renderRelatedPublicationsAndDatasets = (publications, datasets) => {
        return this.renderList(
            this.getPublications(publications, 'rek_related_publications').concat(this.getPublications(datasets, 'rek_related_datasets'))
        );
    }

    render() {
        const {publication} = this.props;

        return (
            <StandardCard title={locale.viewRecord.sections.relatedPublications.title} className={'relatedPublications'}>
                {
                    ((publication.fez_record_search_key_related_publications && publication.fez_record_search_key_related_publications.length > 0) ||
                    (publication.fez_record_search_key_related_datasets && publication.fez_record_search_key_related_datasets.length > 0)) &&
                        this.renderRelatedPublicationsAndDatasets(publication.fez_record_search_key_related_publications, publication.fez_record_search_key_related_datasets)
                }
            </StandardCard>
        );
    }
}
