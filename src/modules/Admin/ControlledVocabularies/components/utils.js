import PropTypes from 'prop-types';

export const componentProps = {
    default: ['id', 'name', 'label', 'value', 'onChange', 'inputProps', 'disabled'],
    textfield: ['InputLabelProps', 'fullWidth', 'error', 'onClick'],
    checkbox: ['checked'],
};
export const filterComponentProps = ({ type = 'textfield', ...props }) => {
    if (type !== 'textfield' && type !== 'checkbox') return props;

    const fullProps = [...componentProps.default, ...componentProps[type]];
    Object.keys(props).forEach(key => {
        if (!fullProps.includes(key)) delete props[key];
    });
    return props;
};
filterComponentProps.propTypes = {
    type: PropTypes.oneOf(['textfield', 'checkbox']),
    props: PropTypes.object.isRequired,
};

export const transformAddRequest = ({ request }) => {
    if (request.hasOwnProperty('parentId')) {
        const id = request.parentId;
        delete request.parentId;
        request.cvr_parent_cvo_id = id;
    }

    return request;
};
