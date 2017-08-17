import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {Checkbox} from 'uqlibrary-react-toolbox';
import {Field} from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';
import {locale, validation} from 'config';

export default class AuthorLinking extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        dataSource: PropTypes.object,
        resetSelectedAuthor: PropTypes.func,
        selectedAuthorId: PropTypes.number,
        setSelectedAuthor: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.resetSelectedAuthor();
    }

    buildAuthorList = () => {
        const {dataSource, selectedAuthorId} = this.props;
        return dataSource.map((author, index) => {
            const key = `${author}${index}`;
            const authorId = author.get('rek_author_id') || index;
            const selectedClass = selectedAuthorId === authorId ? 'selectedAuthor' : 'unSelectedAuthor';
            // TODO: commented out for now until the endpoint returns the data <div className={subTitleClass}>{authorId}</div>
            // const subTitleClass = selectedAuthorId !== authorId ? 'subTitleHidden' : '';

            return (
                <div className="column" key={index}>
                    <FlatButton
                    key={key}
                    label={author.get('rek_author')}
                    onTouchTap={() => this.selectAuthor(authorId)}
                    className={selectedClass}
                    />
                </div>
            );
        });
    };

    authorFound = () => {
        const {dataSource, account} = this.props;
        const found = dataSource.filter(author => account.get('aut_id') && author.get('author_id') === account.get('aut_id'));

        return !(found.size === 0);
    };

    selectAuthor = (authorId) => {
        this.props.setSelectedAuthor(authorId);
    };

    render() {
        const authorLinkingInformation = locale.pages.claimPublications.authorLinking;
        const fileInformation = locale.sharedComponents.files;


        return (
            <div>
                {!this.authorFound() && (
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title is-4">{authorLinkingInformation.title}</h2>
                                <h4 className="sub-title">{authorLinkingInformation.subTitle}</h4>
                            </div>
                            <div className="column is-narrow is-helpicon">
                                {fileInformation.help && (
                                    <HelpIcon
                                        title={fileInformation.help.title}
                                        text={fileInformation.help.text}
                                        buttonLabel={fileInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="columns" style={{marginTop: '12px'}}>
                            <div className="column authorList">
                                {this.buildAuthorList()}
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column confirmBox">
                                <Field
                                    component={Checkbox}
                                    name="authorLinkConfirmation"
                                    className="open-access-checkbox"
                                    label={authorLinkingInformation.confirmation}
                                    validate={[validation.required]}
                                />
                            </div>
                        </div>
                    </CardText>
                </Card>
                )}
            </div>
        );
    }
}
