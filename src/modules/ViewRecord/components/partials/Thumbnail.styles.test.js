import {styles} from "./Thumbnail";

describe('Thumbnail component', () => {
    it('should have a proper style generator', () => {
        const result = {
            image: {
                width: '100%',
                '&:hover': {
                    cursor: 'pointer'
                }
            },
            brokenImage: {
                opacity: 0.5,
            }
        };
        expect(styles()).toMatchObject(result);
    });
});
