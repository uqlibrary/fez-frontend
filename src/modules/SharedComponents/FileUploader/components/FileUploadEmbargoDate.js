import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';

const moment = require('moment');

export default class FileUploadEmbargoDate extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        locale: PropTypes.object,
        progress: PropTypes.number
    };

    static defaultProps = {
        locale: {
            dateFormat: 'DD/MM/YYYY',
            currentDateString: moment().format('DD/MM/YYYY'),
            fieldName: 'accessDate'
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {dateFormat, currentDateString, fieldName} = this.props.locale;
        const {index} = this.props;
        return (
            <DatePicker
                className="datepicker"
                DateTimeFormat={dateFormat}
                firstDayOfWeek={0}
                hintText={currentDateString}
                locale="en-AU"
                name={ `${fieldName}@${index}` }
                menuItemStyle={{width: '90px'}}
            />
        );
    }
}
