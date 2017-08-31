import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import AuthorItem from './AuthorItem';

export default class AuthorLinking extends React.Component {
    static propTypes = {
        searchKey: PropTypes.object.isRequired,
        authorList: PropTypes.array,
        linkedAuthorIdList: PropTypes.array,
        author: PropTypes.object,
        locale: PropTypes.object,
        className: PropTypes.string,
        onChange: PropTypes.func,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,
        locale: {
            confirmation: 'I confirm and understand that I am claiming this publication under the above name, and confirm this is me'
        },
        authorList: [],
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
            this.props.onChange({authors: this.transformOutput(authorIds), valid: nextState.authorLinkingConfirmed});
        }
    }

    /**
     * Prepare output to be transformed
     *
     * @param nextState
     * @returns {[*]}
     */
    prepareOutput = (nextState) => {
        let selectedAuthorAdded = false;
        let linkedAuthorList = [];
        const selectedAuthorId = { aut_id: this.props.author.aut_id, aut_id_order: nextState.selectedAuthor.rek_author_order };

        if (this.props.linkedAuthorIdList.length === 0) {
            linkedAuthorList = [selectedAuthorId];
        } else {
            linkedAuthorList = this.props.linkedAuthorIdList.map((authorId) => {
                if (authorId.rek_author_id_order === nextState.selectedAuthor.rek_author_order) {
                    selectedAuthorAdded = true;
                    return selectedAuthorId;
                } else {
                    return {aut_id: authorId.rek_author_id, aut_id_order: authorId.rek_author_id_order};
                }
            });

            if (!selectedAuthorAdded) {
                linkedAuthorList.push(selectedAuthorId);
            }
        }

        return linkedAuthorList.sort((a, b) => (a.aut_id_order - b.aut_id_order));
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
    getLinkedAuthors = () => {
        if (this.props.linkedAuthorIdList.length > 0) {
            return this.props.linkedAuthorIdList.filter((linkedAuthor) => {
                return linkedAuthor.hasOwnProperty('rek_author_id') && linkedAuthor.rek_author_id > 0;
            });
        }

        return [];
    };

    /**
     * Check if author is already linked
     *
     * @param author
     * @param linkedAuthors
     * @returns {boolean}
     */
    isAuthorLinked = (author, linkedAuthors) => {
        return linkedAuthors.length > 0 && linkedAuthors.filter(linkedAuthor => linkedAuthor.rek_author_id_order === author.rek_author_order).length > 0;
    };

    /**
     * Build authors list
     */
    buildAuthorList = () => {
        const {authorList} = this.props;
        const linkedAuthors = this.getLinkedAuthors();

        return authorList.map((author, index) => {
            const linked = this.isAuthorLinked(author, linkedAuthors);
            const selected = this.state.selectedAuthor ? author.rek_author_order === this.state.selectedAuthor.rek_author_order : false;
            return (<AuthorItem index={index} key={index} author={author} unlinked={!linked} selected={selected} onAuthorSelect={ this._selectAuthor } disabled={ this.props.disabled } />);
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
