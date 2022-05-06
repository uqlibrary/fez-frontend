import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { withStyles } from '@material-ui/core/styles';
// import classNames from 'classnames';

const styles = theme => ({
    pageButton: {
        width: 32,
        height: 32,
        minWidth: 32,
        minHeight: 32,
        margin: '0 2px',
    },
    nextPrevButtons: {
        height: 32,
        minHeight: 32,
        maxHeight: 32,
        overflow: 'hidden',
    },
    nextPrevIcons: {
        fontSize: '1rem',
    },
    fakeDisabled: {
        backgroundColor: theme.palette.primary.main,
    },
});

export class CommunityCollectionsPaging extends Component {
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
        const isCurrentPage = !!(key === currentPage);
        const totalPages =
            this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        return (
            <Button
                variant={'text'}
                key={key}
                size={'small'}
                className="paging-button"
                onClick={() => {
                    this.pageChanged(key);
                }}
                disabled={this.props.disabled || isCurrentPage}
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

    renderPageButtons = () => {
        const totalPages =
            this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        const pageBracket = locale.components.paging.pagingBracket;
        const currentPage = this.state.current_page;
        const startPage = currentPage - pageBracket < 1 ? 1 : currentPage - pageBracket;
        const endPage = currentPage + pageBracket > totalPages ? totalPages : currentPage + pageBracket;
        const totalToRender = endPage - startPage + 1;
        return Array(totalToRender)
            .fill()
            .map((page, index) => {
                return this.renderButton(index + startPage);
            });
    };

    render() {
        const txt = locale.components.paging;
        const totalPages =
            this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        const currentPage = this.state.current_page;
        if (totalPages === 0 || this.state.current_page < 1 || this.state.current_page > totalPages) {
            return <span className="publicationsListControls empty" />;
        }
        return (
            <div data-testid={this.props.pagingId} id={this.props.pagingId}>
                {totalPages > 1 && (
                    <Grid container spacing={0}>
                        {currentPage >= 1 && (
                            <Grid item>
                                <Button
                                    style={{ paddingLeft: 4 }}
                                    variant={'text'}
                                    className="paging-previous"
                                    onClick={() => {
                                        this.pageChanged(currentPage - 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === 1}
                                >
                                    <ChevronLeft className="nextPrevIcons" />
                                    {txt.previousPage}
                                </Button>
                            </Grid>
                        )}
                        <Grid item style={{ flexGrow: 1 }} />
                        <Hidden xsDown>
                            <Grid item>
                                {currentPage - (txt.pagingBracket + 1) >= 1 && this.renderButton(1)}
                                {currentPage - (txt.pagingBracket + 2) >= 1 && txt.firstLastSeparator}
                                {this.renderPageButtons()}
                                {currentPage + (txt.pagingBracket + 2) <= totalPages && txt.firstLastSeparator}
                                {currentPage + (txt.pagingBracket + 1) <= totalPages && this.renderButton(totalPages)}
                            </Grid>
                        </Hidden>
                        <Hidden smUp>
                            <Grid item style={{ flexGrow: 1 }}>
                                <Button
                                    style={{ margin: '0 auto' }}
                                    variant={'text'}
                                    className="next-prev"
                                    children={txt.pageOf
                                        .replace('[currentPage]', currentPage)
                                        .replace('[totalPages]', totalPages)}
                                />
                            </Grid>
                        </Hidden>
                        <Grid item style={{ flexGrow: 1 }} />
                        {currentPage <= totalPages && (
                            <Grid item>
                                <Button
                                    variant={'text'}
                                    size={'small'}
                                    className="next-prev paging-next"
                                    onClick={() => {
                                        this.pageChanged(currentPage + 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === totalPages}
                                >
                                    {txt.nextPage}
                                    <ChevronRight className={'next-prev-icons'} />
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CommunityCollectionsPaging);
