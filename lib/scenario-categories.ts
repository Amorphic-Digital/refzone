/**
 * The scenario category taxonomy.
 *
 * These are the training topics a branch coach thinks in — "run the squad
 * through some DOGSO" — rather than the coarse `scenario_type` column, which
 * only says which broad kind of incident it is.
 *
 * This list is the single source of truth. It drives:
 *   - the category dropdown in the admin scenario builder
 *   - the category menu on /scenarios
 *   - the public /topics/[slug] landing pages
 *   - the AI tag suggestion in /api/suggest-tags
 *
 * Adding a category: append an entry. Nothing else needs to change.
 * Renaming a slug: existing scenarios keep the old slug in the database, so
 * migrate those rows first.
 */

export interface ScenarioCategory {
  /** URL-safe id, stored in scenarios.category */
  slug: string
  /** Shown in menus, badges and admin */
  label: string
  /** One line, shown under the label in the category menu */
  description: string
  /** Primary Law of the Game this topic sits under */
  lawRef: string
  /** Lucide icon name, resolved in components/scenario-category-icon.tsx */
  icon: string
  /** Opening paragraph for the public /topics/[slug] page */
  intro: string
  /** What a referee should be watching for — bullets on the topic page */
  keyPoints: string[]
  /** Extra search keywords for the topic page metadata */
  keywords: string[]
}

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    slug: "reckless-tackles",
    label: "Reckless Tackles",
    description: "Careless, reckless or excessive force — and the card that follows.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "Footprints",
    intro:
      "Judging a tackle is the decision referees are asked about most. The Laws of the Game separate challenges into careless (a free kick), reckless (a caution) and using excessive force (a sending off) — and getting the threshold right is what separates a controlled match from one that gets away from you.",
    keyPoints: [
      "Speed of the challenge and whether the player was in control",
      "Point of contact — ball first, ankle, shin, or above the boot",
      "Intensity and whether the safety of an opponent was endangered",
      "Whether the challenge was made from the front, side or behind",
    ],
    keywords: ["reckless tackle", "serious foul play", "excessive force", "yellow card tackle", "red card tackle"],
  },
  {
    slug: "dogso",
    label: "DOGSO",
    description: "Denying an obvious goalscoring opportunity — the four considerations.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "ShieldAlert",
    intro:
      "DOGSO — denying an obvious goalscoring opportunity — turns on four considerations that must all be met: distance to goal, direction of play, likelihood of keeping or gaining control of the ball, and the location and number of defenders. Getting one of them wrong changes a red card into a caution.",
    keyPoints: [
      "Distance between the offence and the goal",
      "General direction of play — was the attacker moving toward goal?",
      "Likelihood of keeping or gaining control of the ball",
      "Location and number of defenders covering",
      "In the penalty area, a genuine attempt to play the ball reduces a red card to a caution",
    ],
    keywords: ["DOGSO", "denying an obvious goalscoring opportunity", "last man foul", "triple punishment"],
  },
  {
    slug: "handball",
    label: "Handball",
    description: "Deliberate handling, unnatural position and the accidental-goal rules.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "Hand",
    intro:
      "Handball is the law that has changed most in recent seasons. The question is no longer simply whether it was deliberate — it is whether the arm made the body unnaturally bigger, where the arm was in relation to body movement, and whether a goal was scored immediately afterwards.",
    keyPoints: [
      "Did the hand or arm make the body unnaturally bigger?",
      "Was the arm above shoulder height?",
      "Was the arm position a justifiable consequence of body movement?",
      "Distance between opponent and ball — was the contact unexpected?",
      "A goal scored directly off the hand or arm is disallowed, even if accidental",
    ],
    keywords: ["handball", "deliberate handball", "handball penalty", "unnatural position", "arm position handball"],
  },
  {
    slug: "offside",
    label: "Offside",
    description: "Position, interference, and the moment the ball is played.",
    lawRef: "Law 11: Offside",
    icon: "Flag",
    intro:
      "Being in an offside position is not an offence. The offence comes from interfering with play, interfering with an opponent, or gaining an advantage — judged at the moment the ball is played by a teammate.",
    keyPoints: [
      "Position is judged at the moment the ball is played, not when it is received",
      "Interfering with an opponent — blocking the line of vision or challenging for the ball",
      "Deliberate play by a defender resets the phase; a deflection or save does not",
      "The halfway line, the second-last opponent, and the ball all matter",
    ],
    keywords: ["offside rule", "offside explained", "interfering with play", "offside position", "deliberate play"],
  },
  {
    slug: "penalty-area-incidents",
    label: "Penalty Area Incidents",
    description: "Fouls in the box, penalty kick decisions and encroachment.",
    lawRef: "Law 14: The Penalty Kick",
    icon: "Target",
    intro:
      "Decisions inside the penalty area carry the most weight in the match. As well as judging the offence itself, referees have to manage the taking of the kick — encroachment, feinting, goalkeeper position, and what happens when things go wrong.",
    keyPoints: [
      "Where the offence occurred, not where the player fell",
      "Goalkeeper must have part of one foot on or in line with the goal line",
      "Encroachment by attackers and defenders, and the correct outcome for each",
      "Illegal feinting after completing the run-up",
    ],
    keywords: ["penalty kick", "penalty area foul", "encroachment", "penalty retake", "goalkeeper off line"],
  },
  {
    slug: "advantage",
    label: "Advantage",
    description: "When to play on, when to pull it back, and managing the aftermath.",
    lawRef: "Law 5: The Referee",
    icon: "FastForward",
    intro:
      "Advantage is a judgement about what happens next. The referee weighs the severity of the offence, the position on the field, the prospects of an immediate attack, and the atmosphere of the match — and has a few seconds to decide whether to let it run.",
    keyPoints: [
      "Severity of the offence — a sending-off offence usually stops play",
      "Position on the field and proximity to goal",
      "Whether a promising attack genuinely develops within a few seconds",
      "Cards can still be shown at the next stoppage",
    ],
    keywords: ["advantage rule", "playing advantage", "referee advantage signal", "pull it back"],
  },
  {
    slug: "holding-and-pushing",
    label: "Holding & Pushing",
    description: "Shirt pulls, blocks and wrestling — especially at set pieces.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "Grab",
    intro:
      "Holding offences are the most commonly missed fouls in the game, because they build slowly and often happen away from the ball. Corners and free kicks are where they decide matches.",
    keyPoints: [
      "Holding that prevents an opponent moving toward the ball or into space",
      "Whether the hold started before or after the ball was played",
      "Mutual holding — deciding who initiated it",
      "Warning players before the set piece as a management tool",
    ],
    keywords: ["holding foul", "shirt pull", "pushing foul", "corner kick holding", "wrestling in the box"],
  },
  {
    slug: "simulation",
    label: "Simulation & Deception",
    description: "Diving, feigning injury and attempts to deceive the referee.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "Drama",
    intro:
      "Simulation is a cautionable offence for unsporting behaviour. The difficulty is separating a genuine fall under contact from an attempt to deceive — and being confident enough to caution when there was no contact at all.",
    keyPoints: [
      "Was there contact, and was it enough to cause the fall?",
      "Exaggerating the effect of minimal contact is still simulation",
      "Feigning injury to waste time or get an opponent cautioned",
      "The consequence of getting it wrong in both directions",
    ],
    keywords: ["simulation", "diving", "feigning injury", "unsporting behaviour", "deceiving the referee"],
  },
  {
    slug: "dissent-and-confrontation",
    label: "Dissent & Confrontation",
    description: "Managing dissent, surrounding the referee and mass confrontation.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "MessagesSquare",
    intro:
      "How a referee handles dissent sets the tone for everything that follows. The Laws are clear that dissent by word or action is a caution, but the skill is in stepping the response — body language, a public word, then the card.",
    keyPoints: [
      "Dissent by word or action is a caution",
      "Distinguishing frustration from a public challenge to the authority of the referee",
      "Mass confrontation — identifying instigators rather than cautioning everyone",
      "Offensive, insulting or abusive language is a sending off",
    ],
    keywords: ["dissent", "mass confrontation", "referee abuse", "yellow card dissent", "match control"],
  },
  {
    slug: "goalkeeper-handling",
    label: "Goalkeeper Handling",
    description: "Back-passes, six-second rule and handling outside the area.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "Shield",
    intro:
      "The handling restrictions on goalkeepers produce indirect free kicks inside the penalty area — a restart many referees rarely give, and one worth being certain about before you blow.",
    keyPoints: [
      "Deliberate kick by a teammate versus a deflection or header",
      "Releasing the ball into play within six seconds",
      "Touching the ball again after releasing it, before another player touches it",
      "Handling outside the penalty area and whether DOGSO applies",
    ],
    keywords: ["back pass rule", "goalkeeper six seconds", "indirect free kick", "goalkeeper handling"],
  },
  {
    slug: "restarts",
    label: "Restarts",
    description: "Free kicks, throw-ins, corners, drop balls and the wall.",
    lawRef: "Laws 8, 13–17",
    icon: "RotateCcw",
    intro:
      "Restarts are where a lot of small errors accumulate: wrong restart, wrong position, wrong distance. They rarely make highlight reels, but they are the bread and butter of an assessment.",
    keyPoints: [
      "Direct versus indirect free kick, and correct signalling",
      "The 1-metre wall requirement at attacking free kicks",
      "Throw-in technique, position and the correct restart when it is foul",
      "When a drop ball is required and who receives it",
    ],
    keywords: ["free kick", "throw in", "corner kick", "drop ball", "wall distance", "indirect free kick signal"],
  },
  {
    slug: "violent-conduct",
    label: "Violent Conduct",
    description: "Off-the-ball incidents, striking and serious foul play.",
    lawRef: "Law 12: Fouls and Misconduct",
    icon: "AlertOctagon",
    intro:
      "Violent conduct can occur anywhere on the field, whether or not the ball is in play, and whether or not contact is made. These are the incidents a referee cannot afford to miss.",
    keyPoints: [
      "Violent conduct does not require contact — an attempt is enough",
      "Applies to opponents, teammates, officials and spectators alike",
      "Separating violent conduct from serious foul play in a challenge for the ball",
      "Using assistant referees and managing the restart",
    ],
    keywords: ["violent conduct", "serious foul play", "red card offence", "striking an opponent", "off the ball"],
  },
  {
    slug: "time-wasting",
    label: "Time Wasting",
    description: "Delaying the restart, additional time and game management.",
    lawRef: "Law 7: The Duration of the Match",
    icon: "Timer",
    intro:
      "Time wasting is a management problem before it is a disciplinary one. Referees are expected to add time accurately for substitutions, injuries, celebrations and deliberate delays — and to caution players who delay the restart.",
    keyPoints: [
      "Delaying the restart of play is a caution",
      "Allowances for substitutions, injuries, cards and goal celebrations",
      "Warning before cautioning, and being consistent across both teams",
      "Communicating additional time clearly",
    ],
    keywords: ["time wasting", "delaying the restart", "added time", "stoppage time", "game management"],
  },
  {
    slug: "positioning-and-signals",
    label: "Positioning & Signals",
    description: "Where to be, what to show, and working with your assistants.",
    lawRef: "Law 6: The Other Match Officials",
    icon: "Move",
    intro:
      "Good positioning buys credibility. Being in the right place at the right angle, with a clear signal and eye contact with your assistants, makes correct decisions look correct — and that matters as much as the decision itself.",
    keyPoints: [
      "Diagonal system of control and adjusting for play",
      "Angle and distance — seeing between the players, not through them",
      "Clear, decisive signals for direct and indirect free kicks",
      "Pre-match instructions and eye contact with assistants",
    ],
    keywords: ["referee positioning", "diagonal system of control", "referee signals", "assistant referee mechanics"],
  },
  {
    slug: "var-and-match-control",
    label: "VAR & Match Control",
    description: "Review protocol, clear and obvious errors, and restart procedure.",
    lawRef: "Law 5: The Referee",
    icon: "Monitor",
    intro:
      "VAR only intervenes for clear and obvious errors and serious missed incidents, in four categories: goals, penalty decisions, direct red cards and mistaken identity. Understanding the protocol matters even in matches without VAR, because the principles shape how decisions are reviewed.",
    keyPoints: [
      "The four reviewable categories",
      "Clear and obvious error versus a matter of opinion",
      "On-field review procedure and the TV signal",
      "Correct restart after a decision is changed",
    ],
    keywords: ["VAR protocol", "video assistant referee", "clear and obvious error", "on field review"],
  },
]

/** Fast lookup by slug. */
const BY_SLUG = new Map(SCENARIO_CATEGORIES.map((c) => [c.slug, c]))

export function getCategory(slug: string | null | undefined): ScenarioCategory | null {
  if (!slug) return null
  return BY_SLUG.get(slug) ?? null
}

/** Human label for a slug, falling back to the raw value for legacy rows. */
export function categoryLabel(slug: string | null | undefined): string {
  if (!slug) return "Uncategorised"
  return BY_SLUG.get(slug)?.label ?? slug
}

export function isValidCategory(slug: string | null | undefined): boolean {
  return !!slug && BY_SLUG.has(slug)
}

/** All slugs, for AI prompts and validation. */
export const CATEGORY_SLUGS = SCENARIO_CATEGORIES.map((c) => c.slug)
