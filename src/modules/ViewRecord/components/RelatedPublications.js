import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = () => ({
    list: {
        margin: 0
    },
    data: {
        fontSize: '0.8rem'
    }
});

export class RelatedPublications extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        title: PropTypes.string,
        parentSearchKey: PropTypes.object,
        childrenSearchKey: PropTypes.object.isRequired,
        showPublicationTitle: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        title: locale.viewRecord.sections.relatedPublications.title,
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
            <ul className={`${this.props.classes.list} publicationList`}>
                {
                    this.renderSubList(parents, parentSearchKey)
                }
                {
                    showPublicationTitle &&
                    <li key={'current'}>
                        <Typography variant="body1" classes={{body1: this.props.classes.data}}>
                            {publication.rek_title}<b>{' (' + locale.viewRecord.sections.relatedPublications.currentRecord + ')'}</b>
                        </Typography>
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
                        <Typography variant="body1" classes={{body1: this.props.classes.data}}>
                            {
                                this.renderTitle(item, searchKey)
                            }
                        </Typography>
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
        const {publication, parentSearchKey, childrenSearchKey, title, showPublicationTitle} = this.props;

        if ((!parentSearchKey || !publication[parentSearchKey.key] || publication[parentSearchKey.key].length === 0) &&
            (!publication[childrenSearchKey.key] || publication[childrenSearchKey.key].length === 0)) {
            return null;
        }

        return (
            <StandardCard title={title} className="relatedPublications">
                {
                    this.renderList(publication, parentSearchKey, childrenSearchKey, showPublicationTitle)
                }
            </StandardCard>
        );
    }
}

export default withStyles(styles)(RelatedPublications);
