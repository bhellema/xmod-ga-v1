/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon. Base: cards.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM:
 *   - div.multi-tile-cards .swiperGridViewContainer .tile-card
 *   - div.generic-list-value-prop .generic-list-icon-vp
 *
 * Container block (xwalk): Each card = 1 row, 2 cells
 * - Cell 1: image (reference) -> card icon/image
 * - Cell 2: text (richtext) -> title + description + legal + CTA
 * Collapsed fields (skip hints): none for this model
 */
export default function parse(element, { document }) {
  // Handle both multi-tile-cards and generic-list-value-prop sources
  const tileCards = element.querySelectorAll('.tile-card');
  const vpItems = element.querySelectorAll('.generic-list-icon-vp');
  const items = tileCards.length > 0 ? tileCards : vpItems;

  const cells = [];

  items.forEach((item) => {
    // Cell 1: Image
    const img = item.querySelector('.card-img img, span img, img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      imgFrag.appendChild(img);
    }

    // Cell 2: Text content
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Title (h3 for tile-cards, h4 for value props)
    const title = item.querySelector('h3, h4');
    if (title) textFrag.appendChild(title);

    // Description
    const desc = item.querySelector('.tileSubheading, .description');
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

    // Legal text
    const legal = item.querySelector('.cardlegal, .type-legal');
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
    const cta = item.querySelector('.cta-container a, a.primary-cta, a.btn-primary');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
