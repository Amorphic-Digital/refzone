// ============================================================
// LAWS OF THE GAME — Detailed content for individual law pages
// Each law targets long-tail SEO queries like:
//   "Law 12 fouls and misconduct explained"
//   "offside rule explained simply"
//   "what is a red card offence in football"
// ============================================================

export interface LawContent {
  num: number
  slug: string
  title: string
  shortDesc: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  sections: { heading: string; body: string }[]
  keyPoints: string[]
  commonQuestions: { q: string; a: string }[]
  relatedLaws: number[]
  /** Practical advice for match-day application */
  refereeTips: string[]
  /** How this law applies in Australian football specifically */
  australiaContext: string
  /** URL to official IFAB Laws of the Game page */
  ifabUrl: string
  /** Search keywords for the live search feature */
  searchTerms: string[]
}

export const lawsOfTheGame: LawContent[] = [
  {
    num: 1,
    slug: 'field-of-play',
    title: 'The Field of Play',
    shortDesc: 'Pitch dimensions, markings, goals, and surfaces.',
    metaTitle: 'Law 1: The Field of Play — Pitch Dimensions & Markings Explained',
    metaDescription:
      'Learn about Law 1 of the IFAB Laws of the Game. Football pitch dimensions, field markings, goal sizes, and surface requirements explained for referees in Australia.',
    h1: 'Law 1: The Field of Play — Pitch Dimensions & Markings',
    intro:
      'Law 1 of the IFAB Laws of the Game defines the playing surface, pitch markings, dimensions, and goal specifications for football matches. As a referee in Australia, understanding the field of play is fundamental — it determines where restarts occur, when the ball is out of play, and how to manage technical areas and spectator zones.',
    sections: [
      {
        heading: 'Pitch dimensions and surface',
        body: 'The field of play must be rectangular and marked with continuous lines. For international matches, the pitch must be 100–110 metres long and 64–75 metres wide. For other matches, the length must be 90–120 metres and the width 45–90 metres. The playing surface can be natural grass, artificial turf, or a hybrid system, but it must be green. In Australia, many community grounds use natural grass, while newer facilities may feature FIFA Quality-approved artificial surfaces.',
      },
      {
        heading: 'Field markings',
        body: 'The field is marked with a halfway line, centre circle (radius 9.15m), penalty areas, goal areas, corner arcs, and optional flagposts. The penalty area extends 16.5 metres from each goalpost and 16.5 metres into the field. The goal area extends 5.5 metres from each goalpost and 5.5 metres into the field. The penalty mark is 11 metres from the midpoint of the goal line. All lines must be the same width, not exceeding 12 centimetres.',
      },
      {
        heading: 'Goals',
        body: 'Goals must be placed on the centre of each goal line. They consist of two upright posts equidistant from the corner flagposts and joined at the top by a horizontal crossbar. The distance between the inside of the posts is 7.32 metres and the distance from the lower edge of the crossbar to the ground is 2.44 metres. Goalposts and crossbars must be white, made of approved material, and not dangerous to players.',
      },
    ],
    keyPoints: [
      'Pitch must be rectangular — length always exceeds width',
      'All lines are part of the area they define',
      'The centre mark is the midpoint of the halfway line',
      'Corner flagposts must not be less than 1.5 metres high',
      'Goal nets are permitted but not required by law',
    ],
    commonQuestions: [
      {
        q: 'What are the official dimensions of a football pitch?',
        a: 'For international matches: 100–110m long by 64–75m wide. For other matches: 90–120m long by 45–90m wide.',
      },
      {
        q: 'Are artificial pitches allowed in professional football?',
        a: 'Yes. FIFA Quality or FIFA Quality Pro certified artificial turf is permitted at all levels, including international matches.',
      },
    ],
    refereeTips: [
      'Walk the pitch before kick-off — check markings, goalposts, nets, and any hazards',
      'Ensure penalty area markings are visible, especially in wet conditions',
      'Verify both goals are securely anchored and the correct dimensions',
      'Check corner flagposts are in place and at least 1.5m high',
    ],
    australiaContext: 'In Australian community football, pitch conditions vary significantly between grounds. Many suburban fields may have faded markings, uneven surfaces, or temporary goals. Referees should conduct a thorough pitch inspection at least 30 minutes before kick-off and raise any safety concerns with the home team. Football NSW, Football Victoria, and other state associations provide pitch condition guidelines in their competition regulations.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-field-of-play/',
    searchTerms: ['pitch dimensions', 'field markings', 'goal size', 'penalty area', 'goal area', 'centre circle', 'corner arc', 'flagpost', 'touchline', 'goal line', 'halfway line', 'penalty mark', 'artificial turf', 'playing surface', 'technical area', 'pitch inspection'],
    relatedLaws: [9, 16, 17],
  },
  {
    num: 2,
    slug: 'the-ball',
    title: 'The Ball',
    shortDesc: 'Size, weight, pressure, and replacement procedures.',
    metaTitle: 'Law 2: The Ball — Size, Weight & Specifications Explained',
    metaDescription:
      'Law 2 of the IFAB Laws of the Game covers football specifications: size, weight, pressure, and replacement rules. Essential knowledge for Australian referees.',
    h1: 'Law 2: The Ball — Size, Weight & Match Specifications',
    intro:
      'Law 2 specifies the qualities and measurements of the ball used in football. Referees must ensure the ball meets the required standards before and during the match. In Australian competitions, understanding ball specifications helps referees make confident decisions about replacements and stoppages.',
    sections: [
      {
        heading: 'Ball specifications',
        body: 'The ball must be spherical, made of suitable material, have a circumference of 68–70 cm, weigh 410–450 grams at the start of the match, and have a pressure equal to 0.6–1.1 atmosphere (600–1100 g/cm2) at sea level. For matches in FIFA competitions and competitions of FIFA member associations, only footballs bearing one of the FIFA Quality Programme marks are permitted.',
      },
      {
        heading: 'Replacement of a defective ball',
        body: 'If the ball becomes defective during play, the match is stopped and restarted with a dropped ball at the position where the original ball became defective (unless play was stopped inside the goal area, in which case the dropped ball is on the goal area line parallel to the goal line). If the ball becomes defective during a penalty kick or kicks from the penalty mark, the kick is retaken. If the ball becomes defective at a kick-off, goal kick, corner kick, free kick, penalty kick, or throw-in, the restart is retaken.',
      },
    ],
    keyPoints: [
      'Size 5 ball is used for senior football (circumference 68–70 cm)',
      'Ball must weigh 410–450g at kick-off',
      'Referee decides if the ball meets requirements',
      'Spare balls must be available around the field of play',
      'If defective during play, restart with a dropped ball',
    ],
    commonQuestions: [
      {
        q: 'What size ball is used in professional football?',
        a: 'Size 5 — circumference of 68–70 cm, weight of 410–450 grams.',
      },
      {
        q: 'What happens if the ball bursts during a goal kick?',
        a: 'The goal kick is retaken with a replacement ball.',
      },
    ],
    refereeTips: [
      'Test the ball pressure before kick-off using an approved gauge if available',
      'Have at least one spare ball available at the side of the field',
      'If you suspect the ball is defective during play, stop at the next natural break',
      'Note the position where the ball became defective for the correct restart',
    ],
    australiaContext: 'Australian community competitions typically require the home team to provide match balls. Referees should confirm ball availability during the pre-match inspection. In junior football across Football NSW and Football Queensland, size 4 balls are commonly used for Under 12 and below, while senior matches use size 5.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-ball/',
    searchTerms: ['ball size', 'ball weight', 'ball pressure', 'defective ball', 'replacement ball', 'dropped ball', 'size 5', 'FIFA Quality', 'ball specifications', 'ball burst'],
    relatedLaws: [8, 9],
  },
  {
    num: 3,
    slug: 'the-players',
    title: 'The Players',
    shortDesc: 'Number of players, substitutions, and team officers.',
    metaTitle: 'Law 3: The Players — Substitutions, Team Size & Rules Explained',
    metaDescription:
      'Law 3 covers number of players, substitution procedures, and team officers. Understand player requirements for Australian football matches.',
    h1: 'Law 3: The Players — Substitutions & Team Requirements',
    intro:
      'Law 3 of the IFAB Laws of the Game governs the number of players required for a match, substitution procedures, and the roles of team officers. In Australian football, competitions may vary in the number of permitted substitutions, making it essential for referees to know both the law and competition-specific regulations.',
    sections: [
      {
        heading: 'Number of players',
        body: 'A match is played by two teams, each with a maximum of eleven players, one of whom must be the goalkeeper. A match may not start or continue if either team has fewer than seven players. In Australian community football, competition rules may allow smaller-sided formats (e.g. 7-a-side, 9-a-side), but the minimum player requirement still applies proportionally.',
      },
      {
        heading: 'Substitution procedures',
        body: 'Substitutions can be made during any stoppage in play. The player being replaced must have the referee\'s permission to leave and must leave from the nearest boundary line (unless otherwise directed by the referee). The substitute enters at the halfway line during a stoppage. A player who has been replaced may not return to play. Competition rules may state the maximum number of substitutes — typically 3 in professional matches, with many Australian community leagues allowing up to 5.',
      },
      {
        heading: 'Team officers',
        body: 'Only one person at a time is authorised to convey tactical instructions from the technical area. Team officers must behave responsibly. If a team official is guilty of misconduct, the referee may issue a warning, caution (yellow card), or send-off (red card) to team officials, just as with players.',
      },
    ],
    keyPoints: [
      'Maximum 11 players per team, minimum 7 to start or continue',
      'One player must be designated as goalkeeper',
      'Substitutes enter at the halfway line during a stoppage',
      'A substituted player cannot return to the match',
      'Team officials can receive yellow and red cards',
    ],
    commonQuestions: [
      {
        q: 'How many substitutions are allowed in football?',
        a: 'Competition rules determine the number — typically 3 in professional matches. Many Australian leagues allow up to 5.',
      },
      {
        q: 'Can a match continue with fewer than 7 players?',
        a: 'No. If a team has fewer than 7 players, the match cannot start or continue.',
      },
    ],
    refereeTips: [
      'Count players during substitutions — teams occasionally end up with 12 on the field',
      'Confirm substitution procedures with both teams before kick-off',
      'Record all substitutions in your match notebook immediately',
      'Be aware of competition-specific rules regarding rolling substitutions',
    ],
    australiaContext: 'Australian community leagues commonly allow unlimited rolling substitutions in junior matches and 5 substitutions in senior competitions. NPL competitions across states including Football NSW and Football Victoria follow FIFA guidelines with 5 substitution windows. Always check your competition\'s specific regulations before the match.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-players/',
    searchTerms: ['substitutions', 'number of players', 'minimum players', 'team size', 'goalkeeper', 'rolling substitutions', 'team officers', 'substitute procedure', 'seven players', 'eleven players', 'red card replacement'],
    relatedLaws: [4, 5, 12],
  },
  {
    num: 4,
    slug: 'players-equipment',
    title: "The Players' Equipment",
    shortDesc: 'Required kit, prohibited items, and safety checks.',
    metaTitle: "Law 4: Players' Equipment — Kit Rules & Safety Requirements",
    metaDescription:
      "Law 4 of the IFAB Laws of the Game explains required football kit, prohibited equipment, and referee safety checks. Equipment rules for Australian referees.",
    h1: "Law 4: The Players' Equipment — Kit Rules & Safety Checks",
    intro:
      "Law 4 specifies what players must and must not wear during a match. As a referee, you are responsible for checking players' equipment before the match and ensuring compliance throughout. In Australian football, equipment checks are a standard part of pre-match preparation.",
    sections: [
      {
        heading: 'Compulsory equipment',
        body: 'A player must wear a jersey or shirt with sleeves, shorts, socks (tape or material applied externally must be the same colour as the sock), shinguards (made of rubber, plastic, or similar material and covered by the socks), and footwear. The two teams must wear colours that distinguish them from each other, the referee, and the assistant referees. Goalkeepers must wear colours distinguishable from all other players and match officials.',
      },
      {
        heading: 'Prohibited equipment and items',
        body: 'Players must not wear or use anything dangerous to themselves or others, including jewellery. All jewellery (necklaces, rings, bracelets, earrings, leather bands, rubber bands, etc.) is prohibited and must be removed. Taping over jewellery is not permitted. Electronic communication equipment is not allowed except where goal-line technology or referee communication systems are in use. Medical alert bracelets may be permitted if covered and not dangerous.',
      },
    ],
    keyPoints: [
      'Shinguards are compulsory and must be covered by socks',
      'All jewellery must be removed — taping is not acceptable',
      'Goalkeepers must wear distinct colours from all other players',
      'Undershirts must match the sleeve colour of the jersey',
      'Referee checks equipment before kick-off and at substitutions',
    ],
    commonQuestions: [
      {
        q: 'Can players tape over jewellery in football?',
        a: 'No. All jewellery must be removed. Taping over jewellery is not permitted under Law 4.',
      },
      {
        q: 'Are shin guards mandatory in football?',
        a: 'Yes. Shinguards are compulsory equipment and must be covered by the socks.',
      },
    ],
    refereeTips: [
      'Check equipment of every player before the match — especially shinguards and jewellery',
      'Re-check substitutes\' equipment as they enter the field',
      'Have scissors or tape available in your kit bag for minor adjustments',
      'Do not allow a player to participate until non-compliant equipment is corrected',
    ],
    australiaContext: 'In Australian grassroots football, jewellery and missing shinguards are the most common equipment issues. Some junior competitions across Football Queensland and Football SA have specific requirements about boot types (no metal studs for younger age groups). Referees should familiarise themselves with local ground regulations in addition to Law 4.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-players-equipment/',
    searchTerms: ['shinguards', 'shin guards', 'jewellery', 'jewelry', 'equipment check', 'player kit', 'boots', 'studs', 'goalkeeper colours', 'undershirt', 'headcover', 'electronic equipment', 'taping jewellery', 'compulsory equipment'],
    relatedLaws: [3, 5],
  },
  {
    num: 5,
    slug: 'the-referee',
    title: 'The Referee',
    shortDesc: 'Authority, decisions, responsibilities, and advantage.',
    metaTitle: 'Law 5: The Referee — Authority, Powers & Responsibilities Explained',
    metaDescription:
      'Law 5 defines the referee\'s authority, decision-making powers, and responsibilities. Essential reading for football referees in Australia.',
    h1: 'Law 5: The Referee — Authority & Responsibilities',
    intro:
      'Law 5 is one of the most important laws for any referee to understand, as it defines your authority, powers, and responsibilities on the field. The referee is the final decision-maker on all facts connected with play. In Australia, referees at all levels — from community to A-League — operate under the same fundamental authority granted by Law 5.',
    sections: [
      {
        heading: 'The authority of the referee',
        body: 'Each match is controlled by a referee who has full authority to enforce the Laws of the Game. The decisions of the referee regarding facts connected with play, including whether or not a goal is scored and the result of the match, are final. The referee may only change a decision on realising that it is incorrect or, at the discretion of the referee, on the advice of an assistant referee or other match official, provided play has not restarted or the referee has not signalled the end of the first or second half.',
      },
      {
        heading: 'Playing advantage',
        body: 'The referee allows play to continue when an offence occurs and the non-offending team will benefit from the advantage, and penalises the offence if the anticipated advantage does not materialise within a few seconds. If the offence warrants a caution, it is issued at the next stoppage. If the offence denies an obvious goal-scoring opportunity, the player is cautioned for unsporting behaviour. If the offence is denying a goal or an obvious goal-scoring opportunity, the player is not sent off but is cautioned.',
      },
      {
        heading: 'Referee equipment and signals',
        body: 'The referee must have a whistle, a watch (or two), yellow and red cards, and a notebook (or other means of keeping a record of the match). The referee may also carry communication equipment. In Australian football, referees at higher levels may use electronic communication with assistant referees and fourth officials.',
      },
    ],
    keyPoints: [
      'The referee has full authority to enforce the Laws of the Game',
      'Decisions on facts of play are final',
      'Advantage should be played when beneficial to the non-offending team',
      'A decision can only be changed before play restarts',
      'The referee acts as timekeeper and keeps a record of the match',
    ],
    commonQuestions: [
      {
        q: 'Can a referee change their decision in football?',
        a: 'Only before play restarts or before signalling the end of a half. After that, the decision is final.',
      },
      {
        q: 'What is advantage in football refereeing?',
        a: 'Advantage allows play to continue when an offence occurs but the non-offending team would benefit more from continued play than from a free kick.',
      },
    ],
    refereeTips: [
      'Make decisions quickly and communicate them clearly — hesitation undermines authority',
      'Use advantage wisely — only play advantage when there is a genuine benefit',
      'Keep a record of all cautions, send-offs, and significant incidents in your notebook',
      'Position yourself to see between the ball and the players involved',
    ],
    australiaContext: 'In Australia, referee authority is supported by state-level codes of conduct enforced by Football NSW, Football Victoria, Capital Football, and other federations. Abuse of match officials is a significant concern at community level, and all Australian states have implemented mandatory reporting and suspension frameworks. Referees who feel unsafe should not hesitate to abandon a match — player safety always takes priority.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-referee/',
    searchTerms: ['referee authority', 'advantage rule', 'playing advantage', 'referee decision', 'change decision', 'referee whistle', 'referee equipment', 'match control', 'referee signals', 'VAR review', 'abandoning a match', 'referee notebook', 'timekeeper'],
    relatedLaws: [6, 12, 13],
  },
  {
    num: 6,
    slug: 'other-match-officials',
    title: 'The Other Match Officials',
    shortDesc: 'Assistant referees, fourth official, and VAR.',
    metaTitle: 'Law 6: Other Match Officials — Assistant Referees, Fourth Official & VAR',
    metaDescription:
      'Law 6 explains the roles of assistant referees, the fourth official, and VAR in football. Match official duties for Australian referees explained.',
    h1: 'Law 6: Other Match Officials — Assistant Referees & VAR',
    intro:
      'Law 6 covers the duties and responsibilities of match officials other than the referee, including assistant referees, the fourth official, additional assistant referees, and Video Assistant Referees (VAR). In Australian football, assistant referees are appointed at higher-level matches, while community games may rely on club linesmen.',
    sections: [
      {
        heading: 'Assistant referees',
        body: 'Two assistant referees may be appointed. Their duties, subject to the decision of the referee, include indicating when the whole of the ball has passed out of the field of play, which team is entitled to a corner kick, goal kick, or throw-in, when a player in an offside position may be penalised, when a substitution is requested, and when misconduct or any other incident has occurred out of the view of the referee.',
      },
      {
        heading: 'Fourth official and additional officials',
        body: 'The fourth official assists the referee with administrative duties, supervises substitution procedures, and acts as a replacement if a match official is unable to continue. Additional assistant referees may be positioned behind each goal line to assist with decisions near the goal, particularly penalty area incidents. In Australia, fourth officials are commonly appointed at NPL and A-League level.',
      },
      {
        heading: 'Video Assistant Referee (VAR)',
        body: 'Where appointed, the VAR can assist the referee with clear and obvious errors or serious missed incidents relating to goals, penalty decisions, direct red card incidents, and mistaken identity. The VAR reviews match footage and communicates with the referee, who retains the final decision. VAR is used in the A-League and select Football Australia competitions.',
      },
    ],
    keyPoints: [
      'Assistant referees indicate offsides, throw-ins, and corner kicks',
      'The fourth official manages substitutions and added time',
      'VAR reviews goals, penalties, red cards, and mistaken identity',
      'All officials are subject to the authority of the referee',
      'Club linesmen only indicate when the ball is out of play',
    ],
    commonQuestions: [
      {
        q: 'What decisions can VAR review in football?',
        a: 'VAR reviews four categories: goals, penalty decisions, direct red card incidents, and mistaken identity.',
      },
      {
        q: 'What is the difference between an assistant referee and a linesman?',
        a: 'Assistant referees are trained officials who indicate offsides, restarts, and misconduct. Club linesmen only indicate when the ball is out of play.',
      },
    ],
    refereeTips: [
      'Establish clear pre-match communication with your assistant referees about signals and responsibilities',
      'If you are working without neutral assistants, manage expectations with club linesmen before kick-off',
      'Trust your assistants\' flag signals — they often have a better angle on offside and boundary decisions',
      'Brief the fourth official on added time, substitution procedures, and technical area management',
    ],
    australiaContext: 'Many community matches in Australia are officiated by a single referee without assistant referees. In these cases, club linesmen (provided by each team) can only indicate when the ball is out of play — they cannot flag for offside or fouls. Higher-level competitions in the NPL and state leagues appoint full referee teams. Football Australia and state federations provide guidelines on the duties of club linesmen.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-other-match-officials/',
    searchTerms: ['assistant referee', 'linesman', 'fourth official', 'VAR', 'video assistant referee', 'club linesman', 'flag signal', 'additional assistant', 'offside flag', 'match official duties'],
    relatedLaws: [5, 11, 12],
  },
  {
    num: 7,
    slug: 'duration-of-the-match',
    title: 'The Duration of the Match',
    shortDesc: 'Periods of play, half-time, and added time.',
    metaTitle: 'Law 7: Duration of the Match — Playing Time, Half-Time & Added Time',
    metaDescription:
      'Law 7 covers match duration, half-time interval, and added time in football. How long is a football match? Rules explained for Australian referees.',
    h1: 'Law 7: Duration of the Match — Playing Time & Added Time',
    intro:
      'Law 7 governs the length of a football match, including the two halves of play, the half-time interval, and how additional time is calculated. Australian competitions may modify match duration for junior, community, and women\'s formats, but the principles of Law 7 always apply.',
    sections: [
      {
        heading: 'Periods of play',
        body: 'A match lasts two equal halves of 45 minutes each, unless otherwise agreed between the referee and the two teams before the start of play and in accordance with competition rules. In Australia, competition rules commonly shorten match length for junior age groups (e.g. 20-minute halves for Under 12s) and some community competitions.',
      },
      {
        heading: 'Half-time interval',
        body: 'Players are entitled to an interval at half-time, not exceeding 15 minutes. A short drinks break (not exceeding one minute) is permitted at the interval of a half. Competition rules must state the duration of the half-time interval, which may only be altered with the consent of the referee.',
      },
      {
        heading: 'Allowance for time lost (added time)',
        body: 'The referee adds time lost during each half for substitutions, assessment and/or removal of injured players, wasting time, disciplinary sanctions, medical stoppages, drinks breaks, VAR checks, goal celebrations, and any other cause. The fourth official indicates the minimum additional time at the end of each half. The referee may increase but not reduce this time. A penalty kick must be allowed to be completed even if time has expired.',
      },
    ],
    keyPoints: [
      'Standard match: two halves of 45 minutes each',
      'Half-time must not exceed 15 minutes',
      'Added time compensates for stoppages during play',
      'A penalty kick taken at the end of a half must be completed',
      'The referee is the sole timekeeper',
    ],
    commonQuestions: [
      {
        q: 'How long is a football match?',
        a: '90 minutes — two halves of 45 minutes each, plus any added time for stoppages.',
      },
      {
        q: 'How is added time calculated in football?',
        a: 'The referee adds time for substitutions, injuries, VAR checks, time-wasting, and other stoppages during each half.',
      },
    ],
    refereeTips: [
      'Start your watch at kick-off and keep track of stoppages for added time',
      'Use a second watch or stopwatch as a backup — technology can fail',
      'Communicate clearly with the fourth official about added time at the end of each half',
      'Remember: a penalty kick must be completed even if full time has expired',
    ],
    australiaContext: 'Match duration in Australian junior football varies by age group. Football NSW uses 20-minute halves for Under 8s through to 45-minute halves for Under 18s. Football Queensland and Football Victoria follow similar age-based structures. Referees should confirm match duration with competition coordinators before kick-off, as these can vary between associations and even between divisions within the same age group.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-duration-of-the-match/',
    searchTerms: ['match duration', 'half time', 'added time', 'stoppage time', 'injury time', 'extra time', '45 minutes', '90 minutes', 'drinks break', 'cooling break', 'time wasting', 'how long is a football match'],
    relatedLaws: [5, 8, 14],
  },
  {
    num: 8,
    slug: 'start-and-restart-of-play',
    title: 'The Start and Restart of Play',
    shortDesc: 'Kick-off, dropped ball, and restart procedures.',
    metaTitle: 'Law 8: Start & Restart of Play — Kick-Off & Dropped Ball Rules',
    metaDescription:
      'Law 8 explains kick-off procedures, dropped ball rules, and how play is restarted in football. Restart rules for Australian referees.',
    h1: 'Law 8: Start & Restart of Play — Kick-Off & Dropped Ball',
    intro:
      'Law 8 covers how a football match begins and how play is restarted after stoppages. Understanding kick-off procedures and the dropped ball rule is essential for referees at every level in Australia, from junior community games to senior competitions.',
    sections: [
      {
        heading: 'Kick-off',
        body: 'A kick-off starts both halves of the match, both halves of extra time, and restarts play after a goal has been scored. A coin toss determines which team kicks off. The team that wins the toss decides which goal to attack in the first half. The other team takes the kick-off. The ball must be stationary on the centre mark and all players must be in their own half. The ball is in play when it is kicked and clearly moves. A goal may be scored directly from the kick-off.',
      },
      {
        heading: 'Dropped ball',
        body: 'A dropped ball is used to restart play when the referee has stopped play for any reason not mentioned elsewhere in the Laws. The ball is dropped for the goalkeeper of the defending team in their penalty area if play was stopped there, or for the team that last touched the ball at the position where it last touched a player, outside agent, or match official. All other players must be at least 4 metres from the ball until it is in play. The ball is in play when it touches the ground.',
      },
    ],
    keyPoints: [
      'Kick-off starts each half and restarts after goals',
      'All players must be in their own half at kick-off',
      'A goal can be scored directly from a kick-off',
      'Dropped ball goes to the team that last touched the ball',
      'Players must be 4m away from a dropped ball',
    ],
    commonQuestions: [
      {
        q: 'Can you score directly from a kick-off in football?',
        a: 'Yes. A goal may be scored directly from a kick-off against the opposing team.',
      },
      {
        q: 'When is a dropped ball used in football?',
        a: 'When the referee stops play for a reason not covered by other restart methods — e.g. a defective ball or an outside agent on the field.',
      },
    ],
    refereeTips: [
      'Ensure the coin toss is conducted fairly and both captains understand the result',
      'At kick-off, check all players are in their own half before whistling',
      'For a dropped ball, identify which team last touched the ball and act quickly',
      'Remember that a dropped ball in the penalty area always goes to the goalkeeper',
    ],
    australiaContext: 'In Australian community football, kick-off times can be delayed due to late team arrivals or pitch availability. Referees should communicate any delays to both teams and adjust the match schedule accordingly. Some Australian competitions use a "golden point" format in finals, which requires extra time management skills covered under Law 7 and Law 10.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-start-and-restart-of-play/',
    searchTerms: ['kick-off', 'kickoff', 'dropped ball', 'restart', 'coin toss', 'start of play', 'centre mark', 'which team kicks off', 'can you score from kick-off'],
    relatedLaws: [2, 7, 9],
  },
  {
    num: 9,
    slug: 'ball-in-and-out-of-play',
    title: 'The Ball In and Out of Play',
    shortDesc: 'When the ball is in play and when it is out.',
    metaTitle: 'Law 9: Ball In and Out of Play — When Is the Ball Out in Football?',
    metaDescription:
      'Law 9 defines when the ball is in play and out of play in football. Boundary rules, goal line, and touchline decisions explained for referees.',
    h1: 'Law 9: Ball In and Out of Play',
    intro:
      'Law 9 is one of the shortest but most fundamental laws in football. It defines when the ball is in play and when it is out of play, which directly affects every restart decision a referee makes. Whether you are officiating a junior match in suburban Australia or a senior state league fixture, this law governs every moment of the game.',
    sections: [
      {
        heading: 'Ball out of play',
        body: 'The ball is out of play when it has wholly passed over the goal line or touchline, whether on the ground or in the air, or when play has been stopped by the referee. The key word is "wholly" — the entire ball must cross the entire line. If any part of the ball is on or above the line, it is still in play.',
      },
      {
        heading: 'Ball in play',
        body: 'The ball is in play at all other times when it touches a match official and remains on the field of play, including when it rebounds off a goalpost, crossbar, or corner flagpost and remains on the field. The ball is also in play if it touches the referee or another match official who is on the field of play.',
      },
    ],
    keyPoints: [
      'The whole ball must cross the whole line to be out of play',
      'The ball remains in play if it hits the referee on the field',
      'The ball remains in play if it rebounds off goalposts or crossbar',
      'Lines are part of the area they define (Law 1)',
      'Corner flagposts are on the field — ball is in play if it hits them',
    ],
    commonQuestions: [
      {
        q: 'Is the ball out if it is on the line in football?',
        a: 'No. The whole ball must completely cross the whole line. If any part of the ball is on or above the line, it is still in play.',
      },
      {
        q: 'What happens if the ball hits the referee?',
        a: 'Play continues unless the ball goes into the goal, possession changes, or a promising attack starts — in those cases, a dropped ball restarts play.',
      },
    ],
    refereeTips: [
      'Position yourself with a clear sightline to the ball — especially near boundary lines',
      'When in doubt about whether the ball crossed the line, consult your assistant referee',
      'Remember: the ball hitting a match official is still in play unless specific conditions are met',
      'Be aware that even experienced players and spectators misjudge ball-over-line situations',
    ],
    australiaContext: 'Goal-line technology is not available at community level in Australia. Referees must rely on their own positioning and the assistance of neutral assistant referees (where appointed). In single-referee matches common across Australian grassroots football, positioning near the goal line during attacking play is critical for accurate goal/no-goal decisions.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-ball-in-and-out-of-play/',
    searchTerms: ['ball in play', 'ball out of play', 'over the line', 'whole ball', 'touchline', 'goal line', 'ball hits referee', 'ball rebounds off post', 'is the ball out'],
    relatedLaws: [1, 10, 15, 16, 17],
  },
  {
    num: 10,
    slug: 'determining-the-outcome',
    title: 'Determining the Outcome of a Match',
    shortDesc: 'Goals scored, draws, and penalty shoot-outs.',
    metaTitle: 'Law 10: Determining the Outcome — Goals, Draws & Penalty Shoot-Outs',
    metaDescription:
      'Law 10 explains how goals are scored, how draws are resolved, and penalty shoot-out procedures in football. Match outcomes for Australian referees.',
    h1: 'Law 10: Determining the Outcome of a Match',
    intro:
      'Law 10 defines how goals are scored, the conditions for a valid goal, and the procedures for determining a winner when the match ends in a draw. In Australian cup competitions and finals series, referees must be prepared to manage extra time and kicks from the penalty mark.',
    sections: [
      {
        heading: 'Goals scored',
        body: 'A goal is scored when the whole of the ball passes over the goal line, between the goalposts and under the crossbar, provided no offence has been committed by the team scoring the goal. If the referee signals a goal before the ball has wholly passed over the goal line, play is restarted with a dropped ball.',
      },
      {
        heading: 'Winning team and away goals',
        body: 'The team scoring the greater number of goals is the winner. If both teams score the same number of goals or no goals are scored, the match is a draw. Competition rules may specify extra time or kicks from the penalty mark to determine a winner. The away goals rule, which was previously used in some two-legged ties, has been abolished by many competitions including FIFA and Football Australia.',
      },
      {
        heading: 'Kicks from the penalty mark',
        body: 'When competition rules require a winner after a drawn match, kicks from the penalty mark are taken. All players must remain in the centre circle except the kicker and the two goalkeepers. The referee selects the goal and tosses a coin. Each team takes five kicks alternately. If one team has scored more goals than the other could score, the remaining kicks are not taken. If the score is equal after five kicks each, kicks continue in the same order until one team has scored one more than the other from the same number of kicks.',
      },
    ],
    keyPoints: [
      'The whole ball must cross the whole goal line for a goal',
      'A goal cannot stand if the scoring team committed an offence',
      'Competition rules determine how draws are resolved',
      'Kicks from the penalty mark follow a strict procedure',
      'All eligible players must take a kick before any player takes a second',
    ],
    commonQuestions: [
      {
        q: 'When is a goal scored in football?',
        a: 'When the whole ball passes over the goal line between the posts and under the crossbar, with no offence by the scoring team.',
      },
      {
        q: 'How do penalty shoot-outs work?',
        a: 'Each team takes five kicks alternately. If still level, kicks continue one-for-one until one team leads after equal kicks.',
      },
    ],
    refereeTips: [
      'During penalty shoot-outs, keep a clear written record of each kick and its outcome',
      'Ensure both goalkeepers understand the goal line rule before kicks begin',
      'Check that all eligible players are in the centre circle and monitor for encroachment',
      'If a goalkeeper is injured during kicks from the mark, only a player already on the pitch may replace them',
    ],
    australiaContext: 'Australian cup competitions and finals series frequently require kicks from the penalty mark to determine a winner. Football NSW Cup, FFA Cup qualifying rounds, and state-level knockout competitions all follow IFAB procedures. Referees officiating finals in Australia should practise the penalty shoot-out procedure before the match and brief both teams during the pre-match meeting.',
    ifabUrl: 'https://www.theifab.com/laws/latest/determining-the-outcome-of-a-match/',
    searchTerms: ['goal scored', 'when is a goal scored', 'penalty shoot-out', 'kicks from the penalty mark', 'extra time', 'golden goal', 'away goals', 'draw', 'winner', 'KFTPM'],
    relatedLaws: [9, 14],
  },
  {
    num: 11,
    slug: 'offside',
    title: 'Offside',
    shortDesc: 'Offside position, offence, and when there is no offence.',
    metaTitle: 'Law 11: Offside Rule Explained Simply — Position, Offence & Exceptions',
    metaDescription:
      'The offside rule explained simply. Law 11 covers offside position, when it is an offence, and exceptions. Clear explanations for football referees in Australia.',
    h1: 'Law 11: Offside — The Offside Rule Explained Simply',
    intro:
      'Law 11 is one of the most debated and misunderstood laws in football. The offside rule exists to prevent players from gaining an unfair advantage by positioning themselves behind the defence. For Australian referees, mastering offside interpretation is critical — it is tested heavily in assessments and is one of the most common areas of match-day controversy.',
    sections: [
      {
        heading: 'Offside position',
        body: 'A player is in an offside position if any part of the head, body, or feet is nearer to the opponents\' goal line than both the ball and the second-last opponent. The hands and arms of all players, including the goalkeeper, are not considered. Being in an offside position is not an offence in itself — a player is only penalised if they are involved in active play at the moment the ball is played or touched by a team-mate.',
      },
      {
        heading: 'Offside offence',
        body: 'A player in an offside position is penalised if, at the moment the ball is played or touched by a team-mate, they interfere with play (touching the ball), interfere with an opponent (preventing them from playing the ball by obstructing their line of vision or movement, or challenging them), or gain an advantage by being in that position (playing a ball that rebounds off a post, crossbar, match official, or opponent). The penalty is an indirect free kick from the position of the offending player.',
      },
      {
        heading: 'When there is no offside offence',
        body: 'There is no offside offence if a player receives the ball directly from a goal kick, throw-in, or corner kick. A player is also not offside if they are in their own half of the field, or if they are level with the second-last opponent or level with the last two opponents. These exceptions are important and frequently tested in referee assessments across Australia.',
      },
    ],
    keyPoints: [
      'Being in an offside position alone is not an offence',
      'Offside is judged at the moment the ball is played by a team-mate',
      'No offside from goal kicks, throw-ins, or corner kicks',
      'Arms and hands do not count for offside position',
      'The restart for an offside offence is an indirect free kick',
    ],
    commonQuestions: [
      {
        q: 'What is the offside rule in football explained simply?',
        a: 'A player is offside if they are closer to the goal than the second-last defender when the ball is played to them by a team-mate, and they are involved in active play.',
      },
      {
        q: 'Can you be offside from a throw-in?',
        a: 'No. There is no offside offence if the ball is received directly from a throw-in, goal kick, or corner kick.',
      },
    ],
    refereeTips: [
      'Focus on the moment the ball is played — that is when offside position is judged',
      'Use the "wait and see" technique: flag only when the player becomes involved in active play',
      'Communicate with your assistant referee about marginal calls — eye contact and body language matter',
      'Remember the three exceptions: goal kick, throw-in, corner kick — commit these to memory',
    ],
    australiaContext: 'Offside is the most frequently debated decision in Australian football at every level. Without VAR at community level, referees and assistant referees must rely on positioning and concentration. Football NSW and Football Victoria both include specific offside assessment modules in their referee development programmes. RefZone\'s quiz bank includes over 50 offside-specific questions to help Australian referees master this law.',
    ifabUrl: 'https://www.theifab.com/laws/latest/offside/',
    searchTerms: ['offside rule', 'offside position', 'offside explained', 'interfering with play', 'gaining an advantage', 'second last opponent', 'offside from goal kick', 'offside from throw-in', 'offside from corner', 'active play', 'offside trap', 'delayed flag', 'wait and see', 'offside line'],
    relatedLaws: [6, 13, 15, 16, 17],
  },
  {
    num: 12,
    slug: 'fouls-and-misconduct',
    title: 'Fouls and Misconduct',
    shortDesc: 'Direct and indirect free kicks, cautions, and send-offs.',
    metaTitle: 'Law 12: Fouls & Misconduct — Yellow Cards, Red Cards & Free Kicks',
    metaDescription:
      'Law 12 covers fouls, misconduct, yellow cards, and red cards in football. What is a red card offence? Direct and indirect free kicks explained for referees.',
    h1: 'Law 12: Fouls & Misconduct — Cards, Fouls & Free Kicks',
    intro:
      'Law 12 is the most extensive and frequently applied law in football. It defines what constitutes a foul, the difference between direct and indirect free kicks, and the disciplinary actions available to the referee. For Australian referees, Law 12 is the foundation of match control — understanding careless, reckless, and excessive force is essential at every level.',
    sections: [
      {
        heading: 'Direct free kick offences',
        body: 'A direct free kick is awarded if a player commits any of the following offences against an opponent in a manner considered by the referee to be careless, reckless, or using excessive force: charges, jumps at, kicks or attempts to kick, pushes, strikes or attempts to strike, tackles or challenges, or trips or attempts to trip. A direct free kick is also awarded if a player handles the ball deliberately (except the goalkeeper in their own penalty area). If the offence occurs inside the offender\'s penalty area, a penalty kick is awarded.',
      },
      {
        heading: 'Indirect free kick offences',
        body: 'An indirect free kick is awarded if a player plays in a dangerous manner, impedes the progress of an opponent without any contact being made, or prevents the goalkeeper from releasing the ball from their hands. An indirect free kick is also awarded if the goalkeeper handles the ball after it has been deliberately kicked to them by a team-mate (the back-pass rule), handles a throw-in from a team-mate, or holds the ball for more than six seconds.',
      },
      {
        heading: 'Cautions (yellow card) and send-offs (red card)',
        body: 'A player is cautioned (yellow card) for: delaying the restart of play, dissent, entering/leaving without permission, failing to respect the required distance, persistent offences, and unsporting behaviour. A player is sent off (red card) for: denying an obvious goal-scoring opportunity (DOGSO) by a foul, serious foul play, violent conduct, spitting, biting, using offensive language or gestures, or receiving a second caution. In Australian football, send-off and suspension rules vary by state federation.',
      },
      {
        heading: 'Handling the ball',
        body: 'It is an offence if a player deliberately handles the ball, or their hand/arm makes their body unnaturally bigger, or the ball touches a player\'s hand/arm which is above/beyond their shoulder (unless the player deliberately plays the ball and it then touches their hand/arm). A player\'s hand/arm making their silhouette unnaturally bigger is always considered an offence. The interpretation of "unnatural position" is one of the most debated areas in football refereeing.',
      },
    ],
    keyPoints: [
      'Careless = lack of attention; reckless = disregard for danger; excessive force = exceeds necessary use of force',
      'Direct free kick fouls inside the penalty area become penalty kicks',
      'Two yellow cards in one match result in a red card and send-off',
      'DOGSO by foul in the penalty area: red card becomes yellow if the referee plays advantage or awards a penalty',
      'Indirect free kicks include back-pass violations and dangerous play',
    ],
    commonQuestions: [
      {
        q: 'What is a red card offence in football?',
        a: 'Red card offences include serious foul play, violent conduct, denying a goal-scoring opportunity by foul, spitting, offensive language/gestures, and receiving a second yellow card.',
      },
      {
        q: 'What is the difference between a direct and indirect free kick?',
        a: 'A goal can be scored directly from a direct free kick. An indirect free kick requires the ball to touch another player before a goal can be scored.',
      },
    ],
    refereeTips: [
      'Distinguish between careless (free kick only), reckless (free kick + caution), and excessive force (free kick + send-off)',
      'For handling decisions, ask: was the arm in an unnatural position? Did the player make their body bigger?',
      'When applying DOGSO, consider the four criteria: distance to goal, direction of play, likelihood of keeping the ball, and location/number of defenders',
      'Keep your cards in separate pockets — yellow in one, red in the other — to avoid mistakes under pressure',
      'Record the time, player number, and reason for every card in your notebook immediately',
    ],
    australiaContext: 'Law 12 accounts for the majority of disciplinary action in Australian football. State federations including Football NSW, Football Queensland, and Football Victoria maintain judiciary systems that review red card incidents after each match round. Referees must submit detailed match reports for all send-offs. Understanding the difference between careless, reckless, and excessive force is essential for passing referee assessments in Australia.',
    ifabUrl: 'https://www.theifab.com/laws/latest/fouls-and-misconduct/',
    searchTerms: ['foul', 'misconduct', 'yellow card', 'red card', 'caution', 'send off', 'sending off', 'handball', 'handling', 'dangerous play', 'careless', 'reckless', 'excessive force', 'DOGSO', 'denying a goal scoring opportunity', 'SFP', 'serious foul play', 'violent conduct', 'dissent', 'unsporting behaviour', 'back pass', 'indirect free kick', 'direct free kick', 'penalty', 'spitting', 'simulation', 'diving'],
    relatedLaws: [5, 13, 14],
  },
  {
    num: 13,
    slug: 'free-kicks',
    title: 'Free Kicks',
    shortDesc: 'Direct vs indirect, positioning, and wall procedures.',
    metaTitle: 'Law 13: Free Kicks — Direct vs Indirect, Walls & Positioning Rules',
    metaDescription:
      'Law 13 explains free kick procedures in football: direct vs indirect, defensive wall rules, and positioning requirements. Free kick rules for referees.',
    h1: 'Law 13: Free Kicks — Types, Walls & Procedures',
    intro:
      'Law 13 governs the procedures for taking free kicks, including the distinction between direct and indirect free kicks, positioning requirements, and the rules for defensive walls. For Australian referees, managing free kicks efficiently is a key match management skill.',
    sections: [
      {
        heading: 'Types of free kick',
        body: 'Direct free kicks allow a goal to be scored directly against the opposing team. Indirect free kicks require the ball to touch another player before a goal can be scored — the referee indicates an indirect free kick by raising an arm above the head and maintains this signal until the kick is taken and the ball touches another player or goes out of play.',
      },
      {
        heading: 'Procedure',
        body: 'The ball must be stationary when the kick is taken, and the kicker must not touch the ball again until it has touched another player. All opponents must be at least 9.15 metres (10 yards) from the ball until it is in play. If a free kick is awarded inside the kicker\'s penalty area, all opponents must be outside the penalty area and at least 9.15m from the ball.',
      },
      {
        heading: 'Defensive wall rules',
        body: 'When the defending team forms a "wall" of three or more players, all attacking team players must remain at least 1 metre from the wall until the ball is in play. This rule, introduced in 2019, prevents attackers from infiltrating the wall and causing confusion. The referee must manage this actively and may caution any attacking player who does not comply.',
      },
    ],
    keyPoints: [
      'Direct: goal can be scored directly; indirect: must touch another player first',
      'Ball must be stationary and opponents 9.15m away',
      'Free kick inside own penalty area: opponents must leave the area',
      'Attacking players must be 1m from a 3+ person defensive wall',
      'Referee raises arm to signal indirect free kick',
    ],
    commonQuestions: [
      {
        q: 'What is the difference between a direct and indirect free kick?',
        a: 'A goal can be scored directly from a direct free kick. An indirect free kick must touch another player first.',
      },
      {
        q: 'How far must defenders stand from a free kick?',
        a: '9.15 metres (10 yards) from the ball until it is in play.',
      },
    ],
    refereeTips: [
      'Always signal clearly whether the free kick is direct or indirect',
      'For indirect free kicks near the goal, keep your arm raised until the ball touches another player',
      'Manage the wall actively — ensure 9.15m distance and that attackers stay 1m from a 3+ person wall',
      'If a player delays the restart by kicking the ball away, caution them for delaying the restart',
    ],
    australiaContext: 'Free kick management is a key assessment criterion for referee promotion in Australian football. State associations evaluate how efficiently referees manage restarts, particularly in and around the penalty area. Quick, clear communication and confident positioning during free kicks are skills that Football NSW, Football Victoria, and other associations expect from referees seeking advancement.',
    ifabUrl: 'https://www.theifab.com/laws/latest/free-kicks/',
    searchTerms: ['free kick', 'direct free kick', 'indirect free kick', 'wall', 'defensive wall', '9.15 metres', '10 yards', 'free kick procedure', 'quick free kick', 'free kick in penalty area', 'attacking wall distance'],
    relatedLaws: [12, 14],
  },
  {
    num: 14,
    slug: 'the-penalty-kick',
    title: 'The Penalty Kick',
    shortDesc: 'Procedure, position of players, and infringements.',
    metaTitle: 'Law 14: The Penalty Kick — Procedure, Rules & Infringements',
    metaDescription:
      'Law 14 covers penalty kick procedures, goalkeeper positioning, feinting rules, and infringements. Penalty rules explained for football referees in Australia.',
    h1: 'Law 14: The Penalty Kick — Procedure & Rules',
    intro:
      'Law 14 defines the procedure for taking a penalty kick, which is awarded when a direct free kick offence is committed inside the offender\'s penalty area. Penalty kicks are high-pressure moments for referees — getting the procedure right is critical. Australian referees at all levels must understand the rules around feinting, goalkeeper positioning, and encroachment.',
    sections: [
      {
        heading: 'Procedure',
        body: 'The ball is placed on the penalty mark (11 metres from the goal line). The goalkeeper must remain on the goal line, facing the kicker, between the goalposts until the ball is kicked. The goalkeeper must have at least part of one foot touching or in line with the goal line. The kicker must kick the ball forward. All other players must be outside the penalty area, outside the penalty arc, and behind the penalty mark.',
      },
      {
        heading: 'Feinting',
        body: 'The kicker is permitted to use a feinting (deceptive) approach during the run-up, but must not feint to kick the ball once they have completed the run-up. If the kicker feints at the point of kicking (stops the kicking motion and then kicks), the referee stops play, cautions the kicker for unsporting behaviour, and awards an indirect free kick to the defending team.',
      },
      {
        heading: 'Infringements and sanctions',
        body: 'If the goalkeeper moves off the goal line before the ball is kicked and the kick is missed or saved, the kick is retaken and the goalkeeper may be cautioned. If an attacker encroaches and the kick scores, it is retaken. If a defender encroaches and the kick is saved or missed, it is retaken. If players from both teams encroach, the kick is always retaken regardless of the outcome.',
      },
    ],
    keyPoints: [
      'Ball placed on the penalty mark, 11m from goal',
      'Goalkeeper must have one foot on or in line with the goal line',
      'Feinting during run-up is permitted; feinting at the point of kick is not',
      'Encroachment by the kicker\'s team-mates: retake if goal scored',
      'Encroachment by defenders: retake if saved or missed',
    ],
    commonQuestions: [
      {
        q: 'Can a goalkeeper move during a penalty kick?',
        a: 'The goalkeeper must have at least part of one foot touching or in line with the goal line until the ball is kicked. They may move along the line.',
      },
      {
        q: 'Is feinting allowed during a penalty kick?',
        a: 'Feinting during the run-up is allowed. Feinting at the point of kicking (stopping then kicking) is an offence — the kicker is cautioned.',
      },
    ],
    refereeTips: [
      'Position yourself with a clear view of the penalty mark, the goalkeeper, and the kicker',
      'Watch the goalkeeper\'s feet — they must have at least one foot on or in line with the goal line',
      'If you spot encroachment, wait for the outcome before deciding on the sanction',
      'Brief both teams on penalty kick procedure before any penalty is taken, especially in finals',
    ],
    australiaContext: 'Penalty kicks are high-pressure moments in Australian football, particularly in finals and cup matches. Referees at NPL and A-League level in Australia receive specific training on penalty management. At community level, ensuring both the goalkeeper and kicker understand the rules before the kick is taken can prevent confusion and disputes.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-penalty-kick/',
    searchTerms: ['penalty kick', 'penalty', 'penalty spot', 'penalty mark', 'goalkeeper penalty', 'feinting penalty', 'encroachment', 'penalty retake', 'penalty procedure', 'goalkeeper line', 'penalty saved', 'penalty missed', 'stutter run-up'],
    relatedLaws: [10, 12, 13],
  },
  {
    num: 15,
    slug: 'the-throw-in',
    title: 'The Throw-In',
    shortDesc: 'Procedure, infringements, and restarts.',
    metaTitle: 'Law 15: The Throw-In — Procedure, Foul Throws & Rules Explained',
    metaDescription:
      'Law 15 covers throw-in procedures, foul throw rules, and common infringements in football. Throw-in rules explained for Australian referees.',
    h1: 'Law 15: The Throw-In — Procedure & Foul Throw Rules',
    intro:
      'Law 15 defines the procedure for a throw-in, which is awarded when the ball wholly crosses the touchline. Throw-ins are the most common restart in football, and foul throws are one of the most frequent errors at junior and community level in Australia. Understanding the correct procedure helps referees apply the law consistently.',
    sections: [
      {
        heading: 'Procedure',
        body: 'A throw-in is awarded to the opponents of the player who last touched the ball when the whole ball passes over the touchline. The thrower must face the field of play, have part of each foot on the touchline or on the ground outside the touchline, hold the ball with both hands, and deliver the ball from behind and over the head from the point where it left the field of play. All opponents must stand at least 2 metres from the point on the touchline where the throw-in is taken.',
      },
      {
        heading: 'Foul throws and infringements',
        body: 'If the thrower does not follow the correct procedure, a throw-in is awarded to the opposing team. Common foul throws include lifting one or both feet completely off the ground, not delivering the ball from behind and over the head, and throwing from the wrong location. The thrower must not touch the ball again until it has touched another player. A goal cannot be scored directly from a throw-in.',
      },
    ],
    keyPoints: [
      'Both feet must be on the touchline or on the ground outside it',
      'Ball must be delivered from behind and over the head with both hands',
      'Opponents must be at least 2 metres away',
      'The thrower cannot touch the ball again until another player touches it',
      'No offside offence from a throw-in received directly',
    ],
    commonQuestions: [
      {
        q: 'What is a foul throw in football?',
        a: 'A foul throw occurs when the thrower lifts a foot off the ground, fails to deliver the ball from behind and over the head, or throws from the wrong position.',
      },
      {
        q: 'Can you score directly from a throw-in?',
        a: 'No. If the ball enters the opponent\'s goal directly from a throw-in, a goal kick is awarded. If it enters the thrower\'s own goal, a corner kick is awarded.',
      },
    ],
    refereeTips: [
      'Watch both feet of the thrower — the most common foul throw is lifting a foot completely off the ground',
      'Be consistent with foul throw decisions throughout the match — don\'t suddenly become strict in the second half',
      'Position yourself to see the thrower\'s feet and the field of play simultaneously',
      'In junior football, consider using a quick coaching moment for first-time foul throws rather than immediately penalising',
    ],
    australiaContext: 'Foul throws are one of the most common infringements in Australian junior football. Many state associations including Football NSW and Football Queensland encourage referees to use a developmental approach with younger players — explaining the correct procedure rather than simply awarding a throw-in to the opposition. At senior level, the law is applied strictly.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-throw-in/',
    searchTerms: ['throw-in', 'throw in', 'foul throw', 'throw-in procedure', 'both feet', 'behind and over the head', 'throw-in distance', 'can you score from throw-in', 'long throw'],
    relatedLaws: [9, 11],
  },
  {
    num: 16,
    slug: 'the-goal-kick',
    title: 'The Goal Kick',
    shortDesc: 'Procedure, position of players, and infringements.',
    metaTitle: 'Law 16: The Goal Kick — Procedure & Rules Explained',
    metaDescription:
      'Law 16 covers goal kick procedures, player positioning, and infringements in football. Goal kick rules explained for Australian referees.',
    h1: 'Law 16: The Goal Kick — Procedure & Rules',
    intro:
      'Law 16 defines the goal kick procedure, which is used to restart play when the ball wholly crosses the goal line (excluding the part between the goalposts) having last been touched by an attacker. Goal kicks are a routine restart but have specific rules that referees must enforce, particularly regarding when the ball is in play.',
    sections: [
      {
        heading: 'Procedure',
        body: 'The ball is kicked from any point within the goal area by a player of the defending team. The ball is in play when it is kicked and clearly moves. The ball does not need to leave the penalty area before another player can touch it — this rule changed in 2019. Opponents must remain outside the penalty area until the ball is in play.',
      },
      {
        heading: 'Infringements',
        body: 'If the ball does not leave the penalty area, the goal kick is not retaken — this was the old rule. Under current rules, the ball is in play as soon as it clearly moves. If the kicker touches the ball again before it touches another player, an indirect free kick is awarded. A goal may be scored directly from a goal kick, but only against the opposing team.',
      },
    ],
    keyPoints: [
      'Ball is kicked from inside the goal area',
      'Ball is in play when kicked and clearly moves (does not need to leave penalty area)',
      'Opponents must be outside the penalty area until ball is in play',
      'No offside offence from receiving a goal kick directly',
      'A goal can be scored directly against the opposing team',
    ],
    commonQuestions: [
      {
        q: 'Does a goal kick need to leave the penalty area?',
        a: 'No. Since 2019, the ball is in play as soon as it is kicked and clearly moves. It does not need to leave the penalty area.',
      },
      {
        q: 'Can you score from a goal kick?',
        a: 'Yes, against the opposing team. If the ball enters the kicker\'s own goal directly, a corner kick is awarded.',
      },
    ],
    refereeTips: [
      'Ensure opponents leave the penalty area before the goal kick is taken',
      'Remind goalkeepers they can pass to a team-mate inside the penalty area — many still use the old rule',
      'Position yourself to monitor both the goal kick procedure and potential offside situations',
      'A goal kick taken from the wrong position should be retaken — communicate clearly with the kicker',
    ],
    australiaContext: 'The 2019 rule change allowing goal kicks to be received inside the penalty area is still misunderstood by many players and coaches in Australian community football. Referees should be prepared to explain this change, particularly at lower levels. Football Australia and state federations have issued guidance on communicating rule changes to teams.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-goal-kick/',
    searchTerms: ['goal kick', 'goal kick procedure', 'goal kick penalty area', 'goal kick rule change', 'goal kick offside', 'can you score from goal kick', 'goal kick in play'],
    relatedLaws: [1, 9, 11],
  },
  {
    num: 17,
    slug: 'the-corner-kick',
    title: 'The Corner Kick',
    shortDesc: 'Procedure, position of players, and infringements.',
    metaTitle: 'Law 17: The Corner Kick — Procedure & Rules Explained',
    metaDescription:
      'Law 17 covers corner kick procedures, player positioning, and infringements in football. Corner kick rules explained for Australian referees.',
    h1: 'Law 17: The Corner Kick — Procedure & Rules',
    intro:
      'Law 17 defines the corner kick, which is awarded when the ball wholly crosses the goal line (excluding the part between the goalposts) having last been touched by a defender. Corner kicks create some of the most exciting moments in football and require referees to manage positioning, encroachment, and potential fouls in a crowded penalty area.',
    sections: [
      {
        heading: 'Procedure',
        body: 'The ball is placed inside the corner arc nearest to the point where the ball crossed the goal line. The corner flagpost must not be moved. Opponents must remain at least 9.15 metres from the corner arc until the ball is in play. The ball is in play when it is kicked and clearly moves. The kicker must not touch the ball again until it has touched another player.',
      },
      {
        heading: 'Infringements and scoring',
        body: 'A goal may be scored directly from a corner kick, but only against the opposing team. If the ball enters the kicker\'s own goal directly from a corner kick, a corner kick is awarded to the opposing team. There is no offside offence if a player receives the ball directly from a corner kick. If the kicker touches the ball a second time before it has touched another player, an indirect free kick is awarded.',
      },
    ],
    keyPoints: [
      'Ball placed inside the corner arc nearest to where it crossed the line',
      'The corner flagpost must not be moved',
      'Opponents must be 9.15m from the corner arc',
      'A goal can be scored directly from a corner kick',
      'No offside offence from receiving a corner kick directly',
    ],
    commonQuestions: [
      {
        q: 'Can you score directly from a corner kick?',
        a: 'Yes, against the opposing team. If the ball enters the kicker\'s own goal directly, a corner kick is awarded to the opponents.',
      },
      {
        q: 'Is there offside from a corner kick?',
        a: 'No. There is no offside offence if a player receives the ball directly from a corner kick.',
      },
    ],
    refereeTips: [
      'Position yourself near the corner area to monitor the kick procedure and the penalty area simultaneously',
      'Watch for pushing, holding, and shirt-pulling in the penalty area during corner kicks',
      'Ensure the ball is placed inside the corner arc and the flagpost is not moved',
      'Be alert for short corner kicks — opponents must still maintain 9.15m distance',
    ],
    australiaContext: 'Corner kicks are a common source of penalty area incidents in Australian football. Referees at all levels should focus on managing the crowded penalty area during corners, watching for off-the-ball fouls that can escalate quickly. State federation assessors in Football NSW, Football Victoria, and Football Queensland frequently evaluate referee positioning and awareness during set pieces as part of promotion assessments.',
    ifabUrl: 'https://www.theifab.com/laws/latest/the-corner-kick/',
    searchTerms: ['corner kick', 'corner', 'corner arc', 'corner flag', 'corner kick procedure', 'corner kick offside', 'can you score from corner', 'short corner', 'inswinging corner'],
    relatedLaws: [1, 9, 11, 13],
  },
]
