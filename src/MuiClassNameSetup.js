// Replaces Mui 4's deprecated createGenerateClassName
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

ClassNameGenerator.configure(componentName => `uq-espace-${componentName}`);
