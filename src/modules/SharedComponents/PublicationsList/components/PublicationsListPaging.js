import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { locale } from 'locale';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';

const StyledPrevNextButton = styled(Button)(({ theme }) => ({
    flex: '0 1 auto',
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    minWidth: 'auto',
    overflow: 'hidden',
    [theme.breakpoints.down('lg')]: {
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
}));

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

    static getDerivedStateFromProps(props, state) {
        if (!props.disabled && JSON.stringify(props.pagingData) !== JSON.stringify(state)) {
            return { ...props.pagingData };
        }
        return {};
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
                sx={{
                    flex: '1 0 auto',
                    height: '32px',
                    minWidth: '32px',
                    minHeight: '32px',
                    margin: '0 2px',
                    ...(isCurrentPage && { fontWeight: 900, fontSize: '1.2rem' }),
                }}
                className={'paging-button'}
                onClick={() => {
                    this.pageChanged(key);
                }}
                disabled={this.props.disabled}
                color={isCurrentPage ? 'primary' : 'inherit'}
                aria-label={locale.components.paging.pageButtonAriaLabel
                    .replace('[pageNumber]', key)
                    .replace('[totalPages]', totalPages)}
                children={key}
                data-analyticsid={`${this.props.pagingId}-select-page-${key}`}
                data-testid={`${this.props.pagingId}-select-page-${key}`}
                id={`${this.props.pagingId}-select-page-${key}`}
            />
        );
    };

    renderPageButtons = pagesToShow => {
        return Array(pagesToShow.length)
            .fill()
            .map((page, index) => this.renderButton(pagesToShow[index]));
    };

    render() {
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
                    <Grid container spacing={0} sx={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                        {currentPage >= 1 && (
                            <Grid item xs={'auto'}>
                                <StyledPrevNextButton
                                    variant={'text'}
                                    className={'paging-previous'}
                                    onClick={() => {
                                        this.pageChanged(currentPage - 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === 1}
                                >
                                    <ChevronLeft sx={{ fontSize: '1rem' }} />
                                    {txt.previousPage}
                                </StyledPrevNextButton>
                            </Grid>
                        )}
                        <Grid
                            item
                            sm={'auto'}
                            sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center' }}
                            data-analyticsid={`${this.props.pagingId}-desktop-controls`}
                            data-testid={`${this.props.pagingId}-desktop-controls`}
                            id={`${this.props.pagingId}-desktop-controls`}
                        >
                            {paginationPages.indexOf(1) === -1 && this.renderButton(1)}
                            {paginationPages[0] - 1 > 1 && txt.firstLastSeparator}
                            {renderedPageButtons}
                            {paginationPages[paginationPages.length - 1] + 1 < totalPages && txt.firstLastSeparator}
                            {paginationPages.indexOf(totalPages) === -1 && this.renderButton(totalPages)}
                        </Grid>
                        <Grid
                            item
                            xs
                            sx={{ display: { xs: 'block', sm: 'none' } }}
                            data-analyticsid={`${this.props.pagingId}-mobile-controls`}
                            data-testid={`${this.props.pagingId}-mobile-controls`}
                            id={`${this.props.pagingId}-mobile-controls`}
                        >
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    paddingLeft: 1,
                                    paddingRight: 1,
                                }}
                            >
                                <StyledPrevNextButton
                                    variant={'text'}
                                    children={txt.pageOf
                                        .replace('[currentPage]', currentPage)
                                        .replace('[totalPages]', totalPages)}
                                />
                            </Box>
                        </Grid>
                        {currentPage <= totalPages && (
                            <Grid item xs={'auto'}>
                                <StyledPrevNextButton
                                    variant={'text'}
                                    className={'paging-next'}
                                    onClick={() => {
                                        this.pageChanged(currentPage + 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === totalPages}
                                >
                                    {txt.nextPage}
                                    <ChevronRight sx={{ fontSize: '1rem' }} />
                                </StyledPrevNextButton>
                            </Grid>
                        )}
                    </Grid>
                )}
            </div>
        );
    }
}

export default PublicationsListPaging;
