import { getOneToManyRelationItemByOrder } from './record';

it('getOneToManyRelationItemByOrder()', () => {
    const record = {
        fez_record_search_key_author: [
            { rek_author: 'Test 2', rek_author_order: 2 },
            { rek_author: 'Test 1', rek_author_order: 1 },
            { rek_author: 'Test 3', rek_author_order: 3 },
        ],
    };

    expect(getOneToManyRelationItemByOrder()).toBeUndefined();
    expect(getOneToManyRelationItemByOrder({})).toBeUndefined();
    expect(getOneToManyRelationItemByOrder({}, 'author')).toBeUndefined();
    expect(getOneToManyRelationItemByOrder({}, 'author', 1)).toBeUndefined();
    expect(getOneToManyRelationItemByOrder(record, 'author', 0)).toBeUndefined();
    expect(getOneToManyRelationItemByOrder(record, 'author', 4)).toBeUndefined();
    expect(getOneToManyRelationItemByOrder(record, 'author', 3)).toEqual({ rek_author: 'Test 3', rek_author_order: 3 });
});
