import React, {Component} from 'react';
import {Field} from 'redux-form';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

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

    addAuthor = () => {
        const authorId = this.props.formValues.get('authorName');
        const matchedAuthor = this.props.dataSource.find(function findMatchedAuthor(obj) {return obj.get('id') === authorId;});
        this.props.addAuthor(matchedAuthor);
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
                        authorID={author.get('id')}
                        name={author.get('name')}
                        removeAuthorLabel={this.props.removeAuthorLabel}
                        removeAuthor={this.removeAuthor}/>
                );
            });
        }
    };

    prepDataSource = (listOfAuthors) => {
        const authors = [];

        if (typeof listOfAuthors !== 'undefined' && listOfAuthors.size > 0) {
            listOfAuthors.map((author) => {
                authors.push(
                    {'id': author.get('id'), 'name': author.get('name')}
                );
            });
        }

        return authors;
    };

    render() {
        const {formValues, selectedAuthors} = this.props;
        const ListOfAuthors = this.createAuthorRow(selectedAuthors);
        const blah = {
            id: 1,
            name: 'test author'
        };

        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <Field component={AsyncAutoCompleteSelect} name="authorName"
                               label={this.props.authorFieldLabel}
                               value={blah}
                               dataSource={loadAuthorsData}
                               dataSourceConfig={{text: 'name', value: 'id'}}
                               openOnFocus
                               fullWidth />
                    </div>
                    <div className="column is-narrow">
                        <RaisedButton label="Add" secondary style={{marginTop: '15px'}} onClick={this.addAuthor} disabled={formValues && formValues.size === 0} />
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

