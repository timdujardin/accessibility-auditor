import type { AuditScope } from '@/@types/audit';
import type { CriterionTestability, TestabilityLevel } from '@/@types/criteria';

import { getCriteriaForScope } from './audit.config';

const ACT_BASE = 'https://www.w3.org/WAI/standards-guidelines/act/rules';

/**
 * Per-criterion automation testability metadata.
 *
 * Sources:
 * - "Mind the WCAG automation gap" (html5accessibility.com, 2025)
 * - W3C ACT Rules (w3.org/WAI/standards-guidelines/act/rules)
 *
 * level:
 *   'auto'    — fully testable by automated tools
 *   'partial' — automation detects some issues; human judgment required
 *   'manual'  — no meaningful automated coverage; requires full manual evaluation
 */
export const CRITERION_TESTABILITY: Record<string, CriterionTestability> = {
  // ── Principle 1: Perceivable ──────────────────────────────────────────

  '1.1.1': {
    level: 'partial',
    automation: {
      can: [
        'Detect presence or absence of alt attributes',
        'Identify empty/missing alt on <img> elements',
        'Identify images using role="presentation" or aria-hidden="true"',
      ],
      cannot: [
        'Assess if alt text is meaningful or contextually accurate',
        "Confirm whether the alt conveys the image's purpose",
        'Validate completeness of alternatives for complex content (e.g. charts)',
      ],
    },
    actRules: [
      {
        id: '23a2a8',
        name: 'Image has non-empty accessible name',
        url: `${ACT_BASE}/23a2a8/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'qt1vmo',
        name: 'Image accessible name is descriptive',
        url: `${ACT_BASE}/qt1vmo/`,
        status: 'approved',
        implementation: 'manual',
      },
      {
        id: '59796f',
        name: 'Image button has non-empty accessible name',
        url: `${ACT_BASE}/59796f/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'e88epe',
        name: 'Element marked as decorative is not exposed',
        url: `${ACT_BASE}/e88epe/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.2.1': {
    level: 'partial',
    automation: {
      can: ['Detect presence of <audio>/<video> elements', 'Check for linked transcript or text alternative'],
      cannot: [
        'Determine whether the alternative is equivalent in information content',
        'Evaluate accuracy or completeness of the transcript or description',
      ],
    },
    actRules: [],
  },

  '1.2.2': {
    level: 'partial',
    automation: {
      can: ['Detect <track kind="captions"> elements', 'Identify association with media'],
      cannot: [
        'Determine if captions are accurate, complete, or synchronized',
        'Evaluate whether all spoken content and sounds are included',
      ],
    },
    actRules: [],
  },

  '1.2.3': {
    level: 'partial',
    automation: {
      can: [
        'Detect presence of a description track or text-based alternative',
        'Identify <track kind="descriptions"> or aria-describedby',
      ],
      cannot: [
        'Evaluate whether visual content is comprehensively described',
        'Confirm that essential visual information is not omitted',
      ],
    },
    actRules: [],
  },

  '1.2.4': {
    level: 'partial',
    automation: {
      can: [
        'Identify live streaming and detect whether captions are delivered in real time',
        'Confirm <track kind="captions"> on live video',
      ],
      cannot: [
        'Evaluate real-time accuracy, latency, or synchronization of captions',
        'Determine whether captions cover all spoken content',
      ],
    },
    actRules: [],
  },

  '1.2.5': {
    level: 'partial',
    automation: {
      can: [
        'Detect presence of audio description tracks',
        'Identify related metadata like <track kind="descriptions">',
      ],
      cannot: [
        'Evaluate whether the description accurately conveys meaningful visuals',
        'Determine whether users gain equivalent access to visual content',
      ],
    },
    actRules: [],
  },

  '1.2.6': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether sign language interpretation is provided and adequate'] },
    actRules: [],
  },

  '1.2.7': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether extended audio description is provided where needed'] },
    actRules: [],
  },

  '1.2.8': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether a full text alternative for time-based media is provided'] },
    actRules: [],
  },

  '1.2.9': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether a live audio-only alternative is provided'] },
    actRules: [],
  },

  '1.3.1': {
    level: 'partial',
    automation: {
      can: [
        'Check for correct use of semantic HTML (e.g. <table>, <fieldset>, <label>)',
        'Identify ARIA roles and relationships (e.g. aria-labelledby, aria-describedby)',
      ],
      cannot: [
        'Confirm whether visual relationships (grouping, hierarchy) are represented programmatically',
        'Detect if semantics match the intended meaning',
      ],
    },
    actRules: [
      {
        id: 'e6952f',
        name: 'Form field has non-empty accessible name',
        url: `${ACT_BASE}/e6952f/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'd0f69e',
        name: 'Role attribute has valid value',
        url: `${ACT_BASE}/d0f69e/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '5f99a7',
        name: 'ARIA attribute is defined in WAI-ARIA',
        url: `${ACT_BASE}/5f99a7/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.3.2': {
    level: 'partial',
    automation: {
      can: ['Analyze DOM order of elements', 'Detect visually overlapping items that might confuse sequence'],
      cannot: [
        'Judge if the reading order makes sense to a user',
        'Determine if semantic flow aligns with visual flow',
      ],
    },
    actRules: [],
  },

  '1.3.3': {
    level: 'partial',
    automation: {
      can: ['Detect keywords like "see the red button" or "upper-left"', 'Flag possible sensory-only references'],
      cannot: [
        'Understand whether those references are the only way of conveying instructions',
        'Judge if equivalent non-sensory cues are present',
      ],
    },
    actRules: [],
  },

  '1.3.4': {
    level: 'partial',
    automation: {
      can: ['Check CSS and viewport responsiveness', "Confirm that content isn't locked to one orientation"],
      cannot: [
        'Confirm usability in both portrait and landscape modes',
        'Detect visual issues or content loss when switching orientations',
      ],
    },
    actRules: [
      {
        id: 'b33eff',
        name: 'Orientation of the page is not restricted using CSS transforms',
        url: `${ACT_BASE}/b33eff/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.3.5': {
    level: 'partial',
    automation: {
      can: ['Detect autocomplete attributes on input fields', 'Validate usage against known input purposes'],
      cannot: [
        "Determine if the autocomplete value matches the field's intended purpose",
        'Evaluate whether user expectations are met',
      ],
    },
    actRules: [
      {
        id: '73f2c2',
        name: 'Autocomplete attribute has valid value',
        url: `${ACT_BASE}/73f2c2/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.3.6': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ['Determine if the purpose of UI components, icons, and regions can be programmatically determined'],
    },
    actRules: [],
  },

  '1.4.1': {
    level: 'partial',
    automation: {
      can: [
        'Detect cases where color is the only distinguishing feature',
        'Flag form fields or charts using color keys',
      ],
      cannot: [
        'Understand if color meaning is also conveyed via shape, text, or pattern',
        'Determine whether users can perceive the difference without color',
      ],
    },
    actRules: [],
  },

  '1.4.2': {
    level: 'partial',
    automation: {
      can: [
        'Detect media elements set to autoplay with audio > 3 seconds',
        'Identify if a control is present to pause/stop audio',
      ],
      cannot: [
        'Confirm the effectiveness or discoverability of the control',
        'Detect if custom media players meet this need',
      ],
    },
    actRules: [],
  },

  '1.4.3': {
    level: 'auto',
    automation: {
      can: ['Calculate contrast between text and background', 'Flag failures below 4.5:1 (or 3:1 for large text)'],
      cannot: [
        'Handle contrast testing over complex backgrounds (e.g. gradients, images)',
        'Account for user-adjusted styles or overlays',
      ],
    },
    actRules: [
      {
        id: 'afw4f7',
        name: 'Text has minimum contrast',
        url: `${ACT_BASE}/afw4f7/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '09o5cg',
        name: 'Text has enhanced contrast',
        url: `${ACT_BASE}/09o5cg/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.4.4': {
    level: 'partial',
    automation: {
      can: ['Simulate zoom or large font scaling in test environments', 'Detect overlapping or cutoff text'],
      cannot: [
        'Determine whether the layout remains usable after scaling',
        'Evaluate if users can complete tasks at 200% zoom',
      ],
    },
    actRules: [
      {
        id: 'b4f0c3',
        name: 'Meta viewport allows for zoom',
        url: `${ACT_BASE}/b4f0c3/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.4.5': {
    level: 'partial',
    automation: {
      can: [
        'Detect <img> or CSS background images that contain visible text',
        'Identify image-based headings or buttons',
      ],
      cannot: [
        'Determine whether the image of text is essential',
        'Judge whether real text could have been used instead',
      ],
    },
    actRules: [
      {
        id: '0va7u6',
        name: 'HTML images contain no text',
        url: `${ACT_BASE}/0va7u6/`,
        status: 'approved',
        implementation: 'semi-auto',
      },
    ],
  },

  '1.4.6': {
    level: 'auto',
    automation: {
      can: [
        'Calculate contrast ratio for text and images of text',
        'Flag failures below 7:1 (or 4.5:1 for large text)',
      ],
      cannot: ['Handle contrast testing over complex backgrounds'],
    },
    actRules: [
      {
        id: '09o5cg',
        name: 'Text has enhanced contrast',
        url: `${ACT_BASE}/09o5cg/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.4.7': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ['Evaluate whether background audio is sufficiently low in prerecorded audio-only content'],
    },
    actRules: [],
  },

  '1.4.8': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether mechanisms for visual presentation requirements are available'] },
    actRules: [],
  },

  '1.4.9': {
    level: 'partial',
    automation: {
      can: ['Detect images containing text'],
      cannot: ['Determine whether an image of text is purely decorative or essential'],
    },
    actRules: [
      {
        id: '0va7u6',
        name: 'HTML images contain no text',
        url: `${ACT_BASE}/0va7u6/`,
        status: 'approved',
        implementation: 'semi-auto',
      },
    ],
  },

  '1.4.10': {
    level: 'partial',
    automation: {
      can: ['Simulate viewport resizing (e.g. 320px wide)', 'Detect horizontal scrolling or overflow'],
      cannot: ['Verify whether all content remains usable', 'Assess layout issues affecting user task completion'],
    },
    actRules: [
      {
        id: 'b4f0c3',
        name: 'Meta viewport allows for zoom',
        url: `${ACT_BASE}/b4f0c3/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.4.11': {
    level: 'partial',
    automation: {
      can: [
        'Calculate contrast ratios for UI components (e.g. buttons, focus outlines)',
        'Detect contrast failures in icons or input borders',
      ],
      cannot: [
        'Recognize visual indicators that convey meaning',
        'Confirm whether non-text elements are functionally important',
      ],
    },
    actRules: [],
  },

  '1.4.12': {
    level: 'partial',
    automation: {
      can: ['Apply standard spacing overrides via CSS', 'Detect overflow or layout breakage'],
      cannot: [
        'Determine if content remains readable and usable under spacing changes',
        'Validate manual readability and interaction',
      ],
    },
    actRules: [
      {
        id: '24afc2',
        name: 'Important letter spacing in style attributes is wide enough',
        url: `${ACT_BASE}/24afc2/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '78fd32',
        name: 'Important line height in style attributes is wide enough',
        url: `${ACT_BASE}/78fd32/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '9e45ec',
        name: 'Important word spacing in style attributes is wide enough',
        url: `${ACT_BASE}/9e45ec/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '1.4.13': {
    level: 'partial',
    automation: {
      can: [
        'Detect tooltips, popovers, or dropdowns triggered on hover/focus',
        'Identify presence of dismiss buttons or escape key bindings',
      ],
      cannot: [
        'Determine if content is persistent, dismissible, or accessible via keyboard',
        'Assess pointer stability or accidental dismissal',
      ],
    },
    actRules: [],
  },

  // ── Principle 2: Operable ─────────────────────────────────────────────

  '2.1.1': {
    level: 'partial',
    automation: {
      can: ['Identify focusable and interactive elements', 'Check for tabindex, aria-disabled, or missing role'],
      cannot: ['Confirm full usability by keyboard', 'Determine whether focus moves logically through the interface'],
    },
    actRules: [
      {
        id: '0ssw9k',
        name: 'Scrollable content can be reached with sequential focus navigation',
        url: `${ACT_BASE}/0ssw9k/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.1.2': {
    level: 'partial',
    automation: {
      can: ['Simulate basic keyboard navigation within known components', 'Identify focus indicators'],
      cannot: [
        'Confirm whether a user can exit a control via keyboard',
        'Evaluate navigation loops or missing Escape handlers',
      ],
    },
    actRules: [],
  },

  '2.1.3': {
    level: 'partial',
    automation: {
      can: ['Identify focusable and interactive elements'],
      cannot: ['Confirm full keyboard usability without specific timings'],
    },
    actRules: [
      {
        id: '0ssw9k',
        name: 'Scrollable content can be reached with sequential focus navigation',
        url: `${ACT_BASE}/0ssw9k/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.1.4': {
    level: 'partial',
    automation: {
      can: [
        'Detect use of character key triggers (e.g. keydown listeners)',
        'Flag if bound to single keys without modifiers',
      ],
      cannot: ['Assess whether shortcuts interfere with assistive tech', 'Verify presence of disable or remap options'],
    },
    actRules: [],
  },

  '2.2.1': {
    level: 'partial',
    automation: {
      can: ['Detect presence of timeouts or auto-refresh scripts', 'Identify timers in forms or interactive sessions'],
      cannot: [
        'Confirm whether users have warnings or controls to adjust timing',
        'Judge whether time limits are reasonable',
      ],
    },
    actRules: [
      {
        id: 'bc659a',
        name: 'Meta element has no refresh delay',
        url: `${ACT_BASE}/bc659a/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.2.2': {
    level: 'partial',
    automation: {
      can: ['Detect moving, blinking, scrolling, or auto-updating elements', 'Flag content with animation > 5 seconds'],
      cannot: [
        'Verify that users have clear controls to pause/stop/hide content',
        'Evaluate if motion disrupts user focus',
      ],
    },
    actRules: [],
  },

  '2.2.3': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether timing is an essential part of the event'] },
    actRules: [],
  },

  '2.2.4': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether interruptions can be postponed or suppressed'] },
    actRules: [
      {
        id: 'bc659a',
        name: 'Meta element has no refresh delay',
        url: `${ACT_BASE}/bc659a/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.2.5': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether users can continue without data loss after re-authenticating'] },
    actRules: [],
  },

  '2.2.6': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether users are warned of inactivity timeouts'] },
    actRules: [],
  },

  '2.3.1': {
    level: 'auto',
    automation: {
      can: [
        'Analyze animated or video content for flash frequency',
        'Detect if content flashes more than 3 times per second',
      ],
      cannot: [
        'Identify all flashing content (especially custom JS/CSS animations)',
        'Determine whether flashing is within combined areas that could trigger seizures',
      ],
    },
    actRules: [],
  },

  '2.3.2': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ['Verify that web pages contain no content that flashes more than 3 times per second'],
    },
    actRules: [],
  },

  '2.3.3': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether motion animation triggered by interaction can be disabled'] },
    actRules: [],
  },

  '2.4.1': {
    level: 'partial',
    automation: {
      can: ['Detect presence of "skip to main content" links', 'Identify ARIA landmarks (<main>, <nav>, etc.)'],
      cannot: [
        'Confirm that bypass links function correctly',
        'Verify that repeated blocks are actually bypassed for users',
      ],
    },
    actRules: [],
  },

  '2.4.2': {
    level: 'partial',
    automation: {
      can: ['Confirm presence of <title> in <head>', 'Check for duplicates or emptiness'],
      cannot: [
        'Judge whether the title is descriptive or meaningful',
        'Assess whether it accurately reflects page content',
      ],
    },
    actRules: [
      {
        id: '2779a5',
        name: 'HTML page has non-empty title',
        url: `${ACT_BASE}/2779a5/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'c4a8a4',
        name: 'HTML page title is descriptive',
        url: `${ACT_BASE}/c4a8a4/`,
        status: 'approved',
        implementation: 'manual',
      },
    ],
  },

  '2.4.3': {
    level: 'partial',
    automation: {
      can: ['Read the DOM/tab order', 'Flag unusual jumps or unreachable elements'],
      cannot: [
        'Evaluate whether the focus order matches visual/reading order',
        'Confirm whether users can complete tasks logically by keyboard',
      ],
    },
    actRules: [],
  },

  '2.4.4': {
    level: 'partial',
    automation: {
      can: ['Read link text and surrounding content', 'Flag vague terms like "click here" or "read more"'],
      cannot: [
        'Determine true link purpose from contextual meaning',
        'Verify if users can understand link destination from context',
      ],
    },
    actRules: [
      {
        id: 'c487ae',
        name: 'Link has non-empty accessible name',
        url: `${ACT_BASE}/c487ae/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.4.5': {
    level: 'partial',
    automation: {
      can: [
        'Detect presence of site search, sitemaps, or navigation menus',
        'Flag pages with only one navigation option',
      ],
      cannot: [
        'Evaluate usefulness of navigation options',
        'Confirm whether users can actually find other pages via those methods',
      ],
    },
    actRules: [],
  },

  '2.4.6': {
    level: 'partial',
    automation: {
      can: ['Check presence of headings, labels, and form field descriptors', 'Verify heading structure and nesting'],
      cannot: [
        'Confirm clarity or descriptiveness of labels/headings',
        'Assess if headings match content purpose or topic',
      ],
    },
    actRules: [],
  },

  '2.4.7': {
    level: 'partial',
    automation: {
      can: ['Confirm presence of visible focus indicators via CSS', 'Detect outline suppression (e.g. outline:none)'],
      cannot: [
        'Determine if the indicator is visible enough for real users',
        'Assess contrast, motion, or user perceptibility of the focus',
      ],
    },
    actRules: [
      {
        id: 'oj04fd',
        name: 'Element in sequential focus order has visible focus',
        url: `${ACT_BASE}/oj04fd/`,
        status: 'approved',
        implementation: 'manual',
      },
    ],
  },

  '2.4.8': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ["Evaluate whether information about the user's location within a set of web pages is available"],
    },
    actRules: [],
  },

  '2.4.9': {
    level: 'partial',
    automation: {
      can: ['Read link text content', 'Flag vague link text'],
      cannot: ['Determine link purpose from link text alone'],
    },
    actRules: [
      {
        id: 'c487ae',
        name: 'Link has non-empty accessible name',
        url: `${ACT_BASE}/c487ae/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.4.10': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether section headings are used to organize content'] },
    actRules: [],
  },

  '2.4.11': {
    level: 'partial',
    automation: {
      can: [
        'Detect if focused elements have overflow:hidden or are offscreen',
        'Identify layering issues that might hide focus',
      ],
      cannot: [
        'Confirm real visual obstruction (e.g. by sticky headers)',
        'Test whether users can see the current focus during use',
      ],
    },
    actRules: [],
  },

  '2.4.12': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ['Confirm that no part of the focused component is hidden by author-created content'],
    },
    actRules: [],
  },

  '2.4.13': {
    level: 'manual',
    automation: {
      can: [],
      cannot: ['Evaluate whether the focus indicator meets the minimum area and contrast requirements'],
    },
    actRules: [],
  },

  '2.5.1': {
    level: 'auto',
    automation: {
      can: ['Detect multi-point or path-based gestures', 'Confirm availability of single-point alternatives'],
      cannot: ['Judge intended meaning of gestures', 'Assess usability for users with limited dexterity'],
    },
    actRules: [],
  },

  '2.5.2': {
    level: 'auto',
    automation: {
      can: ['Check that actions only trigger on mouseup or completion events', 'Verify support for cancel or undo'],
      cannot: [
        'Evaluate user experience when cancellation is triggered',
        'Confirm whether accidental taps are easily reversible',
      ],
    },
    actRules: [],
  },

  '2.5.3': {
    level: 'partial',
    automation: {
      can: [
        'Compare the visible label with the accessible name',
        'Flag mismatches where visible text is not part of the accessible name',
      ],
      cannot: [
        'Determine if mismatches cause confusion or disorientation',
        'Account for intentional differences that are still accessible',
      ],
    },
    actRules: [
      {
        id: 'e6952f',
        name: 'Form field has non-empty accessible name',
        url: `${ACT_BASE}/e6952f/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '2.5.4': {
    level: 'auto',
    automation: {
      can: [
        'Detect usage of device motion sensors (e.g. DeviceMotionEvent)',
        'Confirm availability of alternate input methods',
      ],
      cannot: ['Test for usability of motion alternatives', 'Validate conformance on real physical devices'],
    },
    actRules: [],
  },

  '2.5.5': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether pointer input target sizes are at least 44x44 CSS pixels'] },
    actRules: [],
  },

  '2.5.6': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether concurrent input mechanisms are supported'] },
    actRules: [],
  },

  '2.5.7': {
    level: 'partial',
    automation: {
      can: ['Detect draggable elements or use of drag-and-drop APIs', 'Flag lack of keyboard-accessible alternatives'],
      cannot: [
        'Confirm whether the keyboard equivalent provides full functionality',
        'Assess if drag actions are usable with assistive tech',
      ],
    },
    actRules: [],
  },

  '2.5.8': {
    level: 'partial',
    automation: {
      can: ['Measure dimensions of clickable/touchable elements', 'Check minimum size threshold (24px × 24px)'],
      cannot: [
        'Account for proximity to other controls',
        'Evaluate whether exceptions apply (e.g. inline links, user-agent controls)',
      ],
    },
    actRules: [],
  },

  // ── Principle 3: Understandable ───────────────────────────────────────

  '3.1.1': {
    level: 'partial',
    automation: {
      can: ['Detect lang attribute on <html>', 'Compare it to known language codes'],
      cannot: [
        'Confirm if the declared language matches the actual content',
        'Handle pages with mixed or incorrect language declarations',
      ],
    },
    actRules: [
      {
        id: 'b5c3f8',
        name: 'HTML page has lang attribute',
        url: `${ACT_BASE}/b5c3f8/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'bf051a',
        name: 'HTML page lang attribute has valid language tag',
        url: `${ACT_BASE}/bf051a/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '3.1.2': {
    level: 'partial',
    automation: {
      can: [
        'Detect lang attributes on elements with inline language changes',
        'Flag missing or invalid lang attributes',
      ],
      cannot: [
        'Confirm whether language changes are semantically accurate',
        'Detect whether screen readers announce changes correctly',
      ],
    },
    actRules: [
      {
        id: 'de46e4',
        name: 'Element with lang attribute has valid language tag',
        url: `${ACT_BASE}/de46e4/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '3.1.3': {
    level: 'manual',
    automation: { can: [], cannot: ['Identify specific definitions of unusual words, idioms, and jargon'] },
    actRules: [],
  },

  '3.1.4': {
    level: 'manual',
    automation: { can: [], cannot: ['Identify expanded forms or meanings of abbreviations'] },
    actRules: [],
  },

  '3.1.5': {
    level: 'manual',
    automation: { can: [], cannot: ['Assess reading level of content'] },
    actRules: [],
  },

  '3.1.6': {
    level: 'manual',
    automation: { can: [], cannot: ['Identify pronunciation mechanisms for ambiguous words'] },
    actRules: [],
  },

  '3.2.1': {
    level: 'partial',
    automation: {
      can: [
        'Detect scripts that trigger actions on focus events',
        'Flag input elements that invoke DOM changes on focus',
      ],
      cannot: [
        'Judge whether those changes are unexpected or disruptive',
        'Evaluate actual user experience caused by focus-triggered behavior',
      ],
    },
    actRules: [],
  },

  '3.2.2': {
    level: 'partial',
    automation: {
      can: [
        'Detect form elements that trigger changes on onchange/oninput',
        'Flag when changes occur without user confirmation',
      ],
      cannot: [
        'Assess whether the triggered action is unexpected or confusing',
        'Judge if users can review and correct before submission',
      ],
    },
    actRules: [],
  },

  '3.2.3': {
    level: 'auto',
    automation: {
      can: ['Detect repeated navigation menus or regions across pages', 'Compare DOM structure of navigation blocks'],
      cannot: [
        'Confirm whether small visual differences impact usability',
        'Determine if order changes cause disorientation',
      ],
    },
    actRules: [],
  },

  '3.2.4': {
    level: 'partial',
    automation: {
      can: [
        'Compare labels, roles, and accessible names of components across views',
        'Identify differences in naming or function',
      ],
      cannot: [
        'Determine if functionally identical controls are inconsistently identified',
        'Evaluate whether inconsistencies confuse users',
      ],
    },
    actRules: [],
  },

  '3.2.5': {
    level: 'partial',
    automation: {
      can: ['Detect auto-refresh meta tags'],
      cannot: ['Evaluate whether changes of context are initiated only by user request'],
    },
    actRules: [
      {
        id: 'bc659a',
        name: 'Meta element has no refresh delay',
        url: `${ACT_BASE}/bc659a/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '3.2.6': {
    level: 'partial',
    automation: {
      can: ['Detect presence of help mechanisms across pages', 'Check for consistency in placement'],
      cannot: [
        'Determine whether the help provided is actually helpful or understandable',
        'Judge whether the help mechanism remains consistent in meaning across contexts',
      ],
    },
    actRules: [],
  },

  '3.3.1': {
    level: 'partial',
    automation: {
      can: [
        'Detect form fields with validation rules',
        'Identify presence of ARIA error messaging (aria-invalid, aria-describedby)',
      ],
      cannot: [
        'Confirm whether error messages are clear and helpful',
        'Determine if all errors are surfaced in an accessible way',
      ],
    },
    actRules: [],
  },

  '3.3.2': {
    level: 'partial',
    automation: {
      can: ['Detect presence of labels via <label> or aria-label', 'Flag missing instructions for required fields'],
      cannot: [
        'Judge whether instructions are understandable or sufficient',
        'Confirm if labels convey correct context',
      ],
    },
    actRules: [],
  },

  '3.3.3': {
    level: 'partial',
    automation: {
      can: ['Detect forms with required fields and validation', 'Identify whether suggestions are surfaced in markup'],
      cannot: ['Judge usefulness or accuracy of suggestions', 'Evaluate if suggestions are clear enough to help users'],
    },
    actRules: [],
  },

  '3.3.4': {
    level: 'partial',
    automation: {
      can: [
        'Detect confirmations, summaries, or confirm() dialogs',
        'Check for autocomplete="off" or forms without undo/review',
      ],
      cannot: [
        'Verify whether users are given a real opportunity to review',
        'Confirm if critical actions are truly reversible',
      ],
    },
    actRules: [],
  },

  '3.3.5': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether context-sensitive help is available'] },
    actRules: [],
  },

  '3.3.6': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate error prevention for all form submissions'] },
    actRules: [],
  },

  '3.3.7': {
    level: 'partial',
    automation: {
      can: [
        'Detect repeated fields with identical name or label attributes',
        'Check for autofill features or data reuse via autocomplete/session storage',
      ],
      cannot: [
        'Confirm whether the user was already asked for the same information',
        'Determine if a mechanism is provided to avoid re-entry',
      ],
    },
    actRules: [],
  },

  '3.3.8': {
    level: 'partial',
    automation: {
      can: [
        'Detect password fields, CAPTCHAs, and MFA inputs',
        'Identify whether autocomplete is disabled on login forms',
      ],
      cannot: [
        'Confirm whether alternatives (copy/paste, password managers, biometric) are supported',
        'Judge whether the authentication process excludes users with cognitive disabilities',
      ],
    },
    actRules: [],
  },

  '3.3.9': {
    level: 'manual',
    automation: { can: [], cannot: ['Evaluate whether enhanced accessible authentication is provided'] },
    actRules: [],
  },

  // ── Principle 4: Robust ───────────────────────────────────────────────

  '4.1.2': {
    level: 'partial',
    automation: {
      can: [
        'Verify that interactive elements expose name, role, and value via accessibility APIs',
        'Detect missing ARIA roles or attributes',
      ],
      cannot: [
        'Evaluate correctness of roles and attributes',
        'Ensure that dynamic elements update live values properly',
      ],
    },
    actRules: [
      {
        id: 'e6952f',
        name: 'Form field has non-empty accessible name',
        url: `${ACT_BASE}/e6952f/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'c487ae',
        name: 'Link has non-empty accessible name',
        url: `${ACT_BASE}/c487ae/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '97a4e1',
        name: 'Button has non-empty accessible name',
        url: `${ACT_BASE}/97a4e1/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: 'd0f69e',
        name: 'Role attribute has valid value',
        url: `${ACT_BASE}/d0f69e/`,
        status: 'approved',
        implementation: 'automated',
      },
      {
        id: '5f99a7',
        name: 'ARIA attribute is defined in WAI-ARIA',
        url: `${ACT_BASE}/5f99a7/`,
        status: 'approved',
        implementation: 'automated',
      },
    ],
  },

  '4.1.3': {
    level: 'partial',
    automation: {
      can: [
        'Detect ARIA roles like alert, status, log',
        'Confirm whether content changes are exposed programmatically',
      ],
      cannot: ['Judge if the message is clear or relevant', 'Verify whether users actually perceive the status update'],
    },
    actRules: [],
  },
};

/**
 * Returns the testability information for a WCAG criterion, including
 * automation level, what can/cannot be verified, and related ACT rules.
 * @param {string} criterionId - The WCAG criterion ID (e.g. "1.1.1").
 * @returns {CriterionTestability} The testability details, defaulting to manual if unknown.
 */
export const getTestability = (criterionId: string): CriterionTestability => {
  return (
    CRITERION_TESTABILITY[criterionId] ?? {
      level: 'manual' as TestabilityLevel,
      automation: { can: [], cannot: [] },
      actRules: [],
    }
  );
};

/**
 * Calculates the automation coverage breakdown for a given audit scope.
 * @param {AuditScope} scope - The audit scope tier to analyze.
 * @returns {{ auto: number, partial: number, manual: number, total: number }} The count of criteria by testability level and total.
 */
export const getAutomationCoverage = (
  scope: AuditScope,
): {
  auto: number;
  partial: number;
  manual: number;
  total: number;
} => {
  const criteriaIds = getCriteriaForScope(scope);
  let auto = 0;
  let partial = 0;
  let manual = 0;

  for (const id of criteriaIds) {
    const testability = getTestability(id);
    switch (testability.level) {
      case 'auto':
        auto++;
        break;
      case 'partial':
        partial++;
        break;
      case 'manual':
        manual++;
        break;
    }
  }

  return { auto, partial, manual, total: criteriaIds.length };
};
