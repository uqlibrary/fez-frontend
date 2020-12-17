import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AuthorItem from './AuthorItem';
import Infinite from 'react-infinite';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    infiniteContainer: {
        border: '1px solid',
        borderColor: theme.palette.secondary.light,
        margin: '16px 0px',
        padding: '8px 0px',
        width: '100%',
    },
    root: {
        alignItems: 'flex-start',
        margin: 0,
    },
    label: {
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 300,
        lineHeight: '30px',
        paddingTop: 10,
    },
    checkboxRoot: {
        color: theme.palette.error.light,
    },
    checkboxChecked: {
        color: `${theme.palette.primary.main} !important`,
    },
});

export class AuthorLinking extends PureComponent {
    static propTypes = {
        searchKey: PropTypes.object.isRequired,
        authorList: PropTypes.array,
        linkedAuthorIdList: PropTypes.array,
        loggedInAuthor: PropTypes.object,
        locale: PropTypes.object,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        classes: PropTypes.object,
        width: PropTypes.string,
    };

    static contextTypes = {
        isMobile: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        locale: {
            confirmation:
                'I confirm and understand that I am claiming this work under the above name, and confirm this is me',
        },
        authorList: [],
        linkedAuthorIdList: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedAuthor: null,
            authorLinkingConfirmed: false,
        };

        /**
         * Storage for transformed and cached author id list
         *
         * @type {Array}
         */
        this.listToOutput = [];

        /**
         * List to render. List of <AuthorItem/>s/List of rows of multiple <AuthorItem/>s
         * @type {Array}
         */
        this.authorsToRender = [];
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
        this.authorsToRender = this.getAuthorsToRender({ ...this.props }, this.state);
    }

    componentDidMount() {
        const { authorList, linkedAuthorIdList } = this.props;

        // Transform and cache list to output so component doesn't have to go through transform step every time
        if (linkedAuthorIdList.length === 0) {
            this.listToOutput = authorList.map(author =>
                this.transformToAuthorOrderId(0, author, this.props.searchKey),
            );
        } else {
            this.listToOutput = linkedAuthorIdList;
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange !== null && nextState.selectedAuthor !== null) {
            this.props.onChange({
                authors: this.prepareOutput(nextProps, nextState, this.listToOutput),
                valid: nextState.authorLinkingConfirmed,
            });
            this.authorsToRender = this.getAuthorsToRender({ ...nextProps }, nextState);
        }
    }

    /**
     * Build authors list
     */
    getAuthorsToRender = (
        { authorList = [], linkedAuthorIdList = [], disabled = false } = {},
        { selectedAuthor = {} } = {},
    ) => {
        const authors = authorList.map((author, index) => {
            const linked =
                linkedAuthorIdList.length > 0 &&
                !!linkedAuthorIdList[index] &&
                linkedAuthorIdList[index][this.props.searchKey.value] !== null &&
                linkedAuthorIdList[index][this.props.searchKey.value] !== 0;
            const selected =
                selectedAuthor &&
                author[`rek_${this.props.searchKey.type}_order`] ===
                    selectedAuthor[`rek_${this.props.searchKey.type}_id_order`];
            return (
                <AuthorItem
                    type={this.props.searchKey.type}
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

        if (this.context.isMobile) {
            return authors;
        }

        const rows = [];
        let itemsPerRow;
        if (this.props.width === 'xs') {
            itemsPerRow = 1;
        } else if (this.props.width === 'sm') {
            itemsPerRow = 2;
        } else {
            itemsPerRow = 3;
        }

        if (authors.length > 0) {
            for (let i = 0; i < authors.length; i += itemsPerRow) {
                rows.push(
                    <Grid container key={i}>
                        {authors.slice(i, i + itemsPerRow)}
                    </Grid>,
                );
            }
        }
        return rows;
    };

    /**
     * Prepare output to be transformed
     *
     * @returns {[*]}
     */
    prepareOutput = ({ searchKey: { order } }, { selectedAuthor }, list) => {
        const index = list.findIndex(data => data[order] === selectedAuthor[order]);
        return [...list.slice(0, index), selectedAuthor, ...list.slice(index + 1)];
    };

    /**
     * Transform to search key
     *
     * @param authorId
     * @param author
     * @returns {{}}
     */
    transformToAuthorOrderId = (authorId, author, searchKey) => {
        const { value, order, type } = searchKey;
        return {
            [`rek_${type}_id_id`]: null,
            [`rek_${type}_id_pid`]: (author !== null && author[`rek_${type}_pid`]) || null,
            [value]: authorId,
            [order]: (author !== null && author[`rek_${type}_order`]) || null,
        };
    };

    /**
     * Select and transform author to be linked
     */
    _selectAuthor = author => {
        const selectedAuthor = this.transformToAuthorOrderId(
            this.props.loggedInAuthor.aut_id,
            author,
            this.props.searchKey,
        );
        this.setState({
            selectedAuthor: selectedAuthor,
            authorLinkingConfirmed: false,
        });
    };

    /**
     * Accept author linking terms and conditions
     *
     * @private
     */
    _acceptAuthorLinkingTermsAndConditions = () => {
        this.setState({ authorLinkingConfirmed: !this.state.authorLinkingConfirmed });
    };

    render() {
        const { confirmation } = this.props.locale;
        const { selectedAuthor, authorLinkingConfirmed } = this.state;
        return (
            <div className={this.props.className}>
                <Grid container>
                    <Grid item className={this.props.classes.infiniteContainer}>
                        <Infinite containerHeight={250} elementHeight={50} infiniteLoadBeginEdgeOffset={50}>
                            {this.authorsToRender}
                        </Infinite>
                    </Grid>
                </Grid>
                {selectedAuthor !== null && (
                    <FormControlLabel
                        classes={{
                            root: this.props.classes.root,
                        }}
                        disabled={this.props.disabled}
                        control={
                            <Checkbox
                                checked={authorLinkingConfirmed}
                                onChange={this._acceptAuthorLinkingTermsAndConditions}
                                classes={{
                                    root: this.props.classes.checkboxRoot,
                                    checked: this.props.classes.checkboxChecked,
                                }}
                                id="authorAcceptDeclaration"
                            />
                        }
                        label={
                            <Typography
                                classes={{
                                    root: this.props.classes.label,
                                }}
                                color={!authorLinkingConfirmed ? 'error' : 'secondary'}
                            >
                                {confirmation}
                            </Typography>
                        }
                    />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(withWidth()(AuthorLinking));
