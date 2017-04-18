import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';

import Divider from 'material-ui/Divider';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {AutoCompleteSelect} from 'uqlibrary-react-toolbox';

import './PublicationTypeForm.scss';


export default class PublicationTypeForm extends Component {

    static propTypes = {
        formValues: React.PropTypes.object,
        pristine: React.PropTypes.bool,
        handleSubmit: React.PropTypes.func,
        loadPublicationTypes: React.PropTypes.func,
        types: React.PropTypes.object,
        account: React.PropTypes.object,
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
        const {handleSubmit, formValues} = this.props;
        const publicationName = this.getPublicationName(parseInt(formValues.get('publicationType'), 10));

        return (
            <form onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">Add your publication</h2>
                            </div>
                            <div className="flex">
                                <HelpIcon
                                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                                    title="No matching records" inline />
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <Field component={AutoCompleteSelect} name="publicationType"
                               maxSearchResults={10}
                               label="Select a publication type"
                               dataSource={this.setPublicationList()}
                               dataSourceConfig={{text: 'name', value: 'id'}}
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
