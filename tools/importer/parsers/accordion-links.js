/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-links. Base: accordion.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.link-farm .desktop-view-and-tablet .accordion-item
 *
 * Container block (xwalk): Each accordion group = 1 row, 2 cells
 * - Cell 1: summary (text) -> column/category heading
 * - Cell 2: text (richtext) -> list of links
 * Collapsed fields (skip hints): none for this model
 */
export default function parse(element, { document }) {
  // Find accordion columns (desktop layout)
  const columns = element.querySelectorAll('.desktop-view-and-tablet .accordion-item, .grid-col-3.accordion-item');

  const cells = [];

  columns.forEach((col) => {
    // Cell 1: Summary (column heading or first link as category)
    const summaryFrag = document.createDocumentFragment();
    summaryFrag.appendChild(document.createComment(' field:summary '));

    // Check for a heading element; if not, use the first link text as category
    const heading = col.querySelector('h3, h4, .accordion-heading');
    if (heading && heading.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = heading.textContent.trim();
      summaryFrag.appendChild(p);
    } else {
      // Use first link text as the category name
      const firstLink = col.querySelector('a');
      if (firstLink && firstLink.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = firstLink.textContent.trim();
        summaryFrag.appendChild(p);
      }
    }

    // Cell 2: Links list
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const links = col.querySelectorAll('li a, a.link-text2');
    const ul = document.createElement('ul');
    links.forEach((link) => {
      if (link.textContent.trim()) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        li.appendChild(a);
        ul.appendChild(li);
      }
    });
    if (ul.children.length > 0) {
      textFrag.appendChild(ul);
    }

    cells.push([summaryFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-links', cells });
  element.replaceWith(block);
}
