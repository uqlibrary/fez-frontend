import { styles } from './Stepper';

describe('Stepper component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            hexToRGBA: jest.fn(() => 'rgb(247, 247, 247)'),
            breakpoints: {
                down: jest.fn(() => '@media (max-width:959.95px)'),
            },
        };
        const test = styles(theme);
        expect(theme.hexToRGBA).toBeCalled();
        expect(theme.breakpoints.down).toBeCalled();
        expect(test).toMatchSnapshot();
    });
});
