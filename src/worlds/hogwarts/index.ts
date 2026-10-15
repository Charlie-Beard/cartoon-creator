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
import { hedwig } from './characters/hedwig';
import { hagrid, harry, hermione, ron } from './characters/heroes';
import { basilisk, dobby, fawkes, gnome, nick, ollivander, trevor, voldemort, willow } from './characters/hosts1';
import {
  bellatrix, buckbeak, crookshanks, deatheater, dumbledore, ginny, griphook, horntail, kreacher, luna, lupin, mcgonagall,
  moody, myrtle, nagini, neville, sirius, slughorn, wormtail,
} from './characters/hosts2';
import { buckbeakFly, fawkesFly, hedwigFly, voldemortLoom } from './characters/poses';
import { snape } from './characters/snape';
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
import { meadow } from './places/meadow';
import { paddock } from './places/paddock';
import { dungeon } from './places/potions-dungeon';
import { pitch } from './places/quidditch-pitch';
import { stadium } from './places/quidditch-stadium';
import { room } from './places/room-of-requirement';
import { cliffs } from './places/sea-cliffs';
import { throneRoom } from './places/throne-room';
import { roomArt } from './places/training-room';
import { underwater } from './places/underwater';
import { vault } from './places/gringotts-vault';
import { shop } from './places/wand-shop';
import { hillsBackdrop } from './places/countryside';
import {
  birthdayCake, bat, broomstick, cauldron, cobweb, crescentMoon, dragon, flame, frog, galleon, lantern, magicWand,
  owl, owlPostLetter, parchmentMap, pumpkin, quill, rat, redStone, schoolBag, sortingHat, spellbook, toad, wand, chessKnight,
} from './props';
import { castleNight, forbiddenForest, nightSky } from './scenery';
import { diadem, diary, cup as goldenCup, locket, ring } from './treasures';

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
  },
});
