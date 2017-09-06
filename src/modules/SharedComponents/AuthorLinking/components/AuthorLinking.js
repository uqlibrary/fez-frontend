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
        if (this.props.onChange && nextState.selectedAuthor !== null) {
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
     * Build authors list
     */
    buildAuthorList = (authorList) => {
        return authorList.map((author, index) => {
            const linked = this.props.linkedAuthorIdList.length > 0 && this.props.linkedAuthorIdList[index].rek_author_id !== 0;
            const selected = this.state.selectedAuthor ? author.rek_author_order === this.state.selectedAuthor.rek_author_order : false;
            return (<AuthorItem index={index} key={index} author={author} unlinked={!linked} selected={selected} onAuthorSelected={ this._selectAuthor } disabled={ this.props.disabled } />);
        });
    };

    /**
     * Select author to be linked
     *
     * @param author
     * @private
     */
    _selectAuthor = (author) => {
        this.setState({ selectedAuthor: author, authorLinkingConfirmed: false });
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
        const authors = this.buildAuthorList(this.props.authorList);

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
