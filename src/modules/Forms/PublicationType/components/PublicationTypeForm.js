import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {AutoCompleteSelect} from 'uqlibrary-react-toolbox';

import './PublicationTypeForm.scss';


export default class PublicationTypeForm extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        popularTypesList: PropTypes.array.isRequired,
        explanationText: PropTypes.string,
        helpTitle: PropTypes.string,
        helpText: PropTypes.string,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadPublicationTypesList: PropTypes.func,
        loadSelectedPublicationType: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]),
        publicationTypeList: PropTypes.object,
        maxSearchResults: PropTypes.number,
        publicationTypeLabel: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadPublicationTypesList();
    }

    addListDivider(popularTypes) {
        if (popularTypes.length > 0) {
            popularTypes.push({'id': 'divider', 'divider': <Divider key="divider"/>});
        }

        return popularTypes;
    }

    // create a list of popularTypes as each id is different in each environment
    createPopularTypesList(popularTypesList, publicationTypeList) {
        const popularTypes = [];
        const ptObject = publicationTypeList.toJS();

        // check if the popularTypesList has been passed in as a prop
        if (popularTypesList.length > 0) {
            popularTypesList.map(item => {
                const entry = ptObject.find(obj => {
                    return obj.name === item;
                });

                popularTypes.push(entry);
            });
        }

        return popularTypes;
    }

    // merge the popularTypes list with the complete publicationTypeList
    mergeLists(popularTypes, publicationTypeList) {
        return popularTypes.concat(publicationTypeList.toJS());
    }

    createCompletePublicationList = () => {
        const {publicationTypeList, popularTypesList} = this.props;
        if (publicationTypeList.size > 0) {
            let popularTypes = this.createPopularTypesList(popularTypesList, publicationTypeList);

            // add the divider
            popularTypes = this.addListDivider(popularTypes);

            // return the complete merged list
            return this.mergeLists(popularTypes, publicationTypeList);
        }

        return [];
    };

    render() {
        const {
            handleSubmit,
            loadSelectedPublicationType,
            title,
            helpTitle,
            helpText,
            explanationText,
            maxSearchResults,
            children,
            publicationTypeLabel
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">{title}</h2>
                            </div>
                            {helpTitle && helpText && (
                                <div className="flex">
                                    <HelpIcon
                                        text={helpTitle}
                                        title={helpText} inline />
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        {explanationText && (
                            <p>{explanationText}</p>
                        )}
                        <Field component={AutoCompleteSelect} name="publicationType"
                               maxSearchResults={maxSearchResults}
                               label={publicationTypeLabel}
                               dataSource={this.createCompletePublicationList()}
                               dataSourceConfig={{text: 'name', value: 'id'}}
                               onChange={loadSelectedPublicationType}
                               openOnFocus
                               fullWidth />
                    </CardText>
                </Card>
                {children}
            </form>
        );
    }
}
