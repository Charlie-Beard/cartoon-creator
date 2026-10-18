/**
 * Hogwarts (Wizard Words, charlie-beard/spelling-game).
 *
 * The cast, places and things of the spelling game, ported for the cartoon
 * maker. The drawing code is the game's own (torn paper, src/art/paper.ts);
 * only the plumbing changed. What is new here: Snape, the Forbidden Forest,
 * the `mouth` / `mouthOpen` / `lids` parts on every talking face, and the
 * `fly` and `loom` poses.
 *
 *   characters/   hedwig, heroes, hosts1, hosts2 (the portraits), people
 *                 (the portrait template), snape, poses
 *   places/       one backdrop per file, from the game's chapter stories
 *   objects/      small story props (snitch, patronus, suit of armour …)
 *   scenery.ts    the castle at night, the starry sky, the Forbidden Forest
 *   props.ts      everyday things from the game's picture books (wand, owl …)
 *   treasures.ts  the five hidden treasures (ring, diary, locket, cup, diadem)
 */
import { C } from '../../art/palette';
import { cached } from '../../art/paper';
import { defineWorld } from '../types';
import { dudley, petunia, vernon } from './characters/dursleys';
import { hedwig } from './characters/hedwig';
import { hagrid, harry, hermione, ron } from './characters/heroes';
import { basilisk, dobby, fawkes, gnome, nick, ollivander, trevor, voldemort, willow } from './characters/hosts1';
import {
  bellatrix, buckbeak, crookshanks, deatheater, dumbledore, ginny, griphook, horntail, kreacher, luna, lupin, mcgonagall,
  moody, myrtle, nagini, neville, sirius, slughorn, wormtail,
} from './characters/hosts2';
import { buckbeakFly, fawkesFly, hedwigFly, voldemortLoom } from './characters/poses';
import { snape } from './characters/snape';
import { lockhart } from './characters/lockhart';
import { tabbyCat } from './characters/tabbyCat';
import { peeves } from './characters/peeves';
import { baron, baronLoom } from './characters/baron';
import { sirPatrick } from './characters/sirPatrick';
import { mrsWeasley } from './characters/mrsWeasley';
import { gnomeChief } from './characters/gnomeChief';
import { norbert } from './characters/norbert';
import { dragonKeeper } from './characters/dragonKeepers';
import { bush, hedge } from './objects/garden';
import { babyHarryArt } from './objects/babyHarry';
import { bludgerArt } from './objects/bludger';
import { candle } from './objects/floatingCandle';
import { goldenEgg } from './objects/goldenEgg';
import { knightArt } from './objects/knight';
import { orreryArt } from './objects/orrery';
import { patronus } from './objects/patronus';
import { featherArt } from './objects/phoenixFeather';
import { pieArt } from './objects/pie';
import { quaffleArt } from './objects/quaffle';
import { snitchArt } from './objects/snitch';
import { spectrespecs } from './objects/spectrespecs';
import { spider } from './objects/spider';
import { wardrobe } from './objects/wardrobe';
import { windChimes } from './objects/windChimes';
import { streetLampArt } from './objects/streetLamp';
import { putOuterArt } from './objects/putOuter';
import { flyingMotorbikeArt } from './objects/flyingMotorbike';
import { ghostDancersArt, ghostHorseArt } from './objects/ghostParty';
import { bankHall } from './places/gringotts-hall';
import { bedroom } from './places/bedroom';
import { burrow } from './places/burrow';
import { chamber } from './places/chamber-of-secrets';
import { classroom } from './places/classroom';
import { commonRoom } from './places/common-room';
import { compartment } from './places/train-compartment';
import { corridor } from './places/corridor';
import { courtyard } from './places/courtyard';
import { arena } from './places/dragon-arena';
import { sky } from './places/flying-sky';
import { greatHall } from './places/great-hall';
import { grounds } from './places/grounds';
import { hut } from './places/hagrids-hut';
import { office } from './places/headmasters-office';
import { kitchen } from './places/kitchen';
import { surface } from './places/lake-surface';
import { london } from './places/london';
import { privetDrive } from './places/privet-drive';
import { meadow } from './places/meadow';
import { paddock } from './places/paddock';
import { dungeon } from './places/potions-dungeon';
import { pitch } from './places/quidditch-pitch';
import { stadium } from './places/quidditch-stadium';
import { stands } from './places/quidditch-stands';
import { fakeDementor, gryffindorBanner, robeHeap } from './objects/fakeDementors';
import { room } from './places/room-of-requirement';
import { cliffs } from './places/sea-cliffs';
import { throneRoom } from './places/throne-room';
import { roomArt } from './places/training-room';
import { underwater } from './places/underwater';
import { vault } from './places/gringotts-vault';
import { shop } from './places/wand-shop';
import { honeydukes } from './places/honeydukes';
import { secretTunnel } from './places/secret-tunnel';
import { fizzingWhizbee, iceMouse, pepperImp, sweetJar, trapdoor } from './objects/sweets';
import { dursleyKitchen } from './places/dursley-kitchen';
import { grunningsOffice } from './places/grunnings-office';
import { hillsBackdrop } from './places/countryside';
import {
  birthdayCake, bat, broomstick, cauldron, cobweb, crescentMoon, dragon, flame, frog, galleon, lantern, magicWand,
  owl, owlPostLetter, parchmentMap, pumpkin, quill, rat, redStone, schoolBag, sortingHat, spellbook, toad, wand, chessKnight,
} from './props';
import { castleNight, forbiddenForest, nightSky } from './scenery';
import { diadem, diary, cup as goldenCup, locket, ring } from './treasures';
import { castleDoors, snowyGrounds } from './places/winter';
import { dormitory } from './places/dormitory';
import { astronomyTower } from './places/astronomy-tower';
import { crate, hanky, invisibilityCloak, teddy } from './objects/norbert';
import { christmasTree, snowball } from './objects/christmasTree';
import { admiralHat, cracker, flowerBonnet, jumper, whiteMouse } from './objects/christmas';
import { ghostParty } from './places/ghost-party';
import { ghostFeast, gong, sawBand } from './objects/ghostFeast';
import { dwarfCupid } from './characters/dwarfCupid';
import { bigHeart, harp, heartGarland, valentineCard } from './objects/valentine';
import { fred, george } from './characters/twins';
import { malfoy, malfoyTangled } from './characters/malfoy';
import { wood } from './characters/wood';
import { fireboltArt, quidditchCupArt } from './objects/quidditchCup';
import { maraudersMapArt, oneEyedWitchArt } from './objects/marauders';
import { fluffy } from './characters/fluffy';
import { woodenFlute } from './objects/woodenFlute';
import { thirdFloorRoom } from './places/third-floor-room';
import { devilsSnareArt } from './objects/devilsSnare';
import { potionChamber } from './places/potion-chamber';
import { potionTableArt } from './objects/potionTable';
import { blackFireArt, purpleFireArt } from './objects/magicFire';
import { riddleScrollArt } from './objects/riddleScroll';
import { mirrorOfErisedArt } from './objects/mirrorOfErised';
import { sirCadogan, sirCadoganFallen } from './characters/sirCadogan';
import { pinkLady } from './characters/pinkLady';
import { grandStaircase } from './places/grand-staircase';
import { portraitFrameArt } from './objects/portraitFrame';
import { paintedFieldArt, paintedParlourArt } from './objects/paintedField';
import { passwordListArt } from './objects/passwordList';
import { cadoganPony } from './objects/cadoganPony';

// The hair-and-robe portraits, shared by the notes below.
const PERSON = ['figure', 'head', 'lids', 'mouth', 'mouthOpen'];
const PERSON_WAND = [...PERSON, 'wand'];
const PERSON_BEARD = ['figure', 'head', 'lids'];

