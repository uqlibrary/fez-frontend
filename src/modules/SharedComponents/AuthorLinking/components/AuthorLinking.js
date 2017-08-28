import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import AuthorItem from './AuthorItem';

export class AuthorLinking extends React.Component {
    static propTypes = {
        searchKey: PropTypes.object.isRequired,
        authorList: PropTypes.array,
        author: PropTypes.object,
        locale: PropTypes.object,
        linkedAuthorIdList: PropTypes.array,
        resetSelectedAuthor: PropTypes.func,
        selectedAuthorId: PropTypes.number,
        className: PropTypes.string,
        onChange: PropTypes.func,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,
        locale: {
            confirmation: 'I confirm and understand that I am claiming this publication under the above name, and confirm this is me'
        },
        authorList: [{
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Overgaard, Nana H.',
            'rek_author_order': 1
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Cruz, Jazmina L.',
            'rek_author_order': 2
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Bridge, Jennifer A.',
            'rek_author_order': 3
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Nel, Hendrik J.',
            'rek_author_order': 4
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Frazer adsadsfadsfadsfdsa, Ian H.',
            'rek_author_order': 5
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'La Gruta, Nicole L.',
            'rek_author_order': 6
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Blumenthal, Antje',
            'rek_author_order': 7
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Steptoe, Raymond J.',
            'rek_author_order': 8
        }, {
            'rek_author_id': null,
            'rek_author_pid': 'UQ:654776',
            'rek_author': 'Wells, James W.',
            'rek_author_order': 9
        }],
        linkedAuthorIdList: []
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedAuthor: null,
            authorLinkingConfirmed: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && this.state !== nextState) {
            const authorIds = this.prepareOutput(nextState);
            this.props.onChange(this.transformOutput(authorIds));
        }
    }

    /**
     * Prepare output to be transformed
     *
     * @param nextState
     * @returns {[*]}
     */
    prepareOutput = (nextState) => {
        const selectedAuthorId = { aut_id: this.props.author.aut_id, aut_id_order: nextState.selectedAuthor.rek_author_order };

        return this.props.linkedAuthorIdList.length > 0 ? this.props.linkedAuthorIdList.map((authorId) => {
            if (authorId.rek_author_id_order === nextState.selectedAuthor.rek_author_order) {
                return selectedAuthorId;
            } else {
                return { aut_id: authorId.rek_author_id, aut_id_order: authorId.rek_author_id_order };
            }
        }) : [selectedAuthorId];
    };

    /**
     * Transform output to search key value/order
     *
     * @param authors
     */
    transformOutput = (authors) => {
        return authors.map(author => ({
            [this.props.searchKey.value]: author.aut_id,
            [this.props.searchKey.order]: author.aut_id_order
        }));
    };

    /**
     * Get unlinked authors if author IDs provided (i.e. author_id = 0)
     *
     * @returns {Array}
     */
    getUnlinkedAuthors = () => {
        if (this.props.linkedAuthorIdList.length > 0) {
            return this.props.linkedAuthorIdList.filter((linkedAuthor) => {
                return linkedAuthor.rek_author_id === 0;
            });
        }

        return [];
    };

    /**
     * Check if given author found in unlinked authors by author order
     *
     * @param author
     * @param unlinkedAuthors
     * @returns {boolean}
     */
    isAuthorFoundInUnlinkedAuthorIdList = (author, unlinkedAuthors) => {
        return unlinkedAuthors.filter(unlinkedAuthor => unlinkedAuthor.rek_author_id_order === author.rek_author_order).length > 0;
    };

    /**
     * Check if given author is unlinked
     *
     * @param author
     * @param unlinkedAuthors
     * @returns {boolean}
     */
    isAuthorUnlinked = (author, unlinkedAuthors) => {
        return unlinkedAuthors.length === 0 || this.isAuthorFoundInUnlinkedAuthorIdList(author, unlinkedAuthors);
    };

    /**
     * Build authors list
     */
    buildAuthorList = () => {
        const {authorList} = this.props;
        const unlinkedAuthors = this.getUnlinkedAuthors();

        return authorList.map((author, index) => {
            const unlinked = this.isAuthorUnlinked(author, unlinkedAuthors);
            const selected = this.state.selectedAuthor ? author.rek_author_order === this.state.selectedAuthor.rek_author_order : false;
            return (<AuthorItem index={index} key={index} author={author} unlinked={unlinked} selected={selected} onAuthorSelect={ this._selectAuthor } disabled={ this.props.disabled } />);
        });
    };

    /**
     * Select author to be linked
     *
     * @param author
     * @private
     */
    _selectAuthor = (author) => {
        this.setState({ ...this.state, selectedAuthor: author, authorLinkingConfirmed: false });
    };

    /**
     * Accept author linking terms and conditions
     *
     * @private
     */
    _acceptAuthorLinkingTermsAndConditions = () => {
        this.setState({ ...this.state, authorLinkingConfirmed: !this.state.authorLinkingConfirmed });
    };

    render() {
        const { confirmation } = this.props.locale;
        const { selectedAuthor, authorLinkingConfirmed } = this.state;
        const authors = this.buildAuthorList();

        return (
            <div>
                <div className="columns is-gapless is-multiline is-desktop is-mobile">
                    { authors }
                </div>
                {
                    selectedAuthor !== null &&
                        <div className="columns is-gapless is-multiline is-desktop is-mobile">
                            <div className="column">
                                <div className={!authorLinkingConfirmed ? 'author-linking-checkbox error-checkbox' : 'author-linking-checkbox'}>
                                    <Checkbox name="authorLinkingConfirmation"
                                        label={ confirmation }
                                        onCheck={ this._acceptAuthorLinkingTermsAndConditions }
                                        checked={ authorLinkingConfirmed }
                                        disabled={this.props.disabled}
                                    />
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(state => ({
    author: state.get('accountReducer').author
}))(AuthorLinking);
