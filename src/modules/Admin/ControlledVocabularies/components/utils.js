import PropTypes from 'prop-types';
import { ACTION } from '../ControlledVocabularyContext';

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

export const validRequestProps = [
    'cvo_id',
    'cvo_title',
    'cvo_desc',
    'cvo_external_id',
    'cvo_image_filename',
    'cvo_lat',
    'cvo_long',
    'cvo_order',
    'cvo_policy',
    'cvo_created_at',
    'cvo_updated_at',
    'cvo_hide',
];
export const transformAdminRequest = ({ request, parentId, action }) => {
    Object.keys(request).forEach(key => {
        !validRequestProps.includes(key) && delete request[key];
    });
    if (!!parentId && action === ACTION.ADD) {
        request.cvr_parent_cvo_id = parentId;
    }
    if (request.hasOwnProperty('cvo_hide')) {
        request.cvo_hide = !!request.cvo_hide ? 1 : 0;
    }
    if (request.hasOwnProperty('cvo_order') && typeof request.cvo_order === 'string') {
        request.cvo_order = Number(request.cvo_order); // validation should ensure this is a valid number
    }

    return request;
};
