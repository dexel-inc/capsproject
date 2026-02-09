import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const authPages = ['auth/Login', 'auth/Register'];
const landingPages = [
    'welcome',
    'catalog/Index',
    'product/Show',
    'placeholder/Faq',
    'placeholder/Cart',
    'account/Index',
    'account/Orders',
    'account/Wishlist',
];

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const page = await resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        let defaultLayout = (pageElement: ReactNode) => <AppLayout>{pageElement}</AppLayout>;
        if (authPages.includes(name)) {
            defaultLayout = (pageElement: ReactNode) => <AuthLayout>{pageElement}</AuthLayout>;
        } else if (landingPages.includes(name)) {
            defaultLayout = (pageElement: ReactNode) => <LandingLayout>{pageElement}</LandingLayout>;
        }
        (page as { default: { layout?: (el: ReactNode) => ReactNode } }).default.layout =
            (page as { default: { layout?: (el: ReactNode) => ReactNode } }).default.layout ?? defaultLayout;
        return page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});
