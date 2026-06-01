import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Week 1 — Motion, forces, and energy
  {
    slug: "what-physics-is",
    title: "What physics is and how physicists think",
    weekNumber: 1,
    blurb: "The science of matter, energy, and the rules the universe obeys.",
    lectureTitle: "1.1 What physics is and how physicists think",
    body: `# What physics is and how physicists think

**Physics** is the study of matter, energy, motion, and the fundamental rules that govern how the universe behaves. It is the most basic of the sciences: chemistry, biology, and astronomy all rest on the laws physics uncovers.

## What it is not

- It is **not** just equations. The math is a language; the ideas come first.
- It is **not** a list of facts to memorize. It is a way of *asking why*.
- It is **not** only about the very large or very small. The same laws describe a falling apple and an orbiting moon.

## How physicists think

A physicist habitually:

1. **Idealizes** — strips a messy situation down to its essentials (a "frictionless surface," a "point mass").
2. **Quantifies** — turns "fast" into a number with units.
3. **Seeks laws** — looks for rules that hold *everywhere*, not just here.
4. **Tests** — trusts experiment over authority; a beautiful theory dies against one ugly fact.

## The unreasonable power of simple laws

A handful of compact laws — Newton's three, the conservation of energy, Maxwell's equations — predict an astonishing range of phenomena. Physics is the discovery that the universe is, at bottom, *comprehensible*: it runs on patterns we can write down.

## Concept over calculation

This is **conceptual physics** — the goal is deep understanding of *what is really going on*, with math as a tool rather than the point. Ask of any phenomenon: *what is moving, what is pushing it, and where does the energy go?*`,
  },
  {
    slug: "space-time-frames",
    title: "Space, time, and frames of reference",
    weekNumber: 1,
    blurb: "Measuring where and when, and why motion is always relative.",
    lectureTitle: "1.2 Space, time, and frames of reference",
    body: `# Space, time, and frames of reference

All of physics happens somewhere (**space**) and somewhen (**time**). To describe an event we need both — a position and a moment.

## Measuring space and time

- **Space** is described by position: how far, and in what direction, from some chosen origin.
- **Time** orders events: before, after, how long between.

Physics expresses these in standard units — meters for distance, seconds for time — so that any two observers can compare measurements.

## Frames of reference

A **frame of reference** is the viewpoint from which you measure motion — your chosen origin and your state of motion. Crucially, *position and velocity have meaning only relative to a frame*.

> Walking down the aisle of a moving train, you move at 1 m/s relative to the train, but perhaps 30 m/s relative to the ground.

## There is no "absolute rest"

You feel still right now, but Earth spins, orbits the Sun, and rides through the galaxy. **There is no special frame that is truly at rest** — only frames moving relative to one another. "Are you moving?" is an incomplete question; the answer is always *relative to what?*

## Why frames matter

Choosing the right frame can turn a hard problem into an easy one. Much of mechanics — and later all of relativity — hinges on recognizing that motion is never absolute, only a comparison between frames.`,
  },
  {
    slug: "motion-and-change",
    title: "Motion and the idea of change",
    weekNumber: 1,
    blurb: "Speed, velocity, and acceleration — describing how things change.",
    lectureTitle: "1.3 Motion and the idea of change",
    body: `# Motion and the idea of change

**Motion** is change of position over time. Describing it precisely is the starting point of mechanics.

## Speed and velocity

- **Speed** is how fast: distance covered per unit time ($\\text{speed} = \\frac{\\text{distance}}{\\text{time}}$).
- **Velocity** is speed *with a direction* — a **vector**. 60 km/h north is a velocity; 60 km/h is just a speed.

The distinction matters: a car rounding a bend at steady speed has *changing velocity*, because its direction is changing.

## Acceleration

**Acceleration** is the rate of change of velocity. You accelerate when you speed up, slow down (negative acceleration), *or* change direction.

> A falling object near Earth accelerates at about $9.8 \\text{ m/s}^2$ — each second, its downward speed grows by roughly 10 m/s.

## The idea of change itself

Physics is largely the study of *change*: position changes (velocity), velocity changes (acceleration). Galileo's great insight was that the natural state of motion is not rest but **constant velocity** — and that only *change* in motion needs explaining.

## Why this reframes everything

Ancient thinkers asked "what keeps things moving?" Galileo and Newton showed that is the wrong question. Motion needs no cause; *changes* in motion do. That shift — from explaining motion to explaining acceleration — opened the door to all of modern physics.`,
  },
  {
    slug: "forces-and-acceleration",
    title: "Forces and why things accelerate",
    weekNumber: 1,
    blurb: "Newton's laws: forces cause acceleration, not motion itself.",
    lectureTitle: "1.4 Forces and why things accelerate",
    body: `# Forces and why things accelerate

A **force** is a push or a pull. Newton's three laws explain how forces relate to motion — the foundation of classical mechanics.

## Newton's first law (inertia)

An object at rest stays at rest, and an object in motion stays in motion at constant velocity, *unless acted on by a net force*. Motion does not need a cause; **changing** motion does.

## Newton's second law

The net force on an object equals its mass times its acceleration:

$$F = ma$$

The bigger the force, the bigger the acceleration; the bigger the mass, the smaller the acceleration for the same force. This single equation predicts the motion of nearly everything we see day to day.

## Newton's third law

For every action there is an **equal and opposite reaction**. When you push on a wall, the wall pushes back on you just as hard. A rocket flies by throwing gas backward; the gas throws the rocket forward.

## Net force is what counts

Several forces usually act at once — gravity, friction, a push. Only the **net** (total) force determines acceleration. A book resting on a table feels gravity *and* the table's upward push; they cancel, the net force is zero, and it stays put.

## The big picture

Forces don't keep things moving — they make motion *change*. Master "net force causes acceleration" and you can explain why a car turns, why you lurch when a bus brakes, and why the planets curve through space.`,
  },
  {
    slug: "inertia-mass-momentum",
    title: "Inertia, mass, and momentum",
    weekNumber: 1,
    blurb: "Resistance to change, and the conserved quantity of motion.",
    lectureTitle: "1.5 Inertia, mass, and momentum",
    body: `# Inertia, mass, and momentum

## Inertia and mass

**Inertia** is an object's resistance to a change in its motion. **Mass** is the measure of inertia: the more mass, the harder it is to start, stop, or turn.

Mass is *not* the same as weight. Mass is how much "stuff" and how much inertia an object has; weight is the force of gravity on that mass. In orbit you are weightless but your mass — and inertia — is unchanged.

## Momentum

**Momentum** is mass in motion: the product of mass and velocity.

$$p = mv$$

A slow truck and a fast bullet can carry similar momentum. Momentum is a vector — it has direction — and it captures "how hard it is to stop something."

## Conservation of momentum

In any collision or interaction with no outside force, the **total momentum before equals the total momentum after**. This is one of the deepest laws in physics.

> A cannon recoils because the forward momentum of the ball is matched by equal backward momentum of the cannon — the total stays zero.

## Impulse

To change momentum you apply a force over time (**impulse**). The same change can come from a big force briefly or a small force for longer. Airbags and crumple zones save lives by *stretching the time* of a collision, lowering the force.

## Why it matters

Conservation of momentum lets us predict collisions, rocket flight, and recoil without tracking every detail of the forces — we just balance the books before and after.`,
  },
  {
    slug: "energy-and-conservation",
    title: "Energy and its conservation",
    weekNumber: 1,
    blurb: "The currency of change that can transform but never vanish.",
    lectureTitle: "1.6 Energy and its conservation",
    body: `# Energy and its conservation

**Energy** is the capacity to do work — to make change happen. It comes in many forms but obeys one supreme rule: it is never created or destroyed, only transformed.

## Kinetic and potential energy

- **Kinetic energy** is energy of motion: $KE = \\tfrac{1}{2}mv^2$. Note the *square* — doubling speed quadruples kinetic energy.
- **Potential energy** is stored energy of position or configuration — a raised weight, a stretched spring, fuel in a tank.

## Work

**Work** is done when a force moves something through a distance, transferring energy from one form to another. Lifting a book does work *against* gravity, storing potential energy that returns as kinetic energy if you drop it.

## Conservation of energy

The **law of conservation of energy** says the total energy of an isolated system stays constant. A swinging pendulum trades potential for kinetic and back; a ball bouncing lower each time hasn't *lost* energy — it converted some to heat and sound.

> Roller coaster: potential energy at the top becomes kinetic energy at the bottom, with a little lost to friction as heat.

## Power

**Power** is the *rate* of energy transfer — energy per unit time. The same job done faster requires more power, not more energy.

## Why this law is sacred

Conservation of energy has never been observed to fail. It lets physicists track change across transformations — chemical to thermal, gravitational to kinetic — by insisting the books always balance.`,
  },
  {
    slug: "cause-law-clockwork",
    title: "Cause, law, and the clockwork universe",
    weekNumber: 1,
    blurb: "Determinism, prediction, and the Newtonian worldview.",
    lectureTitle: "1.7 Cause, law, and the clockwork universe",
    body: `# Cause, law, and the clockwork universe

Newton's mechanics did more than explain motion — it suggested a **worldview**: a universe running like a vast, lawful machine.

## Cause and effect

Classical physics is built on **causality**: every effect has a cause, and the same causes always produce the same effects. Forces cause accelerations in a perfectly reliable way.

## The clockwork universe

If you knew the position and velocity of every particle, and all the forces, Newton's laws would let you compute the future — and the past — exactly. This is **determinism**: the universe as a wound-up clock, its every tick already implied.

> The mathematician Laplace imagined a "demon" who, knowing everything now, could foresee everything to come. That is the clockwork dream.

## The power of physical law

A **physical law** is a regularity that holds universally and lets us *predict*. Newton's triumph was showing that earthly and heavenly motion obey the *same* laws — apples and planets alike. The cosmos is lawful and knowable.

## Cracks in the clockwork

This deterministic picture reigned for two centuries — but it is not the final word. **Chaos** makes some systems practically unpredictable even if lawful, and **quantum mechanics** (Week 3) injects genuine randomness. The clockwork is an extraordinary approximation, not the whole truth.

## Why it still matters

The Newtonian worldview shaped science, philosophy, and the very idea of progress. Understanding both its power *and* its limits is essential to understanding what physics claims about reality.`,
  },

  // Week 2 — Gravity, fields, and thermodynamics
  {
    slug: "gravity-and-orbits",
    title: "Gravity and the shape of orbits",
    weekNumber: 2,
    blurb: "The universal force that pulls apples down and moons around.",
    lectureTitle: "2.1 Gravity and the shape of orbits",
    body: `# Gravity and the shape of orbits

**Gravity** is the attractive force between any two objects with mass. It is the weakest of the fundamental forces, yet it rules the cosmos because it is always attractive and never cancels out.

## Newton's law of universal gravitation

Every mass attracts every other mass with a force that grows with the masses and *shrinks with the square of the distance*:

$$F = G\\frac{m_1 m_2}{r^2}$$

Double the distance and the pull drops to a quarter — the **inverse-square law**.

## Why an apple and the Moon obey one law

Newton's leap was realizing the force pulling an apple down is the *same* force holding the Moon in orbit. The Moon is, in effect, perpetually *falling* toward Earth — but moving sideways fast enough that it keeps missing.

## Orbits as endless falling

An **orbit** is a balance between falling inward and moving forward. Too slow and you crash; too fast and you fly off; just right and you circle forever.

> Fire a cannonball fast enough horizontally and it falls *around* the curve of the Earth — that is an orbit.

## The shape of orbits

Kepler found orbits are **ellipses**, not perfect circles, with the Sun at one focus. Planets move faster when closer to the Sun and slower when farther — sweeping equal areas in equal times.

## Why it matters

The same simple law explains tides, satellites, the return of comets, and the architecture of the solar system. Gravity is the scaffolding of the universe.`,
  },
  {
    slug: "fields-action-at-a-distance",
    title: "Fields and action at a distance",
    weekNumber: 2,
    blurb: "How forces reach across empty space without touching.",
    lectureTitle: "2.2 Fields and action at a distance",
    body: `# Fields and action at a distance

How does the Sun pull the Earth across 150 million km of empty space? The puzzle of **action at a distance** led to one of physics' most powerful ideas: the **field**.

## The problem of empty space

Gravity, electricity, and magnetism all act between objects that never touch. To early thinkers this seemed almost magical — a force reaching across a void.

## The field idea

A **field** is a condition of space itself: every point around a mass (or a charge) carries a value telling what force *would* act on an object placed there. The object doesn't respond to the distant source directly — it responds to the field *right where it is*.

> Iron filings around a magnet trace out the **magnetic field** — the invisible influence made visible.

## Fields are real, not bookkeeping

Fields turn out to be physical things that carry energy and can exist on their own. A radio wave is a field rippling through space long after the antenna that made it has switched off.

## Mapping fields

- **Field lines** show direction; their crowding shows strength.
- A **gravitational field** points toward mass; an **electric field** points away from positive charge.

## Why fields matter

The field concept replaced spooky action at a distance with a local, mechanical picture: influence spreads *through* space, point to point, at a finite speed. It underlies electromagnetism, light, and even Einstein's curved-spacetime gravity in Week 4.`,
  },
  {
    slug: "electricity-and-charge",
    title: "Electricity and charge",
    weekNumber: 2,
    blurb: "Positive and negative charge, and the forces and flows between them.",
    lectureTitle: "2.3 Electricity and charge",
    body: `# Electricity and charge

**Electric charge** is a fundamental property of matter, like mass. It comes in two kinds — **positive** and **negative** — and it is the source of electrical forces.

## The rule of charge

- **Like charges repel; opposite charges attract.**
- Charge is carried by particles: electrons are negative, protons positive.
- Charge is **conserved** — never created or destroyed, only moved around.

## Coulomb's law

The force between two charges follows an inverse-square law strikingly like gravity:

$$F = k\\frac{q_1 q_2}{r^2}$$

But it is vastly stronger — and, unlike gravity, it can push *as well as* pull.

## Current and circuits

When charges flow, you have an **electric current**. A **circuit** is a loop that lets charge flow continuously, driven by a **voltage** (electrical "pressure") and opposed by **resistance**.

> Voltage pushes, current flows, resistance restricts — like water pressure, flow, and a narrow pipe.

## Static vs. current electricity

- **Static electricity:** charge built up and held — the shock from a doorknob.
- **Current electricity:** charge in motion — the power running your devices.

## Why it matters

Electrical forces hold atoms and molecules together — they are why solid matter is solid. And harnessing the *flow* of charge built the modern world. Charge is the bridge from raw physics to technology.`,
  },
  {
    slug: "magnetism-and-electricity",
    title: "Magnetism and its unity with electricity",
    weekNumber: 2,
    blurb: "Two forces revealed as one: electromagnetism.",
    lectureTitle: "2.4 Magnetism and its unity with electricity",
    body: `# Magnetism and its unity with electricity

**Magnetism** seems separate from electricity — until you look closely. One of physics' great unifications showed they are two faces of a single force: **electromagnetism**.

## Magnets and poles

Magnets have **north** and **south** poles. Like poles repel, opposites attract — and you can never isolate a single pole: cut a magnet in two and each half grows its own north *and* south.

## The deep connection

Two experimental discoveries revealed the unity:

1. **Moving charge makes magnetism.** A current in a wire creates a magnetic field around it (Oersted).
2. **Changing magnetism makes electricity.** Moving a magnet near a coil drives a current (Faraday's **electromagnetic induction**).

> Electricity and magnetism are not two forces but one — *electromagnetism* — appearing differently depending on your frame of reference.

## How the modern world runs on it

- **Motors** turn electricity into motion using magnetic force.
- **Generators** turn motion into electricity using induction.
- **Transformers** ship power across continents.

## Maxwell's synthesis

James Clerk Maxwell wrote four equations uniting every electric and magnetic phenomenon. They predicted something stunning: self-sustaining electromagnetic waves traveling at the speed of light — meaning **light itself is electromagnetic** (next topic).

## Why it matters

The unification of electricity and magnetism is a model of what physics aspires to: showing that apparently different phenomena are deep down the *same thing*.`,
  },
  {
    slug: "light-em-spectrum",
    title: "Light as wave and the electromagnetic spectrum",
    weekNumber: 2,
    blurb: "Light is an electromagnetic wave — one band of a vast spectrum.",
    lectureTitle: "2.5 Light as wave and the electromagnetic spectrum",
    body: `# Light as wave and the electromagnetic spectrum

Maxwell's equations revealed that **light is an electromagnetic wave** — a self-propagating ripple of electric and magnetic fields, needing no medium to travel.

## Light as a wave

A wave is described by:

- **Wavelength** — the distance between crests.
- **Frequency** — how many crests pass per second.
- **Speed** — for light in a vacuum, always $c \\approx 3 \\times 10^8$ m/s.

Wavelength and frequency are inversely related: shorter waves oscillate faster.

## The electromagnetic spectrum

Visible light is a *tiny* slice of a vast **electromagnetic spectrum**, ordered by wavelength:

> radio → microwave → infrared → **visible** → ultraviolet → X-ray → gamma

They are all the *same* phenomenon — electromagnetic waves — differing only in wavelength and energy. Radio waves are kilometers long; gamma rays are smaller than an atom.

## Color and energy

Within visible light, wavelength is **color**: red is long-wavelength and low-energy, violet short and high-energy. Shorter wavelength means higher energy — which is why UV burns and X-rays penetrate.

## Wave behavior

Light **reflects**, **refracts** (bends entering glass or water), and **diffracts** (spreads around edges) — all hallmarks of waves. A prism splits white light into colors because each wavelength bends a different amount.

## Why it matters

Understanding light as electromagnetic waves explains rainbows, radio, vision, and the colors of stars — and sets up the great puzzle of Week 3, where light also behaves like a *particle*.`,
  },
  {
    slug: "heat-temperature-time",
    title: "Heat, temperature, and the arrow of time",
    weekNumber: 2,
    blurb: "Energy in motion at the molecular scale, and why heat flows one way.",
    lectureTitle: "2.6 Heat, temperature, and the arrow of time",
    body: `# Heat, temperature, and the arrow of time

**Thermodynamics** is the physics of heat and energy flow. It begins by distinguishing two ideas people routinely confuse.

## Temperature vs. heat

- **Temperature** measures the *average* kinetic energy of the particles in a substance — how fast they jiggle.
- **Heat** is the *transfer* of thermal energy from a hotter object to a cooler one.

A spark is hotter (higher temperature) than a bathtub, but the bathtub holds far more total heat energy.

## Particles in motion

At the microscopic level, **heat is motion**: temperature is how vigorously atoms and molecules vibrate or fly about. At **absolute zero** ($-273°$C) that motion would all but stop.

## How heat moves

- **Conduction:** through direct contact, jiggle passed neighbor to neighbor.
- **Convection:** by the bulk flow of a heated fluid.
- **Radiation:** by electromagnetic waves, across empty space — how the Sun warms us.

## Heat always flows one way

Heat flows **spontaneously from hot to cold**, never the reverse on its own. A hot coffee cools to room temperature; a cool coffee never spontaneously heats up.

> This one-way flow defines an **arrow of time** — a direction that distinguishes past from future, which the laws of motion alone do not.

## Why it matters

Why heat has a preferred direction — while a bouncing ball's mechanics look the same run backward — is one of the deepest questions in physics. The answer is **entropy** (next topic).`,
  },
  {
    slug: "entropy-and-disorder",
    title: "Entropy and the tendency toward disorder",
    weekNumber: 2,
    blurb: "The second law: why the universe drifts toward disorder.",
    lectureTitle: "2.7 Entropy and the tendency toward disorder",
    body: `# Entropy and the tendency toward disorder

**Entropy** is a measure of disorder — or more precisely, of the number of ways a system's parts can be arranged. The **second law of thermodynamics** says the total entropy of an isolated system tends to *increase*.

## Order, disorder, and probability

There are vastly more disordered arrangements than ordered ones, so disorder is overwhelmingly more *likely*. A shuffled deck, a messy room, a mixed drink — systems drift toward the states there are simply more of.

> Drop a sandcastle and it crumbles; piles of sand never spontaneously assemble into castles. Both obey mechanics, but only one direction is probable.

## The second law

- Heat flows hot → cold because that *spreads energy out* (raises entropy).
- No process can be perfectly efficient; some energy always disperses as waste heat.
- You can create order locally (a fridge, a living cell) — but only by increasing entropy *more* somewhere else.

## The arrow of time, explained

Entropy gives time its direction. The underlying laws of motion run the same forwards and backwards, but the *statistical* march toward disorder does not. The future is simply the direction of higher entropy.

## The heat death of the universe

Taken to its limit, the second law predicts the universe trends toward maximum entropy — energy evenly spread, no gradients left to drive change. A bleak but profound consequence.

## Why it matters

Entropy explains why perpetual-motion machines are impossible, why time flows one way, and why structure and life are precious, hard-won islands of order in a universe sliding toward disorder.`,
  },

  // Week 3 — Atoms and the quantum world
  {
    slug: "atomic-picture-of-matter",
    title: "The atomic picture of matter",
    weekNumber: 3,
    blurb: "Everything is made of atoms — the most important idea in science.",
    lectureTitle: "3.1 The atomic picture of matter",
    body: `# The atomic picture of matter

If all scientific knowledge were lost but one sentence, Richard Feynman said, it should be: *everything is made of atoms.* The **atomic theory** is the bedrock of modern physics and chemistry.

## What an atom is

An **atom** is the smallest unit of an element that retains its identity. Atoms are unimaginably small — millions would span the width of a hair — yet they are mostly *empty space*.

## From atoms to everything

- **Atoms** combine into **molecules** (two hydrogen + one oxygen = water).
- The *type* of atom (element) and how atoms bond explain why gold differs from glass.
- All the matter you touch is just atoms arranged in different patterns.

## States of matter

The same atoms behave differently depending on how much they jiggle:

- **Solid:** atoms locked in place, vibrating.
- **Liquid:** atoms loosely bound, flowing.
- **Gas:** atoms free and fast, flying apart.

Add heat and you climb the ladder — ice to water to steam — without changing the atoms themselves.

## Evidence for atoms

You can't see atoms with your eyes, but the evidence is overwhelming: the jittery **Brownian motion** of pollen grains (explained by Einstein as atomic collisions), fixed chemical proportions, and today, direct images from electron microscopes.

## Why it matters

The atomic picture unifies chemistry, materials, biology, and physics under one idea — and raises the next question: if everything is atoms, *what are atoms made of?* The answer broke classical physics apart.`,
  },
  {
    slug: "quantum-revolution",
    title: "The quantum revolution and its strangeness",
    weekNumber: 3,
    blurb: "Energy comes in lumps, and the small world stops making ordinary sense.",
    lectureTitle: "3.2 The quantum revolution and its strangeness",
    body: `# The quantum revolution and its strangeness

Around 1900, physics seemed nearly complete — then the study of atoms and light shattered the classical worldview. The **quantum revolution** revealed that the small-scale universe plays by deeply strange rules.

## Energy comes in lumps

Classical physics assumed energy is smooth and continuous. **Quantum** physics found it comes in discrete packets — **quanta**.

> Planck explained hot-object radiation only by assuming energy is emitted in chunks. Einstein explained the **photoelectric effect** only by treating light as particles — **photons**.

The very word *quantum* means "a discrete amount."

## The strangeness

The quantum world violates everyday intuition:

- Particles can be in a **superposition** — multiple states at once — until measured.
- Outcomes are **probabilistic**, not determined: physics predicts odds, not certainties.
- **Measurement changes the system** — observing it forces a definite result.

## A break with the clockwork

This demolished the deterministic clockwork of Week 1. At the deepest level the universe is *not* a predictable machine; it is irreducibly statistical. Einstein hated this — "God does not play dice" — but experiment sided against him.

## It is not optional weirdness

Quantum mechanics is the most precisely tested theory in history. Lasers, transistors, and the very stability of atoms depend on it. The strangeness is not a gap in our knowledge — it is how nature actually behaves.

## Why it matters

The quantum revolution redefined what physics can even *claim* to know — replacing certainty with probability and exact prediction with fundamental limits.`,
  },
  {
    slug: "wave-particle-duality",
    title: "Wave-particle duality",
    weekNumber: 3,
    blurb: "Light and matter behave as both waves and particles.",
    lectureTitle: "3.3 Wave-particle duality",
    body: `# Wave-particle duality

One of quantum mechanics' central mysteries: light — and matter — behave as **both waves and particles**, depending on how you look.

## Light: wave or particle?

- As a **wave**, light diffracts and interferes (Week 2).
- As a **particle**, light delivers energy in discrete **photons** (the photoelectric effect).

Neither picture alone is complete. Light is *both* — this is **wave-particle duality**.

## The double-slit experiment

Fire light (or even single electrons) at two slits and an **interference pattern** of bright and dark bands appears on the screen — proof of wave behavior. The shock: it appears *even when particles are sent one at a time*. Each particle seems to interfere with *itself*, as if passing through both slits.

> Try to detect *which* slit each particle uses, and the interference pattern vanishes — the act of looking changes the result.

## Matter waves too

De Broglie proposed that *matter* also has a wavelength. It was confirmed: electrons diffract like waves. Everything has a wave nature — but for large objects the wavelength is so tiny it is utterly unnoticeable.

## How to hold both pictures

An object isn't secretly a wave *or* secretly a particle. It is a quantum thing that *shows* wave behavior or particle behavior depending on the experiment. The question "which is it really?" assumes a classical answer the universe declines to give.

## Why it matters

Duality forces us to abandon the idea that small things are just tiny versions of everyday objects. It is the heart of the quantum mystery — and the setup for the uncertainty principle.`,
  },
  {
    slug: "uncertainty-limits-of-knowing",
    title: "Uncertainty and the limits of knowing",
    weekNumber: 3,
    blurb: "Heisenberg's principle: some pairs of facts can't both be exact.",
    lectureTitle: "3.4 Uncertainty and the limits of knowing",
    body: `# Uncertainty and the limits of knowing

Quantum mechanics does not just make prediction hard — it sets a *fundamental limit* on what can be known. This is **Heisenberg's uncertainty principle**.

## The principle

You cannot simultaneously know both the **position** and the **momentum** of a particle with perfect precision. The more exactly you pin down one, the more uncertain the other becomes.

> Pin down *where* an electron is, and *how fast it's going* blurs — and vice versa. The product of the two uncertainties cannot fall below a fixed limit.

## Not a measurement flaw

This is the crucial point: the uncertainty is **not** because our instruments are clumsy. A particle simply **does not possess** a precise position *and* a precise momentum at the same time. The limit is built into nature, not into our tools.

## Why it happens

It flows from wave-particle duality. A particle localized to a point is built from many wavelengths (uncertain momentum); a particle with one sharp wavelength is spread out (uncertain position). You cannot have both at once — it is a property of waves.

## Consequences

- Empty space seethes with **quantum fluctuations** — particles flickering in and out.
- Electrons can't spiral into the nucleus; confining them too tightly would spike their momentum.
- The future is genuinely *open*: with the present unknowable in full, exact prediction is impossible in principle.

## Why it matters

The uncertainty principle is the final nail in the clockwork coffin. It says the limit on knowledge is not practical but **fundamental** — there are facts the universe simply does not contain.`,
  },
  {
    slug: "structure-of-the-atom",
    title: "The structure of the atom",
    weekNumber: 3,
    blurb: "A tiny dense nucleus, orbiting electrons, and quantized energy levels.",
    lectureTitle: "3.5 The structure of the atom",
    body: `# The structure of the atom

Atoms are not solid balls — they have an intricate internal structure that took decades and the quantum revolution to map.

## The parts of an atom

- **Protons** — positive charge, in the nucleus.
- **Neutrons** — no charge, in the nucleus.
- **Electrons** — negative charge, surrounding the nucleus.

The number of protons (the **atomic number**) defines the element.

## The nuclear atom

Rutherford fired particles at gold foil and found most passed straight through, but a few bounced back hard. The conclusion: an atom is almost entirely **empty space**, with nearly all its mass packed into a tiny, dense, positive **nucleus** at the center.

> If an atom were a stadium, the nucleus would be a marble at center field — and the electrons a faint haze in the stands.

## The quantum atom

Classically, orbiting electrons should spiral into the nucleus, radiating energy. They don't — because of quantum rules. Electrons occupy only **discrete energy levels**; they cannot exist between them.

## Light from atoms

When an electron jumps from a higher to a lower level, it emits a photon of a *specific* energy — a specific color. Each element has a unique **spectral fingerprint** of colors, which is how we know what distant stars are made of.

## Why it matters

The structure of the atom unites everything so far — electric forces, quantum energy levels, and light — into one picture, and points to the next layer down: what holds the nucleus together?`,
  },
  {
    slug: "nucleus-and-radioactivity",
    title: "The nucleus and radioactivity",
    weekNumber: 3,
    blurb: "The forces inside the nucleus, and the energy of its decay.",
    lectureTitle: "3.6 The nucleus and radioactivity",
    body: `# The nucleus and radioactivity

The **nucleus** packs positive protons into a vanishingly small space — yet they don't fly apart. Understanding why reveals new forces and the source of nuclear energy.

## The strong force

Like-charged protons repel fiercely at such close range. They are held together by the **strong nuclear force** — far stronger than electricity but acting only across nuclear distances. It is the strongest of the four fundamental forces.

## Isotopes and instability

Atoms of an element can have different numbers of neutrons — **isotopes**. Some combinations are unstable; their nuclei eventually break down. That breakdown is **radioactivity**.

## Three kinds of radiation

- **Alpha:** a heavy, slow chunk (two protons + two neutrons); stopped by paper.
- **Beta:** a fast electron; stopped by metal foil.
- **Gamma:** high-energy electromagnetic radiation; needs thick lead or concrete.

## Half-life

Radioactive decay is random for any single atom but precisely statistical for many. The **half-life** is the time for half a sample to decay — from seconds to billions of years. This clockwork of decay enables **radiometric dating** of rocks and fossils.

## Fission and fusion

- **Fission:** a heavy nucleus splits, releasing energy — reactors and atomic bombs.
- **Fusion:** light nuclei merge, releasing even more — the power source of the Sun and stars.

Both convert a tiny bit of mass into enormous energy, via $E = mc^2$ (Week 4).

## Why it matters

Nuclear physics powers the stars, dates the Earth, drives reactors, and — for better and worse — reshaped the modern world.`,
  },
  {
    slug: "particle-zoo-standard-model",
    title: "The particle zoo and the Standard Model",
    weekNumber: 3,
    blurb: "The fundamental building blocks and forces of the universe.",
    lectureTitle: "3.7 The particle zoo and the Standard Model",
    body: `# The particle zoo and the Standard Model

Probe deeper than protons and neutrons and a whole "zoo" of particles appears. The **Standard Model** of particle physics organizes them into our best theory of matter's fundamental ingredients.

## Matter particles

Everything is built from two families of fundamental particles:

- **Quarks** — combine in threes to make protons and neutrons (a proton is two "up" quarks and one "down").
- **Leptons** — including the familiar **electron** and the ghostly, nearly massless **neutrino**.

These are believed to be truly fundamental — not made of anything smaller.

## The four fundamental forces

All interactions reduce to four forces, each carried by a **force-carrier particle**:

1. **Gravity** — weakest, but universal and long-range.
2. **Electromagnetism** — carried by the **photon**.
3. **Strong force** — binds quarks and nuclei.
4. **Weak force** — drives certain radioactive decays.

> In the quantum view, a force *is* an exchange of particles — like two skaters tossing a ball and recoiling apart.

## The Higgs

The **Higgs field**, confirmed in 2012, gives many particles their mass. Its particle, the **Higgs boson**, was the Standard Model's last missing piece.

## A triumph — and not the end

The Standard Model is extraordinarily accurate, yet incomplete: it doesn't include gravity, doesn't explain dark matter, and leaves deep questions open. It is our best map, not the final territory.

## Why it matters

Particle physics is the search for the ultimate building blocks — the bottom layer of the question "what is everything made of?"`,
  },

  // Week 4 — Relativity, cosmology, and frontiers
  {
    slug: "special-relativity-light",
    title: "Special relativity and the constancy of light",
    weekNumber: 4,
    blurb: "Light's speed is the same for everyone — and it changes everything.",
    lectureTitle: "4.1 Special relativity and the constancy of light",
    body: `# Special relativity and the constancy of light

In 1905 Einstein overturned our notions of space and time with **special relativity**, built on two deceptively simple postulates.

## The two postulates

1. **The laws of physics are the same in every inertial (non-accelerating) frame.** There is no preferred frame, no absolute rest.
2. **The speed of light in a vacuum is the same for all observers**, no matter how they or the source are moving.

The second postulate is the shocker.

## Why constant light speed is so strange

In everyday life, speeds add: throw a ball forward from a moving train and the ground sees it go faster. But shine a flashlight from that train and the ground measures the light at *exactly* $c$ — not $c$ plus the train's speed.

> Chase a light beam at 99% of $c$ and it *still* races away from you at the full speed of light. Speed simply does not add the ordinary way.

## Something has to give

If everyone measures the same light speed, then *space and time themselves* must differ between observers. Speed is distance over time, so holding speed fixed forces distance and time to bend. That is the price of the postulates.

## The end of absolute time

There is no universal "now." Space and time are not separate, fixed backdrops but woven into a single, flexible **spacetime** that observers carve up differently.

## Why it matters

From these two postulates flow time dilation, length contraction, the relativity of simultaneity, and $E=mc^2$ — the rest of this week. Special relativity is among the best-confirmed theories in physics.`,
  },
  {
    slug: "time-dilation-simultaneity",
    title: "Time dilation and the relativity of simultaneity",
    weekNumber: 4,
    blurb: "Moving clocks run slow, and 'now' depends on who's asking.",
    lectureTitle: "4.2 Time dilation and the relativity of simultaneity",
    body: `# Time dilation and the relativity of simultaneity

If light's speed is the same for everyone, time must be flexible. Two of the strangest consequences are **time dilation** and the **relativity of simultaneity**.

## Time dilation

**Moving clocks run slow.** A clock moving relative to you ticks slower than your own — and this is real, not an illusion.

> The faster you move, the slower your time passes *relative to* a stationary observer. Near the speed of light, the effect becomes dramatic.

It applies to *all* clocks, including biological ones — so it is about time itself, not about machinery.

## The twin "paradox"

One twin rockets off near light-speed and returns younger than the twin who stayed home. Strange, but true and not paradoxical: the traveling twin accelerated and turned around, breaking the symmetry between them.

## It is measured, not hypothetical

Time dilation is confirmed daily. Particles created in the upper atmosphere survive long enough to reach the ground only because their clocks run slow. **GPS satellites** must correct for relativity or navigation would drift by kilometers a day.

## The relativity of simultaneity

Two events that are simultaneous for one observer are *not* simultaneous for another moving relative to the first. There is **no universal "now"** stretching across the universe — the ordering of distant events can genuinely differ between observers.

## Why it matters

These effects dismantle the intuition that time is a single, universal river flowing at one rate for all. Time is local, personal, and relative — one of the most counterintuitive truths in all of science.`,
  },
  {
    slug: "mass-energy-equivalence",
    title: "Mass-energy equivalence",
    weekNumber: 4,
    blurb: "E = mc²: mass is a frozen, ferociously concentrated form of energy.",
    lectureTitle: "4.3 Mass-energy equivalence",
    body: `# Mass-energy equivalence

Special relativity's most famous result is that **mass and energy are the same thing** in different forms, linked by the most famous equation in physics:

$$E = mc^2$$

## What the equation says

- $E$ is energy, $m$ is mass, and $c$ is the speed of light.
- Because $c$ is enormous and it is *squared*, a *tiny* amount of mass holds a *staggering* amount of energy.
- Mass is, in effect, frozen energy — a hyper-concentrated store.

## Just how much energy

The mass in a single paperclip, fully converted, could power a city for a long while. Matter is the most concentrated energy reservoir in the universe.

## Where we see it

- **The Sun:** fusion converts about 4 million tonnes of mass into sunlight *every second*.
- **Nuclear power and weapons:** release energy by converting a sliver of nuclear mass.
- **Particle accelerators:** turn energy *back into* mass, creating new particles from pure kinetic energy.

## Mass is not conserved alone

A startling shift: mass and energy are not separately conserved — only the *combined* total is. In a nuclear reaction, the products weigh slightly less than the reactants; the missing mass left as energy.

## Why it matters

$E=mc^2$ unified two pillars of Week 1 — conservation of mass and conservation of energy — into a single law. It explains why stars shine, why the nucleus stores such power, and reveals matter and energy as two faces of one reality.`,
  },
  {
    slug: "general-relativity-spacetime",
    title: "General relativity and curved spacetime",
    weekNumber: 4,
    blurb: "Gravity isn't a force — it's the curvature of spacetime by mass.",
    lectureTitle: "4.4 General relativity and curved spacetime",
    body: `# General relativity and curved spacetime

In 1915 Einstein extended relativity to gravity and acceleration, producing **general relativity** — a radical reimagining of what gravity *is*.

## Gravity is not a force

Newton saw gravity as a force reaching across space. Einstein saw it differently: **mass and energy curve spacetime**, and what we call gravity is objects moving along the straightest possible paths through that curved geometry.

> "Spacetime tells matter how to move; matter tells spacetime how to curve." — John Wheeler

## The rubber-sheet picture

Imagine a heavy ball on a stretched sheet: it dents the surface, and a rolling marble curves toward it — not because of a pull, but because the *surface itself* is warped. Planets orbit the Sun because they follow the valleys the Sun carves in spacetime.

## The equivalence principle

Einstein's key insight: **gravity and acceleration are locally indistinguishable**. Standing on Earth feels exactly like accelerating in a rocket. From this single idea the whole theory unfolds.

## Confirmed predictions

- **Light bends** around massive objects (seen during eclipses, and as gravitational lensing).
- **Time runs slower** in stronger gravity (confirmed by precise clocks at different altitudes).
- **Black holes** — regions where spacetime curves so steeply nothing escapes.
- **Gravitational waves** — ripples in spacetime, directly detected in 2015.

## Why it matters

General relativity replaced Newton's force with geometry, gave us black holes and the expanding universe, and remains our deepest theory of gravity — the stage on which cosmology plays out.`,
  },
  {
    slug: "expanding-universe-cosmology",
    title: "The expanding universe and cosmology",
    weekNumber: 4,
    blurb: "The galaxies are flying apart — and space itself is stretching.",
    lectureTitle: "4.5 The expanding universe and cosmology",
    body: `# The expanding universe and cosmology

**Cosmology** is the physics of the universe as a whole — its structure, origin, and fate. Its founding discovery: the universe is **expanding**.

## Hubble's discovery

In the 1920s Edwin Hubble found that distant galaxies are *receding* from us, and the farther away they are, the faster they go. The universe is not static — it is growing.

## Space itself is stretching

The galaxies are not flying *through* space from an explosion. **Space itself is expanding**, carrying galaxies apart like raisins in rising dough. There is no center and no edge; every observer sees everyone else receding.

## Running the film backward

If everything is spreading apart now, it was closer together in the past — and once unimaginably dense and hot. Rewind far enough and you reach a beginning: the **Big Bang** (next topic).

## Dark matter and dark energy

Cosmology has revealed that ordinary matter is a small fraction of the universe:

- **Dark matter** — unseen mass whose gravity holds galaxies together; about a quarter of everything.
- **Dark energy** — a mysterious pressure *accelerating* the expansion; about 70%.

Together they mean roughly **95% of the universe is stuff we cannot directly see and do not understand**.

## Why it matters

Cosmology applies the physics of the very small and the very fast to the largest scales imaginable — and confronts us with how much remains unknown about the cosmos we live in.`,
  },
  {
    slug: "big-bang-origin",
    title: "The Big Bang and the origin of everything",
    weekNumber: 4,
    blurb: "How the universe began hot and dense, and how we know.",
    lectureTitle: "4.6 The Big Bang and the origin of everything",
    body: `# The Big Bang and the origin of everything

The **Big Bang** is our best theory of how the universe began: about **13.8 billion years ago** from an extraordinarily hot, dense state, expanding and cooling ever since.

## Not an explosion in space

A common misconception: the Big Bang was not a bomb going off *in* empty space. It was the rapid expansion *of space itself*, everywhere at once. There was no "outside" and no central point — it happened *everywhere*.

## The story in stages

1. **Earliest moments:** unimaginably hot and dense; the fundamental forces and particles emerge.
2. **First minutes:** the lightest nuclei (hydrogen, helium) form as the universe cools.
3. **~380,000 years:** atoms form; the universe becomes transparent and light streams free.
4. **Hundreds of millions of years:** gravity pulls matter into stars and galaxies.

## The evidence

The Big Bang is not a guess — it rests on three pillars:

- **Cosmic expansion** (Hubble): the universe is growing, so it was once tiny.
- **The cosmic microwave background:** the faint afterglow of the hot early universe, found everywhere in the sky.
- **Abundance of light elements:** the observed hydrogen-to-helium ratio matches the theory's prediction precisely.

## What it does not answer

The Big Bang describes how the universe *evolved* from an early hot state — not what "caused" it or what came "before." Those remain open frontiers.

## Why it matters

The Big Bang ties together relativity, particle physics, and thermodynamics into a single grand narrative of cosmic history — the origin story of everything.`,
  },
  {
    slug: "frontiers-mysteries",
    title: "Frontiers, mysteries, and unanswered questions",
    weekNumber: 4,
    blurb: "What physics still doesn't know — and where it's heading.",
    lectureTitle: "4.7 Frontiers, mysteries, and unanswered questions",
    body: `# Frontiers, mysteries, and unanswered questions

For all its triumphs, physics is unfinished. Some of the deepest questions remain wide open — and that is what keeps the science alive.

## The great unsolved problems

- **Quantum gravity:** our two best theories — quantum mechanics and general relativity — are mathematically incompatible. No one yet knows how to unite them.
- **Dark matter and dark energy:** 95% of the universe is stuff we cannot identify.
- **The measurement problem:** what *really* happens when a quantum system is observed?
- **The arrow of time:** why did the universe begin in such a low-entropy, orderly state?
- **Fine-tuning:** why do the constants of nature have values that allow stars, atoms, and life?

## Candidate ideas

Physicists pursue bold, unconfirmed ideas — **string theory**, **loop quantum gravity**, the **multiverse**. These are attempts, not yet answers; their test is always experiment.

## The limits of knowing

Some limits appear fundamental — the uncertainty principle, the speed of light, the cosmic horizon beyond which we can never see. Part of physics is learning what *cannot* be known, not just what can.

## Why mysteries matter

Every settled theory was once an open question. Newton, Maxwell, and Einstein each resolved a mystery and uncovered new ones. The frontier is not a sign of failure but the engine of discovery.

## Why it matters

Knowing what we *don't* know is as important as knowing what we do. The unanswered questions define where physics goes next — and remind us the universe is far from fully understood.`,
  },
  {
    slug: "capstone-synthesis",
    title: "Capstone synthesis",
    weekNumber: 4,
    blurb: "Tracing one phenomenon through the whole of physics.",
    lectureTitle: "4.8 Capstone synthesis",
    body: `# Capstone synthesis

The capstone ties the course together: take a single, everyday phenomenon and trace it down through *every layer of physics* we have studied.

## The phenomenon

> **You stand in the sunlight and feel warm.**

A simple experience — and a thread that runs through the entire course.

## Follow it through the physics

1. **The source:** the Sun shines because **gravity** (Topic 2.1) crushes its core until **fusion** (Topic 3.6) ignites, converting mass to energy via **$E=mc^2$** (Topic 4.3).
2. **The energy:** that energy leaves as **light** — electromagnetic waves (Topic 2.5) — having obeyed **conservation of energy** at every step (Topic 1.6).
3. **The journey:** light crosses space at the universal speed $c$, the constant at the heart of **relativity** (Topic 4.1), through space that is itself **expanding** (Topic 4.5).
4. **The arrival:** photons (Topic 3.2) strike your skin; **wave-particle duality** (Topic 3.3) governs how they're absorbed.
5. **The warmth:** absorbed energy becomes **heat** — faster molecular motion (Topic 2.6) — and inevitably spreads, raising **entropy** (Topic 2.7) and pointing time's arrow forward.

## The standard

You understand a phenomenon in the physicist's sense when you can name *what is moving, what force acts, where the energy comes from, and where it goes* — across scales from the cosmic to the atomic.

## The whole in one ray of light

A single sunbeam touches gravity, nuclear physics, relativity, electromagnetism, quantum mechanics, and thermodynamics. That unity — one universe, one connected set of laws — is the deepest lesson of conceptual physics.`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  // Week 1
  {
    kind: "homework",
    title: "Homework 1.1 — Motion, frames, and forces",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Explain your reasoning in the answer box.",
    problems: [
      { topicSlug: "what-physics-is", prompt: "True or false: physics is mainly about memorizing equations and facts.", correctAnswer: "false", explanation: "Physics is a way of asking why and seeking universal laws; math is a tool, not the point." },
      { topicSlug: "space-time-frames", prompt: "Walking at 1 m/s toward the front of a train moving at 30 m/s, how fast do you move relative to the ground? (A number in m/s.)", correctAnswer: "31", explanation: "Velocities add: 30 + 1 = 31 m/s relative to the ground." },
      { topicSlug: "motion-and-change", prompt: "A car rounds a bend at a steady speed. Is its velocity changing? (yes or no)", correctAnswer: "yes", explanation: "Velocity includes direction, so changing direction changes velocity — the car is accelerating." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Newton's laws, momentum, and energy",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "forces-and-acceleration", prompt: "In Newton's second law, net force equals mass times what? (One word.)", correctAnswer: "acceleration", explanation: "F = ma: net force equals mass times acceleration." },
      { topicSlug: "inertia-mass-momentum", prompt: "Momentum is the product of an object's mass and its ____.", correctAnswer: "velocity", explanation: "Momentum p = mv, the product of mass and velocity." },
      { topicSlug: "energy-and-conservation", prompt: "If you double an object's speed, its kinetic energy is multiplied by what factor? (A number.)", correctAnswer: "4", explanation: "KE = ½mv²; doubling v multiplies KE by 2² = 4." },
      { topicSlug: "energy-and-conservation", prompt: "Energy is never created or destroyed, only ____.", correctAnswer: "transformed", explanation: "The law of conservation of energy: energy only changes form." },
    ],
  },
  {
    kind: "test",
    title: "Week 1 Test",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions: "Timed. 30 minutes. Pasting is disabled.",
    problems: [
      { topicSlug: "space-time-frames", prompt: "Is there a single frame of reference that is truly and absolutely at rest? (yes or no)", correctAnswer: "no", explanation: "All motion is relative; there is no absolute rest frame." },
      { topicSlug: "motion-and-change", prompt: "The rate of change of velocity is called ____.", correctAnswer: "acceleration", explanation: "Acceleration is how quickly velocity changes." },
      { topicSlug: "forces-and-acceleration", prompt: "A book rests on a table. The net force on it is what number?", correctAnswer: "0", explanation: "Gravity and the table's upward push cancel, so the net force is zero." },
      { topicSlug: "inertia-mass-momentum", prompt: "The measure of an object's inertia — its resistance to changes in motion — is its ____.", correctAnswer: "mass", explanation: "Mass measures inertia; it is not the same as weight." },
      { topicSlug: "forces-and-acceleration", prompt: "For every action there is an equal and opposite ____ (Newton's third law).", correctAnswer: "reaction", explanation: "Forces come in equal-and-opposite pairs." },
      { topicSlug: "cause-law-clockwork", prompt: "The idea that the universe's future is fully fixed by its present state and the laws of physics is called ____.", correctAnswer: "determinism", explanation: "Determinism is the clockwork view that the future is implied by the present." },
    ],
  },

  // Week 2
  {
    kind: "homework",
    title: "Homework 2.1 — Gravity, fields, and charge",
    weekNumber: 2,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "gravity-and-orbits", prompt: "If you double the distance between two masses, the gravitational force becomes what fraction of the original? (e.g., 1/4)", correctAnswer: "1/4", explanation: "Gravity is inverse-square: doubling distance gives 1/2² = 1/4 the force." },
      { topicSlug: "fields-action-at-a-distance", prompt: "The concept that replaces spooky 'action at a distance' with a condition of space carrying force is the ____.", correctAnswer: "field", explanation: "A field assigns a force-value to each point in space." },
      { topicSlug: "electricity-and-charge", prompt: "Two charges with the same sign will attract or repel each other?", correctAnswer: "repel", explanation: "Like charges repel; opposite charges attract." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 2.2 — Electromagnetism, light, and heat",
    weekNumber: 2,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "magnetism-and-electricity", prompt: "Electricity and magnetism are unified into a single force called ____.", correctAnswer: "electromagnetism", explanation: "Moving charge makes magnetism and changing magnetism makes electricity — one force." },
      { topicSlug: "light-em-spectrum", prompt: "Light is a type of ____ wave that needs no medium to travel.", correctAnswer: "electromagnetic", explanation: "Light is a self-propagating electromagnetic wave." },
      { topicSlug: "heat-temperature-time", prompt: "Temperature measures the average ____ energy of a substance's particles.", correctAnswer: "kinetic", explanation: "Temperature is the average kinetic energy (jiggling) of particles." },
      { topicSlug: "entropy-and-disorder", prompt: "The second law of thermodynamics says the total ____ of an isolated system tends to increase.", correctAnswer: "entropy", explanation: "Entropy (disorder) tends to increase, giving time its arrow." },
    ],
  },
  {
    kind: "midterm",
    title: "Midterm — Weeks 1 & 2",
    weekNumber: 2,
    isTimed: true,
    timeLimitMinutes: 60,
    instructions: "Cumulative midterm. 60 minutes. Pasting disabled.",
    problems: [
      { topicSlug: "what-physics-is", prompt: "Physics expresses the speed of light as 3 × 10^? m/s. (Give the exponent as a number.)", correctAnswer: "8", explanation: "The speed of light is about 3 × 10^8 m/s." },
      { topicSlug: "forces-and-acceleration", prompt: "What does a net force cause an object to do — keep moving, or change its motion?", correctAnswer: "change its motion", explanation: "Force causes acceleration (a change in motion), not motion itself." },
      { topicSlug: "inertia-mass-momentum", prompt: "In a collision with no outside force, the total ____ before equals the total after.", correctAnswer: "momentum", explanation: "Conservation of momentum holds when no external force acts." },
      { topicSlug: "energy-and-conservation", prompt: "A swinging pendulum continually trades kinetic energy for ____ energy and back.", correctAnswer: "potential", explanation: "Energy oscillates between kinetic and potential forms." },
      { topicSlug: "gravity-and-orbits", prompt: "Kepler showed the orbits of planets are shaped like circles or ellipses?", correctAnswer: "ellipses", explanation: "Orbits are ellipses with the Sun at one focus." },
      { topicSlug: "electricity-and-charge", prompt: "The flow of electric charge through a circuit is called electric ____.", correctAnswer: "current", explanation: "Current is charge in motion." },
      { topicSlug: "light-em-spectrum", prompt: "Order by wavelength: which has the shorter wavelength, a radio wave or a gamma ray?", correctAnswer: "gamma ray", explanation: "Gamma rays have far shorter wavelengths (and higher energy) than radio waves." },
      { topicSlug: "heat-temperature-time", prompt: "Heat always flows spontaneously from a hotter object to a ____ one.", correctAnswer: "colder", explanation: "Heat flows hot → cold, never the reverse on its own." },
    ],
  },

  // Week 3
  {
    kind: "homework",
    title: "Homework 3.1 — Atoms and the quantum",
    weekNumber: 3,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "atomic-picture-of-matter", prompt: "The smallest unit of an element that keeps its identity is the ____.", correctAnswer: "atom", explanation: "Atoms are the basic units of the elements." },
      { topicSlug: "quantum-revolution", prompt: "In quantum physics, energy comes in discrete packets called ____.", correctAnswer: "quanta", explanation: "Energy is quantized — delivered in lumps called quanta." },
      { topicSlug: "wave-particle-duality", prompt: "A particle of light is called a ____.", correctAnswer: "photon", explanation: "Light behaves as particles called photons." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 3.2 — Uncertainty, the atom, and the nucleus",
    weekNumber: 3,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "uncertainty-limits-of-knowing", prompt: "Heisenberg's principle says you cannot simultaneously know a particle's exact position and its exact ____.", correctAnswer: "momentum", explanation: "Position and momentum cannot both be known precisely at once." },
      { topicSlug: "structure-of-the-atom", prompt: "Nearly all of an atom's mass is concentrated in its tiny central ____.", correctAnswer: "nucleus", explanation: "Rutherford showed the atom is mostly empty space with a dense nucleus." },
      { topicSlug: "nucleus-and-radioactivity", prompt: "The time for half a radioactive sample to decay is called its ____.", correctAnswer: "half-life", explanation: "Half-life is the time for half the atoms to decay." },
      { topicSlug: "nucleus-and-radioactivity", prompt: "The force that holds protons together in the nucleus despite their repulsion is the ____ force.", correctAnswer: "strong", explanation: "The strong nuclear force overcomes electric repulsion at short range." },
    ],
  },
  {
    kind: "test",
    title: "Week 3 Test",
    weekNumber: 3,
    isTimed: true,
    timeLimitMinutes: 40,
    instructions: "Timed. 40 minutes. Pasting disabled.",
    problems: [
      { topicSlug: "atomic-picture-of-matter", prompt: "Adding heat takes a substance from solid to liquid to ____.", correctAnswer: "gas", explanation: "More molecular motion climbs the ladder solid → liquid → gas." },
      { topicSlug: "wave-particle-duality", prompt: "The experiment showing light and electrons interfere like waves even one at a time is the ____-slit experiment.", correctAnswer: "double", explanation: "The double-slit experiment demonstrates wave-particle duality." },
      { topicSlug: "uncertainty-limits-of-knowing", prompt: "Is quantum uncertainty caused by clumsy instruments, or built into nature? (Answer: instruments or nature)", correctAnswer: "nature", explanation: "The uncertainty is fundamental, not a measurement flaw." },
      { topicSlug: "structure-of-the-atom", prompt: "The number of protons in an atom, which defines the element, is the atomic ____.", correctAnswer: "number", explanation: "The atomic number is the proton count and sets the element." },
      { topicSlug: "particle-zoo-standard-model", prompt: "Protons and neutrons are each built from three particles called ____.", correctAnswer: "quarks", explanation: "Quarks combine in threes to form protons and neutrons." },
    ],
  },

  // Week 4
  {
    kind: "homework",
    title: "Homework 4.1 — Relativity",
    weekNumber: 4,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "special-relativity-light", prompt: "According to special relativity, is the speed of light the same for all observers? (yes or no)", correctAnswer: "yes", explanation: "Light's speed in a vacuum is constant for every observer — the second postulate." },
      { topicSlug: "time-dilation-simultaneity", prompt: "A clock moving fast relative to you runs faster or slower than your own?", correctAnswer: "slower", explanation: "Moving clocks run slow — time dilation." },
      { topicSlug: "mass-energy-equivalence", prompt: "In E = mc², what does m stand for? (One word.)", correctAnswer: "mass", explanation: "E = mc² links energy E to mass m via the speed of light c." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 4.2 — Spacetime, cosmology, and frontiers",
    weekNumber: 4,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice.",
    problems: [
      { topicSlug: "general-relativity-spacetime", prompt: "In general relativity, gravity is explained as the curvature of ____.", correctAnswer: "spacetime", explanation: "Mass and energy curve spacetime; that curvature is gravity." },
      { topicSlug: "expanding-universe-cosmology", prompt: "Hubble found that distant galaxies are moving toward us or away from us?", correctAnswer: "away", explanation: "Galaxies recede as space itself expands." },
      { topicSlug: "big-bang-origin", prompt: "About how many billion years ago did the Big Bang occur? (A number.)", correctAnswer: "13.8", explanation: "The universe is about 13.8 billion years old." },
      { topicSlug: "frontiers-mysteries", prompt: "The two theories that physicists have not yet been able to unite are quantum mechanics and general ____.", correctAnswer: "relativity", explanation: "Reconciling quantum mechanics with general relativity (quantum gravity) is unsolved." },
    ],
  },
  {
    kind: "final",
    title: "Final Exam — All weeks",
    weekNumber: 4,
    isTimed: true,
    timeLimitMinutes: 90,
    instructions: "Cumulative final. 90 minutes. Pasting disabled.",
    problems: [
      { topicSlug: "motion-and-change", prompt: "Galileo argued the natural state of motion is rest or constant velocity?", correctAnswer: "constant velocity", explanation: "Motion needs no cause; only changes in motion do." },
      { topicSlug: "forces-and-acceleration", prompt: "Write Newton's second law as an equation of the form F = m_. (Fill the blank with one letter.)", correctAnswer: "a", explanation: "F = ma — force equals mass times acceleration." },
      { topicSlug: "energy-and-conservation", prompt: "The rate at which energy is transferred or work is done is called ____.", correctAnswer: "power", explanation: "Power is energy per unit time." },
      { topicSlug: "gravity-and-orbits", prompt: "An orbiting moon is best described as perpetually ____ toward the planet while moving sideways.", correctAnswer: "falling", explanation: "An orbit is endless falling combined with forward motion." },
      { topicSlug: "entropy-and-disorder", prompt: "The one-way flow of heat and increase of entropy define the arrow of ____.", correctAnswer: "time", explanation: "Entropy distinguishes past from future — the arrow of time." },
      { topicSlug: "wave-particle-duality", prompt: "Light and matter behaving as both waves and particles is called wave-particle ____.", correctAnswer: "duality", explanation: "Quantum objects show wave or particle behavior depending on the experiment." },
      { topicSlug: "nucleus-and-radioactivity", prompt: "The Sun is powered by merging light nuclei — a process called ____.", correctAnswer: "fusion", explanation: "Fusion of light nuclei releases the energy that powers stars." },
      { topicSlug: "mass-energy-equivalence", prompt: "E = mc² shows that mass is a highly concentrated form of ____.", correctAnswer: "energy", explanation: "Mass and energy are equivalent; a tiny mass holds enormous energy." },
      { topicSlug: "general-relativity-spacetime", prompt: "Einstein's principle that gravity and acceleration are locally indistinguishable is the ____ principle.", correctAnswer: "equivalence", explanation: "The equivalence principle is the foundation of general relativity." },
      { topicSlug: "capstone-synthesis", prompt: "To understand a phenomenon as a physicist, name where the energy comes from and where it ____.", correctAnswer: "goes", explanation: "Tracking energy from source to destination is the core of physical understanding." },
    ],
  },
];

