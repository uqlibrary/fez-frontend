// Replaces Mui 4's deprecated createGenerateClassName
// https://github.com/mui/material-ui/issues/30011#issuecomment-988049123
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

ClassNameGenerator.configure(componentName => componentName.replace('Mui', 'uq-espace-'));
