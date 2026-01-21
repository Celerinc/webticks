import { defineNuxtPlugin } from '#app';
import inject from '@webticks/core';

export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
        const options = nuxtApp.$config.public.webticks || {};
        inject(options);
    }
});
