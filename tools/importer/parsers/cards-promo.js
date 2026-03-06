/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.flex-cards .row-of-cards .card-wrapper
 *
 * Container block (xwalk): Each card = 1 row, 2 cells
 * - Cell 1: image (reference) -> promotional card image
 * - Cell 2: text (richtext) -> eyebrow + heading + body + legal + CTA
 * Collapsed fields (skip hints): none for this model
 */
export default function parse(element, { document }) {
  // Find all card wrappers in flex-cards rows
  const cards = element.querySelectorAll('.card-wrapper');

  const cells = [];

  cards.forEach((card) => {
    // Cell 1: Image (background image of the card)
    const img = card.querySelector('.flex-card > img, .card > img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      imgFrag.appendChild(img);
    }

    // Cell 2: Text content
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Eyebrow
    const eyebrow = card.querySelector('[class*="eyebrow-"]');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }

    // Heading
    const heading = card.querySelector('h1, h2, h3');
    if (heading) textFrag.appendChild(heading);

    // Body text
    const body = card.querySelector('.type-base');
    if (body) {
      const ps = body.querySelectorAll('p');
      if (ps.length > 0) {
        ps.forEach((p) => { if (p.textContent.trim()) textFrag.appendChild(p); });
      } else if (body.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = body.textContent.trim();
        textFrag.appendChild(p);
      }
    }

    // Legal text
    const legal = card.querySelector('.type-legal');
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
    const cta = card.querySelector('.flexCardItemCta a, a.btn-primary');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
