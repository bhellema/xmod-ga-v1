/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form. Base: form.
 * Source: https://www.business.att.com/
 * Selectors from captured DOM: div.rai-form.aem-GridColumn
 *
 * Form block - extracts form structure for EDS form block.
 * Forms use base "form" name (no variants per form block rules).
 */
export default function parse(element, { document }) {
  // Extract visible form fields
  const form = element.querySelector('form, .bs-rai-leadform');
  const cells = [];

  if (form) {
    // Get visible field divs (not hidden fields)
    const fieldDivs = form.querySelectorAll('.field-div');

    fieldDivs.forEach((fieldDiv) => {
      const label = fieldDiv.querySelector('label');
      const input = fieldDiv.querySelector('input.form-textbox, select.form-textbox, textarea.form-textbox');

      if (label && input) {
        const fieldFrag = document.createDocumentFragment();
        const p = document.createElement('p');
        p.textContent = label.textContent.trim();
        fieldFrag.appendChild(p);
        cells.push([fieldFrag]);
      }
    });

    // Add submit button row
    const submitBtn = form.querySelector('button#submitLead, button[type="submit"], .btn-primary');
    if (submitBtn) {
      const btnFrag = document.createDocumentFragment();
      const p = document.createElement('p');
      p.textContent = submitBtn.textContent.trim();
      btnFrag.appendChild(p);
      cells.push([btnFrag]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
