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

export const transformAddRequest = ({ request, parentId }) => {
    if (!!parentId) {
        request.cvr_parent_cvo_id = parentId;
    }
    if (request.hasOwnProperty('cvo_hide')) {
        request.cvo_hide = !!request.cvo_hide ? 1 : 0;
    }

    return request;
};
