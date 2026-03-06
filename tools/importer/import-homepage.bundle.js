var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".bg-hero-panel img, .bg-art img");
    const textPanel = element.querySelector(".content-panel-text .max-width-595, .content-panel-text");
    const textContent = document.createDocumentFragment();
    if (textPanel) {
      const eyebrow = textPanel.querySelector('[class*="eyebrow-"]');
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textContent.appendChild(p);
      }
      const heading = textPanel.querySelector("h1, h2, h3");
      if (heading) {
        textContent.appendChild(heading);
      }
      const body = textPanel.querySelector(".wysiwyg-editor, .type-base");
      if (body) {
        const paragraphs = body.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) textContent.appendChild(p);
        });
      }
      const legal = textPanel.querySelector(".type-legal-wysiwyg-editor");
      if (legal) {
        const legalPs = legal.querySelectorAll("p");
        legalPs.forEach((p) => {
          if (p.textContent.trim()) textContent.appendChild(p);
        });
      }
      const ctas = textPanel.querySelectorAll(".cta-container a");
      ctas.forEach((cta) => {
        if (cta.textContent.trim()) {
          const a = document.createElement("a");
          a.href = cta.href;
          a.textContent = cta.textContent.trim();
          if (cta.title) a.title = cta.title;
          const p = document.createElement("p");
          p.appendChild(a);
          textContent.appendChild(p);
        }
      });
    }
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    textFrag.appendChild(textContent);
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document }) {
    const tileCards = element.querySelectorAll(".tile-card");
    const vpItems = element.querySelectorAll(".generic-list-icon-vp");
    const items = tileCards.length > 0 ? tileCards : vpItems;
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".card-img img, span img, img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        imgFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const title = item.querySelector("h3, h4");
      if (title) textFrag.appendChild(title);
      const desc = item.querySelector(".tileSubheading, .description");
      if (desc) {
        const ps = desc.querySelectorAll("p");
        if (ps.length > 0) {
          ps.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const legal = item.querySelector(".cardlegal, .type-legal");
      if (legal) {
        const legalPs = legal.querySelectorAll("p");
        if (legalPs.length > 0) {
          legalPs.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (legal.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = legal.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const cta = item.querySelector(".cta-container a, a.primary-cta, a.btn-primary");
      if (cta && cta.textContent.trim()) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".card-wrapper");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".flex-card > img, .card > img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        imgFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const eyebrow = card.querySelector('[class*="eyebrow-"]');
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      const heading = card.querySelector("h1, h2, h3");
      if (heading) textFrag.appendChild(heading);
      const body = card.querySelector(".type-base");
      if (body) {
        const ps = body.querySelectorAll("p");
        if (ps.length > 0) {
          ps.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (body.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = body.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const legal = card.querySelector(".type-legal");
      if (legal) {
        const legalPs = legal.querySelectorAll("p");
        if (legalPs.length > 0) {
          legalPs.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (legal.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = legal.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const cta = card.querySelector(".flexCardItemCta a, a.btn-primary");
      if (cta && cta.textContent.trim()) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-story.js
  function parse4(element, { document }) {
    const cards = element.querySelectorAll(".tile-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card-img img, img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        imgFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const eyebrow = card.querySelector(".eyebrow-text, .type-eyebrow-md");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      const heading = card.querySelector("h3");
      if (heading) textFrag.appendChild(heading);
      const desc = card.querySelector(".tileSubheading");
      if (desc) {
        const ps = desc.querySelectorAll("p");
        if (ps.length > 0) {
          ps.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const legal = card.querySelector(".cardlegal, .type-legal-wysiwyg-editor");
      if (legal) {
        const legalPs = legal.querySelectorAll("p");
        if (legalPs.length > 0) {
          legalPs.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (legal.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = legal.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      const cta = card.querySelector(".cta-container a, a.btn-primary");
      if (cta && cta.textContent.trim()) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document }) {
    const textCol = element.querySelector(".grid-col-6.flex.flex-items-center, .grid-col-6:not(.order-img-top)");
    const imageCol = element.querySelector(".grid-col-6.order-img-top, .grid-col-6.rel");
    const textFrag = document.createDocumentFragment();
    if (textCol) {
      const eyebrow = textCol.querySelector('[class*="eyebrow-"]');
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      const heading = textCol.querySelector("h1, h2, h3");
      if (heading) textFrag.appendChild(heading);
      const body = textCol.querySelector(".wysiwyg-editor, .type-base");
      if (body) {
        const ps = body.querySelectorAll(":scope > p");
        ps.forEach((p) => {
          if (p.textContent.trim()) textFrag.appendChild(p);
        });
        const lists = body.querySelectorAll(":scope > div ul, :scope > ul");
        lists.forEach((list) => {
          const ul = document.createElement("ul");
          list.querySelectorAll("li").forEach((li) => {
            const newLi = document.createElement("li");
            const span = li.querySelector("span");
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
      const legal = textCol.querySelector(".type-legal-wysiwyg-editor");
      if (legal) {
        const legalPs = legal.querySelectorAll("p");
        legalPs.forEach((p) => {
          if (p.textContent.trim()) textFrag.appendChild(p);
        });
      }
      const ctas = textCol.querySelectorAll(".cta-container a");
      ctas.forEach((cta) => {
        if (cta.textContent.trim()) {
          const a = document.createElement("a");
          a.href = cta.href;
          a.textContent = cta.textContent.trim();
          const p = document.createElement("p");
          p.appendChild(a);
          textFrag.appendChild(p);
        }
      });
    }
    const imgFrag = document.createDocumentFragment();
    if (imageCol) {
      const img = imageCol.querySelector("img");
      if (img) imgFrag.appendChild(img);
    }
    const cells = [[textFrag, imgFrag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-industry.js
  function parse6(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img.swiper-image, .story-img-container > img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:media_image "));
      if (img) {
        imgFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      const heading = slide.querySelector('.heading-sm, [class*="heading-sm-storyStack"]');
      if (heading && heading.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textFrag.appendChild(h3);
      }
      const desc = slide.querySelector(".story-description, .wysiwyg-editor");
      if (desc) {
        const ps = desc.querySelectorAll("p");
        if (ps.length > 0) {
          ps.forEach((p) => {
            if (p.textContent.trim()) textFrag.appendChild(p);
          });
        } else if (desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textFrag.appendChild(p);
        }
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse7(element, { document }) {
    const form = element.querySelector("form, .bs-rai-leadform");
    const cells = [];
    if (form) {
      const fieldDivs = form.querySelectorAll(".field-div");
      fieldDivs.forEach((fieldDiv) => {
        const label = fieldDiv.querySelector("label");
        const input = fieldDiv.querySelector("input.form-textbox, select.form-textbox, textarea.form-textbox");
        if (label && input) {
          const fieldFrag = document.createDocumentFragment();
          const p = document.createElement("p");
          p.textContent = label.textContent.trim();
          fieldFrag.appendChild(p);
          cells.push([fieldFrag]);
        }
      });
      const submitBtn = form.querySelector('button#submitLead, button[type="submit"], .btn-primary');
      if (submitBtn) {
        const btnFrag = document.createDocumentFragment();
        const p = document.createElement("p");
        p.textContent = submitBtn.textContent.trim();
        btnFrag.appendChild(p);
        cells.push([btnFrag]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-links.js
  function parse8(element, { document }) {
    const columns = element.querySelectorAll(".desktop-view-and-tablet .accordion-item, .grid-col-3.accordion-item");
    const cells = [];
    columns.forEach((col) => {
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(" field:summary "));
      const heading = col.querySelector("h3, h4, .accordion-heading");
      if (heading && heading.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = heading.textContent.trim();
        summaryFrag.appendChild(p);
      } else {
        const firstLink = col.querySelector("a");
        if (firstLink && firstLink.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = firstLink.textContent.trim();
          summaryFrag.appendChild(p);
        }
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const links = col.querySelectorAll("li a, a.link-text2");
      const ul = document.createElement("ul");
      links.forEach((link) => {
        if (link.textContent.trim()) {
          const li = document.createElement("li");
          const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/att-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#att-chat-wrapper",
        ".evidon-banner"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.global-navigation",
        "div.subMenu-container",
        "nav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        "div.footer",
        "div.att-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "noscript",
        "iframe",
        "link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".swiper-button-prev",
        ".swiper-button-next",
        ".swiper-pagination",
        ".swipeButton"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".hidden-spoken",
        ".sr-only"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/att-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-icon": parse2,
    "cards-promo": parse3,
    "cards-story": parse4,
    "columns-feature": parse5,
    "carousel-industry": parse6,
    "form": parse7,
    "accordion-links": parse8
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AT&T Business homepage with hero, product offerings, promotions, and business solutions",
    urls: [
      "https://www.business.att.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "div.hero.aem-GridColumn:first-of-type",
          "div.hero.aem-GridColumn:nth-of-type(2)",
          "div.hero.aem-GridColumn:nth-of-type(3)"
        ]
      },
      {
        name: "cards-icon",
        instances: [
          "div.multi-tile-cards.aem-GridColumn:first-of-type",
          "div.generic-list-value-prop.aem-GridColumn"
        ]
      },
      {
        name: "cards-promo",
        instances: [
          "div.flex-cards.aem-GridColumn"
        ]
      },
      {
        name: "columns-feature",
        instances: [
          "div.offer.aem-GridColumn:first-of-type",
          "div.offer.aem-GridColumn:nth-of-type(2)"
        ]
      },
      {
        name: "carousel-industry",
        instances: [
          "div.story-stack.aem-GridColumn"
        ]
      },
      {
        name: "cards-story",
        instances: [
          "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)"
        ]
      },
      {
        name: "form",
        instances: [
          "div.rai-form.aem-GridColumn"
        ]
      },
      {
        name: "accordion-links",
        instances: [
          "div.link-farm.aem-GridColumn"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "div.hero.aem-GridColumn:first-of-type",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Cards",
        selector: "div.multi-tile-cards.aem-GridColumn:first-of-type",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: [".multi-tile-main .eyebrow-heading-body h2", ".multi-tile-main .eyebrow-heading-body .type-base"]
      },
      {
        id: "section-3",
        name: "Promotional Flex Cards",
        selector: "div.flex-cards.aem-GridColumn",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: [".flex-cards h1"]
      },
      {
        id: "section-4",
        name: "Value Propositions",
        selector: "div.generic-list-value-prop.aem-GridColumn",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: [".generic-list-value-prop h2", ".generic-list-value-prop .type-base"]
      },
      {
        id: "section-5",
        name: "Customer Satisfaction Award",
        selector: "div.offer.aem-GridColumn:first-of-type",
        style: "grey",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Dynamic Defense Hero",
        selector: "div.hero.aem-GridColumn:nth-of-type(2)",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Risk-Free Trial Banner",
        selector: "div.micro-banner.aem-GridColumn",
        style: "accent",
        blocks: [],
        defaultContent: [".micro-banner h3", ".micro-banner .type-base"]
      },
      {
        id: "section-8",
        name: "Switch to AT&T",
        selector: "div.offer.aem-GridColumn:nth-of-type(2)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Industry Solutions Carousel",
        selector: "div.story-stack.aem-GridColumn",
        style: null,
        blocks: ["carousel-industry"],
        defaultContent: [".story-stack .ss-masterHeader h2"]
      },
      {
        id: "section-10",
        name: "AT&T Guarantee Hero",
        selector: "div.hero.aem-GridColumn:nth-of-type(3)",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-11",
        name: "Customer Stories",
        selector: "div.multi-tile-cards.aem-GridColumn:nth-of-type(2)",
        style: null,
        blocks: ["cards-story"],
        defaultContent: [".multi-tile-main .eyebrow-heading-body h2", ".multi-tile-main .eyebrow-heading-body .type-base"]
      },
      {
        id: "section-12",
        name: "Contact Sales Form",
        selector: "div.rai-form.aem-GridColumn",
        style: null,
        blocks: ["form"],
        defaultContent: [".rai-form h2", ".rai-form .type-base"]
      },
      {
        id: "section-13",
        name: "Footer Links Accordion",
        selector: "div.link-farm.aem-GridColumn",
        style: null,
        blocks: ["accordion-links"],
        defaultContent: [".link-farm h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
