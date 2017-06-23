import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import {SelectField} from 'modules/SharedComponents';

import PropTypes from 'prop-types';
import {HelpIcon} from 'uqlibrary-react-toolbox';

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
        this.state = {
            displayPublicationTypeList: this.createDisplayPublicationList(props.popularTypesList, props.dataSource.size > 0 ? props.dataSource.toJS() : [])
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource.size > 0) {
            this.setState({
                displayPublicationTypeList: this.createDisplayPublicationList(nextProps.popularTypesList, nextProps.dataSource.toJS())
            });
        }
    }

    componentWillUnmount() {
        this.props.clearSelectedPublicationType();
    }

    // display publication types list contains popular types set in config and all publication types
    createDisplayPublicationList = (popularTypesList, allPublicationTypeList) => {
        let displayPubTypeList = [];

        if (popularTypesList.length > 0) {
            displayPubTypeList = allPublicationTypeList.filter(item => (popularTypesList.indexOf(item.name) >= 0));
            displayPubTypeList.push({id: 0, name: 'divider'});
        }

        return displayPubTypeList.concat(allPublicationTypeList);
    }

    render() {
        const {
            handleSubmit,
            loadSelectedPublicationType,
            title,
            help,
            formValues,
            children,
            publicationTypeLabel
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
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
                        <div className="columns">
                            <div className="column">
                                <Field component={SelectField}
                                       name="publicationType"
                                       fullWidth
                                       floatingLabelText={publicationTypeLabel}
                                       formValue={formValues.get('publicationType')}
                                       onChange={loadSelectedPublicationType}>
                                    {
                                        this.state.displayPublicationTypeList.map((item, index) => (
                                            item.id !== 0 ? <MenuItem key={index} value={item.id} primaryText={item.name}/> :
                                                <Divider/>
                                        ))
                                    }
                                </Field>
                            </div>
                        </div>
                    </CardText>
                </Card>
                {children}
            </form>
        );
    }
}
