import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

export async function GET(context) {
  const essays = await getCollection('essays');
  // stable order; newest-ish first not available (no dates), so alpha by title
  essays.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return rss({
    title: 'The Syntopicon — Rob Heffern',
    description: 'Essays wandering through the great ideas, one at a time. Plain language, no gatekeeping.',
    site: context.site,
    items: essays.map((e) => ({
      title: e.data.title,
      description: e.data.excerpt || '',
      link: `/essays/${e.slug}/`,
      categories: e.data.category ? [e.data.category] : [],
      content: sanitizeHtml(md.render(e.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'img', 'figure', 'figcaption']),
        allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src', 'alt', 'title'] },
      }),
    })),
    customData: `<language>en-us</language>`,
  });
}
