import {styles} from './Stepper';

describe('Stepper component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            hexToRGBA: jest.fn(() => 'rgb(247, 247, 247)'),
            breakpoints: {
                down: jest.fn(() => '@media (max-width:959.95px)')
            }
        };
        const result = {
            stepper: {
                backgroundColor: 'rgb(247, 247, 247)',
                '@media (max-width:959.95px)': {
                    padding: '12px 0 24px 8px',
                    margin: '-24px 0 0 0'
                }
            },
            stepperLabel: {
                textOverflow: 'ellipsis',
                overflow: 'hidden'
            }
        };
        const test = styles(theme);
        expect(theme.hexToRGBA).toBeCalled();
        expect(theme.breakpoints).toBeCalled();
        expect(test).toMatchObject(result);
    });
});