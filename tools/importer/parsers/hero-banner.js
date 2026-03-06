/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.hero.aem-GridColumn
 *
 * Simple block (xwalk): 2 rows
 * - Row 1: image (reference) -> background image
 * - Row 2: text (richtext) -> eyebrow + heading + body + legal + CTAs
 * Collapsed fields (skip hints): imageAlt
 */
export default function parse(element, { document }) {
  // Extract background image - try <img> tag first, then CSS background-image
  let bgImage = element.querySelector('.bg-hero-panel img, .bg-art img');

  // If no <img> tag, check for CSS background-image on .bg-hero-panel
  if (!bgImage) {
    const bgPanel = element.querySelector('.bg-hero-panel, .bg-art [class*="bg-hero-panel"]');
    if (bgPanel) {
      const computedStyle = bgPanel.ownerDocument.defaultView.getComputedStyle(bgPanel);
      const bgUrl = computedStyle.backgroundImage;
      if (bgUrl && bgUrl !== 'none') {
        const urlMatch = bgUrl.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          bgImage = document.createElement('img');
          bgImage.src = urlMatch[1];
        }
      }
    }
  }

  // Extract text content from content-panel-text
  const textPanel = element.querySelector('.content-panel-text .max-width-595, .content-panel-text');

  // Build text content fragment
  const textContent = document.createDocumentFragment();

  if (textPanel) {
    // Eyebrow
    const eyebrow = textPanel.querySelector('[class*="eyebrow-"]');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textContent.appendChild(p);
    }

    // Heading
    const heading = textPanel.querySelector('h1, h2, h3');
    if (heading) {
      textContent.appendChild(heading);
    }

    // Body text
    const body = textPanel.querySelector('.wysiwyg-editor, .type-base');
    if (body) {
      const paragraphs = body.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) textContent.appendChild(p);
      });
    }

    // Legal text
    const legal = textPanel.querySelector('.type-legal-wysiwyg-editor');
    if (legal) {
      const legalPs = legal.querySelectorAll('p');
      legalPs.forEach((p) => {
        if (p.textContent.trim()) textContent.appendChild(p);
      });
    }

    // CTA buttons
    const ctas = textPanel.querySelectorAll('.cta-container a');
    ctas.forEach((cta) => {
      if (cta.textContent.trim()) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        if (cta.title) a.title = cta.title;
        const p = document.createElement('p');
        p.appendChild(a);
        textContent.appendChild(p);
      }
    });
  }

  // Build cells: Simple block with 2 rows
  const cells = [];

  // Row 1: image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: text with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  textFrag.appendChild(textContent);
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