export default defineWorld({
  id: 'hogwarts',
  name: 'Hogwarts',
  accent: C.night,
  about: [
    'Hogwarts School of Witchcraft and Wizardry and the wizarding world round it: the castle on its hill, the Great Hall, the common room, Hagrid\'s hut, the Forbidden Forest, Diagon Alley, the Burrow. It is the world of Wizard Words, the spelling game: candlelight, night blue, torn paper, owls.',
    'Tone: cosy, funny and a little spooky. He loves the darker side (Voldemort, Bellatrix, Death Eaters, the Battle of Hogwarts), so a cartoon may have a proper scary beat. But scary is not cruel: villains loom, hiss, cackle, swish their cloaks and get outwitted, and nobody is ever hurt on screen. Nobody is lost for good, and everyone in this world is alive and well. Every scary beat cuts back to the friends before it is too much, and every episode ends safe and warm.',
    'Never shown, ever: the three Unforgivable Curses (and any green killing-curse light), Katie Bell and the cursed necklace, anything at Malfoy Manor, any death (Dobby, Sirius, Dumbledore, Snape, Fred and the rest are all fine), Harry as a Horcrux, blood or gore. Spells are sparkles, and a wand is aimed at objects, at the sky or at a spell, never at a person\'s body. The one duelling spell is Expelliarmus: the other wand simply flies out of their hand.',
    'Magic words he may hear (say them clearly and keep them few): Lumos, Wingardium Leviosa, Accio, Alohomora, Expelliarmus, Expecto Patronum, Riddikulus. Sounds: Hedwig hoots, the castle creaks, Hagrid booms, spells twinkle.',
    'The friends are Harry, Hermione and Ron; Hedwig is the helper. Houses: Gryffindor is red and gold, Slytherin green and silver, Ravenclaw blue and bronze, Hufflepuff yellow and black. Everything is original paper art: no film faces, logos or fonts, so keep describing people by their paper look (round glasses, bushy hair, a big beard) and never by an actor.',
    'UK English throughout: "Mum", "jumper", "sweets", "torch", "biscuit". Short sentences. Use the first names children use (Harry, Ron, Hermione, Hagrid) and "Professor" for teachers.',
  ].join('\n\n'),

  characters: {
    hedwig: {
      name: 'Hedwig',
      art: () => hedwig(),
      poses: { fly: hedwigFly },
      parts: ['feet', 'wingL', 'wingR', 'body', 'head', 'eyes', 'lids'],
      chip: '70 30 160 160',
      about:
        'Harry\'s snowy owl and the helper of the game: loyal, quick and clever. She never says words. She hoots (soft hoots for "well done", an urgent double hoot for "look out") and the other characters or the narrator say what she means ("Hedwig says you did it!"). She carries letters and parcels, swoops in to help at just the right moment, and nips an ear fondly. She would never be frightened off, but she is never in danger either. Perched by default; the `fly` pose has her wings spread for a swoop.',
      voice:
        'No spoken lines: use soft owl hoots (a synth or recorded hoot, not an ElevenLabs voice). If she ever has to be voiced, a gentle high British girl\'s voice, slow and warm, like the narrator.',
    },

    harry: {
      name: 'Harry',
      art: harry,
      parts: PERSON_WAND,
      about:
        'Harry Potter, 11 or 12: messy black hair, round glasses, a lightning scar, a red and gold Gryffindor tie. Brave, kind and a bit unsure of himself; he leads with his heart and always looks after his friends. He talks plainly and gently ("Come on, we can do this!", "Are you all right?"). He would never be cruel, show off or leave anyone behind. When he casts, the wand lifts and sparkles. He does not speak in the spelling game (the child picks him as a hero), so he is free to be given lines here.',
      voice:
        'Not cast in Wizard Words (he was the player). Suggest a warm, friendly young British boy, light and clear, with an eager, slightly nervous edge. Speed about 0.95, stability about 0.45.',
    },

    hermione: {
      name: 'Hermione',
      art: hermione,
      parts: PERSON_WAND,
      about:
        'Hermione Granger: big bushy brown hair, a red and gold tie, a wand always to hand. The cleverest in the year, who has read about everything, and who says so kindly ("Actually, I read about this!"). Brisk, bossy in a caring way, brave when it matters. She works out the puzzle and explains it in short sentences. She would never leave a friend in trouble. Likes books, rules and Ron\'s company, though she tuts at him.',
      voice:
        'Not cast in Wizard Words. Suggest a bright, quick young British girl, confident, a little bossy and always kind. Speed about 1.0, stability about 0.45.',
    },

    ron: {
      name: 'Ron',
      art: ron,
      parts: PERSON,
      about:
        'Ron Weasley: flaming ginger hair, freckles, a long nose, a big grin and a hand-knitted maroon jumper with an R on it. Loyal, funny and always hungry; scared of spiders and a bit nervous, but he stands by his friends. He says "Blimey!", "Brilliant!" and "Wicked!". Brave when it counts, a good chess player. He would never run off and leave Harry and Hermione.',
      voice:
        'Not cast in Wizard Words. Suggest a cheerful young British boy, a bit breathless and comic, quick when excited. Speed about 1.0, stability about 0.35.',
    },

    hagrid: {
      name: 'Hagrid',
      art: hagrid,
      parts: PERSON_BEARD.concat(['mouth', 'mouthOpen']),
      about:
        'Rubeus Hagrid, the gamekeeper: enormous, with a bushy black beard and hair and a big brown coat. Booming, warm and soft-hearted, who loves every creature however toothy ("Ah, he\'s just a big softie!"). Says "Blimey!", "Yer a wizard, Harry!" and "Come on in, mind yer head!"; keep his accent light so a six-year-old can follow it. Cooks rock cakes nobody can eat. He would never be unkind. He can be too trusting, and he laughs with his whole belly. Lives in the hut by the Forbidden Forest with his dog Fang.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (a warm, deep, friendly British man), speed 0.88, stability 0.4 for a big, rumbling, expressive delivery.',
    },

    dumbledore: {
      name: 'Dumbledore',
      art: dumbledore,
      parts: PERSON_BEARD.concat(['mouth', 'mouthOpen']),
      about:
        'Professor Dumbledore, the headmaster: a long silver beard and hair, half-moon glasses, a purple robe with gold stars and a pointed hat. Calm, twinkly and wise, with a gentle joke never far away ("Sherbet lemon?"). Speaks slowly and kindly, a little riddling. He is never frightened and never cross, only a bit disappointed. Loves sweets, socks, Fawkes the phoenix and a good cup of tea. He is alive and well and the one grown-up who knows the way out.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.86, stability 0.6: slow, calm, a smile in the voice.',
    },

    mcgonagall: {
      name: 'McGonagall',
      art: mcgonagall,
      parts: PERSON_WAND,
      about:
        'Professor McGonagall, Head of Gryffindor and teacher of Transfiguration: a green robe, a tall pointed hat, square glasses, hair in a tight bun. Strict and crisp ("Really, Potter!") but fair and secretly proud of her students. Short, brisk sentences. She can turn into a tabby cat with square markings round her eyes. She would never shout cruelly; her sternness always ends in a small smile.',
      voice:
        'ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2 (a clear, crisp British woman), speed 0.92, stability 0.6.',
    },

    snape: {
      name: 'Snape',
      art: snape,
      parts: PERSON,
      about:
        'Professor Snape, the Potions master (new for the cartoons; the game never drew him): sallow face, long black hair framing it, a long nose, a high-buttoned black robe. Stern, sarcastic and dry; speaks slowly and quietly ("Sit. Down."), which is scarier than shouting. Swishes his robe and raises one eyebrow. He may scowl and snap "Detention!" but he never hurts, shouts cruelly at or humiliates anyone, and in the end he helps. Good for a comic grump or a stern teacher.',
      voice:
        'Not cast in Wizard Words. Suggest a low, slow, dry British man, quiet and precise, using ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (the deep British voice used for Voldemort and Neville) at speed 0.85 and stability 0.55.',
    },

    dobby: {
      name: 'Dobby',
      art: dobby,
      parts: PERSON.concat(['sock']),
      about:
        'Dobby the house-elf: big green eyes, huge bat ears, a pillowcase for clothes, and a favourite sock. Squeaky, eager and devoted ("Dobby is free!", "Dobby will help Harry Potter!"). Speaks about himself as "Dobby", never "I". Shy, loyal and brave in a small way, he pops in and out with a crack. He is free and happy, and he is always safe in these cartoons.',
      voice:
        'ElevenLabs voice N2lVS1w4EtoT3dr4eOWO (a rough, quick-talking voice, raised in pitch), speed 1.05, stability 0.3 for a squeaky, excitable delivery.',
    },

    voldemort: {
      name: 'Voldemort',
      art: voldemort,
      poses: { loom: voldemortLoom },
      parts: PERSON_WAND,
      about:
        'Lord Voldemort, the dark wizard: pale, bald, snake-slit nose, red narrow eyes, a black cloak. Scary but never cruel. He looms, hisses ("Haaarry Pottter..."), swishes his cloak and sneers, and his plans always fall apart. He never hurts, curses or kills anyone on screen, never points a wand at a person, and no killing-curse light ever appears. Always cuts back to the heroes before it is too much; always outwitted in a funny or clever way. In the `loom` pose he leans in with both hands raised.',
      voice:
        'ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (a deep British man), speed 0.82, stability 0.5: slow, whispery and hissing, never shouting.',
    },

    ollivander: {
      name: 'Ollivander',
      art: ollivander,
      parts: PERSON_WAND,
      about:
        'Mr Ollivander, the wandmaker in Diagon Alley: wild white hair, pale silver eyes, a plum robe. Soft-spoken, dreamy and a little eerie ("The wand chooses the wizard, Harry."). Remembers every wand he ever sold. He peers closely and measures with a long tape. Friendly under the spookiness; never dangerous.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.88, stability 0.5: a soft, breathy, wondering tone.',
    },

    trevor: {
      name: 'Trevor',
      art: trevor,
      parts: [],
      chip: '60 110 180 180',
      about:
        'Trevor, Neville\'s toad: a round, warty, olive-green toad with big yellow eyes. He is always escaping and always turning up somewhere silly. He croaks ("Ribbit") and does not speak words; others translate. Harmless, gloomy and funny.',
      voice:
        'Mostly croaks. If a line is needed: ElevenLabs voice cgSgspJ2msm6clMCkdW9 (a light, expressive voice), speed 1.0, stability 0.4.',
    },

    nick: {
      name: 'Nearly Headless Nick',
      art: nick,
      parts: PERSON,
      chip: '58 72 144 144',
      about:
        'Nearly Headless Nick, the Gryffindor ghost: a see-through pale blue ghost in a ruff and old-fashioned clothes, with a head that wobbles sideways on one thread of neck (cartoon-funny, never gory: just a tilted head). Polite, posh and a little sorry for himself ("Welcome to Gryffindor, dear boy!"). Floats through walls and tables. Always cheerful in the end.',
      voice:
        'ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (British man), speed 0.95, stability 0.4: a posh, wobbly, polite ghost.',
    },

    gnome: {
      name: 'Garden gnome',
      art: gnome,
      parts: ['head'],
      chip: '60 40 180 180',
      about:
        'A garden gnome from the Weasleys\' garden: a bald, bumpy-headed little brown fellow with big ears. Cheeky and giggly, hops and gets flung over the hedge for fun. Squeaks and giggles, rarely says more than a line.',
      voice:
        'ElevenLabs voice N2lVS1w4EtoT3dr4eOWO (a rough voice, raised in pitch), speed 1.1, stability 0.3: a giggly little squeak.',
    },

    whompingWillow: {
      name: 'The Whomping Willow',
      art: willow,
      parts: ['branchL', 'branchR'],
      chip: '70 90 160 160',
      about:
        'The Whomping Willow: a grumpy old tree on the school grounds with a cross face in its trunk and big swinging branches. It flails and creaks when cross, and settles when calmed. It swats and whomps at the air and at things like cars; it never hits a person on screen. Creaks and groans, with only the odd gruff word.',
      voice:
        'ElevenLabs voice nPczCjzI2devNBz1zQrb (a deep, rumbly voice), speed 0.85, stability 0.5: a slow creak.',
    },

    fawkes: {
      name: 'Fawkes',
      art: fawkes,
      poses: { fly: fawkesFly },
      parts: ['wingL', 'wingR', 'head'],
      chip: '84 44 132 132',
      about:
        'Fawkes, Dumbledore\'s phoenix: red and gold feathers, a long gold tail, a singing bird. His song heals and cheers, and he bursts into flames and is reborn as a chick (a bright warm glow, never frightening, never a death). Proud, gentle and loyal. Sings and trills rather than talks.',
      voice:
        'Mostly song. If a line is needed: ElevenLabs voice pFZP5JQG7iQjIQuC4Bku (a warm British voice), speed 0.9, stability 0.55.',
    },

    basilisk: {
      name: 'The Basilisk',
      art: basilisk,
      parts: ['head'],
      chip: '60 50 180 180',
      about:
        'The Basilisk, the giant snake of the Chamber of Secrets: a huge green snake with yellow eyes and a wide mouth. It is scary but cartoon-silly, and nobody is ever harmed. It hisses and rears up, and is tricked, charmed or put to sleep. In these cartoons its eyes never hurt anyone (no petrifying); it just looms and flicks its tongue.',
      voice:
        'ElevenLabs voice nPczCjzI2devNBz1zQrb (a deep voice), speed 0.8, stability 0.5: a slow, sleepy hiss.',
    },

    crookshanks: {
      name: 'Crookshanks',
      art: crookshanks,
      parts: ['head'],
      chip: '56 40 188 188',
      about:
        'Crookshanks, Hermione\'s cat: a big ginger cat with a squashed face, bandy legs and a bottle-brush tail. Clever and a bit sly, and he knows more than he lets on. He purrs and meows; if he must speak, he is dry and knowing.',
      voice:
        'ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2 (a clear British woman), speed 0.9, stability 0.5: a purring, knowing tone.',
    },

    lupin: {
      name: 'Professor Lupin',
      art: lupin,
      parts: PERSON,
      about:
        'Professor Lupin, the Defence Against the Dark Arts teacher: sandy hair, tired kind eyes, a patched brown robe, always with a bar of chocolate. Gentle, warm and quietly brave; good at calming frightened people ("Chocolate helps, Harry."). Teaches by doing: boggarts, Riddikulus, patronuses. In these cartoons there is no werewolf: he is just the kind, tired professor.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.92, stability 0.6: soft and kind.',
    },

    buckbeak: {
      name: 'Buckbeak',
      art: buckbeak,
      poses: { fly: buckbeakFly },
      parts: ['wingL', 'wingR', 'head'],
      chip: '60 56 180 180',
      about:
        'Buckbeak the hippogriff: half horse, half eagle, with grey feathers, an orange eye and a golden beak. Proud, so you bow first and wait for him to bow back. Once he trusts you he gives glorious rides over the lake. Squawks and screeches; he is never harmed.',
      voice:
        'Mostly eagle screeches. If a line is needed: ElevenLabs voice pFZP5JQG7iQjIQuC4Bku (warm British voice), speed 0.9, stability 0.55.',
    },

    wormtail: {
      name: 'Wormtail',
      art: wormtail,
      parts: PERSON_BEARD,
      about:
        'Wormtail (Peter Pettigrew): a small, mousey, balding man with a pointed nose, two buck teeth and a shiny silver hand, in a drab robe. Nervous, sniffly and sneaky ("Y-yes, Master!"). He wrings his hands and scurries, and can turn into a rat. Comic rather than frightening; he never hurts anyone.',
      voice:
        'ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (a British man), speed 1.05, stability 0.3: a quick, squeaky, nervous voice.',
    },

    moody: {
      name: 'Mad-Eye Moody',
      art: moody,
      parts: PERSON,
      about:
        'Mad-Eye Moody, a retired Auror and Defence teacher: a scarred face, a grizzled grey mane, a big nose, and a spinning magical blue eye that sees through walls and cloaks, under a strap. Gruff and jumpy ("Constant vigilance!"), always checking behind doors. Fierce on the outside and a good guy inside. The eye whirrs; nothing gory.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.92, stability 0.35: gruff, barking, jumpy.',
    },

    horntail: {
      name: 'Hungarian Horntail',
      art: horntail,
      parts: ['wingL', 'wingR', 'head'],
      chip: '60 40 180 180',
      about:
        'The Hungarian Horntail: a huge black dragon with spikes, yellow eyes and a puff of smoke. The fiercest dragon of the Triwizard Tournament; it roars, stamps and puffs smoke and flames at the sky and the rocks. It never burns or bites anyone on screen, and it can be soothed or outwitted (a broom, a trick, a golden egg).',
      voice:
        'ElevenLabs voice SOYHLrjzK2X1ezoPC6cr (a gravelly, growling voice), speed 0.85, stability 0.35: a rolling dragon growl.',
    },

    myrtle: {
      name: 'Moaning Myrtle',
      art: myrtle,
      parts: PERSON,
      about:
        'Moaning Myrtle, the ghost who lives in the girls\' bathroom: a see-through girl with pigtails and thick round glasses, who sulks and wails and giggles by turns. Easily offended, easily cheered up; loves a gossip and splashing the pipes. She is sad about being a ghost but never nasty. She is a wail and a wobble, not a fright.',
      voice:
        'ElevenLabs voice pFZP5JQG7iQjIQuC4Bku (a British girl), speed 0.95, stability 0.3: a wavery, wailing, teary voice that can giggle.',
    },

    bellatrix: {
      name: 'Bellatrix',
      art: bellatrix,
      parts: PERSON_WAND,
      about:
        'Bellatrix Lestrange, a Death Eater: wild black hair, heavy sleepy eyes, a dark robe. Cackling, dramatic and bonkers ("Hee hee hee!"). She swishes her wand at the sky and cackles, but never aims a curse at anyone and never hurts a soul; she is a cartoon baddie, thwarted by Hermione\'s cleverness or Ron\'s luck. Nothing at Malfoy Manor, ever.',
      voice:
        'ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2 (a British woman), speed 0.95, stability 0.3: dramatic, giggly and over the top.',
    },

    sirius: {
      name: 'Sirius',
      art: sirius,
      parts: PERSON,
      about:
        'Sirius Black, Harry\'s godfather: shaggy black hair, a beard of stubble, a dark robe. Bold, playful and warm, a bit of a daredevil who can turn into a big black dog. He grins and says things like "Come on, Harry, let\'s go!". Alive and well and always cheerful here.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.95, stability 0.45: warm and dashing.',
    },

    luna: {
      name: 'Luna',
      art: luna,
      parts: PERSON,
      about:
        'Luna Lovegood: long pale blonde hair, big dreamy eyes, radish earrings and a cork necklace. Dreamy and honest, who believes in creatures nobody else has seen (nargles, wrackspurts, the Crumple-Horned Snorkack) and says odd true things ("You\'re not mad, you know."). Never rude, never frightened. Slow, soft sentences.',
      voice:
        'ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2 (a British woman), speed 0.85, stability 0.45: soft, floaty and sing-song.',
    },

    neville: {
      name: 'Neville',
      art: neville,
      parts: PERSON,
      about:
        'Neville Longbottom: a round, kind face, brown hair and a red and gold tie, often holding a plant in a pot. Shy and forgetful, loves Herbology, and braver than he thinks; he stands up when it counts. He loses his toad Trevor again and again. Always warm and a little worried: "Oh no, where\'s Trevor?"',
      voice:
        'ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (a British man), speed 0.95, stability 0.4: shy, a bit wobbly, kind.',
    },

    deathEater: {
      name: 'A Death Eater',
      art: deatheater,
      parts: ['mask'],
      chip: '60 50 180 180',
      about:
        'A Death Eater: a hooded black robe and a silver mask, with no face showing. A masked henchman who looms and cackles and marches in a line, always comic and outwitted, ready to trip over their own robes. They never hurt anyone and have no spoken name (just "a Death Eater", "the masked ones"). Appear as cheeky paper cut-outs, in numbers, never gory.',
      voice:
        'ElevenLabs voice onwK4e9ZLuTAKqWW03F9 (a deep British man), speed 0.85, stability 0.45: a low, muffled, grumbling voice.',
    },

    slughorn: {
      name: 'Slughorn',
      art: slughorn,
      parts: PERSON_BEARD,
      about:
        'Professor Slughorn, the Potions teacher: round and cheery, a big walrus moustache, a green velvet robe with gold buttons. Chatty, jolly and fond of his favourites ("Ah, Harry, m\'boy!"), crystallised pineapple and a party. He brews, bubbles and sniffs potions. A bit vain, quite kind. Not frightening at all.',
      voice:
        'ElevenLabs voice JBFqnCBsd6RMkjVDRZzb (warm British man), speed 0.92, stability 0.4: jolly, plummy and chatty.',
    },

    ginny: {
      name: 'Ginny',
      art: ginny,
      parts: PERSON,
      about:
        'Ginny Weasley, Ron\'s little sister: long red hair, freckles and a red and gold jumper. Quick, funny and brave, a brilliant flier, who laughs at her brothers and stands up to them. Cheeky and warm ("Come on, you slowcoaches!").',
      voice:
        'ElevenLabs voice pFZP5JQG7iQjIQuC4Bku (a British girl), speed 0.98, stability 0.45: bright and cheeky.',
    },

    nagini: {
      name: 'Nagini',
      art: nagini,
      parts: ['head'],
      chip: '84 30 136 136',
      about:
        'Nagini, Voldemort\'s great olive-green snake with yellow eyes. She coils, hisses and slithers, and tries to scare and fails. She never bites or hurts anyone on screen. In the game she is also a hidden treasure to find; here she can be a sleepy, scary-silly snake, even sung to sleep.',
      voice:
        'ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2 (a British woman), speed 0.82, stability 0.45: a slow, sibilant hiss.',
    },

    kreacher: {
      name: 'Kreacher',
      art: kreacher,
      parts: PERSON,
      about:
        'Kreacher, an old house-elf: wrinkly, with big floppy ears, a tatty cloth wrapped round him and heavy sleepy eyes. Grumbly and muttery ("Filthy... Kreacher mutters, Kreacher grumbles..."), though kind underneath and loyal to the people who are kind to him. He talks about himself as "Kreacher". Scowls, but never hurts anyone.',
      voice:
        'ElevenLabs voice N2lVS1w4EtoT3dr4eOWO (a rough, gravelly voice), speed 0.88, stability 0.35: croaky and grumbling.',
    },

    griphook: {
      name: 'Griphook',
      art: griphook,
      parts: PERSON,
      about:
        'Griphook, a goblin at Gringotts Bank: small, with a long pointed nose, pointed ears and clever dark eyes, in a dark waistcoat. Sharp, proud and precise; counts carefully, haggles and checks the keys ("Follow me, please."). Polite but not warm until he is won over. Never frightening, never cruel.',
      voice:
        'ElevenLabs voice N2lVS1w4EtoT3dr4eOWO (a rough voice), speed 0.9, stability 0.45: crisp, dry and a little sniffy.',
    },

    vernon: {
      name: 'Mr Dursley',
      art: vernon,
      parts: [...PERSON, 'cross'],
      about:
        'Vernon Dursley, Harry\'s uncle and the director of Grunnings, a firm that makes drills: big and beefy with hardly any neck, a huge bushy brown moustache, a round pink face, small eyes, thin hair combed flat, a grey suit and a dull tie. Likes everything normal and cannot bear anything strange or magic ("Nonsense!", "Not in MY house!"). Blusters, harrumphs and goes purple in the face (fade in the `cross` part), but he is a figure of fun and never truly menacing. His mouth sits under the moustache: the open mouth drops below it.',
      voice: 'Loud, blustery, pompous middle-aged British man; puffs and harrumphs.',
    },

    petunia: {
      name: 'Mrs Dursley',
      art: petunia,
      parts: PERSON,
      about:
        'Petunia Dursley, Harry\'s aunt and Vernon\'s wife: thin, with neat blonde curls, a very long neck, a narrow horsey face, pursed lips, a pastel pink cardigan and a little pearl necklace. Spends her days craning over garden fences to spy on the neighbours. Prim and fussy, and sure her Dudley is perfect ("Diddy-kins!"). Sniffy, never cruel on screen.',
      voice: 'Prim, thin, sharp middle-aged British woman, a little shrill.',
    },

    dudley: {
      name: 'Dudley',
      art: dudley,
      parts: [...PERSON, 'armR'],
      about:
        'Baby Dudley, about one year old, the Dursleys\' spoilt son: a big chubby pink face, a tuft of blond hair, round blue eyes and a bib, in a high chair whose wooden tray runs along the bottom of the portrait (y 300 to 340). Shouts "More!" and flings his porridge (swing `armR` from the shoulder at 208, 262). His parents think he is wonderful. Cheeky, never nasty.',
      voice: 'A big, loud, babyish toddler; shouts single words.',
    },

    tabbyCat: {
      name: 'The tabby cat',
      art: tabbyCat,
      parts: ['head', 'lids', 'figure', 'mouth', 'mouthOpen', 'tail'],
      about:
        'A tabby cat with square markings round its eyes, like spectacles, sitting very stiffly on a wall: Professor McGonagall in her cat form (she is an Animagus). Watches and waits; never talks as a cat. Turn her into McGonagall with a puff of smoke.',
      voice: 'A cat: a short mew only.',
    },

    peeves: {
      name: 'Peeves',
      art: peeves,
      parts: ['figure', 'head', 'lids', 'mouth', 'mouthOpen', 'armR', 'tongue'],
      about:
        'Peeves the poltergeist, the castle\'s naughty prankster (from the books): a little man who floats in the air, cross-legged, in a floppy jester hat with bells, a big orange bow tie and a spotty waistcoat. Bright and solid-looking, not see-through like the ghosts. Wicked dark eyes, rosy cheeks and a very wide grin. Cheeky and mischievous, never truly mean: he throws chalk, blows raspberries (show `mouthOpen` and `tongue`) and says "Ooooh! Ickle firsties!". Nothing he throws or drops ever lands on anyone. `armR` swings from the shoulder (232, 262) with a stick of chalk in the fist. Only the Baron can make him behave, and Peeves is terrified of him: he stammers sorry and zooms away.',
      voice: 'A cackling, sing-song, cheeky man, high and fast with giggles and "ooooh!"s: a naughty imp, not a villain.',
    },

    baron: {
      name: 'The Baron',
      art: baron,
      poses: { loom: baronLoom },
      parts: ['figure', 'head', 'lids', 'mouth', 'mouthOpen', 'chains'],
      about:
        'The Baron, Slytherin\'s house ghost (the books\' Bloody Baron, but always just "the Baron" here: "bloody" is a swear word to a six-year-old in the UK): a tall, gaunt, see-through grey-green ghost with blank staring eyes, a hollow face, a long pointed beard, a ruff and a heavy cloak hung with silver chains that clink (part `chains`, origin 150, 244). Cold and stern, and he says very little: slow, deep, few words. Even Peeves is terrified of him. He looms and glares but is never cruel; underneath he is gruff but fair, and on the children\'s side. Never draw or mention blood or stains.',
      voice: 'Slow, deep, cold old British man; very few words, long pauses.',
    },

    mrsWeasley: {
      name: 'Mrs Weasley',
      art: mrsWeasley,
      parts: PERSON_WAND,
      about:
        'Molly Weasley, Ron\'s mum: plump and kind, a round rosy freckled face, flaming ginger hair pinned in a messy bun with strands escaping, a plum cardigan and a flowery apron, a wand always in her hand. Warm and bustling, never still: "Ronald!", "Now, dears", "Honestly!". Fusses, feeds everyone, and goes fierce when cross, but the cross melts into a hug and a second helping. Quick, busy sentences in cosy UK English; she would never be truly unkind.',
      voice: 'Warm, brisk, motherly British woman in her forties or fifties; bustling and a little breathless, a bit louder and sharper when cross, then melting back into kindness.',
    },

    gnomeChief: {
      name: 'The Gnome Chief',
      art: gnomeChief,
      parts: PERSON,
      about:
        'The Gnome Chief, big grumpy old leader of the garden gnomes at the Burrow: the same bald, bumpy, potato-brown fellow with big pointy ears as the little gnomes, but older and grander, with a long scruffy grey beard, huge bushy grey eyebrows in a frown, a twig crown with a daisy in it and a little leaf cape. Glares and stomps; grumpy in a funny way, never truly frightening, and softens in the end (he only wants a go on the spin). Talks in short, gruff, grumbly lines ("Hmph." "Not in MY garden.").',
      voice: 'Gruff, grumbly old man, low and gravelly, a bit pompous; short lines, slow and crotchety.',
    },

    norbert: {
      name: 'Norbert',
      art: norbert,
      parts: ['figure', 'head', 'lids', 'mouth', 'mouthOpen', 'wingL', 'wingR', 'tail'],
      about:
        'Norbert, Hagrid\'s baby Norwegian Ridgeback dragon: a whole small dragon sitting up, dark green-black with a pale belly, a row of little bumpy ridges down his back, big round amber eyes, a wide friendly snout with two tiny nostrils, small crumpled umbrella wings (`wingL`, `wingR`, origin at each shoulder, to flap) and a curly tail (`tail`, origin at its base, to wave). Hagrid won him as an egg; he hatched in the hut. Hiccups little puffs of smoke and sparks, squeaks, and adores Hagrid, who calls himself "Mummy". Grows fast, so he goes to live with Charlie\'s dragons in Romania. Cute and a bit daft; never fierce on screen and never bites anyone. He doesn\'t speak: `mouthOpen` is for squeaks and hiccups.',
      voice: 'No words: squeaks, chirrups and little smoky hiccups (sound effects, not a voice actor).',
    },

    dragonKeeper: {
      name: 'Charlie’s friend',
      art: dragonKeeper,
      parts: [...PERSON, 'armR'],
      about:
        'A young witch who works with Charlie Weasley\'s dragons in Romania: a windswept red-brown plait over one shoulder, freckles, flying goggles pushed up on her forehead, a brown leather dragon-keeper jacket with buckles and a cheerful wide grin. Brave, jolly and outdoorsy, brisk and kind, and she loves dragons. "Charlie sends his love!" Never scary. `armR` swings from the shoulder (232, 262) for a wave.',
      voice: 'Bright, brisk, friendly young British woman, a bit breathless from flying.',
    },

    sirPatrick: {
      name: 'Sir Patrick',
      art: sirPatrick,
      parts: ['figure', 'head', 'lids', 'mouth', 'mouthOpen'],
      chip: '68 176 164 164',
      about:
        'Sir Patrick, leader of the Headless Hunt (book 2): a jolly, booming, show-off ghost huntsman, see-through and tinted silvery green like Nick. A ghost-pale red hunting jacket with brass buttons and a frilly white ruff at the top of the shoulders, with nothing above it but a soft curl of silvery mist (no neck, no stump: never gory). He holds his own head in both hands in front of his chest, grinning: a black riding cap, a huge curly moustache and rosy cheeks. Part `head` is the held head (origin at its centre, 150, 264) so a script can toss it up and catch it or spin it; `mouth`, `mouthOpen` and `lids` are inside it. The hands stay put when the head is tossed. He says "Tally-ho!" and "What ho, Nicholas!", loves a gallop and a show, and teases Nick that his head is not properly off ("Not quite off, is it, old chap?"), but never cruelly: in the end he cheers for Nick loudest.',
      voice: 'Booming, plummy, jolly old English huntsman; loud and pleased with himself.',
    },

    lockhart: {
      name: 'Professor Lockhart',
      art: lockhart,
      parts: [...PERSON_WAND, 'armR'],
      about:
        'Gilderoy Lockhart, the vain, cheerful Defence Against the Dark Arts teacher (book 2): glossy golden waves swept up in a perfect quiff, bright blue eyes, one eyebrow raised, rosy cheeks and a dazzling wide toothy smile. Dressed for Valentine\'s Day in a bright pink robe, a frilly lilac cravat and a big pink paper heart badge. A show-off who loves being admired ("Gilderoy Lockhart, Order of Merlin, Third Class!"), always smiling and winking, sure every idea of his is marvellous. His spells often go comically wrong, and he blames anything but himself. Harmless and silly, never cruel. The `wand` is held up on the left of the picture (pivot at his fist); `armR` swings from the right shoulder (226, 258) for a flourish or a wave.',
      voice: 'Smooth, plummy, over-the-top charming British man; delighted with himself.',
    },

    dwarfCupid: {
      name: 'The cupid',
      art: dwarfCupid,
      parts: [...PERSON, 'wingL', 'wingR'],
      about:
        'One of Lockhart\'s grumpy dwarfs on Valentine\'s Day (book 2), made to dress as a cupid: short and stocky, a bald ruddy head with a few brown tufts, a gold paper crown of hearts, heavy frowning eyebrows, a bulbous nose, a huge bushy brown beard, a cream tunic with a raspberry sash and small golden paper wings (`wingL` and `wingR`, origins at the shoulders, so they flap). Gruff and very determined to deliver every valentine, however embarrassing: marches, stomps and shouts "Oi!". He sings badly but proudly. Funny, never frightening, and he never hurts anyone.',
      voice: 'Gruff, grumpy, gravelly little man; Northern English; sings off-key.',
    },
    fred: {
      name: 'Fred',
      art: fred,
      parts: [...PERSON, 'armR'],
      about:
        "Fred Weasley, Ron's older twin, identical to George: flaming ginger hair (longer and messier than Ron's), lots of freckles, a big mischievous grin and one eyebrow up. Fred wears a hand-knitted DARK BLUE Weasley jumper with a yellow F (George's is green with a G, so that is how to tell them apart). Do not flip Fred: it would mirror the F. Jokers who finish each other's sentences and love mischief, but kind to Harry and never cruel. Says \"Mischief managed!\". Part armR swings from the shoulder (232, 262) for a wave or a wink-and-point.",
      voice:
        'Cheeky, quick, cheerful teenage British boy',
    },

    george: {
      name: 'George',
      art: george,
      parts: [...PERSON, 'armR'],
      about:
        "George Weasley, Ron's older twin, identical to Fred: flaming ginger hair (longer and messier than Ron's), lots of freckles, a big mischievous grin and one eyebrow up. George wears a hand-knitted GREEN Weasley jumper with a yellow G (Fred's is dark blue with an F, so that is how to tell them apart). Do not flip George: it would mirror the G. Jokers who finish each other's sentences and love mischief, but kind to Harry and never cruel. Says \"Mischief managed!\". Part armR swings from the shoulder (232, 262) for a wave or a wink-and-point.",
      voice:
        'Cheeky, quick, cheerful teenage British boy, a touch lower than Fred',
    },

    malfoy: {
      name: 'Malfoy',
      art: malfoy,
      poses: { tangled: malfoyTangled },
      parts: PERSON,
      about:
        'Draco Malfoy, the Slytherin Seeker and Harry\'s rival: a pale boy with a pointed chin, sleek slicked-back white-blond hair, narrow grey eyes and a sneery smirk (one corner of the mouth up), in green Slytherin Quidditch robes with silver trim. A show-off and a sneerer ("Nice broom, Potter."), who always gets his comeuppance in a funny way. Never truly dangerous, and nothing cruel happens on screen. The `tangled` pose is Malfoy with his hair stuck up in tufts, a black Dementor hood slipped down round his neck and shoulders, and a startled, embarrassed open mouth: for when his costume collapses.',
      voice: 'Drawling, sneery, posh British boy.',
    },

    wood: {
      name: 'Oliver Wood',
      art: wood,
      parts: [...PERSON, 'armR'],
      about:
        'Oliver Wood, 17, captain of the Gryffindor Quidditch team: tall and broad, short brown hair, a square jaw and intense eyes, in scarlet Quidditch robes with gold trim and padded shoulders. Quidditch-mad and very intense; he gives big speeches and takes the game terribly seriously. He cries with joy when they win. Kind to Harry. Part armR swings from the shoulder (240, 262): lift it for a fist pump.',
      voice: 'Earnest, fired-up Scottish young man.',
    },

    fluffy: {
      name: 'Fluffy',
      art: fluffy,
      parts: ['headL', 'headM', 'headR', 'lidsL', 'lidsM', 'lidsR', 'lids', 'mouth', 'mouthOpen', 'mouthOpenL', 'mouthOpenR', 'tail'],
      about:
        'Fluffy, Hagrid\'s enormous three-headed dog, who guards the trapdoor: a great shaggy toffee-brown heap lying down with big paws out in front, three big dog heads side by side (a larger middle head and a smaller one either side), each with big floppy dark ears, a wet black nose, round friendly eyes and teeth that show when he growls. Gruff to look at, but really a big soppy puppy. He growls at strangers, but music sends him straight to sleep, one head at a time, and then he snores like thunder. Each head is a part (`headL`, `headM`, `headR`, origin at its neck) so it can nod and droop; `lidsL`, `lidsM`, `lidsR` are each head\'s closed sleepy eyes (hidden, fade in as that head nods off); `lids` is the blink on all three heads; `mouth` / `mouthOpen` are the middle head\'s closed and open (growling, teeth showing) mouth, and `mouthOpenL` / `mouthOpenR` the side heads\' snarls (all the open ones hidden). `tail` (origin at its base) wags when he is happy. Ground at y 336 in the box.',
      voice: 'No speech: low rumbling growls, big woofs, whimpers and thunderous snores (sound effects, not a voice actor).',
    },
    sirCadogan: {
      name: 'Sir Cadogan',
      art: sirCadogan,
      poses: { fallen: sirCadoganFallen },
      parts: [...PERSON, 'armR', 'plume'],
      about:
        'Sir Cadogan, the mad little knight from a portrait (book 3): short, squat, in dented silver armour a size too big, visor pushed up on a round pink face with a huge bristly ginger moustache and fierce bushy eyebrows, a red plume on his helmet (part `plume`, origin at its base, to wobble) and a sword held high in his right hand (part `armR`, origin at the shoulder 232, 236: swing it to brandish). Brave, loud and very silly: he challenges everyone to duels, shouts old-fashioned battle cries ("Have at you, scurvy knave!"), changes the password twice a day and keeps falling off his pony. He never actually fights anyone. The `fallen` pose is him sitting in a heap on the ground, helmet askew, a bit dazed but fine (no injuries). Drawn as a normal character; a frame prop goes round him for a painting.',
      voice: 'Excitable, booming, old-fashioned little knight; very theatrical, and a bit squeaky when cross.',
    },
    pinkLady: {
      name: 'The Lady in Pink',
      art: pinkLady,
      parts: [...PERSON, 'armR'],
      about:
        'The Lady in Pink, the lady in the portrait who guards the door to Gryffindor Tower: a plump, cheerful, grand old-fashioned lady in a big pink silk dress with puffed sleeves, pearls, rosy cheeks and curled grey-brown hair piled high with a pink rose. Asks for the password; grand and a bit fussy, and adores singing (sometimes too loudly). Part `armR` swings from the shoulder (240, 262): lift it to wave her pink fan. In the story she runs off in a huff to hide in another painting, and comes back at the end. Drawn as a normal character; a frame prop goes round her for a painting.',
      voice: 'Grand, plummy, motherly older lady with a wobbly singing voice.',
    },
  },

  backdrops: {
    'castle-night': { art: cached(() => castleNight('castle-night')), about: 'Hogwarts on its hill at night: stars, a crescent moon, towers with lit windows, dark hills in front. Ground line at about y 700 on the foreground hill; the castle sits in the middle (x 400 to 850, y 250 to 640). Good for titles, "meanwhile" and flying across.' },
    'starry-sky': { art: cached(() => nightSky('starry-sky')), about: 'Plain night sky with stars and no ground at all: for flying, dreams and magic, or a base to put props on. Anything can stand anywhere; no ground line.' },
    'forbidden-forest': { art: cached(() => forbiddenForest()), about: 'The edge of the Forbidden Forest at night: tall blue-black trees, a pale moon top right (x 820, y 200), mist and a mossy floor with toadstools. Ground line at about y 660; room for 3 actors across x 250 to 900. Spooky but soft.' },
    'hagrids-hut': { art: cached(() => hut()), about: 'Inside Hagrid\'s hut, cosy: a stone fireplace at the centre (x 370 to 670, y 90 to 550) with a dark empty hearth (put a flame prop or a glow in it), a round window top left, hanging onions, herbs and a ham, a wooden floor. Ground line at about y 640; room for 3 actors, kept left and right of the fireplace or in front of it.' },
    'wand-shop': { art: cached(() => shop()), about: 'Ollivander\'s wand shop: floor-to-ceiling shelves of narrow wand boxes on the right (x 590 to 1180), a bay window on the left with Diagon Alley outside, a wooden floor. Ground line at about y 650; room for 3 actors, best on the left and middle.' },
    countryside: { art: cached(() => hillsBackdrop()), about: 'Rolling hills at sunset seen from a train window: purple and pink sky, layered green hills, a strip of green in front. Ground line at about y 640, not really for standing: put a train, a broom or a car on it.' },
    'train-compartment': { art: cached(() => compartment()), about: 'A Hogwarts Express compartment: red cushioned seats at left (x 0 to 290) and right (x 880 to 1180), a small table in the middle, luggage racks with a trunk and a bag above, a red carpet. Ground line at about y 660. Room for 2 actors sitting on each side or 2 standing in the aisle.' },
    'great-hall': { art: cached(() => greatHall()), about: 'The Great Hall: a night sky with floating candles for a ceiling, a stone wall with three red Gryffindor banners and two arched windows, a dark floor in front. Ground line at about y 700, with the wall ending at y 640; room for 4 actors in a row, or add the long tables yourself in front.' },
    bedroom: { art: cached(() => bedroom()), about: 'A small cosy bedroom (Harry\'s at the Dursleys\' in Privet Drive): striped wallpaper, a shelf of books, a hanging lamp, a window at top right with the night outside and a round purple rug. Ground line at about y 650; room for 2 or 3 actors, the rug in the middle.' },
    'the-burrow': { art: cached(() => burrow()), about: 'The Burrow, the Weasleys\' crooked tall house at the left (x 20 to 300, y 80 to 600), with a green garden, a winding sandy path, a duck pond at right (x 670 to 960, y 540 to 650) and a blue sky. Ground line at about y 660 (the garden); room for 3 actors on the grass, mostly right of the house.' },
    'castle-grounds': { art: cached(() => grounds()), about: 'The school grounds at dusk: a purple and pink striped sky, the castle small in the distance (x 520 to 800, y 380 to 560), dark fir trees on the left, rolling green hills. Ground line at about y 660; room for 3 or 4 actors on the grass. Good for flying in and out.' },
    'headmasters-office': { art: cached(() => office()), about: 'Dumbledore\'s office: purple walls, a tall arched night window in the middle with a golden perch stand in front (x 450 to 580, y 100 to 600), a tall bookcase at left and portraits of sleeping headmasters on the wall, a shelf of silver instruments at right, a round red rug. Ground line at about y 680; room for 3 actors.' },
    'chamber-of-secrets': { art: cached(() => chamber()), about: 'The Chamber of Secrets: a dark green stone hall with three twisted pillars, a big round door carved with snakes in the middle (x 310 to 500, y 60 to 330), shallow puddles on the stone floor. Ground line at about y 640; room for 3 actors across the middle. Spooky: pair with spooky music.' },
    'common-room': { art: cached(() => commonRoom()), about: 'The Gryffindor common room: red walls, a stone fireplace with candles on the mantelpiece in the middle (x 470 to 650, y 190 to 590), a night window at left, a painting at top right, a squashy red armchair at right (x 960 to 1180), a round red rug. Ground line at about y 680; room for 3 actors on the rug and in front.' },
    classroom: { art: cached(() => classroom()), about: 'A school classroom: a stone wall with two arched windows (daylight outside), a shelf of books, a hanging red pennant, a wooden floor and an oval red rug. Ground line at about y 650; room for 4 actors across the floor.' },
    paddock: { art: cached(() => paddock()), about: 'Hagrid\'s paddock at sunset: a wooden fence in the middle (y 520 to 600), pumpkins in the grass, a round stone hut at the right (x 880 to 1130, y 390 to 580), the castle far away, tall hedges. Ground line at about y 650; room for 3 actors in front of the fence. Good for creatures like Buckbeak.' },
    'sunset-sky': { art: cached(() => sky()), about: 'A pink, peach and lilac striped sky with a pale sun at right, and nothing else: for flying scenes. No ground line; actors can be anywhere.' },
    'quidditch-pitch': { art: cached(() => pitch()), about: 'A Quidditch pitch by day: a blue sky with clouds, three tall gold goal hoops at the right (x 820 to 1000, y 40 to 260), coloured spectator towers at left, a green grass floor. Ground line at about y 690; the sky from y 0 to 600 is for riders on brooms.' },
    'quidditch-stadium': { art: cached(() => stadium()), about: 'A huge Quidditch stadium at night: a packed crowd all round and bunting, a floodlight at each top corner, golden goal hoops left and right, a green pitch with a centre circle. Ground line at about y 680; the crowd and the hoops are busy, so keep actors in the middle (x 300 to 880).' },
    'dragon-arena': { art: cached(() => arena()), about: 'The dragon task arena: a ring of rocks, rows of cheering crowd with bunting along the top, a wide sandy floor with a nest in the middle (x 540 to 640, y 420 to 470). Ground line at about y 640; lots of room (4 actors, or one big dragon on the right).' },
    'black-lake': { art: cached(() => surface()), about: 'The Black Lake at night: a dark sky with stars, the castle far off on the shore (x 550 to 720), a distant crowd of spectators with flags at right, and dark blue water from y 500 down. No standing ground: put things on or over the water (a boat, a broom, someone swimming).' },
    underwater: { art: cached(() => underwater()), about: 'Under the Black Lake: green-blue water with light rays and bubbles, tall weeds at the left and a merperson statue at right (x 740 to 920, y 160 to 570) on a rock, a muddy green seabed. Ground line (seabed) at about y 680; actors float anywhere between y 200 and 650.' },
    'moonlit-meadow': { art: cached(() => meadow()), about: 'A big moonlit meadow at night: a full moon at upper right (x 740 to 860, y 60 to 190) with its glow, a dark tree trunk on the left (x 0 to 100), layered dark hills and a meadow of tiny flowers. Ground line at about y 650; room for 3 actors in the middle. Dreamy and calm (Luna\'s kind of place).' },
    'castle-corridor': { art: cached(() => corridor()), about: 'A stone castle corridor with grey brick walls and two torches at x 140 and x 1040 (y 190 to 300), and a dark floor from y 640. Ground line at about y 660; room for 3 or 4 actors across.' },
    'da-room': { art: cached(() => roomArt()), about: 'The D.A. practice room: a purple room with bookshelves on both sides, a red "D.A." banner (x 470 to 640, y 20 to 120), a mirror, hanging lamps, cushions on a round rug. Ground line at about y 680; room for 3 actors in the middle on the rug.' },
    'room-of-requirement': { art: cached(() => room()), about: 'The Room of Requirement, the hide-and-seek room: a huge dim room with mounds of old books and junk piled up at left and right (x 0 to 400 and 820 to 1180, y 60 to 560), a small round window at the top, and a brown floor. Ground line at about y 660; clear space in the middle (x 400 to 820) for 2 or 3 actors.' },
    'potions-dungeon': { art: cached(() => dungeon()), about: 'The potions dungeon: grey stone walls, a high window in the middle, shelves of coloured potion bottles on both sides, a cobweb in the top left, and a dark floor. Ground line at about y 690; room for 3 actors, with a cauldron prop in the middle.' },
    'sea-cliffs': { art: cached(() => cliffs()), about: 'Dark sea cliffs at night: a big dark rock with a cave mouth at the left (x 0 to 230, y 260 to 570), a full moon at upper right, and a deep blue sea with waves from y 520. No standing ground: put a boat or a rock on the water.' },
    'throne-room': { art: cached(() => throneRoom()), about: 'A dark stone hall with green banners (a Slytherin-style lair): a throne on a stepped dais at right (x 820 to 1000, y 240 to 570), candles on the floor, a green carpet running down the middle from y 600. Ground line at about y 700; room for 3 actors on the carpet. Spooky; pair with spooky music.' },
    kitchen: { art: cached(() => kitchen()), about: 'An old castle or house kitchen: grey brick walls, a window and hanging onions at top right, pots on a shelf at left, a wooden table in the middle, a big black stove at right. Ground line at about y 660; room for 3 actors.' },
    'gringotts-hall': { art: cached(() => bankHall()), about: 'The marble hall of Gringotts Bank: cream columns, hanging gold lamps, a long dark counter in the middle (x 130 to 1060, y 520 to 670) with two golden scales and a big arched door behind it. Ground line at about y 720, in front of the counter on the pale tiled floor; room for 3 actors.' },
    'gringotts-vault': { art: cached(() => vault()), about: 'A Gringotts vault: a grey wall of little doors and shelves, helmets on two shelves at left (y 100 to 300), a treasure chest and big heaps of gold coins at right (x 750 to 1180, y 470 to 680), a dark tiled floor. Ground line at about y 690; room for 3 actors left of the gold.' },
    'london-sunset': { art: cached(() => london()), about: 'London at sunset: a pink, orange and peach sky with a big sun at right, dark silhouettes of buildings and a clock tower from y 400 to 640, and a purple street. Ground line (the street) at about y 700; room for 3 actors.' },
    'castle-courtyard': { art: cached(() => courtyard()), about: 'The castle courtyard at dusk: a purple and orange sky with dark clouds, Hogwarts rising behind a stone wall (x 370 to 850, y 100 to 470), and a stone-paved yard in front. Ground line at about y 640 (the paving runs from y 500 to the bottom); room for 4 actors.' },
    'dursley-kitchen': { art: cached(() => dursleyKitchen()), about: 'The Dursleys\' spotless lemon-yellow kitchen at No. 4 Privet Drive, morning: white tiles, tidy cupboards, a wall clock (x 302 to 378, y 58 to 134), a kettle (x 334 to 446) and a toaster (x 722 to 816) on the worktop. A big window at the back, upper middle (x 420 to 760, y 110 to 330) showing garden, picket fence and blue sky: owls can fly across it. Ground line at about y 650; room for 3 actors: left (x 80 to 340), middle (x 470 to 700, e.g. a baby in a high chair) and right (x 820 to 1080), heads at y 330 to 380 clear of the window.' },
    'grunnings-office': { art: cached(() => grunningsOffice()), about: 'Mr Dursley\'s beige office at Grunnings (they make drills): a big window at the back right (x 640 to 1120, y 100 to 420) with blue sky and far rooftops low down (owls can fly over the sky part), a framed drill picture and a certificate on the left wall, a filing cabinet, and a big wooden desk across the front left (x 80 to 620, top edge y 540, front down to the bottom) with a telephone, papers and a drill on it. Keep x 220 to 480 of the desktop clear: stand a portrait behind the desk there, head at y 260 to 330. Ground line at about y 680 (right of the desk, x 640 to 1100).' },
    'privet-drive': { art: cached(() => privetDrive(false)), about: 'Privet Drive by day: a neat street of identical brick houses and tidy hedges under a pale blue sky. Number Four is middle-right: front door x 640 to 740 (y 380 to 600, brass 4), stone doorstep in front with a flat top at y 600 (x 615 to 765), Mr Dursley\'s bedroom window above-left of the door (x 560 to 660, y 200 to 290, curtained). Low brick garden wall at left (x 0 to 420, flat top y 520), "Privet Drive" street sign above it (x 175 to 325, y 372 to 424). Pavement ground line at y 640, plain road below y 710. No lamps (put them at x 120, 470, 1050). Room for 3 actors across the middle.' },
    'privet-drive-night': { art: cached(() => privetDrive(true)), about: 'Privet Drive by night: deep blue sky, stars and a crescent moon top right, the same street dim blue-grey with dark windows (a neighbour\'s window or two softly lit, never Number Four\'s). Door x 640 to 740 (y 380 to 600), doorstep top y 600 (x 615 to 765), bedroom window x 560 to 660, y 200 to 290 (dark, curtained: add a light with a script), garden wall at left x 0 to 420 with its top at y 520, street sign x 175 to 325, y 372 to 424. Ground line y 640; no lamps (put them at x 120, 470, 1050).' },
    'snowy-grounds': { art: cached(() => snowyGrounds()), about: 'The school grounds on a snowy winter afternoon: a pale grey-blue sky with a few falling flakes, the castle small on its hill at middle-right (x 690 to 925, y 195 to 450) with snow on its roofs and a few warm yellow windows, tall snow-laden dark firs on the left edge (x 0 to 300, y 175 to 690), small firs on the far hills, rolling white hills and deep plain snow in front. Ground line at about y 660; room for 3 actors across x 300 to 1180 (a big prop can come in from the right). Foreground x 300 to 1180, y 400 to 690 is plain snow; keep actors clear of the firs at the left.' },
    'castle-doors': { art: cached(() => castleDoors()), about: 'The castle\'s great front entrance from outside, in the snow: a big grey stone wall with a tall arched doorway in the middle (the glowing opening is x 430 to 750, y 150 to 660, with a stone surround and keystone up to y 108), two oak doors standing open against the wall each side (slabs x 366 to 430 and x 750 to 814), warm golden candlelight inside with two torches, a lantern at x 260 and x 920, snow on the ledges, the steps and the ground. Ground line at about y 660 (the doorway floor); two shallow snowy steps in front of the door, x 380 to 800, y 660 to 695. Actors stand left (x 0 to 360) and right (x 820 to 1180); a prop or tree can be pushed into the doorway.' },
    dormitory: { art: cached(() => dormitory()), about: 'The Gryffindor boys\' dormitory on a snowy Christmas morning: round stone tower walls, a tall arched window in the middle top (x 490 to 690, y 40 to 370) with snow falling and pale light, two four-poster beds with red velvet curtains tied back and red-and-gold covers (left x 20 to 380, right x 800 to 1160; the beds\' feet face the middle, at x 380 and x 800), a wooden trunk at the foot of the left bed, two holly wreaths, two stockings, a stone floor and a red rug in the middle. Ground line at about y 660; the middle (x 400 to 790, y 300 to 690) is clear for 2 actors, with room on the rug at x 500 to 700, y 560 to 680 for a pile of presents.' },
    'astronomy-tower': { art: cached(() => astronomyTower()), about: 'The flat top of the Astronomy Tower at midnight: a huge deep-blue starry sky, a big pale moon at upper right (x 870 to 1030, y 70 to 230), far below the dark hills, the Forbidden Forest treetops and the tiny lit window of Hagrid\'s hut (x 410, y 500), a few castle turrets with pointed roofs at the sides (x 0 to 150, and x 920 to 990, y 290 to 560). In front a grey stone parapet with crenellations (y 520 to 650) and the stone floor of the tower top. A brass telescope on a tripod at the far left (x 0 to 200, y 440 to 690) and a little stair hut with an arched door at the far right (x 1000 to 1180, y 250 to 660). Ground line at about y 650; room for 3 actors across x 220 to 960. The sky is clear (stars only) in the middle and upper left, x 200 to 800, y 0 to 500, for broomsticks to swoop through. Bottom band y 690 to 820 is plain stone floor.' },
    'ghost-party': { art: cached(() => ghostParty()), about: "Nick's Ghost Day party in a big dungeon hall: black velvet drapes in swags along the top and down both sides, hundreds of tall thin black candles with blue flames (wall brackets, iron stands, a ledge), cold silvery-blue light, grey-blue stone. A small empty wooden platform for the band at back left (x 80 to 420, deck top y 502, front to y 562). Ground line at about y 650; room for 3 or 4 actors across x 300 to 1100, and the middle and right floor is clear for a table and a ghost horse. Floor y 690 to 820 is plain. Spooky-funny, never frightening." },
    honeydukes: { art: cached(() => honeydukes()), about: 'Inside Honeydukes, the Hogsmeade sweet shop, bright, warm and sugary: pink-and-cream striped wallpaper, tall wooden shelves crammed with jars and boxes of sweets (pinks, lemon, mint, chocolate) at the far left (x 0 to 200) and far right (x 980 to 1180) and in two runs at the back (x 214 to 410, x 704 to 954), a window at the middle back (x 430 to 680, y 90 to 320) with snowy Hogsmeade outside, a long wooden counter with glass jars on it (x 210 to 970, top y 430), a wordless pink hanging sign (x 710 to 890, y 50 to 120) and candy-cane strings across the top. Wooden floor. Ground line at about y 650; room for 3 or 4 actors across x 150 to 1050. The floor at x 120 to 320 is bare, for the trapdoor prop. Bottom band (y 690 to 820) is plain floorboards.' },
    'secret-tunnel': { art: cached(() => secretTunnel()), about: 'A long, low, twisting earthy tunnel under the castle: brown-grey earth walls, a rounded low ceiling with roots poking through and two old wooden beams (x 170 and x 880), the tunnel bending away into darkness in the middle distance (x 360 to 790, y 250 to 560), stones and puddles on the packed-earth floor. At the far right (x 930 to 1180) a short stone staircase rises to a wooden trapdoor in the ceiling (about x 1030 to 1180, y 90 to 170). Dark but readable: add a wand light with k.light. Ground line at about y 650; room for 2 or 3 actors across x 150 to 850. Bottom band (y 690 to 820) is calm earth.' },
    'quidditch-stands': { art: cached(() => stands()), about: 'The Gryffindor stand by day, close up: tiers of wooden benches rising behind, packed with a cheerful paper crowd in red and gold scarves with little flags and waving hands (all above y 520), bunting along the top, a wooden rail at y 552 to 610, bright blue sky with clouds at the top and two far-off gold goal hoops at the top right (x 900 to 1100, y 40 to 230). Floor of plain wooden boards. Ground line at about y 660; room for 3 actors across x 150 to 1030. Bottom band (y 690 to 820) is calm.' },
    'third-floor-room': { art: cached(() => thirdFloorRoom()), about: 'The forbidden room off the third-floor corridor at night, where Fluffy lives: dim blue-grey stone walls, a heavy dark wooden door (closed, in a stone arch, iron bands, ring handle) at the far left (x 20 to 220, y 240 to 660) where the friends come in, a wall torch just right of it (x 262 to 310, y 300 to 420) with a warm glow on the nearby stones, one high arched window with three iron bars (x 800 to 920, y 70 to 300) letting in cool blue moonlight in a pale shaft across the right wall and floor, and a few dusty cobwebs in the corners. Bare dark flagstone floor. Ground line at about y 660. The right two thirds (x 450 to 1180) are open for a huge dog to lie in (his feet on y 660 to 690). A patch of floor at x 360 to 620, y 600 to 680 is left plain for the trapdoor prop. Bottom band (y 690 to 820) is calm dark flagstone.' },
    'potion-chamber': { art: cached(() => potionChamber()), about: 'A small, deep stone chamber far under the castle: rough grey-brown stone, a low vaulted ceiling, two warm wall torches (flames at about x 400 and x 780, y 262) lighting the wall, a flagstone floor. An arched doorway at the far left (x 20 to 220, y 230 to 660, the way back) and one at the far right (x 960 to 1160, y 230 to 660, the way on), both open and dark inside: put fire props in them (about 200 by 420, bottom at y 660). Mysterious and a bit spooky, not horrid. Ground line at about y 660; the middle (x 300 to 880) is clear for 2 or 3 actors and a table. Bottom band (y 690 to 820) is plain flagstones.' },
    'grand-staircase': { art: cached(() => grandStaircase()), about: 'The landing at the top of the moving staircases outside Gryffindor Tower: a tall dim blue-grey stone stairwell, flights criss-crossing up into the dark at the top and zig-zagging up both side edges, lots of tiny old gold-framed paintings (fruit, hills, silhouettes) on the left wall (all above y 300) and along the top, warm torches at x 515 and x 995. Stone landing floor, ground line y 670. Floor space at left (x 80 to 500) for 3 children. A big plain wall at x 520 to 980, y 120 to 660 is left clear for the portraitFrame prop (440 x 540, e.g. left 540, top 130). Bottom band y 690 to 820 is plain flagstones.' },
  },

  props: {
    // Everyday things (picture books)
    wand: { art: cached(() => wand()), size: [180, 180], about: 'A plain wand lying diagonally, with a tiny sparkle at its tip.' },
    magicWand: { art: cached(() => magicWand()), size: [180, 180], about: 'A wand with a big gold sparkle burst at its tip (it is casting).' },
    broomstick: { art: cached(() => broomstick()), size: [200, 200], about: 'A twig broomstick, long and slanting, ready to ride.' },
    sortingHat: { art: cached(() => sortingHat()), size: [180, 180], about: 'A tall, floppy, patched brown pointed hat (the Sorting Hat).' },
    cauldron: { art: cached(() => cauldron()), size: [180, 180], about: 'A black iron cauldron full of bubbling green potion.' },
    parchmentMap: { art: cached(() => parchmentMap()), size: [200, 200], about: 'A folded parchment map with a dotted path and a red X.' },
    schoolBag: { art: cached(() => schoolBag()), size: [160, 160], about: 'A brown leather school satchel with a gold buckle.' },
    quill: { art: cached(() => quill()), size: [160, 160], about: 'A white feather quill leaning in an inkwell.' },
    chessKnight: { art: cached(() => chessKnight()), size: [160, 160], about: 'A black wizard\'s-chess knight piece (a horse head).' },
    spellbook: { art: cached(() => spellbook()), size: [180, 180], about: 'An open spell book with a red ribbon bookmark.' },
    owl: { art: cached(() => owl()), size: [180, 180], about: 'A small brown owl perched on a branch (not Hedwig; for a school owl, a hoot or the owlery).' },
    owlPostLetter: { art: cached(() => owlPostLetter()), size: [180, 180], about: 'A cream envelope with a red wax seal: the owl post.' },
    galleon: { art: cached(() => galleon()), size: [140, 140], about: 'A big gold coin (a Galleon).' },
    redStone: { art: cached(() => redStone()), size: [160, 160], about: 'A glowing red gem in a pink halo (the Philosopher\'s Stone, or any magic jewel).' },
    birthdayCake: { art: cached(() => birthdayCake()), size: [180, 180], about: 'A pink iced cake with three lit candles.' },
    pumpkin: { art: cached(() => pumpkin()), size: [160, 160], about: 'An orange pumpkin with a green stalk.' },
    cobweb: { art: cached(() => cobweb()), size: [200, 200], about: 'A corner cobweb with a tiny spider; hangs in the top left of a scene.' },
    lantern: { art: cached(() => lantern()), size: [140, 140], about: 'A little black lantern with a flame inside.' },
    flame: { art: cached(() => flame()), size: [140, 140], about: 'A warm orange flame: put it in a fireplace or on a campfire.' },
    crescentMoon: { art: cached(() => crescentMoon()), size: [160, 160], about: 'A smiling gold crescent moon with twinkles.' },
    dragon: { art: cached(() => dragon()), size: [220, 220], about: 'A baby green dragon with tiny wings and a curly tail: cute, not scary.' },
    toad: { art: cached(() => toad()), size: [180, 180], about: 'A brown warty toad with orange eyes (a toad, not Trevor).' },
    frog: { art: cached(() => frog()), size: [170, 170], about: 'A cheerful green frog.' },
    rat: { art: cached(() => rat()), size: [170, 170], about: 'A small grey rat with a pink tail (Scabbers, or any rat).' },
    bat: { art: cached(() => bat()), size: [200, 200], about: 'A little black bat with wings spread.' },

    // Quidditch and story objects
    snitch: { art: cached(() => snitchArt()), size: [130, 80], about: 'The golden Snitch, a gold ball with fluttery cream wings.' },
    quaffle: { art: cached(() => quaffleArt()), size: [90, 90], about: 'A red Quaffle ball.' },
    bludger: { art: cached(() => bludgerArt()), size: [110, 110], about: 'A dark Bludger ball with a cross face (cartoon-cross, harmless).' },
    goldenEgg: { art: cached(() => goldenEgg()), size: [120, 150], about: 'The golden egg from the dragon task.' },
    patronusStag: { art: cached(() => patronus('stag')), size: [220, 170], about: 'A glowing silver-blue stag (a Patronus), in a soft halo.' },
    patronusOtter: { art: cached(() => patronus('otter')), size: [220, 170], about: 'A glowing silver-blue otter (a Patronus).' },
    patronusHare: { art: cached(() => patronus('hare')), size: [220, 170], about: 'A glowing silver-blue hare (a Patronus).' },
    floatingCandle: { art: cached(() => candle()), size: [70, 128], about: 'A single candle floating with its glow: like the Great Hall candles. Bob it gently up and down.' },
    knight: { art: cached(() => knightArt()), size: [140, 260], about: 'A suit of armour with a spear and a red plume, standing.' },
    spectrespecs: { art: cached(() => spectrespecs()), size: [180, 82], about: 'A pair of big rainbow Spectrespecs (Luna\'s glasses).' },
    boggartSpider: { art: cached(() => spider()), size: [260, 214], about: 'A big round googly-eyed purple spider (a boggart made silly): funny, not scary. It can sprout roller skates (part: skates).' },
    pie: { art: cached(() => pieArt()), size: [200, 120], about: 'A steaming golden pie.' },
    wardrobe: { art: cached(() => wardrobe()), size: [200, 392], about: 'A tall wooden wardrobe with gold handles (a boggart hides in one).' },
    windChimes: { art: cached(() => windChimes()), size: [140, 230], about: 'Pastel wind chimes with a star, hanging from a wooden disc.' },
    phoenixFeather: { art: cached(() => featherArt()), size: [70, 140], about: 'A single red-gold phoenix feather.' },
    orrery: { art: cached(() => orreryArt()), size: [120, 120], about: 'A little silver orrery: a gold sun with three tiny planets on rings.' },

    // The hidden treasures
    ring: { art: cached(() => ring()), size: [160, 160], about: 'A gold ring with a black stone: one of the hidden treasures.' },
    diary: { art: cached(() => diary()), size: [160, 160], about: 'A black diary with a gold-lined cover: a hidden treasure.' },
    locket: { art: cached(() => locket()), size: [160, 160], about: 'A gold locket with a green snake S: a hidden treasure.' },
    goldenCup: { art: cached(() => goldenCup()), size: [160, 160], about: 'A two-handled golden cup with a badger: a hidden treasure.' },
    diadem: { art: cached(() => diadem()), size: [160, 160], about: 'A silver diadem with a blue jewel: a hidden treasure.' },
    streetLamp: { art: cached(() => streetLampArt()), size: [120, 400], about: "A tall black street lamp (Privet Drive). Part glow is the light: fade it to 0 to turn the lamp off (Dumbledore's Put-Outer)." },
    putOuter: { art: cached(() => putOuterArt()), size: [120, 120], about: "Dumbledore's Put-Outer: a silver lighter-like gadget that clicks street lamps out (and back on). Part lid flips up." },
    flyingMotorbike: { art: cached(() => flyingMotorbikeArt()), size: [440, 260], about: "Hagrid's huge flying motorbike, side-on facing right. Put Hagrid behind it (lower z) so his head and shoulders rise over the seat. The seat top is at y 108 in the box (x 104 to 264), and the space above it is empty. Part lamp is the headlamp." },
    babyHarry: { art: cached(() => babyHarryArt()), size: [220, 160], about: 'Baby Harry, asleep in a bundle of blankets, with a letter tucked in (part: letter).' },
    hedge: { art: cached(() => hedge()), size: [520, 230], about: 'A long, tall, scruffy garden hedge in torn-paper clumps (the Burrow\'s garden); flat bottom on the ground line. Gnomes get flung over it, and things can hide behind it.' },
    bush: { art: cached(() => bush()), size: [220, 170], about: 'A round leafy garden bush with a few flowers; one solid shape, flat bottom, so a gnome can hide behind it. Part leaves is a top layer that wobbles from its bottom centre [110, 166]; shake the whole prop to rustle.' },
    christmasTree: { art: cached(() => christmasTree()), size: [360, 520], about: "Hagrid's enormous four-tier fir, snowy and decorated, standing on a short brown trunk (no pot): trunk foot at the bottom edge (y 520), trunk centre x 180. Parts, all with origin at the trunk foot [180, 520] except star: branches (the green body, squash it with scaleX), snow (thick white clumps on the branch tips; fade or drop it), baubles (red, gold and blue baubles, gold tinsel, candles and icicles; hide until dinner), star (gold star on top, origin [180, 30]). With snow, baubles and star hidden it is still a plain fir. If you squash branches, scale baubles and snow with it." },
    snowball: { art: cached(() => snowball()), size: [70, 70], about: 'A small round white snowball with a soft blue shade.' },
    cracker: { art: cached(() => cracker()), size: [260, 90], about: 'A big red and gold wizard Christmas cracker lying sideways, with gold stars, gold bands and frilly twisted ends. Parts left and right are the two halves, both pivoting on the middle [130, 45]: tween left to -x and right to +x to pull it apart. They overlap slightly at the seam, so animate both.' },
    jumper: { art: cached(() => jumper()), size: [220, 190], about: 'A hand-knitted emerald-green Christmas jumper laid flat, with arms out. It has a big cream knitted letter H, ribbed cuffs, neck and hem, knit stitches and a tiny mended patch. Reads as homemade and cosy.' },
    flowerBonnet: { art: cached(() => flowerBonnet()), size: [170, 120], about: 'A silly straw bonnet piled with pink and yellow flowers, with a lilac ribbon band, a bow on top and ribbon ties hanging at the sides. Seen from the front. Brim bottom is at y 100, so place it with the brim on the head (about 260-wide Dumbledore).' },
    admiralHat: { art: cached(() => admiralHat()), size: [180, 90], about: 'A paper admiral\'s bicorne seen from the front: navy, with gold braid, gold tips, little gold stars and a red and cream cockade with a gold star. The wide crescent sits across the head, tips up.' },
    whiteMouse: { art: cached(() => whiteMouse()), size: [110, 70], about: 'A little white mouse with pink ears, nose, feet and a curly pink tail, side view, facing right (flip to face left).' },
    // Goodbye, Norbert
    invisibilityCloak: { art: cached(() => invisibilityCloak()), size: [260, 200], about: "Harry's Invisibility Cloak, draped: a hooded, flowing silvery-grey cloth with watery pale-blue folds and a few faint sparkle stars, wavy hem along the bottom. Hang it up, hold it, or scale it over people. Fade it or shimmer it with a script." },
    crate: { art: cached(() => crate()), size: [220, 180], about: 'A wooden crate for carrying a baby dragon: planks with nails, rope handles on both sides, a row of four round air holes. Flat bottom on the ground. Part lid is the lid, origin at its back hinge corner [8, 42]: rotate it up to lift, or wiggle it to rattle.' },
    teddy: { art: cached(() => teddy()), size: [120, 130], about: 'A small worn brown teddy bear sitting up, with a red ribbon bow, a patch and a sewn-on smile.' },
    hanky: { art: cached(() => hanky()), size: [160, 120], about: "Hagrid's enormous yellow handkerchief with white spots, a bit crumpled." },
    ghostHorse: { art: cached(() => ghostHorseArt()), size: [420, 300], about: "A see-through silvery-green ghost horse in full gallop, side-on, facing right, with a flowing misty mane and tail and a red saddle. The saddle top is at y 94 in the box (x 150 to 250, back line at y 96 between x 130 and 270), and nothing rises above y 90 there (the neck and head are right of x 290, the mane at x 246 to 346, the tail streams left of x 100), so seat a rider by putting a portrait about 220 wide behind it (lower z) with its shoulders hidden below y 96: e.g. a 220 wide, 250 tall portrait at left = horseX + 100, top = horseY + 94 - 250 + 60 (bust rises about 190 px above the saddle). Parts: figure (everything, 80% see-through), legsBack (origin 110, 160, the hip) and legsFront (origin 296, 160, the shoulder): swing them in opposite directions, about 20 degrees, for the gallop; the body can bob up and down." },
    ghostDancers: { art: cached(() => ghostDancersArt()), size: [220, 280], about: 'A translucent pale-blue ghost couple waltzing: a lady in a big old-fashioned bell gown (left) and a gentleman in a ruff and doublet (right), hands joined between them, both smiling with closed eyes. Feet at the bottom edge (y 270). Parts: couple (both, origin 110, 270), lady (origin at her feet 66, 270) and gent (origin 160, 270): sway or rock them in opposite directions, or spin the whole prop.' },
    gong: { art: cached(() => gong()), size: [200, 240], about: 'A big round brass gong hanging from a dark wooden frame on two legs, with a little padded beater leaning on the frame. Part `disc` is the hanging gong (origin at its top hanging point): swing or shake it when it is struck.' },
    sawBand: { art: cached(() => sawBand()), size: [340, 240], about: 'A ghost band: three see-through pale-blue ghost musicians side by side (one in a tall hat, one in a ruff and bonnet, one with a curly moustache and cap), each playing a big musical saw with a bow. Stands on the platform in the ghost-party backdrop. Part `bows` (all three bows, origin about the centre) wiggles for playing.' },
    ghostFeast: { art: cached(() => ghostFeast()), size: [600, 200], about: 'A long table with a black cloth laid with rotten ghost food in greys and sickly greens: a green fish, a mouldy grey cheese, a lumpy grey cake with 500 in grey icing, burnt black sausages and a silver cloche. Flat bottom on the floor; people stand behind it and it hides their chests.' },

    // The Singing Valentine
    harp: { art: cached(() => harp()), size: [140, 170], about: "A small golden lyre-harp, like a cupid's, with curly scrolls and a little red heart on the cross-bar. Part strings (origin at its middle, [70, 90]) can be wobbled or twanged." },
    heartGarland: { art: cached(() => heartGarland()), size: [600, 120], about: 'A long string of pink, red and white paper hearts hanging in three gentle swags, with gold pins at the ends and joins. Hang it across a hall or a doorway; the top edge (the string) is at y 12 to 62.' },
    valentineCard: { art: cached(() => valentineCard()), size: [140, 110], about: 'A pink folded valentine card seen from the front: a lace edge, a fold down the left, and a big red heart.' },
    bigHeart: { art: cached(() => bigHeart()), size: [160, 150], about: 'One big glossy pink paper heart with a shine on its upper left. Float it about, bob it, or burst it into confetti.' },
    // The Secret Way to Honeydukes
    maraudersMap: { art: cached(() => maraudersMapArt()), size: [380, 260], about: "The Marauder's Map unfolded: old yellowed parchment with fold lines. Part `ink` (a group: the castle plan, corridors, towers, a dotted path to a tiny witch-statue mark, footprints and a wavy scribble title that is not readable) is drawn visible; fade it in from opacity 0. Part `feet` is one pair of tiny footprints parked at the path's start (about 92, 198 in the box): move it along the dotted path." },
    oneEyedWitch: { art: cached(() => oneEyedWitchArt()), size: [220, 340], about: "The statue of the one-eyed witch: a kindly-silly hunched grey stone old witch with one big eye, a patch over the other, a crooked hat and a stick, on a plinth; base flat on the floor. Part `hump` is her round back-hump, origin at its lower edge (156, 168): rotate it to swing it open like a lid and show the dark round hole behind." },
    fizzingWhizbee: { art: cached(() => fizzingWhizbee()), size: [100, 100], about: 'A Fizzing Whizzbee: a big round pink-and-white sherbet ball with cream swirls and fizzy white dots. Reads as a round pink ball; bob or spin it.' },
    pepperImp: { art: cached(() => pepperImp()), size: [90, 110], about: 'A Pepper Imp: a little red-hot pepper-shaped sweet with a green stalk, a cheeky face (raised brows, grin) and puffs of heat. Flat-ish bottom at y 104.' },
    iceMouse: { art: cached(() => iceMouse()), size: [120, 80], about: 'An Ice Mouse: a pale icy-blue sugar mouse with pink ears, nose and a string tail, side view, facing right (flip to face left).' },
    sweetJar: { art: cached(() => sweetJar()), size: [140, 180], about: 'A big glass sweet jar with a gold lid, full of round colourful sweets. Flat bottom at y 176, so it can stand on a counter or the floor.' },
    trapdoor: { art: cached(() => trapdoor()), size: [220, 90], about: 'A square wooden trapdoor in the floor seen at a slight angle, over a dark hole, with iron ring and rivets. Place it on the floor (the honeydukes floor at x 120 to 320 is left clear for it). Part door is the lid, origin at its back hinge edge [110, 30]: rotate it (e.g. rotationX or scaleY toward 0, or rotate up) to swing it open and show the hole.' },
    // Gryffindor Wins the Cup
    fakeDementor: { art: cached(() => fakeDementor()), size: [220, 420], about: 'A tall hooded figure in a ragged black cloak: a deep empty dark hood (no face), ragged hem, sleeves hanging with no hands. A bit lumpy and wobbly, with a knee poking out and a trainer-like shoe peeping from the hem, because it is really boys on each other\'s shoulders. Feet at y 415. Part hood (origin at the neck, 110, 96) can droop or tilt.' },
    robeHeap: { art: cached(() => robeHeap()), size: [360, 160], about: 'The same black robes collapsed into a big tangled heap on the grass, with an empty hood flopped over, a green-and-silver sleeve sticking out on the right and a trainer-like shoe poking up. Flat bottom at y 156.' },
    gryffindorBanner: { art: cached(() => gryffindorBanner()), size: [420, 220], about: 'A big red Gryffindor banner with a friendly gold paper lion (mane, face, smile), gold border and fringe, held up on two wooden poles with gold knobs. No lettering. Part cloth (origin top centre, 210, 30) is the red cloth with the lion: rotate or skew it to wave; the poles stay still.' },
    quidditchCup: { art: cached(() => quidditchCupArt()), size: [200, 220], about: 'The big silver Quidditch Cup: a bowl with two big looped handles on a short wooden stand with a gold plate, red and gold ribbons tied on the stem and the handles. Base flat on the floor.' },
    firebolt: { art: cached(() => fireboltArt()), size: [300, 90], about: "Harry's Firebolt: a sleek racing broom side-on, drawn horizontal and facing right (handle tip on the right, the golden-brown twig tail trailing left), a dark polished handle and a little gold band, no lettering. Flip it for facing left; rotate it to climb or dive." },
    // Harry's Flute
    woodenFlute: { art: cached(() => woodenFlute()), size: [220, 50], about: "Harry's hand-whittled wooden flute lying flat, mouthpiece on the left: pale honey wood, a little crooked and homemade, with knife marks and grain, a notch for the whistle near the left end (x 52 to 72), a row of six uneven finger holes (x 92 to 196, y 27), a twist of brown twine round the middle and a little carved ring at the far end. It sounds a bit like an owl." },
    devilsSnare: { art: cached(() => devilsSnareArt()), size: [600, 220], about: 'A big low tangle of dark green creeper with curling tendrils and leaves, spread over the floor like a soft springy mat (friends land on it), flat bottom at y 218. Part `tendrils` (four tall curling tendrils, x 190 to 410, origin bottom centre 300, 214) can be wiggled or shrunk back.' },
    // The Riddle of the Bottles
    potionTable: { art: cached(() => potionTableArt()), size: [520, 260], about: 'A small old wooden table with SEVEN glass potion bottles in a row, all different shapes, sizes and soft colours (tall thin lilac, fat round rose, squat green, curvy amber, a TINY pale-blue one with a silver glint, a teal conical flask, a slim yellow one). Tabletop at y 152 to 174, legs on the floor at the bottom edge. Part `round` is the fat round bottle (origin at its base, 142, 152; box x 102 to 182, y 52 to 152). Part `tiny` is the smallest bottle with its glint (origin at its base, 352, 152; box x 334 to 372, y 108 to 152).' },
    purpleFire: { art: cached(() => purpleFireArt()), size: [200, 420], about: 'A curtain of soft magic fire, violet and lilac with pink-white tips, to fill a doorway; feet at y 410. Part `flames` (origin bottom centre, 100, 410) can be wobbled or scaled; part `glow` is a soft outer wash of light behind it.' },
    blackFire: { art: cached(() => blackFireArt()), size: [200, 420], about: 'A curtain of soft magic fire, inky navy-black with glowing deep-blue and violet rims so it reads against a dark doorway; feet at y 410. Part `flames` (origin bottom centre, 100, 410) can be wobbled or scaled; part `glow` is a soft outer wash of blue light behind it.' },
    riddleScroll: { art: cached(() => riddleScrollArt()), size: [200, 260], about: 'An unrolled parchment scroll with curled rolls top and bottom, covered in neat wavy ink lines (squiggles, not readable) in two short-lined verses, and a tiny bottle doodle at the bottom.' },
    mirrorOfErised: { art: cached(() => mirrorOfErisedArt()), size: [280, 460], about: 'A magnificent tall old mirror, as high as a grown-up: ornate gold frame with a round arch, an engraved band of unreadable squiggles, standing on two clawed feet at the bottom edge. The glass is empty soft silvery-blue; part `glass` (origin centre, 140, 224; box x 72 to 208, y 56 to 392) can be glowed or tinted.' },
    // Sir Cadogan
    portraitFrame: { art: cached(() => portraitFrameArt()), size: [440, 540], about: 'A big, ornate, old gold picture frame standing upright, a HOLLOW border only (the inside is transparent): carved corner blocks with rosettes, a little scroll at the top, faint hinges on the left edge because it is the door into Gryffindor Tower. Inner opening is exactly x 40 to 400, y 40 to 500 (360 x 460); the bottom edge y 540 sits on the floor. Put a canvas (paintedField or paintedParlour) at frame left + 40, top + 40 behind the actors, the actors above that, and the frame above them (a portrait about 260 wide with its bottom at frame top + 500 fits).' },
    paintedField: { art: cached(() => paintedFieldArt()), size: [360, 460], about: 'A soft, slightly blurry painted landscape canvas for inside the portraitFrame: pale sky and clouds, rolling green hills from y 230 down, a little round tree at x 292, and a few white painted daisies, mostly low and at the sides. Exactly the frame opening size, so place it at frame left + 40, top + 40, behind the actors.' },
    paintedParlour: { art: cached(() => paintedParlourArt()), size: [360, 460], about: "A soft painted pink drawing room canvas, the Lady in Pink's own painting: striped pink wallpaper with small flowers, a rose panel below y 326, a gold curtain rod, a wine-red curtain at the left (x 0 to 75) and a little round table with a blue vase of flowers at the right (x 253 to 345, flowers up to y 254). Exactly the frame opening size (360 x 460); place it behind the actors inside the portraitFrame." },
    passwordList: { art: cached(() => passwordListArt()), size: [120, 260], about: "Neville's long scrappy list of passwords: a crumpled strip of old parchment with a little drawn star at the top and foot and a column of wavy unreadable lines, five of them struck through in red-brown ink and one circled. No lettering. Hold it up, wave it, or unroll it by scaling from the top edge." },
    cadoganPony: { art: cached(() => cadoganPony()), size: [300, 340], about: 'Sir Cadogan\'s very fat, round, dapple-grey pony, side-on and facing right, whole body (not a bust): short stumpy legs with hooves on the bottom of the box (y 336), a shaggy mane and forelock over sleepy eyes, a red saddle cloth. The saddle top is at y 148 of the box, x 66 to 150 (centre x 108): stand the knight so his bottom edge sits there. Part `head` (origin at the neck 196, 190) tosses or nods, `tail` (origin at its base 20, 196) swishes, `mouthOpen` is for a whinny. Fat, lazy and gentle: likes grass and naps, and when the knight falls off it just munches.' },
  },
});
