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
      'Law 1 of the IFAB Laws of the Game defines every physical aspect of the playing field — dimensions, markings, surfaces, goals, flagposts, and technical areas. As a referee in Australia, understanding the field of play is fundamental. It determines where restarts occur, when the ball is out of play, how to manage the technical areas, and whether a pitch is safe to play on. This comprehensive guide covers every element of Law 1 in detail.',
    sections: [
      {
        heading: 'Pitch dimensions and shape',
        body: 'The field of play must be rectangular — the length of the touchline must always be greater than the length of the goal line. For international matches, the pitch must be 100–110 metres long and 64–75 metres wide. For all other matches, the range is broader: 90–120 metres long and 45–90 metres wide. Competition rules may further narrow these ranges. The field is bounded by two long sides called touchlines and two short sides called goal lines. All boundary lines are part of the area they define — this means the touchline is part of the field of play, and the goal line is part of the penalty area and goal area.',
      },
      {
        heading: 'Playing surface requirements',
        body: 'The playing surface can be natural grass, artificial turf, or a hybrid system combining both. It must be green in colour. For artificial surfaces, FIFA mandates specific quality certifications: FIFA Quality and FIFA Quality Pro marks ensure the surface meets performance and safety standards. The surface must be uniform and level — significant undulations, holes, or dangerous debris make a pitch unsafe. If the referee deems the surface dangerous, they have the authority to postpone or abandon the match under Law 5.',
      },
      {
        heading: 'Field markings explained',
        body: 'The field is marked with continuous lines that must all be the same width, not exceeding 12 centimetres (5 inches). The major markings include: the halfway line dividing the field into two equal halves, the centre mark at the midpoint of the halfway line, and a centre circle with a radius of 9.15 metres (10 yards) around the centre mark. Two penalty areas are marked at each end of the field. The penalty area extends 16.5 metres (18 yards) from each goalpost and 16.5 metres into the field, forming a rectangular area. The goal area is a smaller rectangle extending 5.5 metres (6 yards) from each goalpost and 5.5 metres into the field.',
      },
      {
        heading: 'The penalty area and penalty mark',
        body: 'The penalty area is one of the most important zones on the field for referees. A direct free kick foul committed inside the penalty area by the defending team results in a penalty kick (Law 14). The penalty mark is located 11 metres (12 yards) from the midpoint of the goal line, directly centred between the goalposts. An arc of a circle with a radius of 9.15 metres from the penalty mark is drawn outside the penalty area — this is the penalty arc, used to ensure all players (except the kicker and goalkeeper) remain at least 9.15 metres from the ball during a penalty kick.',
      },
      {
        heading: 'Corner arcs and flagposts',
        body: 'A quarter circle with a radius of 1 metre (1 yard) from each corner flagpost is drawn inside the field. This is the corner arc — the ball must be placed inside or on this arc when a corner kick is taken. Corner flagposts are compulsory and must be at least 1.5 metres (5 feet) high with a non-pointed top. They must not be removed for any reason, including when a corner kick is being taken. Halfway line flagposts are optional and may be placed at each end of the halfway line, at least 1 metre outside the touchline.',
      },
      {
        heading: 'Goals — dimensions and specifications',
        body: 'Goals must be placed on the centre of each goal line. They consist of two vertical posts equidistant from the corner flagposts and joined at the top by a horizontal crossbar. The distance between the inside of the posts is 7.32 metres (8 yards), and the distance from the lower edge of the crossbar to the ground is 2.44 metres (8 feet). Goalposts and crossbars must be the same width and depth, not exceeding 12 centimetres (5 inches). They must be white, made of wood, metal, or other approved material, and must not be dangerous. Nets may be attached to the goals and the ground behind, but they are not required by law.',
      },
      {
        heading: 'The technical area',
        body: 'Where a technical area exists, it extends 1 metre either side of the designated seated area and forward to within 1 metre of the touchline. Only one person at a time is authorised to convey tactical instructions from the technical area, and they must return to their position immediately after. Team officials must remain within the technical area except in special circumstances — entering the field requires the referee\'s permission. The fourth official monitors the technical area and reports any misconduct to the referee.',
      },
      {
        heading: 'Lines as part of the areas they define',
        body: 'A critical principle in Law 1 is that all lines belong to the area they define. The touchline is part of the field of play — the ball must wholly cross the touchline to be out of play. The goal line is part of the penalty area and goal area. This means that if a foul occurs with the ball on the penalty area line, it is considered to have occurred inside the penalty area. Similarly, if the ball is on the goal line between the posts and under the crossbar, it has not crossed the line and is therefore not a goal. The entire ball must cross the entire line.',
      },
    ],
    keyPoints: [
      'Pitch must be rectangular — touchline always longer than goal line',
      'All lines belong to the area they define (touchline = part of field)',
      'The centre circle has a radius of 9.15m (10 yards)',
      'Penalty area extends 16.5m from each goalpost into the field',
      'Goal area extends 5.5m from each goalpost into the field',
      'Penalty mark is 11m from the midpoint of the goal line',
      'Corner flagposts are compulsory and at least 1.5m high',
      'Goals are 7.32m wide and 2.44m high (inside measurements)',
      'Goal nets are permitted but not required by law',
      'The referee can postpone or abandon a match if the surface is unsafe',
    ],
    commonQuestions: [
      {
        q: 'What are the official dimensions of a football pitch?',
        a: 'For international matches: 100–110m long by 64–75m wide. For other matches: 90–120m long by 45–90m wide. The length must always exceed the width.',
      },
      {
        q: 'Are artificial pitches allowed in professional football?',
        a: 'Yes. FIFA Quality or FIFA Quality Pro certified artificial turf is permitted at all levels, including international matches. The surface must be green.',
      },
      {
        q: 'How big is a football goal?',
        a: 'The goal is 7.32 metres (8 yards) wide and 2.44 metres (8 feet) high, measured from the inside of the posts and the lower edge of the crossbar.',
      },
      {
        q: 'How far is the penalty spot from the goal?',
        a: 'The penalty mark is 11 metres (12 yards) from the midpoint of the goal line, centred between the goalposts.',
      },
      {
        q: 'How big is the penalty area in football?',
        a: 'The penalty area extends 16.5 metres (18 yards) from each goalpost and 16.5 metres into the field, forming a rectangle approximately 40.3m wide and 16.5m deep.',
      },
      {
        q: 'What is the centre circle for in football?',
        a: 'The centre circle (radius 9.15m/10 yards) ensures opponents stay the required distance from the ball at kick-off. Only the kicking team may be inside the circle when the kick is taken.',
      },
      {
        q: 'Is the line part of the penalty area?',
        a: 'Yes. All lines belong to the area they define. The penalty area line is part of the penalty area, so a foul on the line is a penalty kick.',
      },
      {
        q: 'Can a referee cancel a match because of the pitch?',
        a: 'Yes. Under Law 5, the referee has the authority to postpone, abandon, or not start a match if the field of play or its surroundings are deemed unsafe.',
      },
      {
        q: 'Are goal nets required in football?',
        a: 'No. Goal nets are permitted but not required by law. However, most competitions mandate nets in their own regulations.',
      },
      {
        q: 'What is the technical area in football?',
        a: 'The technical area extends 1 metre either side of the seating area and 1 metre from the touchline. Only one person at a time may stand in it to give tactical instructions.',
      },
      {
        q: 'How wide are the lines on a football pitch?',
        a: 'All lines must be the same width, not exceeding 12 centimetres (5 inches). They must be continuous and visible.',
      },
      {
        q: 'Can corner flagposts be removed during play?',
        a: 'No. Corner flagposts are compulsory and must not be removed for any reason, even to take a corner kick.',
      },
      {
        q: 'What is the penalty arc used for?',
        a: 'The penalty arc marks a 9.15m (10 yard) radius from the penalty mark. It ensures all players (except the kicker and goalkeeper) remain the required distance during a penalty kick.',
      },
      {
        q: 'What is the goal area used for?',
        a: 'Goal kicks can be taken from anywhere inside the goal area. If a dropped ball restart is required inside the goal area, it is taken on the goal area line parallel to the goal line at the nearest point.',
      },
      {
        q: 'What surface colours are allowed for football pitches?',
        a: 'The playing surface must be green. This applies to both natural grass and artificial turf.',
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
      'Law 2 specifies the qualities, measurements, and replacement procedures for the ball used in football. While it is one of the shorter laws, referees must be confident about ball specifications, what to do when a ball becomes defective, and how to manage multiple balls during a match. This page covers every aspect of Law 2 in detail.',
    sections: [
      {
        heading: 'Ball specifications and qualities',
        body: 'The ball must be spherical, made of suitable material (typically synthetic leather panels), have a circumference of 68–70 centimetres (size 5), weigh between 410 and 450 grams at the start of the match, and have a pressure equal to 0.6–1.1 atmosphere (600–1100 g/cm2) at sea level. The referee is responsible for checking that the ball meets these requirements before the match, though in practice most referees rely on the match ball bearing a FIFA Quality mark. For matches in FIFA competitions and competitions of FIFA member associations, only footballs bearing the FIFA Quality Programme, FIFA Quality, or FIFA Quality Pro marks are permitted.',
      },
      {
        heading: 'Ball sizes by age group',
        body: 'While Law 2 specifies size 5 for senior football, competition rules commonly prescribe smaller balls for younger age groups. Size 4 balls (circumference 63.5–66 cm, weight 340–390g) are standard for Under 12 to Under 14 matches. Size 3 balls (circumference 58–60 cm, weight 300–320g) are used for Under 8 and younger. The referee should confirm the correct ball size with the competition organiser before kick-off, particularly in junior football where the wrong ball size is a common issue.',
      },
      {
        heading: 'Replacement of a defective ball during play',
        body: 'If the ball becomes defective during play, the referee stops the match and restarts with a dropped ball using a replacement ball at the position where the original ball became defective. If the ball became defective inside the goal area, the dropped ball is taken on the goal area line parallel to the goal line at the nearest point to where the ball was when play was stopped. If the ball becomes defective during a penalty kick or during kicks from the penalty mark and has not yet touched the goalpost, crossbar, or a player, the kick is retaken.',
      },
      {
        heading: 'Replacement of a defective ball at a restart',
        body: 'If the ball becomes defective at a kick-off, goal kick, corner kick, free kick, penalty kick, or throw-in — that is, the ball was defective at the moment of the restart — the restart is simply retaken with a replacement ball. This is different from a ball becoming defective during open play, where a dropped ball is used. The distinction is important: if the ball bursts the moment a free kick is taken, the free kick is retaken rather than using a dropped ball.',
      },
      {
        heading: 'The multi-ball system',
        body: 'Many professional and semi-professional competitions use a multi-ball system where spare balls are placed around the perimeter of the field. When the match ball goes out of play, the nearest spare ball is used immediately to speed up restarts. The referee must ensure that all spare balls meet the required specifications before the match. Ball persons (ball kids) are responsible for retrieving and distributing spare balls. The referee can instruct ball persons to delay or accelerate the return of a ball if needed for match management purposes.',
      },
      {
        heading: 'Electronic performance tracking',
        body: 'Modern match balls may contain electronic performance and tracking (EPT) devices embedded in the ball. These devices are permitted provided they are safe, do not affect the ball\'s performance, and meet the requirements of the FIFA Quality Programme. EPT technology is used in conjunction with goal-line technology (GLT) to determine whether the ball has crossed the goal line, and with semi-automated offside technology (SAOT) to provide data for offside reviews. In Australia, EPT-equipped balls are used in the A-League.',
      },
      {
        heading: 'Referee responsibility and the pre-match check',
        body: 'The referee is the sole judge of whether the ball meets the required specifications. Before the match, the referee should check the ball\'s condition, pressure, and roundness. During the match, if a player or team official claims the ball is defective, the referee should inspect it at the next natural stoppage — there is no obligation to stop play immediately. If the referee determines the ball is satisfactory, play continues. The referee\'s decision on the ball\'s condition is final.',
      },
    ],
    keyPoints: [
      'Size 5 ball: circumference 68–70 cm, weight 410–450g',
      'Ball pressure must be 0.6–1.1 atmosphere at sea level',
      'The referee is the sole judge of whether the ball meets requirements',
      'Spare balls must be available around the field of play',
      'Defective ball during play: restart with a dropped ball',
      'Defective ball at a restart (FK, GK, CK, throw-in): retake the restart',
      'Defective ball during a penalty kick: retake the kick',
      'FIFA Quality marks are required for FIFA and member association competitions',
      'Electronic tracking devices are permitted if safe and approved',
      'Size 4 balls are standard for Under 12–14 matches',
    ],
    commonQuestions: [
      {
        q: 'What size ball is used in professional football?',
        a: 'Size 5 — circumference of 68–70 cm, weight of 410–450 grams at the start of the match.',
      },
      {
        q: 'What happens if the ball bursts during a goal kick?',
        a: 'Since the ball was defective at the restart, the goal kick is retaken with a replacement ball.',
      },
      {
        q: 'What happens if the ball bursts during open play?',
        a: 'Play is stopped and restarted with a dropped ball at the position where the ball became defective.',
      },
      {
        q: 'What happens if the ball bursts during a penalty kick?',
        a: 'If the ball has not yet touched the goalpost, crossbar, or a player, the penalty kick is retaken with a replacement ball.',
      },
      {
        q: 'What size ball is used for junior football?',
        a: 'Size 4 (circumference 63.5–66 cm) for Under 12 to Under 14. Size 3 (circumference 58–60 cm) for Under 8 and younger. Check with your competition.',
      },
      {
        q: 'Can the referee change the ball during a match?',
        a: 'Yes. The referee can replace the ball at any stoppage if they judge it to be defective or unsuitable. The referee\'s decision is final.',
      },
      {
        q: 'What is the FIFA Quality mark on a football?',
        a: 'FIFA Quality and FIFA Quality Pro marks certify that a ball meets specific performance standards for circumference, roundness, weight, bounce, water absorption, and pressure retention.',
      },
      {
        q: 'Are electronic chips inside footballs allowed?',
        a: 'Yes. Electronic performance and tracking (EPT) devices are permitted if they are safe, do not affect the ball, and are approved under the FIFA Quality Programme.',
      },
      {
        q: 'What happens if the ball hits an object above the pitch (e.g. floodlight)?',
        a: 'Play is stopped and restarted with a dropped ball at the position where the ball made contact with the object (treated similarly to a defective ball/outside interference).',
      },
      {
        q: 'What is the correct ball pressure for football?',
        a: '0.6 to 1.1 atmosphere (600–1100 g/cm2) at sea level. The referee checks this before the match.',
      },
      {
        q: 'Can a player request a different ball?',
        a: 'A player can request the referee inspect the ball, but the referee decides whether to replace it. The referee is not obligated to change the ball if they judge it satisfactory.',
      },
      {
        q: 'Who provides the match ball?',
        a: 'Competition rules determine who provides the ball. In Australian community football, the home team typically provides the match ball and spare balls.',
      },
      {
        q: 'What is the multi-ball system?',
        a: 'A system where spare balls are placed around the pitch perimeter. When the match ball goes out, the nearest spare is used immediately. Common in professional competitions to reduce delays.',
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
      'Law 3 governs the number of players required for a match, substitution procedures, the roles of team officers, and what happens when extra players or outside agents enter the field. In Australian football, competitions vary significantly in the number of permitted substitutions — from unlimited rolling subs in junior matches to 5-window systems in NPL. Referees must know both the law itself and their competition\'s specific regulations.',
    sections: [
      {
        heading: 'Number of players',
        body: 'A match is played by two teams, each with a maximum of eleven players, one of whom must be the goalkeeper. A match may not start or continue if either team has fewer than seven players. This minimum applies regardless of the reason for the reduction — whether through send-offs, injuries, or players leaving the field. If a team is reduced to fewer than seven players during the match, the referee must abandon the match. In Australian community football, smaller-sided formats (7-a-side, 9-a-side) have proportionally adjusted minimums set by competition rules.',
      },
      {
        heading: 'The goalkeeper',
        body: 'Each team must designate one player as the goalkeeper at all times. The goalkeeper is the only player permitted to handle the ball within their own penalty area (subject to back-pass restrictions). If the goalkeeper is sent off, injured, or swapped, the replacement must be clearly identified and wear a distinguishing jersey. An outfield player may swap positions with the goalkeeper provided the referee is informed beforehand and the change is made during a stoppage. If the swap is made without the referee\'s knowledge, both players are cautioned.',
      },
      {
        heading: 'Substitution procedures',
        body: 'Substitutions may only be made during a stoppage in play. The player being replaced must have the referee\'s permission to leave and must leave from the nearest point on the boundary line (unless otherwise directed by the referee for safety or injury reasons). The substitute only enters the field at the halfway line after the player being replaced has left and after receiving the referee\'s signal. A substitution is complete when the substitute enters the field — from that moment, the substitute becomes a player and the replaced player becomes a substituted player who may not return to the match.',
      },
      {
        heading: 'Number of substitutions allowed',
        body: 'The maximum number of substitutes is determined by competition rules. In FIFA competitions and most professional leagues, each team may use up to five substitutes in a maximum of three substitution windows (plus the half-time interval). Some competitions use different systems: Australian community leagues commonly allow unlimited rolling substitutions in junior matches, while NPL competitions across Football NSW and Football Victoria follow the five-substitution, three-window model. Referees must confirm the applicable rules before every match.',
      },
      {
        heading: 'Extra persons on the field of play',
        body: 'If a team official, substitute, substituted player, or sent-off player enters the field without permission, the referee must stop play (unless advantage applies) and caution or send off the person as appropriate. If the referee stops play, it is restarted with a direct free kick from where the interference occurred, or an indirect free kick if the person did not interfere with play. If a player who left the field for treatment or a clothing adjustment re-enters without the referee\'s permission, they are cautioned.',
      },
      {
        heading: 'Outside agents and spectators',
        body: 'If an outside agent (anyone not registered on the team sheet, including spectators, animals, or objects) enters the field and interferes with play, the referee stops the match and restarts with a dropped ball. If an outside agent enters but does not interfere, the referee stops play at the next stoppage. If a goal is scored with the ball having been touched by an outside agent, the goal is not awarded and play is restarted with a dropped ball.',
      },
      {
        heading: 'Team officers and the technical area',
        body: 'Only one team official at a time is authorised to convey tactical instructions from the technical area, and they must return to their seat immediately after. Team officers must behave responsibly. The referee can issue formal warnings, cautions (yellow card), or send-offs (red card) to team officials just as with players. A team official who is sent off must leave the field and its surroundings, including the technical area. If a team official cannot be identified, the senior coach present in the technical area receives the sanction.',
      },
      {
        heading: 'Concussion substitutions',
        body: 'IFAB has introduced trial rules for concussion substitutions in certain competitions. Under these trials, a team may make an additional substitution if a player is suspected of having a concussion, and this does not count against the team\'s normal substitution allowance. The opposing team is also permitted an additional substitution to maintain competitive balance. Concussion protocols are taken very seriously in Australian football, and referees should be familiar with their competition\'s specific concussion management procedures.',
      },
    ],
    keyPoints: [
      'Maximum 11 players per team, minimum 7 to start or continue a match',
      'One player must always be designated as goalkeeper',
      'Substitutes enter at the halfway line during a stoppage only',
      'A substituted player cannot return to the match (except in rolling sub competitions)',
      'Team officials can receive yellow and red cards for misconduct',
      'An outfield player can swap with the goalkeeper if the referee is informed',
      'If a team drops below 7 players, the match is abandoned',
      'Extra persons on the field without permission: caution + direct free kick',
      'Competition rules determine the number of substitutions allowed',
      'Concussion substitutions are additional and do not count against the normal allowance',
    ],
    commonQuestions: [
      {
        q: 'How many substitutions are allowed in football?',
        a: 'Competition rules determine the number. In most professional competitions: up to 5 substitutes in 3 windows (plus half-time). Many Australian community leagues allow unlimited rolling substitutions in junior matches.',
      },
      {
        q: 'Can a match continue with fewer than 7 players?',
        a: 'No. If a team is reduced to fewer than 7 players for any reason, the match cannot start or continue and the referee must abandon it.',
      },
      {
        q: 'Can a substituted player come back on the field?',
        a: 'No — in standard substitution rules, a substituted player cannot return to the match. However, in competitions using rolling substitutions, a replaced player may re-enter.',
      },
      {
        q: 'Can an outfield player become the goalkeeper?',
        a: 'Yes. Any player may swap with the goalkeeper provided the referee is informed before the change and it occurs during a stoppage. The new goalkeeper must wear a distinguishing jersey.',
      },
      {
        q: 'What happens if a team has 12 players on the field?',
        a: 'The referee stops play, identifies the extra player, and removes them. The extra person is cautioned. Play restarts with a direct free kick from where the ball was when play stopped, or a dropped ball if the extra person did not interfere.',
      },
      {
        q: 'What happens if a spectator enters the field?',
        a: 'The referee stops play. If the spectator interfered with play, the restart is a dropped ball. The referee does not restart until the spectator has been removed from the field.',
      },
      {
        q: 'Can a team official be sent off?',
        a: 'Yes. Team officials can receive yellow and red cards. A sent-off team official must leave the field and its surroundings, including the technical area.',
      },
      {
        q: 'Where does a substitute enter the field?',
        a: 'Substitutes must enter at the halfway line during a stoppage in play, after the player being replaced has left and the referee has given a signal.',
      },
      {
        q: 'What are rolling substitutions?',
        a: 'Rolling substitutions allow replaced players to re-enter the match later. This is common in Australian junior football but not used in most professional competitions.',
      },
      {
        q: 'What is a concussion substitution?',
        a: 'An additional substitution allowed when a player is suspected of having a concussion. It does not count against the team\'s normal allowance. The opposing team also gets an extra sub.',
      },
      {
        q: 'Can the goalkeeper be sent off?',
        a: 'Yes. If the goalkeeper is sent off, another player must take over as goalkeeper and wear a distinguishing jersey. The team plays with one fewer player.',
      },
      {
        q: 'What happens if a player enters the field without permission?',
        a: 'The player is cautioned (yellow card) for entering the field without the referee\'s permission. If they interfered with play, a direct free kick is awarded.',
      },
      {
        q: 'How many players are on a football team?',
        a: 'A maximum of 11 players per team on the field, including the goalkeeper. Squads typically have 16–23 players with the remaining players available as substitutes.',
      },
      {
        q: 'Can a team start with fewer than 11 players?',
        a: 'Yes, a team can start with fewer than 11 players as long as they have at least 7 (or the minimum set by competition rules for smaller-sided formats).',
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
      "Law 4 specifies what players must and must not wear during a football match. The referee is responsible for checking players' equipment before kick-off and ensuring compliance throughout the match, including when substitutes enter the field. Equipment violations are among the most common issues referees encounter in Australian community football, particularly jewellery and missing shinguards.",
    sections: [
      {
        heading: 'Compulsory equipment (the basic kit)',
        body: 'Every player must wear five items of compulsory equipment: (1) a jersey or shirt with sleeves, (2) shorts, (3) socks — any tape or material applied externally must be the same colour as the part of the sock it covers, (4) shinguards — made of rubber, plastic, or similar suitable material, providing a reasonable degree of protection, covered entirely by the socks, and (5) footwear. These five items are non-negotiable — a player who is missing any compulsory item must leave the field to correct it and can only return with the referee\'s permission during a stoppage.',
      },
      {
        heading: 'Colours and team identification',
        body: 'The two teams must wear colours that distinguish them from each other and from the referee and assistant referees. Goalkeepers must wear colours that are clearly distinguishable from all other players, the referee, and the assistant referees. If the two goalkeepers\' jerseys are the same colour and neither has a replacement, the referee allows play to continue. In practice, the home team has first choice of colours and the away team must change if there is a clash. The referee\'s jersey must also be distinct from both teams.',
      },
      {
        heading: 'Undershirts and undergarments',
        body: 'If a player wears an undershirt beneath their jersey, the sleeves of the undershirt must be the same colour as the main colour of the jersey sleeves. Similarly, undershorts or tights must be the same colour as the main colour of the shorts or the lowest part of the shorts. All players of the same team wearing undershorts or tights must wear the same colour. This rule ensures a uniform appearance and prevents confusion during play.',
      },
      {
        heading: 'Shinguards — requirements and standards',
        body: 'Shinguards are the only piece of protective equipment that is compulsory under the Laws of the Game. They must be made of rubber, plastic, or similar suitable material and must provide a reasonable degree of protection. They must be covered entirely by the socks. Shinguards that are too small, cracked, or broken do not provide reasonable protection and should not be accepted by the referee. In Australian junior football, referees should be particularly vigilant about shinguard compliance as children often forget them or wear undersized guards.',
      },
      {
        heading: 'Prohibited items — jewellery and dangerous equipment',
        body: 'Players must not use equipment or wear anything that is dangerous to themselves or others. All items of jewellery — including necklaces, rings, bracelets, earrings, leather bands, rubber bands, and all similar items — are forbidden and must be removed before the match. Taping over jewellery is not permitted; the item itself must be physically removed. Players with newly pierced ears must remove the studs or cover them is not acceptable — they must be taken out. Electronic communication devices are also prohibited unless they are part of an approved performance tracking system or referee communication equipment.',
      },
      {
        heading: 'Head covers, knee braces, and protective equipment',
        body: 'Head covers are permitted provided they are the same colour as the jersey, are not attached to the jersey, do not pose a danger to the wearer or other players, and do not have any protruding elements. Protective equipment such as headgear, facemasks, knee and arm protectors made of soft, lightweight, padded material is permitted, as are goalkeepers\' caps and sports spectacles. Modern protective headbands designed to reduce concussion risk are generally permitted if they meet the safety criteria. Medical alert bracelets or necklaces may be permitted if they are covered and present no danger.',
      },
      {
        heading: 'Footwear — boots, studs, and barefoot play',
        body: 'Footwear is compulsory but the Laws do not specify the type — boots, trainers, and sports shoes are all acceptable provided they are not dangerous. The referee assesses whether studs or blades are dangerous based on their condition and design. Worn, sharpened, or protruding metal studs may be deemed dangerous. Rubber-moulded studs and bladed boots are generally accepted. Playing barefoot is not permitted. In Australian community football, some junior competitions restrict the type of studs allowed — for example, no metal studs for under-8 matches.',
      },
      {
        heading: 'Equipment check procedures',
        body: 'The referee (or a delegated match official) checks players\' equipment before the match begins. Players whose equipment does not comply must leave the field to correct it. A player who leaves to correct their equipment may only re-enter with the referee\'s permission during a stoppage, and only after the referee (or match official) has verified the equipment. Substitutes\' equipment must be checked before they are allowed to enter the field. If the referee discovers non-compliant equipment during play, they wait for the next stoppage to address it unless the equipment is dangerous, in which case play is stopped immediately.',
      },
    ],
    keyPoints: [
      'Five compulsory items: jersey with sleeves, shorts, socks, shinguards (covered by socks), footwear',
      'All jewellery must be physically removed — taping over is not acceptable',
      'Goalkeepers must wear colours distinct from all other players and officials',
      'Undershirt sleeves must match the main colour of the jersey sleeves',
      'Shinguards must provide reasonable protection and be fully covered by socks',
      'Head covers are permitted if the same colour as the jersey and not dangerous',
      'Protective headgear and sports spectacles are permitted if safe',
      'Electronic devices are prohibited unless part of approved systems',
      'The referee checks equipment before the match and at substitutions',
      'A player with non-compliant equipment must leave the field to correct it',
    ],
    commonQuestions: [
      {
        q: 'Can players tape over jewellery in football?',
        a: 'No. All jewellery must be physically removed from the body. Taping, covering, or wrapping jewellery is not permitted under Law 4.',
      },
      {
        q: 'Are shin guards mandatory in football?',
        a: 'Yes. Shinguards are the only compulsory piece of protective equipment. They must be made of suitable material, provide reasonable protection, and be covered by the socks.',
      },
      {
        q: 'Can a player wear a headband or head cover?',
        a: 'Yes, provided it is the same colour as the jersey, not attached to the jersey, has no protruding elements, and is not dangerous. Protective headgear designed to reduce injury is also permitted.',
      },
      {
        q: 'Can a player wear glasses during a football match?',
        a: 'Yes. Sports spectacles are permitted provided they are not dangerous to the wearer or other players. Modern sports goggles with flexible frames are generally accepted.',
      },
      {
        q: 'What happens if a player loses a boot during play?',
        a: 'Play continues — the player may play on without the boot until the next natural stoppage. The player should put the boot back on at the earliest opportunity. If a player deliberately removes a boot, they may be cautioned.',
      },
      {
        q: 'Can goalkeepers wear tracksuit bottoms?',
        a: 'Yes. Goalkeepers may wear tracksuit bottoms instead of shorts, provided the colour is distinct from other players and officials.',
      },
      {
        q: 'Are GPS vests allowed in football?',
        a: 'Yes. Electronic performance and tracking systems (GPS vests) are permitted if they are safe, commercially available, and do not transmit data to the coaching staff in real time (unless competition rules allow it).',
      },
      {
        q: 'Can a player wear a wedding ring during a match?',
        a: 'No. All rings, including wedding rings, must be removed before play. No exceptions are made in the Laws of the Game for any type of jewellery.',
      },
      {
        q: 'What colour must the goalkeeper\'s jersey be?',
        a: 'The goalkeeper must wear colours that are clearly distinguishable from all other players (both teams), the referee, and the assistant referees. There is no specific colour requirement — just that it is distinct.',
      },
      {
        q: 'Can a player wear a knee brace?',
        a: 'Yes. Knee braces and arm protectors are permitted if they are made of soft, lightweight, padded material and are not dangerous to other players.',
      },
      {
        q: 'What happens if a player\'s kit clashes with the referee?',
        a: 'The referee may ask the player or team to change. In practice, the referee is more likely to change their own shirt colour since referee kits typically include multiple colour options.',
      },
      {
        q: 'Are metal studs allowed in football?',
        a: 'Metal studs are permitted provided they are not sharp, worn, or dangerous. The referee inspects boots and can prohibit any footwear deemed unsafe.',
      },
      {
        q: 'Can a player play barefoot?',
        a: 'No. Footwear is compulsory equipment under Law 4. A player cannot participate without shoes or boots.',
      },
      {
        q: 'What colour must undershorts be?',
        a: 'Undershorts or tights must be the same colour as the main colour of the shorts, or the lowest part of the shorts. All players of the same team must wear the same colour.',
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
      'Law 5 is arguably the most important law for any referee to understand thoroughly, as it defines your authority, powers, duties, and responsibilities on the field. The referee has full and final authority over all decisions connected with the match. In Australia, referees at all levels — from Saturday morning junior community matches to the A-League — operate under the same fundamental powers granted by Law 5. This page covers every aspect of the referee\'s role in comprehensive detail.',
    sections: [
      {
        heading: 'The authority of the referee',
        body: 'Each match is controlled by a referee who has full authority to enforce the Laws of the Game in connection with the match. The decisions of the referee regarding facts connected with play, including whether a goal is scored and the result of the match, are final. This is an absolute principle — no player, team official, or spectator can overrule the referee\'s decision on a matter of fact. The referee may only change a decision upon realising it is incorrect, or on the advice of another match official, provided play has not restarted or the referee has not signalled the end of a half (first or second, or extra time). Once play restarts, the decision is permanently final.',
      },
      {
        heading: 'Powers and duties',
        body: 'The referee enforces the Laws of the Game, controls the match in cooperation with other match officials, acts as timekeeper and keeps a record of the match, and stops, suspends, or abandons the match for any infringement of the Laws or for outside interference. The referee also stops the match if a player is seriously injured (allowing them to be quickly removed from the field) and ensures any player bleeding from a wound leaves the field. The referee has the power to take disciplinary action from entering the field for the pre-match inspection until leaving the field after the match ends, including during the half-time interval.',
      },
      {
        heading: 'Playing advantage — when and how',
        body: 'The referee allows play to continue when an offence occurs and the non-offending team will benefit from the advantage. If the anticipated advantage does not materialise within a few seconds (typically 2-3 seconds, though this is a matter of judgment), the referee penalises the original offence. Crucially, advantage is a power, not an obligation — the referee decides whether advantage benefits the fouled team. If the offence warrants a caution, it is still issued at the next stoppage even though advantage was played. For DOGSO offences where advantage is played and the attacking team scores or retains a clear opportunity, the sanction is reduced from red to yellow card. Advantage should not be applied in the defending team\'s own penalty area due to the high risk.',
      },
      {
        heading: 'Changing a decision',
        body: 'The referee may change a decision provided play has not restarted. If the referee signals the end of the first or second half (including extra time) and leaves the field or signals the end of the match, the decision cannot be changed. In practice, the most common reason for changing a decision is receiving information from an assistant referee that the referee did not see — for example, an assistant flagging for a foul the referee missed. With VAR, the referee can also change a decision based on video review for clear and obvious errors. The referee should always maintain composure when changing a decision and communicate clearly to both teams.',
      },
      {
        heading: 'Stopping play for injuries and medical emergencies',
        body: 'The referee must stop play if a player is seriously injured and ensure they are removed from the field. A player with a minor injury is not treated on the field — they must leave and can return only with the referee\'s permission after treatment, during a stoppage. If the referee has stopped play for an injury and no other reason requires a different restart, play is restarted with a dropped ball. The referee must stop play immediately for any head injury or suspected concussion. In Australian football, concussion protocols mandate that a player who has been assessed for concussion must not return to play until cleared by a medical professional.',
      },
      {
        heading: 'Suspending, postponing, and abandoning a match',
        body: 'The referee has the power to suspend play temporarily (e.g. for lightning, severe weather, floodlight failure, or crowd disturbance), postpone a match that has not started, or abandon a match that has started. The match is abandoned if the field or surrounding conditions become dangerous, if one team is reduced below seven players, or if there is persistent interference by outside agents. The referee submits a detailed report to the competition authority after any suspension or abandonment. In Australian community football, lightning is the most common reason for match suspension — most state federations follow a "30-30 rule" (suspend play for lightning within 30 seconds of thunder, wait 30 minutes after the last flash).',
      },
      {
        heading: 'Referee equipment and signals',
        body: 'The referee must carry a whistle (or whistles), a watch (two are recommended — one for match time, one for added time), yellow and red cards, a notebook or other means of keeping a record, and a coin for the toss. The referee may also use communication equipment to communicate with other match officials. The whistle is used to start and restart play, stop play for fouls and other stoppages, and signal the end of each half. Different whistle tones can convey urgency — a short blast for a minor foul, a long forceful blast for a serious offence. Hand signals indicate the direction of restarts, advantage, and indirect free kicks.',
      },
      {
        heading: 'Respect and match control',
        body: 'The referee is expected to manage the match with authority, fairness, and composure. Good match control involves positioning, communication, personality, and game awareness. The referee should be firm but approachable, consistent in their decisions, and proactive in managing potential flashpoints before they escalate. Preventive refereeing — using body language, verbal warnings, and positioning to manage the match before reaching for cards — is a key skill taught across Australian referee development programmes. The referee should not tolerate abuse, and all Australian state federations support referees who report misconduct through official channels.',
      },
    ],
    keyPoints: [
      'The referee has full and final authority over all facts connected with play',
      'Decisions can only be changed before play restarts (or before the half ends)',
      'Advantage is a power, not an obligation — use it only when the fouled team benefits',
      'Advantage for a cautionable offence: card is still shown at the next stoppage',
      'The referee must stop play immediately for serious injuries and head injuries',
      'The referee can suspend, postpone, or abandon a match for safety reasons',
      'Disciplinary authority extends from pre-match inspection to leaving the field',
      'The referee is the sole timekeeper and keeper of the match record',
      'VAR can advise the referee to change a decision for clear and obvious errors',
      'Preventive refereeing (communication, positioning) is a key match control tool',
    ],
    commonQuestions: [
      {
        q: 'Can a referee change their decision in football?',
        a: 'Yes, but only before play restarts or before signalling the end of a half. Once play has restarted, the decision is permanently final. With VAR, decisions can also be changed based on video review.',
      },
      {
        q: 'What is advantage in football refereeing?',
        a: 'Advantage allows play to continue when an offence occurs but the non-offending team would benefit more from continued play than from a stoppage and free kick. If the advantage does not materialise within a few seconds, the referee penalises the original offence.',
      },
      {
        q: 'Can a referee send off a player before the match starts?',
        a: 'Yes. The referee\'s disciplinary authority begins when they enter the field for the pre-match inspection and continues until they leave the field after the match ends, including the half-time interval.',
      },
      {
        q: 'Can a referee abandon a match?',
        a: 'Yes. The referee can abandon a match if conditions become dangerous (weather, lighting, crowd trouble), if a team is reduced below seven players, or if there is persistent outside interference.',
      },
      {
        q: 'What happens if the referee makes a mistake?',
        a: 'If the referee realises the error before play restarts, they can change the decision. Once play restarts, the decision is final. With VAR, clear and obvious errors on goals, penalties, red cards, and mistaken identity can be corrected.',
      },
      {
        q: 'Does the referee have to play advantage?',
        a: 'No. Advantage is optional — the referee uses judgment to decide whether the fouled team will benefit more from continued play or from the free kick. The referee is not obligated to play advantage.',
      },
      {
        q: 'Can a referee issue a yellow card after playing advantage?',
        a: 'Yes. If the offence warranted a caution, the yellow card is still shown at the next stoppage even though advantage was played. The card is not cancelled by the advantage.',
      },
      {
        q: 'What whistle does a referee use?',
        a: 'Any whistle that produces a clear, audible sound. Many referees use the Fox 40 Classic or similar pealess whistles. Two whistles are recommended in case one fails.',
      },
      {
        q: 'Can a referee be overruled?',
        a: 'No person can overrule the referee on a matter of fact. However, the referee may accept advice from assistant referees, the fourth official, or VAR and change their decision accordingly — this is the referee\'s own choice.',
      },
      {
        q: 'What happens if a player is injured and bleeding?',
        a: 'A player bleeding from a wound must leave the field immediately. They may only return after the bleeding has stopped, the wound is covered, and the referee (or match official) has confirmed their equipment/clothing is blood-free.',
      },
      {
        q: 'Can the referee stop play for a minor injury?',
        a: 'The referee should only stop play for a serious injury. For minor injuries, the player should leave the field for treatment at the next stoppage and return with the referee\'s permission.',
      },
      {
        q: 'What is preventive refereeing?',
        a: 'Preventive refereeing means using communication, body language, positioning, and verbal warnings to manage situations before they escalate to fouls or misconduct. It is a key skill for match control without over-reliance on cards.',
      },
      {
        q: 'Can the referee suspend a match for lightning?',
        a: 'Yes. The referee can suspend play for dangerous weather conditions, including lightning. Most Australian state federations follow the 30-30 rule: suspend for lightning within 30 seconds of thunder, wait 30 minutes after the last flash.',
      },
      {
        q: 'What record must the referee keep during a match?',
        a: 'The referee keeps a record of goals scored, cautions and send-offs (including the reason), substitutions, injuries requiring treatment, and any other significant incidents. This information is used for the match report.',
      },
      {
        q: 'Does the referee control the clock in football?',
        a: 'Yes. The referee is the sole timekeeper. They keep track of match time, calculate added time for stoppages, and decide when each half ends. The fourth official indicates the minimum added time.',
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
        heading: 'Assistant referees — appointment and authority',
        body: 'Two assistant referees may be appointed to assist the referee. They operate on opposite touchlines and are subordinate to the referee, meaning the referee may overrule any of their signals. Assistant referees are qualified match officials who have completed training specific to the role. At higher levels of Australian football, including state leagues and NPL competitions, assistant referees are formally appointed by the match allocator. Their positioning along the touchline allows them to provide critical information the referee may not be able to see from the centre of the field.',
      },
      {
        heading: 'Duties of assistant referees',
        body: 'The assistant referee\'s duties include indicating when the whole of the ball has passed out of the field of play and which team is entitled to a corner kick, goal kick, or throw-in. They signal when a player in an offside position should be penalised, when a substitution is requested, and when misconduct or any other incident has occurred out of the referee\'s view. They also assist with monitoring the nearest penalty area during penalty kicks, ensuring the goalkeeper does not leave the goal line early, and tracking the ball crossing the goal line for goal decisions.',
      },
      {
        heading: 'Assistant referee flag signals',
        body: 'Assistant referees communicate with the referee using a standardised set of flag signals. A raised flag indicates the ball is out of play or an offside offence has occurred. The direction the flag points indicates which team is awarded the restart. For offside, the assistant raises the flag vertically first, then points it to indicate the area of the field where the offence occurred — far side, centre, or near side. Substitution requests are signalled by holding the flag above the head with both hands. Consistent and clear flag technique is emphasised in Australian referee development programmes.',
      },
      {
        heading: 'The fourth official',
        body: 'The fourth official is appointed to assist the referee with administrative duties before, during, and after the match. They supervise the substitution procedure, check the equipment of substitutes before they enter the field, indicate the minimum amount of added time at the end of each half, and act as a point of contact between the referee and team officials in the technical areas. If a match official is unable to continue, the fourth official can replace them. In Australia, fourth officials are regularly appointed at NPL, A-League, and Football Australia Cup matches.',
      },
      {
        heading: 'Additional assistant referees (AARs)',
        body: 'Additional assistant referees are positioned behind each goal line to assist with decisions in and around the penalty area. Their primary focus is on incidents near the goal — whether the ball has crossed the goal line, penalty area offences, and goalkeeping infringements at penalty kicks. AARs communicate with the referee via an electronic communication system. While AARs are used in some international and continental competitions, they are not commonly appointed in Australian domestic football, where VAR technology has largely replaced their role at professional level.',
      },
      {
        heading: 'Video Assistant Referee (VAR)',
        body: 'Where appointed, the VAR can assist the referee with clear and obvious errors or serious missed incidents in four specific match-changing situations: goals and offences leading to goals, penalty decisions and offences in the penalty area, direct red card incidents, and mistaken identity when cautioning or sending off a player. The VAR reviews footage from multiple camera angles and advises the referee, who may accept the advice or conduct an on-field review (OFR) at the referee review area. The referee always retains the final decision. VAR is used in the A-League and select Football Australia competitions.',
      },
      {
        heading: 'Club linesmen and neutral assistant referees',
        body: 'When qualified assistant referees are not available, competition rules may allow club linesmen — one nominated by each team — to assist the referee. Club linesmen have significantly limited duties compared to assistant referees: they may only indicate when the ball has wholly passed over the touchline and which team is entitled to the throw-in. They cannot flag for offside, fouls, or misconduct. The referee should brief club linesmen before kick-off, providing a clear explanation of their restricted role. In Australian community football, club linesmen are common at junior and lower-division senior matches.',
      },
      {
        heading: 'Communication between match officials',
        body: 'Effective communication is the foundation of a well-functioning referee team. Before the match, the referee conducts a pre-match briefing covering positioning, signal protocols, areas of responsibility, and how to handle specific situations such as mass confrontation. During the match, officials communicate through flag signals, hand gestures, eye contact, and (at professional level) electronic communication systems with earpieces and microphones. Post-match, the team debriefs on key decisions. In Australian referee development, pre-match briefings are emphasised as a core competency from the earliest levels of officiation.',
      },
    ],
    keyPoints: [
      'Assistant referees indicate offsides, throw-ins, corner kicks, and misconduct',
      'The referee may overrule any decision made by an assistant referee',
      'The fourth official manages substitutions, added time, and the technical area',
      'VAR reviews goals, penalties, direct red cards, and mistaken identity only',
      'The referee always retains the final decision, even when VAR is used',
      'Additional assistant referees are positioned behind the goal line',
      'Club linesmen may only indicate when the ball is out of play over the touchline',
      'All match officials are subject to the authority of the referee (Law 5)',
      'A pre-match briefing between officials is essential for consistent decision-making',
      'Electronic communication systems are used at professional level in Australia',
    ],
    commonQuestions: [
      {
        q: 'What decisions can VAR review in football?',
        a: 'VAR can only review four categories: goals and offences leading to goals, penalty decisions, direct red card incidents (not second yellow cards), and mistaken identity when cautioning or dismissing a player.',
      },
      {
        q: 'What is the difference between an assistant referee and a linesman?',
        a: 'Assistant referees are qualified match officials who can flag for offside, fouls, restarts, and misconduct. Club linesmen are unqualified volunteers who may only indicate when the ball is out of play over the touchline.',
      },
      {
        q: 'What does the fourth official do in football?',
        a: 'The fourth official assists with substitutions, displays added time, monitors the technical areas, checks substitute equipment, and can replace any match official who is unable to continue.',
      },
      {
        q: 'Can the referee overrule the assistant referee?',
        a: 'Yes. The referee has the final decision on all matters and may overrule any signal or recommendation from the assistant referee, fourth official, or VAR.',
      },
      {
        q: 'What is an on-field review in VAR?',
        a: 'An on-field review (OFR) is when the referee views the incident on a pitchside monitor before making a final decision. The referee may also accept the VAR\'s recommendation without conducting an OFR.',
      },
      {
        q: 'Can a club linesman flag for offside?',
        a: 'No. Club linesmen can only indicate when the ball has crossed the touchline. They cannot flag for offside, fouls, or any other offence.',
      },
      {
        q: 'Who replaces the referee if they are injured during a match?',
        a: 'The fourth official typically replaces the referee. If no fourth official is appointed, the most senior assistant referee may take over, depending on competition rules.',
      },
      {
        q: 'What are additional assistant referees (AARs)?',
        a: 'AARs are match officials positioned behind each goal line who assist with decisions in the penalty area, including goal-line incidents, penalty area fouls, and goalkeeper infringements at penalty kicks.',
      },
      {
        q: 'How many match officials can there be in a football match?',
        a: 'A match can have up to eight officials: the referee, two assistant referees, a fourth official, two additional assistant referees, a reserve assistant referee, and a VAR with assistants (AVARs).',
      },
      {
        q: 'Do assistant referees wear communication earpieces?',
        a: 'At professional level, yes. Electronic communication systems allow the referee team to talk in real time. At community level in Australia, officials rely on flag signals, hand gestures, and eye contact.',
      },
      {
        q: 'What happens if an assistant referee makes a wrong offside call?',
        a: 'The referee may overrule the assistant referee if they have a better view. If VAR is available and a goal is scored, the offside decision can be reviewed and corrected.',
      },
      {
        q: 'Can VAR review yellow card decisions?',
        a: 'No. VAR cannot review cautions (yellow cards) unless it involves a case of mistaken identity — where the wrong player has been cautioned or sent off.',
      },
      {
        q: 'What is the "wait and see" technique for assistant referees?',
        a: 'The assistant referee delays raising the offside flag until the player in an offside position becomes actively involved in play. This prevents incorrect flags when the offside player does not affect the phase of play.',
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
        body: 'A match lasts two equal halves of 45 minutes each, unless otherwise agreed between the referee and the two teams before the start of play and in accordance with competition rules. The duration must be agreed before kick-off and cannot be changed during the match. In Australia, competition rules commonly shorten match length for junior age groups — for example, Under 8s may play 20-minute halves, while Under 16s may play 35- or 40-minute halves. Senior community competitions occasionally use reduced match lengths for mid-week fixtures or tournament formats.',
      },
      {
        heading: 'Half-time interval',
        body: 'Players are entitled to an interval at half-time, not exceeding 15 minutes. Competition rules must state the duration of the half-time interval, which may only be altered with the consent of the referee. Players may leave the field of play during half-time but must return promptly when the interval ends. The referee signals the end of the half-time interval and teams must be ready to restart play. If a team is not ready, the referee may start the second half regardless. In Australian community football, half-time intervals typically last 5 to 10 minutes depending on the competition.',
      },
      {
        heading: 'Allowance for time lost (added time)',
        body: 'The referee adds time at the end of each half to compensate for time lost during that half. Causes for time lost include substitutions, assessment and/or removal of injured players, time-wasting by any player, disciplinary sanctions (cautions and send-offs), medical stoppages including drinks breaks, VAR checks and reviews, goal celebrations, and any other cause including significant delays to restarts. The fourth official indicates the minimum additional time using an electronic board. The referee may always add more time but must not reduce the indicated amount.',
      },
      {
        heading: 'Drinks breaks and cooling breaks',
        body: 'A short drinks break, not exceeding one minute, is permitted at the midpoint of each half. This is separate from the half-time interval. In hot weather conditions, the referee may authorise cooling breaks of up to three minutes, typically taken around the 30th minute of each half. In Australia, cooling breaks are particularly relevant during summer fixtures and in tropical regions such as Queensland and the Northern Territory. Football Australia and state federations issue heat policies that specify when cooling breaks and match postponements are required based on temperature and humidity.',
      },
      {
        heading: 'Extra time in knockout matches',
        body: 'When competition rules require a definitive result, extra time may be played after the end of normal time. Extra time consists of two equal periods of 15 minutes each with an interval of no more than five minutes between them. The teams do not change ends between the two periods of extra time (they change ends at the start of extra time). Players may receive a drinks break at the interval between extra time periods. Added time is also applied at the end of each period of extra time. In Australian cup competitions such as the Australia Cup, extra time is standard procedure before kicks from the penalty mark.',
      },
      {
        heading: 'The referee as sole timekeeper',
        body: 'The referee is the sole timekeeper of the match. Only the referee decides when to end each half or period of play. The referee\'s watch is the official time, even if a stadium clock shows a different time. If the referee\'s watch or timing equipment malfunctions, the referee uses a backup watch or estimates the remaining time. The referee must not end a half while an attack is in progress — play continues until the attacking move is completed or the ball goes out of play. At professional level, the fourth official provides a secondary timing reference.',
      },
      {
        heading: 'Abandoned and suspended matches',
        body: 'A match that is abandoned (stopped permanently before the regulation time is complete) is replayed unless the competition rules provide otherwise. Common reasons for abandonment include dangerous weather (lightning, severe storms), floodlight failure, insufficient players due to injuries or dismissals (a team must have at least seven players), or serious crowd disturbances. In Australia, referees have the authority to suspend play temporarily (for example, during a thunderstorm) and resume when conditions improve. If the match cannot be resumed within a reasonable time, the referee abandons it and submits a report.',
      },
      {
        heading: 'Penalty kick at the end of a half',
        body: 'If a penalty kick is awarded at or after the end of normal time in a half, the half is extended until the penalty kick is completed. "Completed" means the ball stops moving, goes out of play, the referee stops play for an offence, or the kicker or a team-mate scores from a rebound. The defending goalkeeper may also commit an offence that results in a retake. All other players except the kicker and goalkeeper must remain outside the penalty area. This rule ensures that a team is never denied a penalty kick simply because time has run out.',
      },
    ],
    keyPoints: [
      'Standard match duration: two halves of 45 minutes each',
      'Half-time must not exceed 15 minutes',
      'Added time compensates for all stoppages during each half',
      'The fourth official indicates the minimum added time',
      'The referee may increase but never reduce the indicated added time',
      'A penalty kick at the end of a half must be completed',
      'The referee is the sole and final timekeeper',
      'Extra time in knockout matches: two periods of 15 minutes',
      'Drinks breaks (max one minute) are permitted at the midpoint of each half',
      'An abandoned match is replayed unless competition rules state otherwise',
    ],
    commonQuestions: [
      {
        q: 'How long is a football match?',
        a: 'A standard match lasts 90 minutes — two halves of 45 minutes each — plus any added time at the end of each half for stoppages.',
      },
      {
        q: 'How is added time calculated in football?',
        a: 'The referee tracks time lost for substitutions, injuries, time-wasting, disciplinary actions, VAR reviews, goal celebrations, and any other stoppages. This total is displayed as the minimum added time at the end of each half.',
      },
      {
        q: 'Can the referee end the match during an attack?',
        a: 'No. The referee should not blow the final whistle while an attacking move is in progress. Play continues until the attack is completed or the ball goes out of play.',
      },
      {
        q: 'What happens if a penalty is awarded at full time?',
        a: 'The half is extended until the penalty kick is completed. This includes any retakes required due to infringements. All other players except the kicker and goalkeeper must leave the penalty area.',
      },
      {
        q: 'How long is extra time in football?',
        a: 'Extra time consists of two periods of 15 minutes each (30 minutes total), with no more than a five-minute interval between the two periods.',
      },
      {
        q: 'What is a cooling break in football?',
        a: 'A cooling break of up to three minutes is permitted in hot weather conditions. It allows players to hydrate and cool down, typically taken around the 30th minute of each half.',
      },
      {
        q: 'Can the length of a football match be changed?',
        a: 'Yes. Competition rules may specify different match lengths (e.g. shorter halves for junior football). Any change must be agreed before kick-off and comply with competition regulations.',
      },
      {
        q: 'Who keeps time in a football match?',
        a: 'The referee is the sole official timekeeper. A stadium clock is for spectator reference only and is not the official time.',
      },
      {
        q: 'What happens if a match is abandoned?',
        a: 'An abandoned match is typically replayed in full, unless competition rules specify otherwise — for example, some competitions uphold the result if a certain amount of playing time has been completed.',
      },
      {
        q: 'Can the fourth official add time that the referee has not indicated?',
        a: 'No. The fourth official displays the minimum added time as determined by the referee. Only the referee can decide to add more time beyond the displayed amount.',
      },
      {
        q: 'Is there a half-time in extra time?',
        a: 'There is no formal half-time in extra time. Teams change ends at the start of extra time and have a brief interval (maximum five minutes) between the two periods.',
      },
      {
        q: 'How long is half-time in junior football in Australia?',
        a: 'It varies by competition, but most Australian junior competitions set half-time at 5 to 10 minutes. The referee should confirm with the competition coordinator before the match.',
      },
      {
        q: 'Can a match be stopped for lightning?',
        a: 'Yes. The referee must suspend play if lightning is observed. In Australia, the 30/30 rule is widely applied — suspend play if the gap between lightning and thunder is 30 seconds or less, and wait 30 minutes after the last flash before resuming.',
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
        heading: 'The coin toss and choosing ends',
        body: 'Before the match begins, the referee conducts a coin toss with the two team captains. The team that wins the toss chooses which goal to attack in the first half of the match. The other team takes the kick-off to start the first half. In the second half, the teams change ends and the team that won the toss takes the kick-off. If extra time is played, a new coin toss is conducted before extra time begins. The coin toss is a formal procedure — captains must be clearly identified and the result communicated to both teams and the assistant referees.',
      },
      {
        heading: 'Kick-off procedure',
        body: 'A kick-off is used to start each half of the match, each half of extra time, and to restart play after a goal has been scored. The ball must be stationary on the centre mark. All players must be in their own half of the field. Opponents of the team taking the kick-off must be at least 9.15 metres (10 yards) from the ball — effectively outside the centre circle — until the ball is in play. The ball is in play when it is kicked and clearly moves. The kicker must not touch the ball again until it has touched another player.',
      },
      {
        heading: 'Scoring directly from a kick-off',
        body: 'A goal may be scored directly from a kick-off against the opposing team. If the ball enters the kicker\'s own goal directly from a kick-off, a corner kick is awarded to the opposing team rather than an own goal. This provision exists because the Laws do not allow a goal to be scored directly against the kicking team from any restart where the ball is kicked into play (the same principle applies to free kicks and goal kicks). In practice, goals scored directly from kick-off are extremely rare but are a valid test question in referee assessments.',
      },
      {
        heading: 'Dropped ball — when and where',
        body: 'A dropped ball is used to restart play when the referee has stopped play for any reason not covered by another restart method. Common situations include a defective ball, an outside agent entering the field (such as a dog or spectator), a player requiring medical attention when the referee stops play, or the ball striking the referee and causing a change of possession, a goal, or a promising attack. The location of the dropped ball depends on where the ball was when play was stopped — if inside the penalty area, it is dropped for the goalkeeper; otherwise, it is dropped for the team that last touched the ball.',
      },
      {
        heading: 'Dropped ball procedure and rules',
        body: 'For a dropped ball, the referee drops the ball at the appropriate location for one player of the team entitled to possession. All other players (of both teams) must be at least 4 metres from the ball until it touches the ground. The ball is in play when it touches the ground. If the ball leaves the field of play after touching the ground without any player touching it, the dropped ball is retaken. The 2019 law change removed the contested dropped ball — the ball is now always returned to the team that last had possession, making the procedure fairer and reducing conflict.',
      },
      {
        heading: 'Dropped ball in the penalty area',
        body: 'If play was stopped with the ball inside the penalty area, or the last touch was in the penalty area, the dropped ball is always given to the defending team\'s goalkeeper. This rule applies regardless of which team last touched the ball. The rationale is to prevent the attacking team from gaining an advantage inside the penalty area from an uncontested restart. The goalkeeper receives the ball inside the penalty area, and all other players must remain at least 4 metres away until the ball is in play. This provision is frequently tested in Australian referee examinations.',
      },
      {
        heading: 'Kick-off after a goal is scored',
        body: 'After a goal is scored, the team that conceded the goal takes the kick-off to restart play. This is an important detail — many players and spectators mistakenly believe the scoring team restarts. The procedure is identical to the opening kick-off: ball on the centre mark, all players in their own half, opponents outside the centre circle. The referee should ensure all players are correctly positioned before blowing the whistle. Play cannot restart until the referee gives the signal, even if both teams appear ready.',
      },
      {
        heading: 'Infringements and sanctions at restarts',
        body: 'If a player commits an offence at a kick-off — such as touching the ball a second time before another player has touched it — an indirect free kick is awarded to the opposing team from the location of the offence. If the kick-off is taken before the referee\'s signal, the kick-off is retaken. For a dropped ball, if a player touches the ball before it contacts the ground, the dropped ball is retaken. If the ball enters a goal directly from a dropped ball without touching at least two players, play is restarted with a goal kick or corner kick as appropriate rather than awarding a goal.',
      },
    ],
    keyPoints: [
      'The coin toss winner chooses which goal to attack, not which team kicks off',
      'Kick-off starts each half and restarts play after every goal',
      'All players must be in their own half at kick-off',
      'Opponents must be outside the centre circle (9.15m) at kick-off',
      'A goal may be scored directly from a kick-off',
      'Dropped ball is awarded to the team that last touched the ball',
      'All other players must be at least 4m from a dropped ball',
      'A dropped ball in the penalty area always goes to the goalkeeper',
      'The ball is in play at kick-off when kicked and clearly moves',
      'The ball is in play at a dropped ball when it touches the ground',
    ],
    commonQuestions: [
      {
        q: 'Can you score directly from a kick-off in football?',
        a: 'Yes. A goal may be scored directly from a kick-off against the opposing team. If the ball enters the kicker\'s own goal, a corner kick is awarded instead.',
      },
      {
        q: 'When is a dropped ball used in football?',
        a: 'When the referee stops play for a reason not covered by other restart methods, such as a defective ball, an outside agent on the field, or the ball striking the referee and meeting certain conditions.',
      },
      {
        q: 'Who takes the kick-off after a goal is scored?',
        a: 'The team that conceded the goal takes the kick-off to restart play. This is the opposite of what many people assume.',
      },
      {
        q: 'What does the coin toss decide in football?',
        a: 'The team that wins the coin toss chooses which goal to attack in the first half. The other team takes the kick-off to start the match.',
      },
      {
        q: 'Can you score an own goal from a kick-off?',
        a: 'No. If the ball enters the kicker\'s own goal directly from a kick-off, a corner kick is awarded to the opposing team rather than an own goal.',
      },
      {
        q: 'Who gets the dropped ball in the penalty area?',
        a: 'The defending team\'s goalkeeper always receives the dropped ball when the restart location is inside the penalty area, regardless of which team last touched the ball.',
      },
      {
        q: 'How far must players be from a dropped ball?',
        a: 'All players other than the one receiving the dropped ball must be at least 4 metres away until the ball touches the ground and is in play.',
      },
      {
        q: 'What happens if the ball hits the referee during play?',
        a: 'If the ball touches the referee and results in a change of possession, a promising attack, or a goal, play is stopped and restarted with a dropped ball for the team that last had possession.',
      },
      {
        q: 'Can a kick-off be taken before the referee blows the whistle?',
        a: 'No. The kick-off cannot be taken until the referee gives the signal. If it is taken early, the kick-off is retaken.',
      },
      {
        q: 'Is a new coin toss held before extra time?',
        a: 'Yes. A new coin toss is conducted before extra time begins. The team that wins chooses which goal to attack, and the other team takes the kick-off.',
      },
      {
        q: 'What happens if the kicker touches the ball twice at kick-off?',
        a: 'An indirect free kick is awarded to the opposing team from the position where the second touch occurred.',
      },
      {
        q: 'Can a goal be scored directly from a dropped ball?',
        a: 'No. If the ball enters a goal without touching at least two players, the restart is a goal kick (if it enters the opponent\'s goal) or corner kick (if it enters the team\'s own goal).',
      },
      {
        q: 'Why was the contested dropped ball removed from the Laws?',
        a: 'The 2019 law change removed the contested dropped ball to reduce conflict and ensure fairness. The ball is now returned to the team that last had possession rather than being contested by both sides.',
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
        heading: 'Ball out of play — the fundamental rule',
        body: 'The ball is out of play when it has wholly passed over the goal line or touchline, whether on the ground or in the air. It is also out of play when play has been stopped by the referee (including for a foul, offside, or any other reason). The critical word is "wholly" — the entire circumference of the ball must completely cross the entire width of the line. If any part of the ball remains on or directly above the line, the ball is still in play. This principle applies equally to the touchlines and goal lines, and is the same standard used to determine whether a goal has been scored.',
      },
      {
        heading: 'Ball in play — the default state',
        body: 'The ball is in play at all other times not covered by the out-of-play provisions. This includes situations where the ball rebounds off a goalpost, crossbar, or corner flagpost and remains on the field of play. It also includes situations where the ball touches a match official (referee, assistant referee, or other official) who is positioned on the field of play, provided none of the specific conditions for a dropped ball are met. The ball being in play is the default state — play only stops when one of the specific out-of-play conditions is met.',
      },
      {
        heading: 'The "whole ball over the whole line" principle',
        body: 'This principle is central to multiple laws and is one of the most important concepts for referees to understand. The boundary lines (touchlines and goal lines) are part of the field of play (Law 1). Therefore, if any part of the ball is touching or overlapping the line — even by a millimetre — it has not wholly crossed the line and remains in play. This is a three-dimensional assessment: the ball could be in the air above the line and still be in play. Only when the entire ball has passed entirely beyond the outer edge of the line is it out of play.',
      },
      {
        heading: 'Ball striking the goalposts, crossbar, or corner flagpost',
        body: 'If the ball strikes a goalpost, crossbar, or corner flagpost and rebounds back onto the field of play, the ball remains in play and the match continues without interruption. The goalposts and crossbar are positioned on the goal line, and corner flagposts are positioned at the intersection of the touchline and goal line — all are considered part of the field of play. A ball that hits the post and goes into the goal is a valid goal (provided no offence was committed). A ball that hits the corner flagpost and stays on the field remains in play, even if it appears to have crossed the line before rebounding.',
      },
      {
        heading: 'Ball touching a match official',
        body: 'If the ball touches a match official who is on the field of play, the ball generally remains in play. However, since the 2019 law changes, play is stopped and restarted with a dropped ball if the ball touching the referee (or another match official on the field) results in any of the following: a goal is scored, the team in possession changes, or a promising attack begins. This change was introduced to prevent situations where a referee inadvertently affects the outcome of play. If none of these three conditions are met, play simply continues as normal.',
      },
      {
        heading: 'Goal-line technology and ball tracking',
        body: 'At professional level, goal-line technology (GLT) provides automated, near-instant confirmation of whether the ball has wholly crossed the goal line. The system sends a signal to the referee\'s watch within one second. In the A-League, GLT is used at venues where the technology is installed. At community level in Australia, referees rely on their own positioning and the assistance of neutral assistant referees (where appointed) to judge whether the ball has crossed the line. Correct positioning — staying wide and moving toward the goal line during attacks — is essential for accurate decisions.',
      },
      {
        heading: 'Practical positioning for ball-over-line decisions',
        body: 'For referees without technological assistance, positioning is the key to accurate ball-in-and-out-of-play decisions. Along the touchline, assistant referees should be in line with the ball or the second-last defender, giving them a clear sightline to judge whether the ball has crossed the touchline. For goal-line decisions, the referee should move toward the goal line during attacking play to improve their angle. At community level in Australia where single-referee systems are common, the referee must prioritise positioning near the goal line when an attack is developing, especially for close-range shots and scrambles.',
      },
      {
        heading: 'Relationship with other Laws',
        body: 'Law 9 directly connects to several other laws. Law 1 establishes that lines belong to the area they define. Law 10 uses the same "whole ball" principle to determine when a goal is scored. Laws 15, 16, and 17 specify the restarts that occur when the ball leaves the field over different lines — throw-in for the touchline, goal kick or corner kick for the goal line. Law 8 covers the dropped ball restart when the referee stops play. Understanding Law 9 is therefore essential for correctly applying restarts throughout the match.',
      },
    ],
    keyPoints: [
      'The whole ball must completely cross the whole line to be out of play',
      'If any part of the ball is on or above the line, it is still in play',
      'The ball remains in play if it hits the goalpost, crossbar, or corner flagpost',
      'The ball remains in play if it touches a match official on the field (with exceptions)',
      'Lines are part of the area they define — the touchline is part of the field',
      'Play is stopped with a dropped ball if the ball hits the referee and causes a goal, change of possession, or promising attack',
      'Goal-line technology provides automated goal/no-goal decisions at professional level',
      'The same "whole ball" principle determines goals (Law 10) and boundary decisions',
      'The ball is out of play whenever the referee stops play, regardless of its position',
      'Correct referee positioning is critical for accurate ball-over-line decisions',
    ],
    commonQuestions: [
      {
        q: 'Is the ball out if it is on the line in football?',
        a: 'No. The entire ball must completely cross the entire line. If any part of the ball is touching or hovering above the line, it is still in play.',
      },
      {
        q: 'What happens if the ball hits the referee?',
        a: 'Play normally continues. However, if the ball hitting the referee results in a goal, a change of possession, or a promising attack, play is stopped and restarted with a dropped ball.',
      },
      {
        q: 'Is the ball still in play if it hits the goalpost?',
        a: 'Yes. If the ball rebounds off the goalpost, crossbar, or corner flagpost and remains on the field of play, it is still in play and the match continues.',
      },
      {
        q: 'How do you tell if the ball has crossed the line?',
        a: 'The entire ball must pass entirely beyond the outer edge of the line. At professional level, goal-line technology provides automated confirmation. At community level, it depends on the referee\'s and assistant referee\'s positioning and judgement.',
      },
      {
        q: 'Does the ball have to touch the ground to be out of play?',
        a: 'No. The ball can be out of play whether on the ground or in the air. If the whole ball crosses the whole line at any height, it is out of play.',
      },
      {
        q: 'What is the restart when the ball goes over the touchline?',
        a: 'A throw-in is awarded to the opponents of the player who last touched the ball before it crossed the touchline (Law 15).',
      },
      {
        q: 'What is the restart when the ball goes over the goal line?',
        a: 'If last touched by an attacker, it is a goal kick (Law 16). If last touched by a defender, it is a corner kick (Law 17). If the ball enters the goal between the posts and under the crossbar, it is a goal (Law 10).',
      },
      {
        q: 'Is the corner flagpost part of the field of play?',
        a: 'Yes. The corner flagpost is positioned on the field, so if the ball strikes it and stays on the field, play continues. The ball is not out of play simply because it hit the flagpost.',
      },
      {
        q: 'Can the ball be in play if it is above the touchline?',
        a: 'Yes. The ball must wholly cross the line in any plane. If the ball is in the air directly above the touchline but has not fully passed beyond its outer edge, it is still in play.',
      },
      {
        q: 'What if the referee accidentally blocks a pass?',
        a: 'If the ball striking the referee does not result in a goal, a change of possession, or a promising attack, play continues. If any of those three consequences occur, play is stopped and restarted with a dropped ball.',
      },
      {
        q: 'Is goal-line technology used in Australia?',
        a: 'Goal-line technology is used at select A-League venues. It is not available at community or state league level in Australia, where referees must rely on their own positioning and judgement.',
      },
      {
        q: 'Does the ball being out of play stop the clock?',
        a: 'No. The match clock continues to run when the ball is out of play. However, the referee may add time at the end of each half for excessive delays during out-of-play periods.',
      },
      {
        q: 'What if the ball bursts during play?',
        a: 'The referee stops play. A replacement ball is dropped at the position where the original ball became defective. If it was inside the penalty area, it is dropped for the goalkeeper.',
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
        heading: 'When is a goal scored?',
        body: 'A goal is scored when the whole of the ball passes over the goal line, between the goalposts and under the crossbar, provided that no offence has been committed by the team scoring the goal. The same "whole ball over the whole line" principle from Law 9 applies — the entire circumference of the ball must completely cross the inner edge of the goal line. If any part of the ball is still on or above the line, no goal has been scored. This applies whether the ball is on the ground or in the air. At professional level, goal-line technology provides automated confirmation.',
      },
      {
        heading: 'Offences that invalidate a goal',
        body: 'A goal is disallowed if the scoring team committed an offence during the build-up to or the scoring of the goal. Common examples include an offside offence, a foul by an attacking player (such as pushing a defender), handball by an attacker (including accidental handball immediately before scoring or creating a goal-scoring opportunity), and an infringement at a restart such as a free kick taken from the wrong position. If VAR is available, goals are reviewed for these offences before being confirmed. The referee has the authority to disallow a goal at any point before play has restarted.',
      },
      {
        heading: 'Winning team and drawn matches',
        body: 'The team scoring the greater number of goals during the match is the winner. If both teams score the same number of goals, or neither team scores, the match is a draw. For league matches, a draw typically stands as the final result, with each team awarded one point. For knockout matches where a winner must be determined, competition rules may provide for extra time, kicks from the penalty mark, or both. The away goals rule, previously used in two-legged knockout ties, has been abolished by FIFA and most competitions including Football Australia.',
      },
      {
        heading: 'Extra time procedures',
        body: 'When competition rules require a winner and the match is drawn after normal time, extra time of two equal periods of 15 minutes may be played. A coin toss is conducted before extra time, and teams change ends at the start. There is no change of ends between the two periods, but there is an interval of no more than five minutes. Each team is permitted one additional substitution during extra time (in addition to any unused substitutions). Added time is calculated and applied at the end of each extra time period, just as in normal time. If the score is still level after extra time, kicks from the penalty mark follow.',
      },
      {
        heading: 'Kicks from the penalty mark — preparation',
        body: 'Before kicks from the penalty mark (KFTPM) begin, the referee confirms which players are eligible to participate. Only players who were on the field of play at the end of the match (or extra time) are eligible — substitutes who did not enter the match cannot take part. If one team has more eligible players than the other, the team with more players must reduce their number to match the smaller team. The referee selects the goal at which the kicks will be taken (usually based on safety and pitch conditions), conducts a coin toss, and records all eligible players.',
      },
      {
        heading: 'Kicks from the penalty mark — procedure',
        body: 'Each team takes five kicks alternately. The team that wins the coin toss decides whether to kick first or second. All players except the kicker and the two goalkeepers must remain in the centre circle. Each kick is taken by a different player, and all eligible players must take a kick before any player takes a second. If one team has scored more goals than the other could possibly score with their remaining kicks, the procedure ends immediately. If the score is level after five kicks each, kicks continue in sudden-death format — one kick each in the same order, until one team scores and the other does not from the same number of kicks.',
      },
      {
        heading: 'Goalkeeper rules during kicks from the penalty mark',
        body: 'The goalkeeper must remain on the goal line, facing the kicker, between the goalposts until the ball is kicked. At least one foot must be touching, or be in line with, the goal line when the kick is taken. The goalkeeper may move along the goal line but must not move off it before the ball is kicked. If the goalkeeper commits an infringement and the kick is missed or saved, the kick is retaken. If the goalkeeper commits an infringement and a goal is scored, the goal stands. Either team may change their goalkeeper at any time during KFTPM, provided the replacement is an eligible player.',
      },
      {
        heading: 'Recording and managing kicks from the penalty mark',
        body: 'The referee must maintain a clear written record of every kick, noting the kicker, whether a goal was scored, and any infringements. This is critical for ensuring the correct order of kickers, tracking when all players have taken a kick, and producing an accurate match report. The referee should also brief both teams on the procedure before kicks begin, including the rules on goalkeeper positioning, encroachment, and the order of kickers. In Australian cup competitions such as the Australia Cup and state knockout cups, referees should practise KFTPM administration as part of their pre-match preparation.',
      },
    ],
    keyPoints: [
      'The whole ball must cross the whole goal line between the posts and under the crossbar for a goal',
      'A goal is disallowed if the scoring team committed an offence in the build-up',
      'The referee can disallow a goal at any time before play restarts',
      'Competition rules determine how drawn matches are resolved',
      'Extra time consists of two periods of 15 minutes each',
      'Kicks from the penalty mark use five kicks per team, then sudden death',
      'All eligible players must take a kick before any player takes a second',
      'Only players on the field at the end of the match may participate in KFTPM',
      'The goalkeeper must have at least one foot on or in line with the goal line',
      'The away goals rule has been abolished by FIFA and Football Australia',
    ],
    commonQuestions: [
      {
        q: 'When is a goal scored in football?',
        a: 'A goal is scored when the whole of the ball passes over the goal line, between the goalposts and under the crossbar, provided no offence was committed by the scoring team.',
      },
      {
        q: 'How do penalty shoot-outs work?',
        a: 'Each team takes five kicks alternately. If the score is still level, kicks continue in sudden-death format — one kick each until one team scores and the other does not from the same number of kicks.',
      },
      {
        q: 'Can a goal be disallowed after it is scored?',
        a: 'Yes. The referee can disallow a goal at any time before play has restarted with the next kick-off. If VAR is available, it reviews all goals for possible offences before confirmation.',
      },
      {
        q: 'What happens if a penalty shoot-out is tied after five kicks?',
        a: 'Kicks continue in sudden-death format. Each team takes one kick at a time, in the same order, until one team scores and the other does not from the same number of kicks.',
      },
      {
        q: 'Can substitutes take penalty kicks in a shoot-out?',
        a: 'Only if they were on the field at the end of the match or extra time. A substitute who was not used during the match cannot participate in kicks from the penalty mark.',
      },
      {
        q: 'What if one team has more players for the shoot-out?',
        a: 'The team with more eligible players must reduce their number to match the team with fewer players. The excluded players are nominated before kicks begin and cannot take a kick unless the procedure reaches a second round.',
      },
      {
        q: 'Can the goalkeeper be changed during a penalty shoot-out?',
        a: 'Yes. Either team may change their goalkeeper at any time during kicks from the penalty mark, provided the replacement is an eligible player who is already participating.',
      },
      {
        q: 'Does the away goals rule still exist?',
        a: 'No. The away goals rule has been abolished by FIFA and most major competitions, including Football Australia. Two-legged ties that are level on aggregate proceed to extra time and/or kicks from the penalty mark.',
      },
      {
        q: 'What is the "golden goal" rule?',
        a: 'The golden goal rule (where the first goal scored in extra time immediately wins the match) is no longer part of the IFAB Laws of the Game. It was abolished in 2004. Extra time is now always played in full.',
      },
      {
        q: 'Where must the goalkeeper stand during a penalty shoot-out kick?',
        a: 'The goalkeeper must be on the goal line, between the goalposts, facing the kicker, with at least one foot touching or in line with the goal line until the ball is kicked.',
      },
      {
        q: 'What happens if the referee signals a goal but the ball did not cross the line?',
        a: 'If the referee realises the error before play restarts, the goal can be cancelled and play restarted with a dropped ball. If VAR is available, it will intervene to correct a clear and obvious error.',
      },
      {
        q: 'Can a goal be scored directly from a restart?',
        a: 'A goal can be scored directly from a kick-off, direct free kick, penalty kick, goal kick, or corner kick. A goal cannot be scored directly from an indirect free kick, throw-in, or dropped ball.',
      },
      {
        q: 'How are penalty shoot-outs recorded?',
        a: 'The referee keeps a written record of every kick, noting the kicker, whether a goal was scored, and any infringements. Goals from kicks from the penalty mark are not added to the match score — the result is recorded separately.',
      },
      {
        q: 'Are KFTPM goals counted in the match score?',
        a: 'No. Goals scored during kicks from the penalty mark are recorded separately from the match score. For example, if the match ends 1–1 and one team wins 4–2 on penalties, the official result is 1–1 (4–2 on penalties).',
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
      'Law 11 is one of the most debated and misunderstood laws in football. The offside rule exists to prevent players from gaining an unfair advantage by positioning themselves behind the defence. For Australian referees, mastering offside interpretation is critical — it is tested heavily in assessments and is one of the most common areas of match-day controversy. This page provides a comprehensive breakdown of every aspect of the offside rule, from the basic definition through to the most complex edge cases.',
    sections: [
      {
        heading: 'Offside position defined',
        body: 'A player is in an offside position if any part of the head, body, or feet is nearer to the opponents\' goal line than both the ball and the second-last opponent. The hands and arms of all players, including the goalkeeper, are not considered when determining offside position. This is consistent with the body parts that can legitimately play the ball. Crucially, being in an offside position is not an offence in itself — a player is only penalised if they become involved in active play at the moment the ball is played or touched by a team-mate. A player who is standing in an offside position but is not involved in the play commits no offence.',
      },
      {
        heading: 'The "second-last opponent" explained',
        body: 'The offside rule references the "second-last opponent" rather than the "last defender" because the goalkeeper typically counts as one of the two required opponents. In most situations, the goalkeeper is the last opponent and one outfield defender is the second-last, which is why people often simplify offside as "behind the last defender." However, if the goalkeeper has come upfield (for example, during a corner kick), then two outfield players become the reference points. A player is not offside if they are level with the second-last opponent — "level" means any part of their eligible body (head, body, or feet) is in line with the second-last opponent.',
      },
      {
        heading: 'Interfering with play',
        body: 'A player in an offside position is penalised for interfering with play if they touch or play the ball that has been passed or touched by a team-mate. This is the most straightforward offside offence. The key moment is when the ball is played by the team-mate, not when the player receives it. If a player is onside when the ball is played but then moves into an offside position before touching it, they are not offside. Conversely, if a player is offside when the ball is played but then moves back onside before touching it, they are still offside because position is judged at the moment the ball is played.',
      },
      {
        heading: 'Interfering with an opponent',
        body: 'A player in an offside position interferes with an opponent by preventing the opponent from playing or being able to play the ball by clearly obstructing the opponent\'s line of vision, or by challenging an opponent for the ball, or by clearly attempting to play a ball near them that impacts an opponent, or by making an obvious action that clearly impacts the ability of an opponent to play the ball. This category covers situations where an offside player does not touch the ball but still affects the play — for example, by standing directly in front of the goalkeeper and blocking their view of a shot, or by making a run toward the ball that causes a defender to change direction even though the offside player does not ultimately touch it.',
      },
      {
        heading: 'Gaining an advantage by being in an offside position',
        body: 'A player in an offside position is penalised for gaining an advantage if they play the ball or interfere with an opponent after the ball has rebounded or been deflected off the goalpost, crossbar, a match official, or an opponent. The key word is "deliberately" — if an opponent deliberately plays the ball (for example, a deliberate clearance or save by the goalkeeper), then the offside player is not considered to have gained an advantage and may play the ball. However, if the ball merely deflects or ricochets off an opponent without a deliberate play, the offside player is still penalised. This distinction between a "deliberate play" and a "deflection" is one of the most difficult interpretations in the offside rule and is frequently tested in referee assessments.',
      },
      {
        heading: 'When there is no offside offence',
        body: 'There is no offside offence if a player receives the ball directly from a goal kick, a throw-in, or a corner kick, even if the player is in an offside position. A player is also not in an offside position if they are in their own half of the field of play, or if they are level with the second-last opponent, or if they are level with the last two opponents. These three restart exceptions (goal kick, throw-in, corner kick) are among the most frequently tested aspects of the offside rule. Note that there is no exception for free kicks — a player can be offside from a free kick, whether direct or indirect.',
      },
      {
        heading: 'The "deliberate play" vs "deflection" distinction',
        body: 'One of the most complex areas of offside interpretation involves determining whether an opponent "deliberately played" the ball. If a defender makes a deliberate attempt to play the ball (e.g. a clearance, interception, or save) and the ball then goes to a player who was in an offside position, that player is not offside because the defender\'s action created a "new phase of play." However, if the ball merely deflects off a defender (with no deliberate attempt to play it), or if the defender\'s clearance is uncontrolled and the ball ricochets off them, the offside player is considered to have gained an advantage and should be penalised. The test is whether the defender had time to react and made a deliberate attempt to play the ball, regardless of whether that attempt was successful.',
      },
      {
        heading: 'Offside and VAR',
        body: 'In competitions using Video Assistant Referee (VAR) technology, offside decisions can be reviewed using replay footage and calibrated line technology. VAR draws precise offside lines on the pitch to determine whether any eligible body part of the attacking player was beyond the second-last defender when the ball was played. In the A-League in Australia, VAR is used for offside reviews on goals. At community level where VAR is not available, the assistant referee and referee must rely on their positioning, concentration, and the "wait and see" technique to make offside decisions in real time.',
      },
    ],
    keyPoints: [
      'Being in an offside position alone is not an offence — the player must be involved in active play',
      'Offside is judged at the exact moment the ball is played or touched by a team-mate',
      'No offside from goal kicks, throw-ins, or corner kicks',
      'Arms and hands do not count for determining offside position',
      'The restart for an offside offence is an indirect free kick from where the offence occurred',
      '"Level" with the second-last opponent means the player is not in an offside position',
      'A deliberate play by an opponent creates a new phase of play and resets offside',
      'A deflection off an opponent does not reset offside — the attacker is still penalised',
      'The goalkeeper usually counts as one of the two required opponents',
      'VAR uses calibrated lines for offside reviews in professional competitions',
    ],
    commonQuestions: [
      {
        q: 'What is the offside rule in football explained simply?',
        a: 'A player is offside if any part of their head, body, or feet is closer to the opponents\' goal than both the ball and the second-last opponent at the moment a team-mate plays the ball to them, and they are involved in active play. Think of it as: you cannot be behind the defence when your team-mate passes to you.',
      },
      {
        q: 'Can you be offside from a throw-in?',
        a: 'No. There is no offside offence if the ball is received directly from a throw-in. The same applies to goal kicks and corner kicks.',
      },
      {
        q: 'Can you be offside from a free kick?',
        a: 'Yes. Unlike throw-ins, goal kicks, and corner kicks, there is no offside exception for free kicks. A player can be penalised for offside from both direct and indirect free kicks.',
      },
      {
        q: 'Can you be offside in your own half?',
        a: 'No. A player in their own half of the field is never in an offside position, regardless of where the opponents are.',
      },
      {
        q: 'Do arms count for offside?',
        a: 'No. Hands and arms are not considered when determining offside position. This applies to all players, including the goalkeeper. Only the head, body, and feet are used.',
      },
      {
        q: 'What is the "wait and see" technique for offside?',
        a: 'The "wait and see" technique means the assistant referee delays raising the flag when a player is in an offside position until that player becomes actively involved in play. This prevents incorrect flags in situations where the offside player does not interfere with play.',
      },
      {
        q: 'What happens if the ball deflects off a defender to an offside player?',
        a: 'If the ball deflects or ricochets off a defender without a deliberate attempt to play it, the offside player is penalised for gaining an advantage. However, if the defender made a deliberate play on the ball (e.g. an attempted clearance), the offside player is not penalised.',
      },
      {
        q: 'What is the difference between a "deliberate play" and a "deflection" for offside?',
        a: 'A deliberate play is when a player chooses to play the ball (e.g. a tackle, clearance, or save). A deflection is when the ball bounces off a player unintentionally. Deliberate plays reset offside; deflections do not.',
      },
      {
        q: 'Can a goalkeeper be offside?',
        a: 'Technically, yes — if a goalkeeper moves upfield into the opponents\' half and is in an offside position when a team-mate plays the ball. However, this is extremely rare in practice.',
      },
      {
        q: 'What is the restart for an offside offence?',
        a: 'An indirect free kick is awarded to the defending team from the position where the offside player was when their team-mate played the ball.',
      },
      {
        q: 'Can you be offside if you are behind the ball?',
        a: 'No. You cannot be in an offside position if you are behind the ball (nearer to your own goal than the ball). Even if there are no defenders between you and the goal, being behind the ball means you are not offside.',
      },
      {
        q: 'Is it offside if a player runs from onside to offside after the ball is played?',
        a: 'No. Offside position is judged at the exact moment the ball is played by a team-mate. If the player was onside at that moment, they can run into an offside position afterwards and still legally play the ball.',
      },
      {
        q: 'What does "interfering with an opponent" mean in offside?',
        a: 'Interfering with an opponent means preventing them from playing the ball by blocking their line of vision, physically challenging them, or making an obvious action that impacts their ability to play — even without touching the ball yourself.',
      },
      {
        q: 'How does VAR check offside?',
        a: 'VAR uses calibrated camera angles and draws precise lines on the pitch to determine whether any eligible body part of the attacker was beyond the second-last defender at the exact frame when the ball was played.',
      },
      {
        q: 'Can you be offside from a corner kick?',
        a: 'No. There is no offside offence from a corner kick. However, once the ball has been touched by another player after the corner kick, normal offside rules apply again.',
      },
    ],
    refereeTips: [
      'Focus on the moment the ball is played — that is the only moment offside position matters',
      'Use the "wait and see" technique: delay the flag until the player becomes involved in active play',
      'Communicate with your assistant referee about marginal calls — eye contact and body language matter',
      'Remember the three exceptions: goal kick, throw-in, corner kick — commit these to memory',
      'For the "deliberate play" vs "deflection" distinction, ask: did the defender choose to play the ball?',
      'Position yourself in line with the second-last defender, not the last defender',
      'Keep both the ball and the offside line in your peripheral vision simultaneously',
    ],
    australiaContext: 'Offside is the most frequently debated decision in Australian football at every level. Without VAR at community level, referees and assistant referees must rely on positioning and concentration. Football NSW and Football Victoria both include specific offside assessment modules in their referee development programmes. In the A-League, VAR reviews all offside decisions on goals using calibrated line technology. For community referees working without neutral assistants, offside decisions become even more challenging — you must judge both the moment the ball is played and the position of the players from a single vantage point. RefZone\'s quiz bank includes over 50 offside-specific questions to help Australian referees master this law.',
    ifabUrl: 'https://www.theifab.com/laws/latest/offside/',
    searchTerms: ['offside rule', 'offside position', 'offside explained', 'interfering with play', 'gaining an advantage', 'second last opponent', 'offside from goal kick', 'offside from throw-in', 'offside from corner', 'active play', 'offside trap', 'delayed flag', 'wait and see', 'offside line', 'deliberate play', 'deflection', 'VAR offside', 'can you be offside in own half', 'offside from free kick'],
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
      'Law 12 is the most extensive and frequently applied law in football. It defines what constitutes a foul, the difference between direct and indirect free kicks, and the disciplinary actions available to the referee. For Australian referees, Law 12 is the foundation of match control — understanding careless, reckless, and excessive force is essential at every level of the game. This comprehensive guide covers every aspect of fouls and misconduct, from physical challenges through to handball, dissent, and the DOGSO rule.',
    sections: [
      {
        heading: 'Direct free kick offences',
        body: 'A direct free kick is awarded if a player commits any of the following offences against an opponent in a manner considered by the referee to be careless, reckless, or using excessive force: charges, jumps at, kicks or attempts to kick, pushes, strikes or attempts to strike (including head-butt), tackles or challenges, or trips or attempts to trip. A direct free kick is also awarded if a player handles the ball deliberately (except the goalkeeper in their own penalty area, subject to specific restrictions). If the offence occurs inside the offender\'s penalty area, a penalty kick is awarded instead of a direct free kick. The key distinction is the level of force: careless (free kick only), reckless (free kick + yellow card), or excessive force (free kick + red card).',
      },
      {
        heading: 'Careless, reckless, and excessive force explained',
        body: 'A careless challenge is one where the player shows a lack of attention or consideration when making a challenge, or acts without precaution. No disciplinary sanction is required — just a free kick. A reckless challenge is one where the player acts with disregard to the danger to, or consequences for, an opponent. A reckless challenge must be sanctioned with a yellow card (caution). Using excessive force means the player far exceeds the necessary use of force and endangers the safety of an opponent. A challenge using excessive force must be sanctioned with a red card (send-off). This three-tier system is the cornerstone of Law 12 and is the framework referees use for every physical challenge.',
      },
      {
        heading: 'Indirect free kick offences',
        body: 'An indirect free kick is awarded if a player plays in a dangerous manner (e.g. attempting to kick the ball near an opponent\'s head), impedes the progress of an opponent without any contact being made, or prevents the goalkeeper from releasing the ball from their hands. Specific goalkeeper offences also result in an indirect free kick: handling a deliberate kick-back from a team-mate (the back-pass rule), handling a throw-in received directly from a team-mate, touching the ball with the hands after releasing it and before it touches another player, and holding the ball for more than six seconds. The referee signals an indirect free kick by raising one arm above the head and keeping it raised until the ball is played and touches another player or goes out of play.',
      },
      {
        heading: 'Handling the ball (handball)',
        body: 'Handball is one of the most complex and frequently debated areas of Law 12. It is an offence if a player deliberately touches the ball with their hand or arm. It is also usually an offence if the ball touches a player\'s hand/arm when it has made the body unnaturally bigger, or when the hand/arm is above or beyond the shoulder level. After recent IFAB clarifications, a goal scored or chance created using the hand/arm is always penalised, even if accidental. However, it is not an offence if the ball touches a player\'s hand/arm directly from the player\'s own head, body, or foot, or if the hand/arm is close to the body and does not make the body unnaturally bigger. For goalkeepers, handling restrictions apply outside their own penalty area (treated the same as any outfield player) and for back-passes inside it.',
      },
      {
        heading: 'Cautionable offences (yellow card)',
        body: 'A player is cautioned and shown a yellow card for any of the following: delaying the restart of play, dissent by word or action, entering or re-entering the field without permission, deliberately leaving the field without permission, failing to respect the required distance at a corner kick, free kick, or throw-in, persistent infringement of the Laws of the Game, and unsporting behaviour. Unsporting behaviour is a broad category that includes simulation (diving), reckless challenges, handling the ball to prevent a promising attack, committing a tactical foul, showing a lack of respect for the game, and verbally distracting an opponent during play. Team officials can also receive yellow cards for irresponsible behaviour in the technical area.',
      },
      {
        heading: 'Sending-off offences (red card)',
        body: 'A player is sent off and shown a red card for any of the following: serious foul play (a tackle or challenge that endangers the safety of an opponent using excessive force or brutality), violent conduct (using or attempting to use excessive force or brutality against any person when not challenging for the ball), spitting at or towards any person, biting or attempting to bite any person, denying the opposing team a goal or an obvious goal-scoring opportunity by a handball offence, denying an obvious goal-scoring opportunity by a foul (DOGSO), using offensive, insulting, or abusive language and/or action, or receiving a second caution (yellow card) in the same match. A player who is sent off must leave the field and its surroundings, including the technical area.',
      },
      {
        heading: 'Denying an obvious goal-scoring opportunity (DOGSO)',
        body: 'DOGSO is one of the most critical concepts in Law 12. When a player commits a foul that denies an obvious goal-scoring opportunity, the referee must consider four criteria: the distance between the offence and the goal, the general direction of play, the likelihood of keeping or gaining control of the ball, and the location and number of defenders. If a player inside the penalty area commits a DOGSO foul and the referee awards a penalty kick, the offending player receives a yellow card (not a red card) — this is known as the "triple punishment" reduction introduced by IFAB. However, if the foul involves holding, pulling, pushing, or no attempt to play the ball, or the offence is outside the penalty area, a red card is still given. If the referee plays advantage for DOGSO, the offending player receives a yellow card.',
      },
      {
        heading: 'Fouls against the goalkeeper',
        body: 'The goalkeeper is protected by specific provisions in Law 12. It is an offence to prevent the goalkeeper from releasing the ball from their hands. A player who impedes the goalkeeper\'s release (e.g. by blocking the throw or kick) commits an indirect free kick offence. Physical challenges against the goalkeeper are judged using the same careless/reckless/excessive force framework as any other challenge. Charging the goalkeeper while they are holding the ball is not permitted, as the goalkeeper is considered to be in control of the ball when touching it with any part of the hands or arms. The goalkeeper\'s six-second rule is enforced by an indirect free kick, though in practice referees often warn the goalkeeper before penalising.',
      },
    ],
    keyPoints: [
      'Careless = lack of attention (free kick only); reckless = disregard for danger (+ yellow card); excessive force = endangers safety (+ red card)',
      'Direct free kick fouls inside the penalty area become penalty kicks',
      'Two yellow cards in one match result in a red card and send-off',
      'DOGSO by foul in the penalty area: yellow card if a penalty is awarded (not red)',
      'DOGSO outside the penalty area or with no attempt to play the ball: red card',
      'Indirect free kicks include back-pass violations, dangerous play, and impeding',
      'Handball is always penalised if the hand/arm is above shoulder level',
      'Goalkeeper holding the ball for more than 6 seconds: indirect free kick',
      'Team officials can receive yellow and red cards for misconduct',
      'Simulation (diving) is cautionable as unsporting behaviour',
    ],
    commonQuestions: [
      {
        q: 'What is a red card offence in football?',
        a: 'Red card offences include serious foul play, violent conduct, denying a goal-scoring opportunity by foul or handball, spitting, biting, offensive/abusive language or gestures, and receiving a second yellow card in the same match.',
      },
      {
        q: 'What is the difference between a direct and indirect free kick?',
        a: 'A goal can be scored directly from a direct free kick. An indirect free kick requires the ball to touch another player before a goal can be scored. The referee signals an indirect free kick by raising an arm.',
      },
      {
        q: 'What is the difference between careless, reckless, and excessive force?',
        a: 'Careless means lack of attention — just a free kick. Reckless means disregard for danger — free kick plus a yellow card. Excessive force means endangering the opponent\'s safety — free kick plus a red card.',
      },
      {
        q: 'What is DOGSO in football?',
        a: 'DOGSO stands for Denying an Obvious Goal-Scoring Opportunity. If a player commits a foul that prevents a clear chance on goal, they are normally sent off. However, if the foul is inside the penalty area and a penalty is awarded, the player receives a yellow card instead of red.',
      },
      {
        q: 'What is the back-pass rule?',
        a: 'If a team-mate deliberately kicks the ball to their own goalkeeper and the goalkeeper handles it, an indirect free kick is awarded to the opposing team from where the goalkeeper touched the ball. The same applies if the goalkeeper handles a throw-in from a team-mate.',
      },
      {
        q: 'Is diving a yellow card offence?',
        a: 'Yes. Simulation (attempting to deceive the referee by faking a fall or injury) is classified as unsporting behaviour and is punishable with a yellow card.',
      },
      {
        q: 'Can a goalkeeper get a yellow card for time-wasting?',
        a: 'Yes. The goalkeeper is subject to the same disciplinary rules as any other player. Holding the ball for more than six seconds results in an indirect free kick, and deliberately wasting time can result in a yellow card.',
      },
      {
        q: 'What happens if a player gets two yellow cards?',
        a: 'A player who receives two yellow cards in the same match is shown a red card and sent off. The two yellow cards result in an automatic send-off — the player must leave the field and cannot be replaced.',
      },
      {
        q: 'Is a shirt pull a foul in football?',
        a: 'Yes. Holding or pulling an opponent\'s shirt is a foul and results in a direct free kick (or penalty if inside the penalty area). Depending on the context, it may also warrant a yellow card for unsporting behaviour or a red card for DOGSO.',
      },
      {
        q: 'What is serious foul play?',
        a: 'Serious foul play is a tackle or challenge that endangers the safety of an opponent using excessive force or brutality when challenging for the ball. It results in a red card. The key factor is the degree of force — challenges that could cause injury are classified as serious foul play.',
      },
      {
        q: 'What is dangerous play in football?',
        a: 'Dangerous play is any action that threatens injury to someone, including the player themselves. Common examples include a high foot near an opponent\'s head and playing on the ground in a way that risks being kicked. It results in an indirect free kick — no card unless reckless.',
      },
      {
        q: 'Can you get a red card without getting a yellow card first?',
        a: 'Yes. A straight red card is given for serious foul play, violent conduct, DOGSO, spitting, biting, or offensive language/gestures. These do not require a prior yellow card.',
      },
      {
        q: 'What is the handball rule in football?',
        a: 'A handball is penalised when a player deliberately handles the ball, when the hand/arm makes the body unnaturally bigger, or when the hand/arm is above shoulder level. A goal scored using the hand/arm is always disallowed, even if accidental.',
      },
      {
        q: 'What counts as dissent in football?',
        a: 'Dissent is protesting or showing disagreement with a referee\'s decision by word or action. This includes arguing, throwing the ball away after a decision, or making sarcastic gestures. Dissent is punishable with a yellow card.',
      },
      {
        q: 'Can a substitute receive a red card?',
        a: 'Yes. A substitute or substituted player can receive a yellow or red card for misconduct, including during the half-time interval. If a substitute is sent off before entering play, they cannot be replaced — the team plays with the same number of players.',
      },
    ],
    refereeTips: [
      'Distinguish between careless (free kick only), reckless (free kick + caution), and excessive force (free kick + send-off) on every challenge',
      'For handling decisions, ask: was the arm in an unnatural position? Did the player make their body bigger? Was the hand above shoulder level?',
      'When applying DOGSO, consider the four criteria: distance to goal, direction of play, likelihood of keeping the ball, and location/number of defenders',
      'Keep your cards in separate pockets — yellow in one, red in the other — to avoid mistakes under pressure',
      'Record the time, player number, and reason for every card in your notebook immediately',
      'For the "triple punishment" rule, remember: DOGSO foul + penalty awarded = yellow card, not red',
      'When assessing a tackle, look at the point of contact, the speed of the challenge, and whether studs were showing',
    ],
    australiaContext: 'Law 12 accounts for the majority of disciplinary action in Australian football. State federations including Football NSW, Football Queensland, and Football Victoria maintain judiciary systems that review red card incidents after each match round. Referees must submit detailed match reports for all send-offs within 24 hours. Understanding the difference between careless, reckless, and excessive force is the single most important skill for passing referee assessments in Australia. The handball rule has undergone significant changes in recent years, and Australian referees should stay current with IFAB amendments — RefZone updates its content to reflect the latest interpretations.',
    ifabUrl: 'https://www.theifab.com/laws/latest/fouls-and-misconduct/',
    searchTerms: ['foul', 'misconduct', 'yellow card', 'red card', 'caution', 'send off', 'sending off', 'handball', 'handling', 'dangerous play', 'careless', 'reckless', 'excessive force', 'DOGSO', 'denying a goal scoring opportunity', 'SFP', 'serious foul play', 'violent conduct', 'dissent', 'unsporting behaviour', 'back pass', 'indirect free kick', 'direct free kick', 'penalty', 'spitting', 'simulation', 'diving', 'shirt pull', 'two yellow cards', 'triple punishment', 'goalkeeper six seconds'],
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
