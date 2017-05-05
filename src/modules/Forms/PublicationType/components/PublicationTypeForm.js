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
        dataSource: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        popularTypesList: PropTypes.array.isRequired,
        explanationText: PropTypes.string,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadSelectedPublicationType: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]),
        maxSearchResults: PropTypes.number,
        publicationTypeLabel: PropTypes.string,
        help: PropTypes.object,
        clearSelectedPublicationType: PropTypes.func,
        formValues: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.clearSelectedPublicationType();
    }

    addListDivider = (popularTypes) => {
        if (popularTypes.length > 0) {
            popularTypes.push({'id': 'divider', 'divider': <Divider key="divider"/>});
        }

        return popularTypes;
    };

    // create a list of popularTypes as each id is different in each environment
    createPopularTypesList = (popularTypesList, publicationTypeList) => {
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
    };

    // merge the popularTypes list with the complete publicationTypeList
    mergeLists = (popularTypes, publicationTypeList) => {
        return popularTypes.concat(publicationTypeList.toJS());
    };

    createCompletePublicationList = () => {
        const {dataSource, popularTypesList} = this.props;
        if (dataSource.size > 0) {
            let popularTypes = this.createPopularTypesList(popularTypesList, dataSource);

            // add the divider
            popularTypes = this.addListDivider(popularTypes);

            // return the complete merged list
            return this.mergeLists(popularTypes, dataSource);
        }

        return [];
    };

    render() {
        const {
            handleSubmit,
            loadSelectedPublicationType,
            title,
            help,
            explanationText,
            maxSearchResults,
            children,
            publicationTypeLabel,
            formValues
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{title}</h2>
                            </div>
                            <div className="column">
                                {help && (
                                    <HelpIcon
                                        title={help.title}
                                        text={help.text}
                                        buttonLabel={help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <br />
                        <div>
                            {explanationText}
                        </div>
                        <Field component={AutoCompleteSelect} name="publicationType"
                               maxSearchResults={maxSearchResults}
                               label={publicationTypeLabel}
                               dataSource={this.createCompletePublicationList()}
                               dataSourceConfig={{text: 'name', value: 'id'}}
                               onChange={loadSelectedPublicationType}
                               formValue={formValues.get('publicationType')}
                               openOnFocus
                               fullWidth />
                    </CardText>
                </Card>
                {children}
            </form>
        );
    }
}
