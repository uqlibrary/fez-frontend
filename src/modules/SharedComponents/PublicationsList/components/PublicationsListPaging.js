import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Box from '@material-ui/core/Box';

const styles = theme => ({
    pageButton: {
        flex: '1 0 auto',
        height: 32,
        minWidth: 32,
        minHeight: 32,
        margin: '0 2px',
    },
    current: {
        fontWeight: 900,
        fontSize: '1.2rem',
    },
    nextPrevButtons: {
        flex: '0 1 auto',
        height: 32,
        minHeight: 32,
        maxHeight: 32,
        minWidth: 'auto',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
            paddingLeft: 0,
            paddingRight: 0,
            '& > span': {
                lineHeight: '0.875rem',
            },
        },
        '&.paging-previous': {
            justifyContent: 'flex-start',
        },
        '&.paging-next': {
            justifyContent: 'flex-end',
        },
    },
    nextPrevIcons: {
        fontSize: '1rem',
    },
    fakeDisabled: {
        backgroundColor: theme.palette.primary.main,
    },
    gridContainer: {
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    paginationGridContainer: {
        textAlign: 'center',
    },
});

export const paginate = (totalItems, currentPage = 1, pageSize = 10, maxPages = 10) => {
    let currPage = currentPage;
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currPage = 1;
    } else if (currentPage > totalPages) {
        currPage = totalPages;
    }

    let startPage;
    let endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currPage - maxPagesBeforeCurrentPage;
            endPage = currPage + maxPagesAfterCurrentPage;
        }
    }

    // create an array of pages
    const pages = Array.from(Array(endPage + 1 - startPage).keys(), i => startPage + i);

    // adjust the paging array to account for the edge case
    // where if the currentPage is exactly 1 position in from
    // the starting page 1 or end page totalPages, we end up
    // rendering an additional number. Although not a breaking issue
    // it is a jarring UI artefact so to fix, we either remove a page
    // number from the start or the end of the array
    if (startPage === 2 && endPage !== totalPages + 1) pages.pop();
    else if (endPage === totalPages - 1) pages.shift();

    console.log(startPage, endPage, pages);

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        pages: pages,
    };
};

export class PublicationsListPaging extends Component {
    static propTypes = {
        classes: PropTypes.object,
        onPageChanged: PropTypes.func,
        disabled: PropTypes.bool,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number,
        }),
        pagingId: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.pagingData,
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.disabled && JSON.stringify(nextProps.pagingData) !== JSON.stringify(this.state)) {
            this.setState({ ...nextProps.pagingData });
        }
    }

    pageChanged = newPage => {
        this.props.onPageChanged && this.props.onPageChanged(newPage);
    };

    renderButton = key => {
        const currentPage = this.state.current_page;
        const isCurrentPage = key === currentPage;
        const totalPages =
            this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;

        return (
            <Button
                variant={'text'}
                key={key}
                size={'small'}
                className={`${classNames(
                    this.props.classes.pageButton,
                    isCurrentPage && this.props.classes.current,
                )} paging-button`}
                onClick={() => {
                    this.pageChanged(key);
                }}
                disabled={this.props.disabled}
                color={isCurrentPage ? 'primary' : 'default'}
                aria-label={locale.components.paging.pageButtonAriaLabel
                    .replace('[pageNumber]', key)
                    .replace('[totalPages]', totalPages)}
                children={key}
                data-testid={`${this.props.pagingId}-select-page-${key}`}
                id={`${this.props.pagingId}-select-page-${key}`}
            />
        );
    };

    renderPageButtons = (pagesToShow = []) => {
        return Array(pagesToShow.length)
            .fill()
            .map((page, index) => this.renderButton(pagesToShow[index]));
    };

    render() {
        const { classes } = this.props;
        const txt = locale.components.paging;
        const maxPagesToShow = locale.components.paging.maxPagesToShow;
        const pagination = paginate(this.state.total, this.state.current_page, this.state.per_page, maxPagesToShow);
        const paginationPages = pagination.pages;
        const totalPages = pagination.totalPages;

        const renderedPageButtons = this.renderPageButtons(paginationPages);

        const currentPage = this.state.current_page;
        if (totalPages === 0 || this.state.current_page < 1 || this.state.current_page > totalPages) {
            return <span className="publicationsListControls empty" />;
        }
        return (
            <div data-testid={this.props.pagingId} id={this.props.pagingId}>
                {totalPages > 1 && (
                    <Grid container spacing={0} className={classes.gridContainer}>
                        {currentPage >= 1 && (
                            <Grid item xs={'auto'}>
                                <Button
                                    variant={'text'}
                                    className={`${classes.nextPrevButtons} paging-previous`}
                                    onClick={() => {
                                        this.pageChanged(currentPage - 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === 1}
                                >
                                    <ChevronLeft className={classes.nextPrevIcons} />
                                    {txt.previousPage}
                                </Button>
                            </Grid>
                        )}
                        <Hidden xsDown>
                            <Grid item sm={'auto'} className={classes.paginationGridContainer}>
                                {paginationPages.indexOf(1) === -1 && this.renderButton(1)}
                                {paginationPages[0] - 1 > 1 && txt.firstLastSeparator}
                                {renderedPageButtons}
                                {paginationPages[paginationPages.length - 1] + 1 < totalPages && txt.firstLastSeparator}
                                {paginationPages.indexOf(totalPages) === -1 && this.renderButton(totalPages)}
                            </Grid>
                        </Hidden>
                        <Hidden smUp>
                            <Grid item xs>
                                <Box textAlign={'center'} paddingLeft={1} paddingRight={1}>
                                    <Button
                                        variant={'text'}
                                        className={classes.nextPrevButtons}
                                        children={txt.pageOf
                                            .replace('[currentPage]', currentPage)
                                            .replace('[totalPages]', totalPages)}
                                    />
                                </Box>
                            </Grid>
                        </Hidden>
                        {currentPage <= totalPages && (
                            <Grid item xs={'auto'}>
                                <Button
                                    variant={'text'}
                                    className={`${classes.nextPrevButtons} paging-next`}
                                    onClick={() => {
                                        this.pageChanged(currentPage + 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === totalPages}
                                >
                                    {txt.nextPage}
                                    <ChevronRight className={classes.nextPrevIcons} />
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(PublicationsListPaging);
