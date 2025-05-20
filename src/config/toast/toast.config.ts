import type { ToastOptions }    from 'svelte-french-toast';


// Define your theme colors here (example values)
const themeColors = {
    light: {
        background: '#FFFFFF',
        border: '#E4E4E7', // zinc-200
        textPrimary: '#0F172A', // slate-800
        textSuccess: '#16A34A', // green-600
        textError: '#DC2626',   // red-600
        backgroundError: '#FEE2E2', // red-100
        textOnError: '#B91C1C',      // red-700
        borderError: '#FCA5A5',       // red-300
        textLoading: '#2563EB', // blue-600
        iconSuccessPrimary: '#22C55E', // green-500
        iconErrorPrimary: '#EF4444',   // red-500
        iconLoadingPrimary: '#3B82F6', // blue-500
        iconSecondary: '#FFFFFF'
    },
    dark: {
        background: '#07a59c', // slate-800
        border: '#334155',     // slate-700
        textPrimary: '#F8FAFC', // slate-50
        textSuccess: '#4ADE80', // green-400
        textError: '#F87171',   // red-400
        textLoading: '#60A5FA', // blue-400
        iconSuccessPrimary: '#4ADE80', // green-400
        iconErrorPrimary: '#F87171',   // red-400
        iconLoadingPrimary: '#60A5FA', // blue-400
        backgroundError: '#B91C1C', // red-700
        textOnError: '#FFFFFF',
        borderError: '#EF4444',       // red-500
        iconSecondary: '#FFFFFF'
    }
};

const getCurrentModeColors = () => {
    const isDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? themeColors.dark : themeColors.light;
};

const baseStyle = () => {
    const colors = getCurrentModeColors();
    return `
        background-color: ${colors.background};
        color: ${colors.textPrimary};
        padding: 16px;
        border: 1px solid ${colors.border};
        border-radius: 0.5rem; // Equivalent to rounded-lg
`;
}

const baseToastConfig: ToastOptions = {
    position: "bottom-right",
    duration: 3000,
	className: "shadow-lg",
	
};


export const loadingToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle()}
			color: ${getCurrentModeColors().textLoading};
		`,
		iconTheme: {
            primary: getCurrentModeColors().iconLoadingPrimary,
            secondary: getCurrentModeColors().iconSecondary
        },
	};
};


export const successToast = (): ToastOptions => {
	return {
        ...baseToastConfig,
        style: `
            ${baseStyle()}
            color: ${getCurrentModeColors().textSuccess};
        `,
        iconTheme: {
            primary: getCurrentModeColors().iconSuccessPrimary,
            secondary: getCurrentModeColors().iconSecondary
        },
    };
};


export const errorToast = (): ToastOptions => {
	return {
        ...baseToastConfig,
        style: `
            padding: 16px;
            border: 1px solid ${getCurrentModeColors().borderError};
            border-radius: 0.5rem;
            background-color: ${getCurrentModeColors().backgroundError};
            color: ${getCurrentModeColors().textOnError};
        `,
        iconTheme: {
            primary: getCurrentModeColors().iconErrorPrimary,
            secondary: getCurrentModeColors().iconSecondary
        }
    };
};