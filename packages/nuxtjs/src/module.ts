import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: '@webticks/nuxtjs',
        configKey: 'webticks'
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addPlugin(resolver.resolve('./runtime/plugin'));
    }
});
