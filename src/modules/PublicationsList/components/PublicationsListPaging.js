import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

export default class PublicationsListPaging extends Component {
    static propTypes = {
        onPageSizeChanged: PropTypes.func,
        onPageChanged: PropTypes.func,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            pageSize: this.props.pagingData ? this.props.pagingData.per_page : 20
        };
    }

    pageChanged = (newPage) => {
        if (this.props.onPageChanged) this.props.onPageChanged(newPage, this.state.pageSize);
    }

    pageSizeChanged = (event, index, value) => {
        this.setState({
            pageSize: value
        });

        if (this.props.onPageSizeChanged) this.props.onPageSizeChanged(this.state.pageSize);
    }

    render() {
        const txt = locale.components.paging;
        const totalPages = Math.ceil(this.props.pagingData.total / this.props.pagingData.per_page);
        const renderedPages = Array(Math.min(totalPages, txt.maxPagesToShow + 1)).fill()
            .map((page, index) => {
                const classNames = 'is-hidden-mobile page' + ((index + 1) === this.props.pagingData.current_page ? ' selectedPage' : '');
                let pageText = (index + 1);
                if ((index + 1) === txt.maxPagesToShow) pageText = '...';
                if ((index + 1) > txt.maxPagesToShow) pageText = totalPages;

                return (
                    <FlatButton
                        key={index}
                        onTouchTap={() => {
                            this.pageChanged(pageText);
                        }}
                        disabled={pageText === '...' || (index + 1) === this.props.pagingData.current_page}
                        className={classNames}>{pageText}</FlatButton>
                );
            });

        return (
            <div className="publicationsListPaging">
                {
                    this.props.pagingData.current_page > 1 &&
                    <FlatButton className="pagingPrevious" onTouchTap={() => {
                        this.pageChanged(this.props.pagingData.current_page - 1);
                    }}>{txt.previousPage}</FlatButton>
                }
                {renderedPages}
                {
                    this.props.pagingData.current_page < totalPages &&
                    <FlatButton className="pagingNext" onTouchTap={() => {
                        this.pageChanged(this.props.pagingData.current_page + 1);
                    }}>{txt.nextPage}</FlatButton>
                }
                <SelectField
                    id="pageSize"
                    className="is-hidden-mobile"
                    value={this.state.pageSize}
                    maxHeight={250}
                    dropDownMenuProps={{animated: false}}
                    onChange={this.pageSizeChanged}
                    floatingLabelText={txt.pageSize}>
                    <MenuItem value={20} primaryText={20}/>
                    <MenuItem value={50} primaryText={50}/>
                    <MenuItem value={100} primaryText={100}/>
                    <MenuItem value={1000} primaryText={1000}/>
                </SelectField>
            </div>
        );
    }
}
