/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business cleanup.
 * Removes non-authorable content (global navigation, footer, overlays, scripts).
 * All selectors from captured DOM of https://www.business.att.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays and chat widgets (captured from DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#att-chat-wrapper',
      '.evidon-banner',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove global navigation header and sub-menus (captured from DOM)
    WebImporter.DOMUtils.remove(element, [
      'div.global-navigation',
      'div.subMenu-container',
      'nav',
    ]);

    // Remove footer (captured from DOM)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      'div.footer',
      'div.att-footer',
    ]);

    // Remove non-authorable elements (scripts, iframes, noscript, link tags)
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'iframe',
      'link',
    ]);

    // Remove swiper navigation buttons and pagination (not authorable)
    WebImporter.DOMUtils.remove(element, [
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-pagination',
      '.swipeButton',
    ]);

    // Remove hidden spoken/accessibility-only pricing elements (not authorable content)
    WebImporter.DOMUtils.remove(element, [
      '.hidden-spoken',
      '.sr-only',
    ]);

    // Clean tracking attributes from all elements
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
