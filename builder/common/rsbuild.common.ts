import { defineConfig } from '@rsbuild/core';
import { join } from 'path';
import { rootPath, srcPath } from './paths';

const CommonConfig = defineConfig({
    resolve: {
        alias: {
            '@/src': join(rootPath, './src/'),
            '@/types': join(rootPath, './types/'),
            '@/resources': join(rootPath, './resources/'),
            '@/constant': join(rootPath, './constant/'),
            '@/render': join(srcPath, './render/'),
        },

    },
});

export default CommonConfig;