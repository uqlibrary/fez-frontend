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
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange !== null && nextState.selectedAuthor !== null) {
            const authorIds = this.prepareOutput(nextState);
            this.props.onChange({authors: this.transformOutput(authorIds), valid: nextState.authorLinkingConfirmed});
        }
    }

    /**
     * Prepare output to be transformed
     *
     * @returns {[*]}
     */
    prepareOutput = ({selectedAuthor}) => {
        const {authorList, linkedAuthorIdList, author} = this.props;
        const selectedAuthorId = {aut_id: author.aut_id, aut_id_order: selectedAuthor.rek_author_order};

        if (linkedAuthorIdList.length === 0) {
            return authorList.map((author, index) => {
                const authorIdOrder = {aut_id: 0, aut_id_order: index + 1};
                return selectedAuthorId.aut_id_order === (index + 1) ? selectedAuthorId : authorIdOrder;
            });
        } else {
            return linkedAuthorIdList.map((authorId) => {
                const authorIdOrder = {aut_id: authorId.rek_author_id, aut_id_order: authorId.rek_author_id_order};
                return authorId.rek_author_id_order === selectedAuthor.rek_author_order ? selectedAuthorId : authorIdOrder;
            });
        }
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
     * Build authors list
     */
    buildAuthorList = ({authorList, linkedAuthorIdList, disabled}, {selectedAuthor}) => {
        return authorList.map((author, index) => {
            const linked = linkedAuthorIdList.length > 0 && linkedAuthorIdList[index].rek_author_id !== 0;
            const selected = selectedAuthor && author.rek_author_order === selectedAuthor.rek_author_order;
            return (
                <AuthorItem
                    index={index}
                    key={index}
                    author={author}
                    linked={!linked}
                    selected={selected}
                    onAuthorSelected={this._selectAuthor}
                    disabled={disabled}
                />
            );
        });
    };

    /**
     * Select author to be linked
     *
     * @param author
     * @private
     */
    _selectAuthor = (author) => {
        this.setState({selectedAuthor: author, authorLinkingConfirmed: false});
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
