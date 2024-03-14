// import the function to be tested
import { ACTION } from '../ControlledVocabularyContext';
import { transformAdminRequest, calculateEnd } from './utils';

// define some mock data for testing
const mockRequest = {
    cvo_name: 'Test',
    cvo_order: '1',
    cvo_hide: false,
    cvo_extra: 'foo',
};
const mockParentId = '123';

describe('transformAdminRequest', () => {
    // test that the function returns an object
    test('should return an object', () => {
        expect(typeof transformAdminRequest({ request: mockRequest })).toBe('object');
    });

    // test that the function deletes invalid properties from the request object
    test('should delete invalid properties from the request object', () => {
        const transformedRequest = transformAdminRequest({ request: mockRequest });
        expect(transformedRequest).not.toHaveProperty('cvo_extra');
    });

    // test that the function adds the parentId to the request object if action is 'add'
    test('should add the parentId to the request object if action is add', () => {
        const transformedRequest = transformAdminRequest({
            request: mockRequest,
            parentId: mockParentId,
            action: ACTION.ADD,
        });
        expect(transformedRequest).toHaveProperty('cvr_parent_cvo_id', mockParentId);
    });

    // test that the function does not add the parentId to the request object if action is not 'add'
    test('should not add the parentId to the request object if action is not add', () => {
        const transformedRequest = transformAdminRequest({
            request: mockRequest,
            parentId: mockParentId,
            action: ACTION.EDIT,
        });
        expect(transformedRequest).not.toHaveProperty('cvr_parent_cvo_id');
    });

    // test that the function converts the cvo_hide property to a 0
    test('should convert the cvo_hide property to a number', () => {
        const transformedRequest = transformAdminRequest({ request: mockRequest });
        expect(transformedRequest).toHaveProperty('cvo_hide', 0);
    });

    // test that the function converts the cvo_hide property to a 1
    test('should convert the cvo_hide property to a number', () => {
        const transformedRequest = transformAdminRequest({ request: { ...mockRequest, cvo_hide: true } });
        expect(transformedRequest).toHaveProperty('cvo_hide', 1);
    });

    // test that the function converts the cvo_order property to a number
    test('should convert the cvo_order property to a number', () => {
        const transformedRequest = transformAdminRequest({ request: mockRequest });
        expect(transformedRequest).toHaveProperty('cvo_order', 1);
    });

    // test that the function converts an empty cvo_order property to null
    test('should convert the cvo_order property to null', () => {
        const request = { ...mockRequest, cvo_order: '' };
        const transformedRequest = transformAdminRequest({ request });
        expect(transformedRequest).toHaveProperty('cvo_order', null);
    });
});

describe('calculateEnd', () => {
    test('Should return perPage when records are bigger than that the page can show', () => {
        expect(calculateEnd(0, 10, 15, 0)).toEqual(10);
    });
    test('Should return remaing records when remaining records are smaller than that the page can show', () => {
        expect(calculateEnd(0, 10, 15, 1)).toEqual(5);
    });
});
