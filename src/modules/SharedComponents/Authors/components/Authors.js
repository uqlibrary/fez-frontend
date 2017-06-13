import React, {Component} from 'react';
import {Field} from 'redux-form';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';

import {AsyncAutoCompleteSelect} from 'uqlibrary-react-toolbox';
import AuthorRow from './AuthorRow';
import {loadAuthorsData} from 'repositories/authors';

export default class Authors extends Component {

    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        form: PropTypes.string.isRequired,
        addAuthor: PropTypes.func,
        removeAuthor: PropTypes.func,
        clearAuthors: PropTypes.func,
        formValues: PropTypes.object,
        listOfAuthors: PropTypes.object,
        selectedAuthors: PropTypes.object,
        authorFieldLabel: PropTypes.string,
        removeAuthorLabel: PropTypes.string
    };

    static defaultProps = {
        authorFieldLabel: 'Author name (as published, in order)'
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.clearAuthors();
    }

    addAuthor = (author) => {
        this.props.addAuthor(author);
    };

    removeAuthor = (i) => {
        this.props.removeAuthor(i);
    };

    createAuthorRow = (selectedAuthors) => {
        if (typeof selectedAuthors === 'undefined' || selectedAuthors.size === 0) {
            return '';
        } else {
            return selectedAuthors.valueSeq().map((author, i) => {
                return (
                    <AuthorRow
                        key={i}
                        authorID={author.get('aut_id')}
                        name={author.get('aut_display_name')}
                        removeAuthorLabel={this.props.removeAuthorLabel}
                        removeAuthor={this.removeAuthor}/>
                );
            });
        }
    };

    render() {
        const {selectedAuthors} = this.props;
        const ListOfAuthors = this.createAuthorRow(selectedAuthors);

        return (
            <div>
                <div className="columns">
                    <div className="column is-gapless">
                    <Field component={AsyncAutoCompleteSelect} name="authorName"
                           label={this.props.authorFieldLabel}
                           dataSourceLabel="aut_display_name"
                           dataSource={loadAuthorsData}
                           disabled={false}
                           onChange={this.addAuthor}
                           fullWidth/>
                </div>
                </div>

                {ListOfAuthors}
                {ListOfAuthors.length > 0 && (
                    <Divider style={{margin: '10px 0 0 0'}}/>
                )}
            </div>
        );
    }
}

