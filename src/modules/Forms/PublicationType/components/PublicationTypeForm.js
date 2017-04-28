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
        explanationText: PropTypes.string,
        helpTitle: PropTypes.string,
        helpText: PropTypes.string,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadPublicationTypes: PropTypes.func,
        getSelectedPublicationType: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]),
        publicationTypes: PropTypes.object,
        account: PropTypes.object,
        maxSearchResults: PropTypes.number,
        label: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadPublicationTypes();
    }

    setPublicationList = () => {
        const {publicationTypes} = this.props;
        if (publicationTypes && publicationTypes.size > 0) {
            const popularTypesList = ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'];
            const popularTypes = [];

            const ptObject = publicationTypes.toJS();

            popularTypesList.map(item => {
                const entry = ptObject.find(obj => {
                    return obj.name === item;
                });

                popularTypes.push(entry);
            });

            // add the divider
            popularTypes.push({'id': 'divider', 'divider': <Divider key="divider"/>});

            // return the complete merged list
            return popularTypes.concat(publicationTypes.toJS());
        }

        return [];
    };

    render() {
        const {
            handleSubmit,
            getSelectedPublicationType,
            title,
            helpTitle,
            helpText,
            explanationText,
            maxSearchResults,
            children,
            label
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
                               label={label}
                               dataSource={this.setPublicationList()}
                               dataSourceConfig={{text: 'name', value: 'id'}}
                               onChange={getSelectedPublicationType}
                               openOnFocus
                               fullWidth />
                    </CardText>
                </Card>
                {children}
            </form>
        );
    }
}
