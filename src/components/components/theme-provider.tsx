import {useEffect} from 'react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {type ThemeProviderProps} from 'next-themes/dist/types';

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    useEffect(() => {
        console.log('ThemeProvider props:', props);
    }, [props]);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}