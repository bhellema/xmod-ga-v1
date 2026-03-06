/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for the homepage template
import heroBannerParser from './parsers/hero-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsStoryParser from './parsers/cards-story.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import carouselIndustryParser from './parsers/carousel-industry.js';
import formParser from './parsers/form.js';
import accordionLinksParser from './parsers/accordion-links.js';

// TRANSFORMER IMPORTS - Import all transformers for AT&T Business site
import attCleanupTransformer from './transformers/att-cleanup.js';
import attSectionsTransformer from './transformers/att-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-icon': cardsIconParser,
  'cards-promo': cardsPromoParser,
  'cards-story': cardsStoryParser,
  'columns-feature': columnsFeatureParser,
  'carousel-industry': carouselIndustryParser,
  'form': formParser,
  'accordion-links': accordionLinksParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AT&T Business homepage with hero, product offerings, promotions, and business solutions',
  urls: [
    'https://www.business.att.com/'
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        'div.hero.aem-GridColumn:first-of-type',
        'div.hero.aem-GridColumn:nth-of-type(2)',
        'div.hero.aem-GridColumn:nth-of-type(3)'
      ]
    },
    {
      name: 'cards-icon',
      instances: [
        'div.multi-tile-cards.aem-GridColumn:first-of-type',
        'div.generic-list-value-prop.aem-GridColumn'
      ]
    },
    {
      name: 'cards-promo',
      instances: [
        'div.flex-cards.aem-GridColumn'
      ]
    },
    {
      name: 'columns-feature',
      instances: [
        'div.offer.aem-GridColumn:first-of-type',
        'div.offer.aem-GridColumn:nth-of-type(2)'
      ]
    },
    {
      name: 'carousel-industry',
      instances: [
        'div.story-stack.aem-GridColumn'
      ]
    },
    {
      name: 'cards-story',
      instances: [
        'div.multi-tile-cards.aem-GridColumn:nth-of-type(2)'
      ]
    },
    {
      name: 'form',
      instances: [
        'div.rai-form.aem-GridColumn'
      ]
    },
    {
      name: 'accordion-links',
      instances: [
        'div.link-farm.aem-GridColumn'
      ]
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'div.hero.aem-GridColumn:first-of-type',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Product Cards',
      selector: 'div.multi-tile-cards.aem-GridColumn:first-of-type',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['.multi-tile-main .eyebrow-heading-body h2', '.multi-tile-main .eyebrow-heading-body .type-base']
    },
    {
      id: 'section-3',
      name: 'Promotional Flex Cards',
      selector: 'div.flex-cards.aem-GridColumn',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: ['.flex-cards h1']
    },
    {
      id: 'section-4',
      name: 'Value Propositions',
      selector: 'div.generic-list-value-prop.aem-GridColumn',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['.generic-list-value-prop h2', '.generic-list-value-prop .type-base']
    },
    {
      id: 'section-5',
      name: 'Customer Satisfaction Award',
      selector: 'div.offer.aem-GridColumn:first-of-type',
      style: 'grey',
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Dynamic Defense Hero',
      selector: 'div.hero.aem-GridColumn:nth-of-type(2)',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Risk-Free Trial Banner',
      selector: 'div.micro-banner.aem-GridColumn',
      style: 'accent',
      blocks: [],
      defaultContent: ['.micro-banner h3', '.micro-banner .type-base']
    },
    {
      id: 'section-8',
      name: 'Switch to AT&T',
      selector: 'div.offer.aem-GridColumn:nth-of-type(2)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'Industry Solutions Carousel',
      selector: 'div.story-stack.aem-GridColumn',
      style: null,
      blocks: ['carousel-industry'],
      defaultContent: ['.story-stack .ss-masterHeader h2']
    },
    {
      id: 'section-10',
      name: 'AT&T Guarantee Hero',
      selector: 'div.hero.aem-GridColumn:nth-of-type(3)',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-11',
      name: 'Customer Stories',
      selector: 'div.multi-tile-cards.aem-GridColumn:nth-of-type(2)',
      style: null,
      blocks: ['cards-story'],
      defaultContent: ['.multi-tile-main .eyebrow-heading-body h2', '.multi-tile-main .eyebrow-heading-body .type-base']
    },
    {
      id: 'section-12',
      name: 'Contact Sales Form',
      selector: 'div.rai-form.aem-GridColumn',
      style: null,
      blocks: ['form'],
      defaultContent: ['.rai-form h2', '.rai-form .type-base']
    },
    {
      id: 'section-13',
      name: 'Footer Links Accordion',
      selector: 'div.link-farm.aem-GridColumn',
      style: null,
      blocks: ['accordion-links'],
      defaultContent: ['.link-farm h2']
    }
  ]
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, then sections (which needs afterTransform for section breaks)
const transformers = [
  attCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [attSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
