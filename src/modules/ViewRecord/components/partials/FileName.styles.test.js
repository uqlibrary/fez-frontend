import { styles } from './FileName';

describe('FileName component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                body2: {
                    test1: 'test1',
                    test2: 'test2',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});
