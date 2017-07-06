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
        setSelectedAuthor: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            showConfirmation: false,
            authorId: ''
        };
    }

    componentWillUnmount() {
        this.props.resetSelectedAuthor();
    }

    buildAuthorList = () => {
        return this.props.dataSource.map((author, index) => {
            const key = `${author}${index}`;
            const authorId = author.get('rek_author');
            const selectedClass = this.state.authorId === authorId ? 'selectedAuthor' : '';

            return (
                <div
                    key={key} onTouchTap={() => this.selectAuthor(authorId)}
                    className={selectedClass}
                >
                    {author.get('rek_author')}
                </div>
            );
        });
    };

    selectAuthor = (authorId) => {
        this.setState({
            showConfirmation: true,
            authorId
        });

        this.props.setSelectedAuthor(authorId);
    };

    render() {
        const authorLinkingInformation = locale.pages.claimPublications.authorLinking;
        const fileInformation = locale.sharedComponents.files;

        return (
            <div className="layout-fill">
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
                                {this.state.showConfirmation && (
                                    <Field
                                        component={Checkbox}
                                        name="authorLinkConfirmation"
                                        className="open-access-checkbox"
                                        label={authorLinkingInformation.confirmation}
                                        validate={[validation.required]}
                                    />
                                )}
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}

