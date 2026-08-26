import { defineConfig } from "vite";

// A multi-page static site: Vite bundles TypeScript while the existing scripts
// still generate blog pages, metadata, and the sitemap.
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        home: `${import.meta.dirname}/index.html`,
        blogIndex: `${import.meta.dirname}/blog/index.html`,
        blogPost: `${import.meta.dirname}/blog/post.html`,
        staticPost: `${import.meta.dirname}/src/pages/static-post.ts`,
      },
    },
  },
});
