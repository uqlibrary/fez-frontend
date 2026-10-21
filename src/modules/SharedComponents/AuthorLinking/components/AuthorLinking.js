import React from 'react';
import PropTypes from 'prop-types';
import AuthorItem from './AuthorItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useWidth } from 'hooks';

export const AuthorLinking = ({
    authorLinkingId,
    authorList = [],
    className,
    disabled = false,
    linkedAuthorIdList = [],
    locale = {
        confirmation:
            'I confirm and understand that I am claiming this work under the above name, and confirm this is me',
    },
    loggedInAuthor,
    onChange,
    searchKey,
}) => {
    const width = useWidth();
    const [selectedAuthor, setSelectedAuthor] = React.useState(null);
    const [authorLinkingConfirmed, confirmAuthorLinking] = React.useState(false);

    /**
     * List to render. List of <AuthorItem/>s/List of rows of multiple <AuthorItem/>s
     * @type {Array}
     */
    const [authorsToRender, setAuthorsToRender] = React.useState([]);

    const { confirmation } = locale;

    /**
     * Transform to search key
     *
     * @param authorId
     * @param author
     * @returns {{}}
     */
    const transformToAuthorOrderId = (authorId, author, searchKey) => {
        const { value, order, type } = searchKey;
        return {
            [`rek_${type}_id_id`]: null,
            [`rek_${type}_id_pid`]: author !== null && author[`rek_${type}_pid`],
            [value]: authorId,
            [order]: author !== null && author[`rek_${type}_order`],
        };
    };

    /**
     * Storage for transformed and cached author id list
     *
     * @type {Array}
     */
    const listToOutput = React.useRef(
        linkedAuthorIdList.length === 0
            ? authorList.map(author => transformToAuthorOrderId(0, author, searchKey))
            : linkedAuthorIdList,
    );

    /**
     * Prepare output to be transformed
     *
     * @returns {[*]}
     */
    const prepareOutput = ({ order }, selectedAuthor) => {
        const index = listToOutput.current.findIndex(data => data[order] === selectedAuthor[order]);
        return [...listToOutput.current.slice(0, index), selectedAuthor, ...listToOutput.current.slice(index + 1)];
    };

    /**
     * Select and transform author to be linked
     */
    const _selectAuthor = author => {
        const selectedAuthor = transformToAuthorOrderId(loggedInAuthor.aut_id, author, searchKey);
        setSelectedAuthor(selectedAuthor);
        confirmAuthorLinking(false);
    };

    /**
     * Accept author linking terms and conditions
     *
     * @private
     */
    const _acceptAuthorLinkingTermsAndConditions = () => {
        confirmAuthorLinking(state => !state.authorLinkingConfirmed);
    };

    /**
     * Build authors list
     */
    const getAuthorsToRender = ({ authorList, linkedAuthorIdList, disabled }, { selectedAuthor }) => {
        const authors = authorList.map((author, index) => {
            const linked =
                linkedAuthorIdList.length > 0 &&
                !!linkedAuthorIdList[index] &&
                linkedAuthorIdList[index][searchKey.value] !== null &&
                linkedAuthorIdList[index][searchKey.value] !== 0;
            const selected =
                selectedAuthor &&
                author[`rek_${searchKey.type}_order`] === selectedAuthor[`rek_${searchKey.type}_id_order`];
            return (
                <AuthorItem
                    type={searchKey.type}
                    index={index}
                    key={index}
                    author={author}
                    linked={linked}
                    selected={selected}
                    onAuthorSelected={_selectAuthor}
                    disabled={disabled}
                    authorItemId={`${authorLinkingId}-${index}`}
                />
            );
        });

        const rows = [];
        let itemsPerRow;
        if (width === 'xs') {
            itemsPerRow = 1;
        } else if (width === 'sm') {
            itemsPerRow = 2;
        } else {
            itemsPerRow = 3;
        }

        /* istanbul ignore else  */
        if (authors.length > 0) {
            let j = 0;
            for (let i = 0; i < authors.length; i += itemsPerRow) {
                rows.push(
                    <Grid
                        container
                        key={i}
                        id={`${authorLinkingId}-row-${j}`}
                        data-testid={`${authorLinkingId}-row-${j}`}
                    >
                        {authors.slice(i, i + itemsPerRow)}
                    </Grid>,
                );
                j++;
            }
        }
        return rows;
    };

    React.useEffect(() => {
        setAuthorsToRender(getAuthorsToRender({ authorList, linkedAuthorIdList, disabled }, { selectedAuthor }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAuthor, width]);

    React.useEffect(() => {
        if (onChange !== null && selectedAuthor !== null) {
            onChange({
                authors: prepareOutput(searchKey, selectedAuthor, listToOutput.current),
                valid: authorLinkingConfirmed,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAuthor, authorLinkingConfirmed]);

    const numRowsToShow = 4;
    const allRowsDisplayed = authorsToRender.length <= numRowsToShow;
    const scrollHeight = () => {
        if (authorsToRender.length === 0) {
            return 120;
        }

        const multiRowHeight = 65;

        if (!!allRowsDisplayed) {
            return (authorsToRender.length + 1) * multiRowHeight;
        }

        return numRowsToShow * multiRowHeight;
    };
    const overflowType = () => {
        return allRowsDisplayed ? 'auto' : 'scroll';
    };
    return (
        <div className={className}>
            <Grid container>
                <Grid
                    item
                    sx={{
                        border: '1px solid',
                        borderColor: 'secondary.light',
                        margin: '16px 0px',
                        padding: '8px 0px',
                        width: '100%',
                        height: scrollHeight(),
                        overflowY: overflowType(),
                    }}
                >
                    {authorsToRender}
                </Grid>
            </Grid>
            {selectedAuthor !== null && (
                <FormControlLabel
                    sx={{ alignItems: 'flex-start', margin: 0 }}
                    disabled={disabled}
                    control={
                        <Checkbox
                            checked={authorLinkingConfirmed}
                            onChange={_acceptAuthorLinkingTermsAndConditions}
                            sx={{
                                color: 'error.light',
                                '& .Mui-checked': {
                                    color: 'primary.main',
                                },
                            }}
                            id="authorAcceptDeclaration"
                            inputProps={{
                                id: 'author-accept-declaration-input',
                                'data-analyticsid': 'author-accept-declaration-input',
                                'data-testid': 'author-accept-declaration-input',
                            }}
                        />
                    }
                    label={
                        <Typography
                            textAlign={'justify'}
                            fontSize={'16px'}
                            fontWeight={300}
                            lineHeight={'30px'}
                            paddingTop={'10px'}
                            color={!authorLinkingConfirmed ? 'error' : 'secondary'}
                        >
                            {confirmation}
                        </Typography>
                    }
                />
            )}
        </div>
    );
};

AuthorLinking.propTypes = {
    authorLinkingId: PropTypes.string,
    authorList: PropTypes.array,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    linkedAuthorIdList: PropTypes.array,
    loggedInAuthor: PropTypes.object,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    searchKey: PropTypes.object.isRequired,
};

export default React.memo(AuthorLinking);