export async function seedIfEmpty(): Promise<void> {
  const existing = await db.execute(sql`select count(*)::int as n from topics`);
  const row = (existing.rows[0] ?? {}) as { n?: number };
  if ((row.n ?? 0) > 0) {
    logger.info("Seed: already populated, skipping");
    return;
  }
  logger.info("Seed: populating course content");

  // Topics + lectures
  const slugToTopicId = new Map<string, number>();
  for (let i = 0; i < TOPICS.length; i++) {
    const t = TOPICS[i]!;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
    slugToTopicId.set(t.slug, inserted.id);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
  }

  // Assignments + problems
  for (let i = 0; i < ASSIGNMENTS.length; i++) {
    const a = ASSIGNMENTS[i]!;
    const [inserted] = await db
      .insert(assignmentsTable)
      .values({
        kind: a.kind,
        title: a.title,
        weekNumber: a.weekNumber,
        position: i,
        isTimed: a.isTimed,
        timeLimitMinutes: a.timeLimitMinutes,
        instructions: a.instructions,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
    for (let p = 0; p < a.problems.length; p++) {
      const prob = a.problems[p]!;
      const topicId = slugToTopicId.get(prob.topicSlug);
      if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
      await db.insert(problemsTable).values({
        assignmentId: inserted.id,
        topicId,
        position: p,
        prompt: prob.prompt,
        correctAnswer: prob.correctAnswer,
        explanation: prob.explanation,
        hint: prob.hint ?? null,
      });
    }
  }

  logger.info({ topics: TOPICS.length, assignments: ASSIGNMENTS.length }, "Seed complete");
}
