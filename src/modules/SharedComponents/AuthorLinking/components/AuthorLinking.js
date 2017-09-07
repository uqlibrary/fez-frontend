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

        /**
         * Storage for transformed and cached author id list
         *
         * @type {Array}
         */
        this.listToOutput = [];
    }

    componentDidMount() {
        const {authorList, linkedAuthorIdList} = this.props;

        // Transform and cache list to output so component doesn't have to go through transform step every time
        if (linkedAuthorIdList.length === 0) {
            this.listToOutput = this.transformAuthorList(authorList);
        } else {
            this.listToOutput = this.transformAuthorIdList(linkedAuthorIdList);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange !== null && nextState.selectedAuthor !== null) {
            this.props.onChange({authors: this.prepareOutput(nextProps, nextState, this.listToOutput), valid: nextState.authorLinkingConfirmed});
        }
    }

    /**
     * Prepare output to be transformed
     *
     * @returns {[*]}
     */
    prepareOutput = ({searchKey: {order}}, {selectedAuthor}, list) => {
        const index = selectedAuthor[order] - 1;

        return [
            ...list.slice(0, index),
            selectedAuthor,
            ...list.slice(index + 1)
        ];
    };

    /**
     * Transform author list to search key
     *
     * @param authors
     */
    transformAuthorList = (authors) => {
        return authors.map((author, index) => this.transformToAuthorOrderId(0, index + 1));
    };

    /**
     * Transform linked author id list to search key
     *
     * @param authorIds
     */
    transformAuthorIdList = (authorIds) => {
        return authorIds.map((authorId) => this.transformToAuthorOrderId(authorId.rek_author_id, authorId.rek_author_id_order));
    };

    /**
     * Transform to search key
     *
     * @param authorId
     * @param authorIdOrder
     * @returns {{}}
     */
    transformToAuthorOrderId = (authorId, authorIdOrder) => {
        return {
            [this.props.searchKey.value]: authorId,
            [this.props.searchKey.order]: authorIdOrder
        };
    };

    /**
     * Build authors list
     */
    buildAuthorList = ({authorList, linkedAuthorIdList, disabled}, {selectedAuthor}) => {
        const {value, order} = this.props.searchKey;

        return authorList.map((author, index) => {
            const linked = linkedAuthorIdList.length > 0 && linkedAuthorIdList[index][value] !== 0;
            const selected = selectedAuthor && author.rek_author_order === selectedAuthor[order];

            return (
                <AuthorItem
                    index={index}
                    key={index}
                    author={author}
                    linked={linked}
                    selected={selected}
                    onAuthorSelected={this._selectAuthor}
                    disabled={disabled}
                />
            );
        });
    };

    /**
     * Select and transform author to be linked
     *
     * @param author
     * @private
     */
    _selectAuthor = (author) => {
        const selectedAuthor = this.transformToAuthorOrderId(this.props.author.aut_id, author.rek_author_order);

        this.setState({
            selectedAuthor: selectedAuthor,
            authorLinkingConfirmed: false
        });
    };

    /**
     * Accept author linking terms and conditions
     *
     * @private
     */
    _acceptAuthorLinkingTermsAndConditions = () => {
        this.setState({authorLinkingConfirmed: !this.state.authorLinkingConfirmed});
    };

    render() {
        const {confirmation} = this.props.locale;
        const {selectedAuthor, authorLinkingConfirmed} = this.state;
        const authors = this.buildAuthorList({...this.props}, this.state);

        return (
            <div>
                <div className="columns is-gapless is-multiline is-desktop is-mobile">
                    {authors}
                </div>
                {
                    selectedAuthor !== null &&
                        <div className="columns is-gapless is-multiline is-desktop is-mobile">
                            <div className="column">
                                <div className={!authorLinkingConfirmed ? 'author-linking-checkbox error-checkbox' : 'author-linking-checkbox'}>
                                    <Checkbox name="authorLinkingConfirmation"
                                        label={confirmation}
                                        onCheck={this._acceptAuthorLinkingTermsAndConditions}
                                        checked={authorLinkingConfirmed}
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
