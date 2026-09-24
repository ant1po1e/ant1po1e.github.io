import { MappingGuideSection } from '../types';

export const MAPPING_GUIDE_SECTIONS: MappingGuideSection[] = [
  {
    id: "fundamentals-timing",
    title: "01. Fundamentals: Audio, Timing & Snapping",
    category: "Fundamentals",
    readTime: "5 min read",
    summary: "The bedrock of every good beatmap: precise BPM offset detection, metronome alignment, and understanding beat snap divisors.",
    contentMarkdown: `
### The Absolute First Step: Flawless Timing

Never place a single hit object until your song's timing and offset are calibrated to the exact millisecond. A map with an offset off by even +15ms feels muddy and will destroy the player's accuracy.

#### 1. Finding the First Downbeat (Offset)
- Slow down playback to **25% or 50%** in the editor.
- Listen for the very first kick drum or transient peak.
- Press **F6** (Timing Setup) and place an uninherited red line (*Timing Point*).
- Tap along in the editor's timing panel (or use the Snap Calculator in the Tools section) to confirm the BPM.

#### 2. Variable BPM vs. Constant BPM
- Modern electronic music (EDM, Speedcore, Hardstyle) almost always uses fixed constant BPM.
- Live instruments (rock, jazz, vocal solos) frequently drift. You must drop red timing points at each bar line where tempo drifts occur.

#### 3. Snapping Divisors
- **1/4 beat snap** (White / Blue / Red ticks): Standard rhythm grid for 4/4 electronic music.
- **1/3 or 1/6 beat snap** (Purple / Yellow ticks): Triplets, waltz time, swing beats, and polyrhythms.
- **1/8 or 1/12 beat snap**: Micro-bursts, rapid trills, or flutter rolls.
    `,
    keyTakeaways: [
      "Always set timing at 25%/50% playback speed before placing notes.",
      "Red lines define BPM and Bar lines; Green lines define SV and Volume.",
      "Use metronome ticks to verify downbeats across the entire track length."
    ]
  },
  {
    id: "pattern-theory-chordjack",
    title: "02. Pattern Theory: Chordjack, Jumpstream & Balance",
    category: "Pattern Theory",
    readTime: "7 min read",
    summary: "How to represent musical hierarchy through note density, avoid unintended hand bias, and master anchor management.",
    contentMarkdown: `
### Representing Musical Hierarchy

In osu!mania, your visual density must mirror the acoustic weight of the audio. If a heavy snare hits alongside a synth stab, a single note is underwhelming; a double (jump) or triple (hand) communicates the musical impact.

#### 1. Chord Size Assignment
- **Single (1 note)**: Hi-hats, subtle ghost notes, quiet melodic leads.
- **Jump (2 notes)**: Standard kick drums, weak snares, vocal accents.
- **Hand (3 notes)**: Heavy clap/snare, cymbal crashes, major downbeats.
- **Quad (4 notes)**: Climax drops, explosive impacts (use sparingly to avoid fatigue).

#### 2. Jumpstream (JS) vs. Handstream (HS)
- **Jumpstream**: Alternates single notes and jumps on 1/4 beats. Ideal for BPM 180–230 melodic speed segments. Keep jump placements evenly distributed between Left (Col 1-2) and Right (Col 3-4) hands.
- **Handstream**: Intersperse triples and doubles. Suitable for intense guitar solos, heavy drum-and-bass, or high-energy chorus drops.

#### 3. Anchor Prevention & Jack Theory
An **anchor** occurs when the same column is hit repeatedly (e.g., Column 2 pressed three consecutive times).
- *Accidental Anchors*: Cause sudden hand fatigue and break stream flow.
- *Intentional Jacks*: When timed to a machine-gun snare or rhythm guitar riff, mini-jacks (2-note repeats) feel extraordinarily tactile and satisfying.
    `,
    keyTakeaways: [
      "Maintain consistent chord sizes for identical instrument sounds throughout the map.",
      "Check column distribution to ensure neither hand is overloaded.",
      "Use mini-jacks deliberately to accent aggressive repetitive percussion."
    ]
  },
  {
    id: "long-notes-ln",
    title: "03. Long Notes (LN): Release Timing & Inverses",
    category: "Long Notes (LN)",
    readTime: "6 min read",
    summary: "Mastering sustain, tail accuracy, hybrid chords, shields, and inverse LN densities without frustrating the player.",
    contentMarkdown: `
### The Art of the Release

Long Notes (LNs) test a completely different mental dimension compared to rice (regular single notes): **the release**.

#### 1. LN Length and Release Snaps
- Always snap LN tails to an audible release in the music (such as the end of a vocal phrase, a synth chord decay, or a cymbal fade).
- Avoid ending an LN 1/16th off-beat without a musical reason—players judge release timing based on acoustic decay.

#### 2. Shields and Anti-Shields
- **Shield**: A regular note placed in the same column immediately before an LN starts or immediately after an LN ends.
  - *Short shield*: Creates high tension and physical resistance.
  - *Long shield*: Accessible in lower star ratings.
- Avoid accidental sub-1/4 shields in stream maps unless intended as a technical handicap.

#### 3. Inverse LN & Full Release
In **Inverse LN**, the screen is filled with continuous holds, and the player 'plays the gaps'. Ensure that column transitions provide enough physical release space for the finger tendons to reset.
    `,
    keyTakeaways: [
      "LN tails have strict timing windows; always snap them to audible acoustic releases.",
      "Be mindful of finger independence: holding Col 1 while tapping Col 2 is physically harder than holding Col 1 while tapping Col 4.",
      "Test release responsiveness with a mechanical keyboard."
    ]
  },
  {
    id: "scroll-velocity-sv",
    title: "04. Scroll Velocity (SV): Math, Easing & Teleports",
    category: "Scroll Velocity (SV)",
    readTime: "8 min read",
    summary: "Transform visual rhythm into cinematic art using green-line multipliers, exponential acceleration, and stutter teleports.",
    contentMarkdown: `
### The Physics of Scroll Velocity (SV)

Scroll Velocity alters how fast hit objects travel down the playfield without changing their audio hit time. It is driven by **Inherited Points (Green Lines)** in the \`.osu\` file format.

#### 1. The Compensation Formula
To create a slow-down followed by a speed-up without shifting the rest of the map's visual spacing, the cumulative SV integral must equal 1.0x:

$$\\Delta t_1 \\times SV_1 + \\Delta t_2 \\times SV_2 = \\Delta t_{total} \\times 1.0$$

#### 2. Popular SV Techniques
- **Exponential Deceleration (Slowdown)**: Start with 3.0x SV and step down to 0.5x SV in small micro-intervals (1/16th ticks) to create a braking sensation.
- **Stutter SV**: Rapidly alternate between 2.0x and 0.0x every 1/16th tick to make notes 'teleport' forward to the beat.
- **Bumper / Bounce SV**: An instant 0.1x drop on the downbeat followed by a 4.0x launch, accentuating bass drops.

#### 3. Readability & Sightread Guidelines
If a map is intended for general ranked play, keep SV within readable boundaries (0.75x to 1.35x). Save extreme 0.0x/10.0x gimmick SV for dedicated SV categories or tournament tiebreakers.
    `,
    keyTakeaways: [
      "Plan SV curves on paper or a spreadsheet first, then place green lines to match the intended easing shape.",
      "Always compensate extreme slowdowns with corresponding speed-ups to avoid visual overlapping.",
      "Green lines only change visual scroll rate, never the song BPM."
    ]
  },
  {
    id: "hitsounding-modding",
    title: "05. Hitsounding, Keysounding & Modding Checklist",
    category: "Hitsounding & Modding",
    readTime: "5 min read",
    summary: "Polishing your map for submission, adding crisp acoustic feedback, and passing ranking criteria checks.",
    contentMarkdown: `
### Crisp Audio Feedback (Hitsounding)

A beatmap without hitsounds feels sterile. Hitsounds provide instantaneous neurological confirmation that a key was pressed accurately.

#### 1. Standard Samplesets
- **Normal**: Punchy acoustic drum set (Kick = Normal-hitnormal, Snare = Normal-hitclap).
- **Soft**: Gentle electronic or acoustic guitar (Whistle for melody leads, Finish for cymbals).
- **Drum**: Heavy synthetic kick and electronic snare.

#### 2. Custom Hitsound Layering
- Map kick drums to **Normal-Hitnormal**.
- Map snares and claps to **Soft-Hitclap** or custom WAV samples.
- Map vocal or piano accents to **Soft-Hitwhistle**.

#### 3. Pre-Submission Quality Checklist
1. Are all red timing points locked with no accidental BPM decimals (e.g., use 180.00, not 180.023)?
2. Are there any unsnapped notes (check with AiMod / Ctrl+Shift+A)?
3. Are all background image dimensions within 1920x1080 and under 2.5MB?
4. Is audio bitrate between 128kbps and 192kbps CBR?
5. Did you test the map with Auto mod to check for visual overlaps?
    `,
    keyTakeaways: [
      "Never leave a map with default unhitsounded ticks.",
      "Run Ctrl+Shift+A (AiMod) before exporting the .osz package.",
      "Seek test plays from players of varied skill levels."
    ]
  }
];
