import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import DateCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DateCitationView';
import CitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/CitationView';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';

export default class RelatedPublications extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        fields: PropTypes.array.isRequired,
        showPublicationTitle: PropTypes.bool
    };

    static defaultProps = {
        showPublicationTitle: false
    }

    constructor(props) {
        super(props);
    }

    renderList = (list) => {
        return(
            <ul className={'publicationList'}>
                {
                    list.map((item, index)=> {
                        return (
                            <li key={`related-publications-${index}`}>
                                <PublicationCitation publication={item} actions={this.props.actions} hideCitation />
                                <CitationView suffix={' '} value={item.rek_display_type_lookup} className={'displayType'} />
                                <DateCitationView prefix={'(' + locale.viewRecord.sections.relatedPublications.depositedBy + ' '} suffix={')'} format={'DD-MM-YYYY'} date={item.rek_created_date} />
                            </li>
                        );
                    })
                }
            </ul>

        );
    }

    getPublications = (publications, subKey) => {
        const list = [];
        if (Array.isArray(publications)) {
            publications.sort((publication1, publication2) => (
                publication1[subKey + '_order'] - publication2[subKey + '_order']
            )).map((publication) => {
                publication[subKey] && list.push(publication[subKey]);
            });
        }

        return list;
    }

    renderRelatedPublications = (publication, fields = []) => {
        let list = [];
        fields.map(item => {
            list = list.concat(this.getPublications(publication[item.field], item.subKey));
        });

        return this.renderList(list);
    }

    render() {
        const {publication, fields, title, showPublicationTitle} = this.props;

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
                    this.renderRelatedPublications(publication, fields)
                }
            </StandardCard>
        );
    }
}
