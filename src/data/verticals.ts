/**
 * Config for /for/:vertical landing pages.
 * Copy rules: contractor to contractor, candid, no em dashes, no statistics,
 * no testimonials, no guarantees, no prices, no product name on first touch.
 * To add a vertical: add an entry here. The route, sitemap and SEO pick it up.
 */
export interface VerticalConfig {
  slug: string;
  /** Display name, for example "Roofing". */
  label: string;
  /** Value sent to GHL. Landscaping and pool have no GHL option yet, the API maps them to "other". */
  vertical: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  sub: string;
  scene: string;
  pains: { title: string; body: string }[];
  fixes: { title: string; body: string }[];
  formTitle: string;
  formSub: string;
  submitLabel: string;
  messageLabel: string;
  closing: { headline: string; body: string };
}

/** Honest "what this is not" list shown on every vertical page. */
export const NOT_LIST = [
  'No promised jobs or revenue. Nobody can promise that honestly.',
  'No long pitch deck. We look at your calls, quotes and old leads first.',
  "If the numbers say a fix is small, we'll say so.",
];

const SHARED = {
  formTitle: 'Tell me about your company',
  formSub: "A couple of quick details and I'll follow up by email. You can pick a time to talk right after.",
  submitLabel: 'Send it',
  messageLabel: "What's slipping the most right now? (optional)",
  closing: {
    headline: "Let's find where calls and quotes are slipping.",
    body: "Send me your details and I'll take a look. No pressure, and no pitch if it doesn't fit.",
  },
};

