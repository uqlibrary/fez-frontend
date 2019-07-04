import { styles } from './Thumbnail';

describe('Thumbnail component', () => {
    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });
});
