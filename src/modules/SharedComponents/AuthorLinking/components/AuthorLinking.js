import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {Checkbox} from 'modules/SharedComponents/Checkbox';
import {Field} from 'redux-form/immutable';
import {locale, validation} from 'config';

import './AuthorLinking.scss';

export default class AuthorLinking extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        dataSource: PropTypes.object,
        resetSelectedAuthor: PropTypes.func,
        selectedAuthorId: PropTypes.string,
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
            // TODO: Update the author id once the API has been updated
            const authorId = author.get('rek_author');
            const selectedClass = selectedAuthorId === authorId ? 'selectedAuthor' : 'unSelectedAuthor';
            const subTitleClass = selectedAuthorId !== authorId ? 'subTitleHidden' : '';

            console.log('author', author.toJS());

            return (
                <div
                    key={key} onTouchTap={() => this.selectAuthor(authorId)}
                    className={selectedClass}
                >
                    {author.get('rek_author')}
                    <div className={subTitleClass}>{authorId}</div>
                </div>
            );
        });
    };

    authorFound = () => {
        const {dataSource, account} = this.props;
        const found = dataSource.filter(author => author.get('author_id') === account.get('id'));

        return !(found.size === 0);
    };

    selectAuthor = (authorId) => {
        this.props.setSelectedAuthor(authorId);
    };

    render() {
        const authorLinkingInformation = locale.pages.claimPublications.authorLinking;
        const fileInformation = locale.sharedComponents.files;

        return (
            <div className="layout-fill">
                {!this.authorFound() && (
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{authorLinkingInformation.title}</h2>
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
                            <div className="column">
                                {this.buildAuthorList()}
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

