/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.offer .right-alignment
 *
 * Columns block (xwalk): 1 row, 2 cells (text + image)
 * NO field hints for columns blocks per hinting.md exception rule.
 */
export default function parse(element, { document }) {
  // Find the two grid columns
  const textCol = element.querySelector('.grid-col-6.flex.flex-items-center, .grid-col-6:not(.order-img-top)');
  const imageCol = element.querySelector('.grid-col-6.order-img-top, .grid-col-6.rel');

  // Cell 1: Text content
  const textFrag = document.createDocumentFragment();

  if (textCol) {
    // Eyebrow
    const eyebrow = textCol.querySelector('[class*="eyebrow-"]');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }

    // Heading
    const heading = textCol.querySelector('h1, h2, h3');
    if (heading) textFrag.appendChild(heading);

    // Body text (wysiwyg-editor contains paragraphs and possibly lists)
    const body = textCol.querySelector('.wysiwyg-editor, .type-base');
    if (body) {
      // Get paragraphs
      const ps = body.querySelectorAll(':scope > p');
      ps.forEach((p) => { if (p.textContent.trim()) textFrag.appendChild(p); });

      // Get lists (e.g. checklist in "Switch to AT&T" section)
      const lists = body.querySelectorAll(':scope > div ul, :scope > ul');
      lists.forEach((list) => {
        const ul = document.createElement('ul');
        list.querySelectorAll('li').forEach((li) => {
          const newLi = document.createElement('li');
          // Get text from span (skip checkmark SVG images)
          const span = li.querySelector('span');
          if (span) {
            newLi.textContent = span.textContent.trim();
          } else {
            newLi.textContent = li.textContent.trim();
          }
          if (newLi.textContent) ul.appendChild(newLi);
        });
        if (ul.children.length > 0) textFrag.appendChild(ul);
      });
    }

    // Legal text
    const legal = textCol.querySelector('.type-legal-wysiwyg-editor');
    if (legal) {
      const legalPs = legal.querySelectorAll('p');
      legalPs.forEach((p) => { if (p.textContent.trim()) textFrag.appendChild(p); });
    }

    // CTA buttons
    const ctas = textCol.querySelectorAll('.cta-container a');
    ctas.forEach((cta) => {
      if (cta.textContent.trim()) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(a);
        textFrag.appendChild(p);
      }
    });
  }

  // Cell 2: Image
  const imgFrag = document.createDocumentFragment();
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) imgFrag.appendChild(img);
  }

  // Build cells: 1 row, 2 columns - NO field hints for columns blocks
  const cells = [[textFrag, imgFrag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
