/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-industry. Base: carousel.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.story-stack .storyStackSlider .swiper-slide
 *
 * Container block (xwalk): Each slide = 1 row, 2 cells
 * - Cell 1: media_image (reference) -> slide background image
 * - Cell 2: content_text (richtext) -> category heading + description
 * Collapsed fields (skip hints): media_imageAlt
 * Grouped fields: media_ prefix -> cell 1, content_ prefix -> cell 2
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.swiper-slide');

  const cells = [];

  slides.forEach((slide) => {
    // Cell 1: Image (swiper-image, not the small icon)
    const img = slide.querySelector('img.swiper-image, .story-img-container > img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:media_image '));
    if (img) {
      imgFrag.appendChild(img);
    }

    // Cell 2: Text content (category heading + description)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));

    // Category heading
    const heading = slide.querySelector('.heading-sm, [class*="heading-sm-storyStack"]');
    if (heading && heading.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textFrag.appendChild(h3);
    }

    // Description
    const desc = slide.querySelector('.story-description, .wysiwyg-editor');
    if (desc) {
      const ps = desc.querySelectorAll('p');
      if (ps.length > 0) {
        ps.forEach((p) => { if (p.textContent.trim()) textFrag.appendChild(p); });
      } else if (desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textFrag.appendChild(p);
      }
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-industry', cells });
  element.replaceWith(block);
}
