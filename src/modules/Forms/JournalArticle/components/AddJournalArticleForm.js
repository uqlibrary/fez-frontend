import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {reduxForm, Field} from 'redux-form/immutable';

import {HelpIcon, TextField, Authors} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import './AddJournalArticleForm.scss';

const formName = 'addJournalArticle';


class AddJournalArticleForm extends Component {

    static propTypes = {
        loadPublicationSubTypes: React.PropTypes.func,
        types: React.PropTypes.object,
        loadAuthorData: React.PropTypes.func,
        listOfAuthors: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            subTypeValue: 1,
        };
    }

    componentDidMount() {
        this.props.loadPublicationSubTypes();
        this.props.loadAuthorData();
    }

    handleSubTypeChange = (e, index, value) => {
        this.setState({subTypeValue: value});
    };

    render() {
        const { types } = this.props;
        const subtypeItems = types.valueSeq().map((subtypes) => {
            return (<MenuItem value={subtypes.get('id')} key={subtypes.get('id')} primaryText={subtypes.get('label')}/>);
        });

        return (
            <div style={{marginBottom: '-60px'}}>
                {/* Journal Information */}
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">Journal article information</h2>
                            </div>
                            <div className="flex">
                                <HelpIcon
                                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                                    title="No matching records" inline/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="flex">
                            <Field component={TextField} name="journalTitle" type="text" fullWidth
                                   floatingLabelText="Journal title"/>
                        </div>
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="journalName" type="text" fullWidth
                                       floatingLabelText="Journal name"/>
                            </div>
                            <div className="flex">
                                <DatePicker floatingLabelText="Journal Publish Date" textFieldStyle={{width: '100%'}}
                                            style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="flex">
                            <SelectField
                                floatingLabelText="Select a publication type"
                                value={this.state.subTypeValue}
                                onChange={this.handleSubTypeChange}
                                style={{width: '100%'}}
                            >
                                { subtypeItems }
                            </SelectField>
                        </div>
                    </CardText>
                </Card>

                {/* Author Information */}
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">Authors</h2>
                            </div>
                            <div className="flex">
                                <HelpIcon
                                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                                    title="No matching records" inline/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <Authors form={formName} dataSource={this.props.listOfAuthors} />
                    </CardText>
                </Card>

                {/* Optional publication details */}
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">Optional publication detail</h2>
                            </div>
                            <div className="flex">
                                <HelpIcon
                                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                                    title="No matching records" inline/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationVolume" type="text" fullWidth
                                       floatingLabelText="Volume"/>
                            </div>
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationIssue" type="text" fullWidth
                                       floatingLabelText="Issue"/>
                            </div>
                        </div>
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationStartPage" type="text" fullWidth
                                       floatingLabelText="Start page"/>
                            </div>
                            <div className="flex">
                                <Field component={TextField} name="publicationEndPage" type="text" fullWidth
                                       floatingLabelText="End page"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="flex">
                                <Field component={TextField} name="publicationNotes" type="text" fullWidth multiLine
                                       rows={5} floatingLabelText="Notes (not publically viewable)"/>
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Files */}
                <Card className="layout-card">
                    <CardHeader>
                        <div className="row">
                            <div className="flex-100">
                                <h2 className="headline">Files</h2>
                            </div>
                            <div className="flex">
                                <HelpIcon
                                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                                    title="No matching records" inline/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">

                        <div className="row">
                            <div className="flex" style={{marginTop: '16px', flex: '0 0 140px'}}>
                                <RaisedButton label="Browse files" secondary/>
                            </div>
                            <div className="flex" style={{marginTop: '-10px'}}>
                                <Field component={TextField} name="filesUpload" type="text"
                                       floatingLabelText="Filename selected" fullWidth/>
                            </div>
                        </div>


                        <div className="fileInstructions">
                            <h3>File name restrictions</h3>
                            <div style={{width: '100%'}}>
                                <ul>
                                    <li>Only upper or lowercase alphanumeric characters or underscores (a0z, A-Z, _ and 0-9 only)</li>
                                    <li>Only numbers and lowercase characters in the file extension</li>
                                    <li>Under 45 characters</li>
                                    <li>Only one file extension (on period (.) character) and</li>
                                    <li>Starting with a letter. Eg "s12345678_phd_thesis.pdf"</li>
                                </ul>
                            </div>
                        </div>

                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="filesAccessConditions" type="text" fullWidth
                                       floatingLabelText="Access conditions"/>
                            </div>
                            <div className="flex">
                                <DatePicker floatingLabelText="Embargo date" textFieldStyle={{width: '100%'}}
                                            style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="flex">
                                <Field component={TextField} name="filesDescription" type="text" fullWidth multiLine
                                       rows={5} floatingLabelText="Description"/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}

AddJournalArticleForm = reduxForm({
    form: formName
})(AddJournalArticleForm);

export default AddJournalArticleForm;