export const VERTICALS: Record<string, VerticalConfig> = {
  roofing: {
    ...SHARED,
    slug: 'roofing',
    label: 'Roofing',
    vertical: 'roofing',
    metaTitle: 'AI Receptionist and Lead Follow-Up for Roofers | Summit Voice AI',
    metaDescription:
      'Missed calls, quiet estimates and old leads cost roofers jobs. See how Summit Voice AI answers, follows up and books inspections when you are on a roof.',
    eyebrow: 'For roofing contractors',
    headline: "You're on a roof. The phone rings. That job just went to the next guy on the list.",
    sub: "I came up in roofing, so I know how it goes. You can't answer every call, and a homeowner with a leak doesn't leave a voicemail. They call the next roofer. We build the phone and follow-up side so fewer of those get away.",
    scene: 'A homeowner calls at 6:40 on a Tuesday. Your crew is mid-tear-off. Nobody picks up.',
    pains: [
      {
        title: 'Calls you miss while you work',
        body: "Leaks and storm damage can't wait for a callback. If nobody answers, they dial the next name.",
      },
      {
        title: 'Estimates that go quiet',
        body: 'You sent the number. Then the week got busy and nobody followed up. That quote is still sitting there.',
      },
      {
        title: 'Old leads nobody calls back',
        body: 'Past customers and old quotes sit in a CRM or a spreadsheet and do nothing for you.',
      },
      {
        title: 'Storm weeks',
        body: 'When the weather turns, calls stack up faster than one office person can answer them.',
      },
    ],
    fixes: [
      {
        title: 'Every call gets picked up',
        body: "An AI receptionist answers when you can't, asks the basics, and books an inspection or passes you a clear message.",
      },
      {
        title: 'Missed calls get a quick text',
        body: 'If someone hangs up, they get a text back right away instead of silence.',
      },
      {
        title: 'Quotes get followed up',
        body: 'Open estimates get a nudge on a schedule, so the follow-up does not depend on you remembering.',
      },
      {
        title: 'Old leads get a second look',
        body: 'We can reach out to past customers and old quotes you have the right to contact.',
      },
    ],
    formTitle: 'Tell me about your shop',
    messageLabel: "What's slipping the most right now? (optional)",
    closing: {
      headline: "Let's see where your jobs are slipping.",
      body: "Send me your details and I'll take a look. No pressure, and no pitch if it doesn't fit.",
    },
  },

  hvac: {
    ...SHARED,
    slug: 'hvac',
    label: 'HVAC',
    vertical: 'hvac',
    metaTitle: 'AI Receptionist and Lead Follow-Up for HVAC Companies | Summit Voice AI',
    metaDescription:
      'No-heat calls at 9 PM, techs stuck on jobs, replacement quotes that go quiet. See how Summit Voice AI answers and follows up for HVAC contractors.',
    eyebrow: 'For HVAC contractors',
    headline: 'The furnace dies at 9 PM. Your phone goes to voicemail. They call someone else.',
    sub: "Contractor to contractor: you can't be on every call, and no-heat and no-cool customers don't wait. We build the phone and follow-up side so fewer calls and quotes slip through.",
    scene: 'A family has no heat on the coldest night of the week. They call three companies. The first one to answer gets the job.',
    pains: [
      {
        title: 'After-hours emergencies',
        body: 'No-heat and no-cool calls come at night and on weekends. Voicemail loses a lot of them.',
      },
      {
        title: "Techs who can't pick up",
        body: 'Your people are under a house or in an attic. Calls ring out while the work gets done.',
      },
      {
        title: 'Replacement quotes that go quiet',
        body: 'A big install quote needs follow-up. It usually gets one call, then nothing.',
      },
      {
        title: 'Maintenance customers who drift',
        body: 'Past customers who should be on a tune-up schedule never get a reminder.',
      },
    ],
    fixes: [
      {
        title: 'Calls answered, day or night',
        body: 'An AI receptionist picks up, gets the address and the problem, and books it or flags it as urgent to you.',
      },
      {
        title: 'Missed calls get a quick text',
        body: 'Callers who hang up get a text back instead of a dead end.',
      },
      {
        title: 'Install quotes get followed up',
        body: 'Open estimates get a nudge on a schedule, without you chasing them.',
      },
      {
        title: 'Past customers get a reminder',
        body: 'We can reach out to past customers you have the right to contact about tune-ups and service.',
      },
    ],
  },

  plumbing: {
    ...SHARED,
    slug: 'plumbing',
    label: 'Plumbing',
    vertical: 'plumbing',
    metaTitle: 'AI Receptionist and Lead Follow-Up for Plumbers | Summit Voice AI',
    metaDescription:
      'Burst pipes do not wait for a callback. See how Summit Voice AI answers calls, follows up on quotes and brings back past customers for plumbing companies.',
    eyebrow: 'For plumbing contractors',
    headline: "A pipe's leaking in somebody's kitchen. You're under a sink across town. Who answers?",
    sub: 'Contractor to contractor: plumbing calls are urgent, and the first company to pick up usually gets the work. We build the phone and follow-up side so fewer of those calls go to someone else.',
    scene: 'Water is on the floor. The homeowner is calling every plumber in town until somebody picks up.',
    pains: [
      {
        title: 'Urgent calls that ring out',
        body: 'Burst pipes and backed-up drains get a quick call to whoever answers first.',
      },
      {
        title: "You're hands-on all day",
        body: 'You or your techs are in the middle of a job. The phone rings and nobody can grab it.',
      },
      {
        title: 'Bigger quotes that stall',
        body: 'Water heaters, repipes and remodel work need follow-up. Most of it gets one call.',
      },
      {
        title: 'Past customers forgotten',
        body: "People you fixed a drain for last year have no reason to remember your name next time.",
      },
    ],
    fixes: [
      {
        title: 'Calls answered every time',
        body: 'An AI receptionist picks up, gets the address and the problem, and books it or flags it as urgent.',
      },
      {
        title: 'Missed calls get a quick text',
        body: 'If a caller hangs up, they get a text back instead of silence.',
      },
      {
        title: 'Quotes get followed up',
        body: 'Open estimates get a nudge on a schedule, so nothing depends on you remembering.',
      },
      {
        title: 'Past customers get a check-in',
        body: 'We can reach out to past customers you have the right to contact.',
      },
    ],
  },

  landscaping: {
    ...SHARED,
    slug: 'landscaping',
    label: 'Landscaping',
    vertical: 'landscaping',
    metaTitle: 'AI Receptionist and Lead Follow-Up for Landscapers | Summit Voice AI',
    metaDescription:
      'Spring rush, crews on mowers, design quotes that go quiet. See how Summit Voice AI answers calls and follows up for landscaping and lawn care companies.',
    eyebrow: 'For landscaping and lawn care companies',
    headline: "It's spring. Everyone wants a quote this week. Your crew is on a mower and the phone is ringing.",
    sub: 'Contractor to contractor: the season is short and the calls come all at once. We build the phone and follow-up side so fewer of them get away while you are out working.',
    scene: 'The first warm weekend hits and every homeowner decides it is time to call someone about the yard.',
    pains: [
      {
        title: 'The seasonal rush',
        body: "Calls bunch up in a few weeks. One office person can't keep up and some go unanswered.",
      },
      {
        title: "Crews who can't stop to talk",
        body: 'Mowers, trimmers and trucks make a phone call hard to take. It rings out.',
      },
      {
        title: 'Design and hardscape quotes that stall',
        body: 'Bigger projects need follow-up. They get a quote, then silence.',
      },
      {
        title: "Last season's customers not rebooked",
        body: "Customers from last year should be easy to bring back. Nobody reaches out.",
      },
    ],
    fixes: [
      {
        title: 'Calls answered while you work',
        body: 'An AI receptionist picks up, takes the address and the job, and books a quote visit or passes you a clear message.',
      },
      {
        title: 'Missed calls get a quick text',
        body: 'Callers who hang up get a text back instead of a dead end.',
      },
      {
        title: 'Quotes get followed up',
        body: 'Open estimates get a nudge on a schedule, without you chasing them.',
      },
      {
        title: 'Past customers get a reminder',
        body: 'We can reach out to past customers you have the right to contact when the new season starts.',
      },
    ],
  },

  pool: {
    ...SHARED,
    slug: 'pool',
    label: 'Pool',
    vertical: 'pool',
    metaTitle: 'AI Receptionist and Lead Follow-Up for Pool Companies | Summit Voice AI',
    metaDescription:
      'Opening season, service routes and renovation leads that go cold. See how Summit Voice AI answers calls and follows up for pool service and pool builders.',
    eyebrow: 'For pool service and pool builders',
    headline: 'Opening season is here. Your techs are at poolside. The phone keeps ringing.',
    sub: 'Contractor to contractor: pool work is seasonal and the calls land in waves. We build the phone and follow-up side so fewer of them get away while your team is out in the yard.',
    scene: 'The first hot week hits and every homeowner with a green pool calls at once.',
    pains: [
      {
        title: 'Opening and closing rushes',
        body: 'Calls come in waves at the start and end of the season. Some ring out.',
      },
      {
        title: 'Techs at poolside',
        body: "Your team is working with chemicals and equipment. They can't take a call.",
      },
      {
        title: 'Renovation and install leads that go cold',
        body: 'Bigger jobs need follow-up. They get one call and then sit.',
      },
      {
        title: 'Holes in the service route',
        body: 'When a customer cancels or moves, nobody works the list of people who asked about service.',
      },
    ],
    fixes: [
      {
        title: 'Calls answered while you work',
        body: 'An AI receptionist picks up, takes the details, and books a visit or passes you a clear message.',
      },
      {
        title: 'Missed calls get a quick text',
        body: 'Callers who hang up get a text back instead of a dead end.',
      },
      {
        title: 'Quotes get followed up',
        body: 'Open estimates get a nudge on a schedule, so nothing depends on you remembering.',
      },
      {
        title: 'Old leads and past customers get a second look',
        body: 'We can reach out to people you have the right to contact when it is time to fill the route.',
      },
    ],
  },
};

export const VERTICAL_SLUGS = Object.keys(VERTICALS);
