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
        types: PropTypes.object,
        account: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadPublicationTypes();
    }

    setPublicationList = () => {
        const popularTypesList = ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'];
        const popularTypes = [];
        const allTypes = [];

        this.props.types.map(item => {
            // check if the item is within the popularTypesList array
            if (popularTypesList.indexOf(item.get('type')) >= 0) {
                popularTypes.push(
                    {'id': item.get('id'), 'name': item.get('type')}
                );
            }

            // build the complete publication type list
            allTypes.push(
                {'id': item.get('id'), 'name': item.get('type')}
            );
        });

        // add the divider
        popularTypes.push({'id': 'divider', 'divider': <Divider key="divider" />});

        // return the complete merged list
        return popularTypes.concat(allTypes);
    };

    render() {
        const {handleSubmit, getSelectedPublicationType} = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">{this.props.title}</h2>
                            </div>
                            {this.props.helpTitle && this.props.helpText && (
                                <div className="flex">
                                    <HelpIcon
                                        text={this.props.helpTitle}
                                        title={this.props.helpText} inline />
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        {this.props.explanationText && (
                            <p>{this.props.explanationText}</p>
                        )}
                        <Field component={AutoCompleteSelect} name="publicationType"
                               maxSearchResults={10}
                               label="Select a publication type"
                               dataSource={this.setPublicationList()}
                               dataSourceConfig={{text: 'name', value: 'id'}}
                               onChange={getSelectedPublicationType}
                               openOnFocus
                               fullWidth />
                    </CardText>
                </Card>
                {this.props.children}
            </form>
        );
    }
}
