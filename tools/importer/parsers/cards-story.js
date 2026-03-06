/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-story. Base: cards.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.multi-tile-cards:nth-of-type(2) .tile-card
 *
 * Container block (xwalk): Each card = 1 row, 2 cells
 * - Cell 1: image (reference) -> customer story image
 * - Cell 2: text (richtext) -> eyebrow (industry) + h3 (quote) + description + legal + CTA
 * Collapsed fields (skip hints): none for this model
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.tile-card');

  const cells = [];

  cards.forEach((card) => {
    // Cell 1: Image
    const img = card.querySelector('.card-img img, img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      imgFrag.appendChild(img);
    }

    // Cell 2: Text content
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Eyebrow (industry category)
    const eyebrow = card.querySelector('.eyebrow-text, .type-eyebrow-md');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }

    // Heading (customer quote)
    const heading = card.querySelector('h3');
    if (heading) textFrag.appendChild(heading);

    // Description
    const desc = card.querySelector('.tileSubheading');
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

    // Legal / attribution
    const legal = card.querySelector('.cardlegal, .type-legal-wysiwyg-editor');
    if (legal) {
      const legalPs = legal.querySelectorAll('p');
      if (legalPs.length > 0) {
        legalPs.forEach((p) => { if (p.textContent.trim()) textFrag.appendChild(p); });
      } else if (legal.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = legal.textContent.trim();
        textFrag.appendChild(p);
      }
    }

    // CTA
    const cta = card.querySelector('.cta-container a, a.btn-primary');
    if (cta && cta.textContent.trim()) {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-story', cells });
  element.replaceWith(block);
}
