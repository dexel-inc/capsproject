import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import AppLayout from './layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type InertiaPageComponent = ComponentType & {
    layout?: (page: ReactNode) => ReactNode;
};

type InertiaPageModule = {
    default: InertiaPageComponent;
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const page = (await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<InertiaPageModule>('./pages/**/*.tsx'),
        )) as InertiaPageModule;

        page.default.layout ??= (pageElement: ReactNode) => <AppLayout>{pageElement}</AppLayout>;

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
