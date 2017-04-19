import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import Divider from 'material-ui/Divider';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {AutoCompleteSelect} from 'uqlibrary-react-toolbox';

import './PublicationTypeForm.scss';


export default class PublicationTypeForm extends Component {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        explanationText: React.PropTypes.string,
        helpTitle: React.PropTypes.string,
        helpText: React.PropTypes.string,
        pristine: React.PropTypes.bool,
        handleSubmit: React.PropTypes.func,
        loadPublicationTypes: React.PropTypes.func,
        types: React.PropTypes.object,
        account: React.PropTypes.object,
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            submitOpen: false,
            saveOpen: false,
            selectedId: 0
        };
    }

    componentDidMount() {
        this.props.loadPublicationTypes();
    }

    handlePublicationTypeChange = (obj, id) => {
        this.setState({selectedId: parseInt(id, 10)});
    };

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

    getPublicationName = (id) => {
        if (id) {
            const pubTypes = this.props.types;

            const selected = pubTypes.find(item => {
                return item.get('id') === id;
            });

            return selected.get('type');
        }

        return '';
    }

    render() {
        const {handleSubmit} = this.props;
        const publicationName = this.getPublicationName(this.state.selectedId);

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
                               onChange={this.handlePublicationTypeChange}
                               openOnFocus
                               fullWidth />
                    </CardText>
                </Card>

                {/* Journal Article is selected */}
                { publicationName === 'Journal Article' &&
                <div>
                    Add journal article form

                </div>
                }
            </form>
        );
    }
}
