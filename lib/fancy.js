/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra - Alien-Alfa
*/

const unicode = require("./styleText");
var style = unicode;
style.tools.creepify.options.maxHeight = 10;

function createMap(chars) {
  var alphanum = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  var i = 0;
  var map = {};
  for (var c of chars) {
    map[alphanum[i]] = c;
    i++;
  }
  return map;
}

const mangaCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "卂",
  b: "乃",
  c: "匚",
  d: "ᗪ",
  e: "乇",
  f: "千",
  g: "ᘜ",
  h: "卄",
  i: "|",
  j: "ﾌ",
  k: "Ҝ",
  l: "ㄥ",
  m: "爪",
  n: "几",
  o: "ㄖ",
  p: "卩",
  q: "Ҩ",
  r: "尺",
  s: "丂",
  t: "ㄒ",
  u: "ㄩ",
  v: "ᐯ",
  w: "山",
  x: "乂",
  y: "ㄚ",
  z: "乙",
  A: "卂",
  B: "乃",
  C: "匚",
  D: "ᗪ",
  E: "乇",
  F: "千",
  G: "ᘜ",
  H: "卄",
  I: "|",
  J: "ﾌ",
  K: "Ҝ",
  L: "ㄥ",
  M: "爪",
  N: "几",
  O: "ㄖ",
  P: "卩",
  Q: "Ҩ",
  R: "尺",
  S: "丂",
  T: "ㄒ",
  U: "ㄩ",
  V: "ᐯ",
  W: "山",
  X: "乂",
  Y: "ㄚ",
  Z: "乙",
};
const ladybugCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ꍏ",
  b: "ꌃ",
  c: "ꏳ",
  d: "ꀷ",
  e: "ꏂ",
  f: "ꎇ",
  g: "ꁅ",
  h: "ꀍ",
  i: "ꀤ",
  j: "꒻",
  k: "ꀘ",
  l: "꒒",
  m: "ꎭ",
  n: "ꈤ",
  o: "ꂦ",
  p: "ᖘ",
  q: "ꆰ",
  r: "ꋪ",
  s: "ꌚ",
  t: "꓄",
  u: "ꀎ",
  v: "꒦",
  w: "ꅐ",
  x: "ꉧ",
  y: "ꌩ",
  z: "ꁴ",
  A: "ꍏ",
  B: "ꌃ",
  C: "ꏳ",
  D: "ꀷ",
  E: "ꏂ",
  F: "ꎇ",
  G: "ꁅ",
  H: "ꀍ",
  I: "ꀤ",
  J: "꒻",
  K: "ꀘ",
  L: "꒒",
  M: "ꎭ",
  N: "ꈤ",
  O: "ꂦ",
  P: "ᖘ",
  Q: "ꆰ",
  R: "ꋪ",
  S: "ꌚ",
  T: "꓄",
  U: "ꀎ",
  V: "꒦",
  W: "ꅐ",
  X: "ꉧ",
  Y: "ꌩ",
  Z: "ꁴ",
};
const runesCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ል",
  b: "ጌ",
  c: "ር",
  d: "ዕ",
  e: "ቿ",
  f: "ቻ",
  g: "ኗ",
  h: "ዘ",
  i: "ጎ",
  j: "ጋ",
  k: "ጕ",
  l: "ረ",
  m: "ጠ",
  n: "ክ",
  o: "ዐ",
  p: "የ",
  q: "ዒ",
  r: "ዪ",
  s: "ነ",
  t: "ፕ",
  u: "ሁ",
  v: "ሀ",
  w: "ሠ",
  x: "ሸ",
  y: "ሃ",
  z: "ጊ",
  A: "ል",
  B: "ጌ",
  C: "ር",
  D: "ዕ",
  E: "ቿ",
  F: "ቻ",
  G: "ኗ",
  H: "ዘ",
  I: "ጎ",
  J: "ጋ",
  K: "ጕ",
  L: "ረ",
  M: "ጠ",
  N: "ክ",
  O: "ዐ",
  P: "የ",
  Q: "ዒ",
  R: "ዪ",
  S: "ነ",
  T: "ፕ",
  U: "ሁ",
  V: "ሀ",
  W: "ሠ",
  X: "ሸ",
  Y: "ሃ",
  Z: "ጊ",
};

const serif_BCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "𝐚",
  b: "𝐛",
  c: "𝐜",
  d: "𝐝",
  e: "𝐞",
  f: "𝐟",
  g: "𝐠",
  h: "𝐡",
  i: "𝐢",
  j: "𝐣",
  k: "𝐤",
  l: "𝐥",
  m: "𝐦",
  n: "𝐧",
  o: "𝐨",
  p: "𝐩",
  q: "𝐪",
  r: "𝐫",
  s: "𝐬",
  t: "𝐭",
  u: "𝐮",
  v: "𝐯",
  w: "𝐰",
  x: "𝐱",
  y: "𝐲",
  z: "𝐳",
  A: "𝐀",
  B: "𝐁",
  C: "𝐂",
  D: "𝐃",
  E: "𝐄",
  F: "𝐅",
  G: "𝐆",
  H: "𝐇",
  I: "𝐈",
  J: "𝐉",
  K: "𝐊",
  L: "𝐋",
  M: "𝐌",
  N: "𝐍",
  O: "𝐎",
  P: "𝐏",
  Q: "𝐐",
  R: "𝐑",
  S: "𝐒",
  T: "𝐓",
  U: "𝐔",
  V: "𝐕",
  W: "𝐖",
  X: "𝐗",
  Y: "𝐘",
  Z: "𝐙",
};
const serif_BICharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "𝒂",
  b: "𝒃",
  c: "𝒄",
  d: "𝒅",
  e: "𝒆",
  f: "𝒇",
  g: "𝒈",
  h: "𝒉",
  i: "𝒊",
  j: "𝒋",
  k: "𝒌",
  l: "𝒍",
  m: "𝒎",
  n: "𝒏",
  o: "𝒐",
  p: "𝒑",
  q: "𝒒",
  r: "𝒓",
  s: "𝒔",
  t: "𝒕",
  u: "𝒖",
  v: "𝒗",
  w: "𝒘",
  x: "𝒙",
  y: "𝒚",
  z: "𝒛",
  A: "𝑨",
  B: "𝑩",
  C: "𝑪",
  D: "𝑫",
  E: "𝑬",
  F: "𝑭",
  G: "𝑮",
  H: "𝑯",
  I: "𝑰",
  J: "𝑱",
  K: "𝑲",
  L: "𝑳",
  M: "𝑴",
  N: "𝑵",
  O: "𝑶",
  P: "𝑷",
  Q: "𝑸",
  R: "𝑹",
  S: "𝑺",
  T: "𝑻",
  U: "𝑼",
  V: "𝑽",
  W: "𝑾",
  X: "𝑿",
  Y: "𝒀",
  Z: "𝒁",
};
const serif_ICharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "𝑎",
  b: "𝑏",
  c: "𝑐",
  d: "𝑑",
  e: "𝑒",
  f: "𝑓",
  g: "𝑔",
  h: "ℎ",
  i: "𝑖",
  j: "𝑗",
  k: "𝑘",
  l: "𝑙",
  m: "𝑚",
  n: "𝑛",
  o: "𝑜",
  p: "𝑝",
  q: "𝑞",
  r: "𝑟",
  s: "𝑠",
  t: "𝑡",
  u: "𝑢",
  v: "𝑣",
  w: "𝑤",
  x: "𝑥",
  y: "𝑦",
  z: "𝑧",
  A: "𝐴",
  B: "𝐵",
  C: "𝐶",
  D: "𝐷",
  E: "𝐸",
  F: "𝐹",
  G: "𝐺",
  H: "𝐻",
  I: "𝐼",
  J: "𝐽",
  K: "𝐾",
  L: "𝐿",
  M: "𝑀",
  N: "𝑁",
  O: "𝑂",
  P: "𝑃",
  Q: "𝑄",
  R: "𝑅",
  S: "𝑆",
  T: "𝑇",
  U: "𝑈",
  V: "𝑉",
  W: "𝑊",
  X: "𝑋",
  Y: "𝑌",
  Z: "𝑍",
};
const wingdingsCharMap = {
  0: "📁︎",
  1: "📂︎",
  2: "📄︎",
  3: "🗏︎",
  4: "🗐︎",
  5: "🗄︎",
  6: "⌛︎",
  7: "🖮︎",
  8: "🖰︎",
  9: "🖲︎",
  "!": "✏︎",
  '"': "✂︎",
  "#": "✁︎",
  $: "👓︎",
  "%": "🕭︎",
  "&": "🕮︎",
  "'": "🕯︎",
  "(": "🕿︎",
  ")": "✆︎",
  "*": "🖂︎",
  "+": "🖃︎",
  ",": "📪︎",
  "-": "📫︎",
  ".": "📬︎",
  "/": "📭︎",
  ":": "🖳︎",
  ";": "🖴︎",
  "<": "🖫︎",
  "=": "🖬︎",
  ">": "✇︎",
  "?": "✍︎",
  A: "✌︎",
  B: "👌︎",
  C: "👍︎",
  D: "👎︎",
  E: "☜︎",
  F: "☞︎",
  G: "☝︎",
  H: "☟︎",
  I: "✋︎",
  J: "☺︎",
  K: "😐︎",
  L: "☹︎",
  M: "💣︎",
  N: "☠︎",
  O: "⚐︎",
  P: "🏱︎",
  Q: "✈︎",
  R: "☼︎",
  S: "💧︎",
  T: "❄︎",
  U: "🕆︎",
  V: "✞︎",
  W: "🕈︎",
  X: "✠︎",
  Y: "✡︎",
  Z: "☪︎",
  "[": "☯︎",
  "\\": "ॐ︎",
  "]": "☸︎",
  "^": "♈︎",
  _: "♉︎",
  "`": "♊︎",
  a: "♋︎",
  b: "♌︎",
  c: "♍︎",
  d: "♎︎",
  e: "♏︎",
  f: "♐︎",
  g: "♑︎",
  h: "♒︎",
  i: "♓︎",
  j: "🙰",
  k: "🙵",
  l: "●︎",
  m: "❍︎",
  n: "■︎",
  o: "□︎",
  p: "◻︎",
  q: "❑︎",
  r: "❒︎",
  s: "⬧︎",
  t: "⧫︎",
  u: "◆︎",
  v: "❖︎",
  w: "⬥︎",
  x: "⌧︎",
  y: "⍓︎",
  z: "⌘︎",
  "{": "❀︎",
  "|": "✿︎",
  "}": "❝︎",
  "~": "❞︎",
  "": "▯︎",
  "€": "⓪︎",
  "": "①︎",
  "‚": "②︎",
  ƒ: "③︎",
  "„": "④︎",
  "…": "⑤︎",
  "†": "⑥︎",
  "‡": "⑦︎",
  ˆ: "⑧︎",
  "‰": "⑨︎",
  Š: "⑩︎",
  "‹": "⓿︎",
  Œ: "❶︎",
  "": "❷︎",
  Ž: "❸︎",
  "": "❹︎",
  "": "❺︎",
  "‘": "❻︎",
  "’": "❼︎",
  "“": "❽︎",
  "”": "❾︎",
  "•": "❿︎",
  "–": "◻︎",
  "—": "◻︎",
  "˜": "◻︎",
  "™": "◻︎",
  š: "◻︎",
  "›": "◻︎",
  œ: "◻︎",
  "": "◻︎",
  ž: "·︎",
  Ÿ: "•︎",
  "¡": "○︎",
  "¢": "⭕︎",
  "£": "◻︎",
  "¤": "◉︎",
  "¥": "◎︎",
  "¦": "◻︎",
  "§": "▪︎",
  "¨": "◻︎",
  "©": "◻︎",
  ª: "✦︎",
  "«": "★︎",
  "¬": "✶︎",
  "®": "✹︎",
  "¯": "✵︎",
  "°": "◻︎",
  "±": "⌖︎",
  "²": "⟡︎",
  "³": "⌑︎",
  "´": "◻︎",
  µ: "✪︎",
  "¶": "✰︎",
  "·": "🕐︎",
  "¸": "🕑︎",
  "¹": "🕒︎",
  º: "🕓︎",
  "»": "🕔︎",
  "¼": "🕕︎",
  "½": "🕖︎",
  "¾": "🕗︎",
  "¿": "🕘︎",
  À: "🕙︎",
  Á: "🕚︎",
  Â: "🕛︎",
  Ã: "◻︎",
  Ä: "◻︎",
  Å: "◻︎",
  Æ: "◻︎",
  Ç: "◻︎",
  È: "◻︎",
  É: "◻︎",
  Ê: "◻︎",
  Ë: "◻︎",
  Ì: "◻︎",
  Í: "◻︎",
  Î: "◻︎",
  Ï: "◻︎",
  Ð: "◻︎",
  Ñ: "◻︎",
  Ò: "◻︎",
  Ó: "◻︎",
  Ô: "◻︎",
  Õ: "⌫︎",
  Ö: "⌦︎",
  "×": "◻︎",
  Ø: "➢︎",
  Ù: "◻︎",
  Ú: "◻︎",
  Û: "◻︎",
  Ü: "➲︎",
  Ý: "◻︎",
  Þ: "◻︎",
  ß: "◻︎",
  à: "◻︎",
  á: "◻︎",
  â: "◻︎",
  ã: "◻︎",
  ä: "◻︎",
  å: "◻︎",
  æ: "◻︎",
  ç: "◻︎",
  è: "➔︎",
  é: "◻︎",
  ê: "◻︎",
  ë: "◻︎",
  ì: "◻︎",
  í: "◻︎",
  î: "◻︎",
  ï: "⇦︎",
  ð: "⇨︎",
  ñ: "⇧︎",
  ò: "⇩︎",
  ó: "⬄︎",
  ô: "⇳︎",
  õ: "⬀︎",
  ö: "⬁︎",
  "÷": "⬃︎",
  ø: "⬂︎",
  ù: "▭︎",
  ú: "▫︎",
  û: "✗︎",
  ü: "✓︎",
  ý: "☒︎",
  þ: "☑︎",
  ÿ: "◻︎",
};
const vaporwaveCharMap = {
  " ": "　",
  "`": "`",
  1: "１",
  2: "２",
  3: "３",
  4: "４",
  5: "５",
  6: "６",
  7: "７",
  8: "８",
  9: "９",
  0: "０",
  "-": "－",
  "=": "＝",
  "~": "~",
  "!": "！",
  "@": "＠",
  "#": "＃",
  $: "＄",
  "%": "％",
  "^": "^",
  "&": "＆",
  "*": "＊",
  "(": "（",
  ")": "）",
  _: "_",
  "+": "＋",
  q: "ｑ",
  w: "ｗ",
  e: "ｅ",
  r: "ｒ",
  t: "ｔ",
  y: "ｙ",
  u: "ｕ",
  i: "ｉ",
  o: "ｏ",
  p: "ｐ",
  "[": "[",
  "]": "]",
  "\\": "\\",
  Q: "Ｑ",
  W: "Ｗ",
  E: "Ｅ",
  R: "Ｒ",
  T: "Ｔ",
  Y: "Ｙ",
  U: "Ｕ",
  I: "Ｉ",
  O: "Ｏ",
  P: "Ｐ",
  "{": "{",
  "}": "}",
  "|": "|",
  a: "ａ",
  s: "ｓ",
  d: "d",
};
const sparrowCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "Δ",
  b: "β",
  c: "C",
  d: "D",
  e: "Σ",
  f: "Ғ",
  g: "G",
  h: "H",
  i: "I",
  j: "J",
  k: "Ҝ",
  l: "L",
  m: "M",
  n: "Π",
  o: "Ω",
  p: "P",
  q: "Q",
  r: "R",
  s: "S",
  t: "T",
  u: "U",
  v: "∇",
  w: "Ш",
  x: "X",
  y: "Ψ",
  z: "Z",
  A: "Δ",
  B: "β",
  C: "C",
  D: "D",
  E: "Σ",
  F: "Ғ",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "Ҝ",
  L: "L",
  M: "M",
  N: "Π",
  O: "Ω",
  P: "P",
  Q: "Q",
  R: "R",
  S: "S",
  T: "T",
  U: "U",
  V: "∇",
  W: "Ш",
  X: "X",
  Y: "Ψ",
  Z: "Z",
};
const typewriterCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "𝚊",
  b: "𝚋",
  c: "𝚌",
  d: "𝚍",
  e: "𝚎",
  f: "𝚏",
  g: "𝚐",
  h: "𝚑",
  i: "𝚒",
  j: "𝚓",
  k: "𝚔",
  l: "𝚕",
  m: "𝚖",
  n: "𝚗",
  o: "𝚘",
  p: "𝚙",
  q: "𝚚",
  r: "𝚛",
  s: "𝚜",
  t: "𝚝",
  u: "𝚞",
  v: "𝚟",
  w: "𝚠",
  x: "𝚡",
  y: "𝚢",
  z: "𝚣",
  A: "𝙰",
  B: "𝙱",
  C: "𝙲",
  D: "𝙳",
  E: "𝙴",
  F: "𝙵",
  G: "𝙶",
  H: "𝙷",
  I: "𝙸",
  J: "𝙹",
  K: "𝙺",
  L: "𝙻",
  M: "𝙼",
  N: "𝙽",
  O: "𝙾",
  P: "𝙿",
  Q: "𝚀",
  R: "𝚁",
  S: "𝚂",
  T: "𝚃",
  U: "𝚄",
  V: "𝚅",
  W: "𝚆",
  X: "𝚇",
  Y: "𝚈",
  Z: "𝚉",
};
const analuciaCharMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ꪖ",
  b: "᥇",
  c: "ᥴ",
  d: "ᦔ",
  e: "ꫀ",
  f: "ᠻ",
  g: "ᧁ",
  h: "ꫝ",
  i: "𝓲",
  j: "𝓳",
  k: "𝘬",
  l: "ꪶ",
  m: "ꪑ",
  n: "ꪀ",
  o: "ꪮ",
  p: "ρ",
  q: "𝘲",
  r: "𝘳",
  s: "𝘴",
  t: "𝓽",
  u: "ꪊ",
  v: "ꪜ",
  w: "᭙",
  x: "᥊",
  y: "ꪗ",
  z: "ɀ",
  A: "ꪖ",
  B: "᥇",
  C: "ᥴ",
  D: "ᦔ",
  E: "ꫀ",
  F: "ᠻ",
  G: "ᧁ",
  H: "ꫝ",
  I: "𝓲",
  J: "𝓳",
  K: "𝘬",
  L: "ꪶ",
  M: "ꪑ",
  N: "ꪀ",
  O: "ꪮ",
  P: "ρ",
  Q: "𝘲",
  R: "𝘳",
  S: "𝘴",
  T: "𝓽",
  U: "ꪊ",
  V: "ꪜ",
  W: "᭙",
  X: "᥊",
  Y: "ꪗ",
  Z: "ɀ",
};

//createMap("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡")

function listall(text) {
  text = text.trim();
  if (text === "") {
    return "";
  }
  var finalText = [];

  finalText.push(tiny(text));
  finalText.push(flip(text));
  finalText.push(roundsquares(text));
  finalText.push(squares(text));
  finalText.push(mirror(text));
  finalText.push(creepify(text));
  finalText.push(bubbles(text));
  finalText.push(strikeThrough(text));
  finalText.push(tildeStrikeThrough(text));
  finalText.push(slashThrough(text));
  finalText.push(underline(text));
  finalText.push(doubleUnderline(text));
  finalText.push(heartsBetween(text));
  finalText.push(arrowBelow(text));
  finalText.push(crossAboveBelow(text));
  finalText.push(wingdings(text));
  finalText.push(vaporwave(text));
  finalText.push(sparrow(text));
  finalText.push(manga(text));
  finalText.push(ladybug(text));
  finalText.push(runes(text));
  finalText.push(serif_B(text));
  finalText.push(serif_BI(text));
  finalText.push(serif_I(text));
  finalText.push(analucia(text));
  finalText.push(typewriter(text));
  finalText.push(fancy1(text));
  finalText.push(fancy2(text));
  finalText.push(fancy3(text));
  finalText.push(fancy4(text));
  finalText.push(fancy5(text));
  finalText.push(fancy6(text));
  finalText.push(fancy7(text));
   finalText.push(fancy8(text));
   finalText.push(fancy9(text));
   finalText.push(fancy10(text));
   finalText.push(fancy11(text));
   finalText.push(fancy12(text));
   finalText.push(fancy13(text));
   finalText.push(fancy14(text));
   finalText.push(fancy15(text));
   finalText.push(fancy16(text));
   finalText.push(fancy17(text));
   finalText.push(fancy18(text));
   finalText.push(fancy19(text));
   finalText.push(fancy20(text));
   finalText.push(fancy21(text));
   finalText.push(fancy22(text));
   finalText.push(fancy23(text));
   finalText.push(fancy24(text));
   finalText.push(fancy25(text));
   finalText.push(fancy26(text));
   finalText.push(fancy27(text));
   finalText.push(fancy28(text));
   finalText.push(fancy29(text));
   finalText.push(fancy30(text));
   finalText.push(fancy31(text));
   finalText.push(fancy32(text));
   finalText.push(fancy33(text));
  
  return finalText;
}

function flip(text) {
  return style.tools.flip.encode(text);
}
function roundsquares(text) {
  return style.tools.roundsquares.encode(text);
}
function squares(text) {
  return style.tools.squares.encode(text);
}
function mirror(text) {
  return style.tools.mirror.encode(text);
}
function creepify(text) {
  return style.tools.creepify.encode(text);
}
function bubbles(text) {
  return style.tools.bubbles.encode(text);
}
function strikeThrough(text) {
  return text.split("").join("̶") + "̶";
}
function tildeStrikeThrough(text) {
  return text.split("").join("̴") + "̴";
}
function underline(text) {
  return text.split("").join("̲") + "̲";
}
function doubleUnderline(text) {
  return text.split("").join("̳") + "̳";
}
function slashThrough(text) {
  return text.split("").join("̷") + "̷";
}
function heartsBetween(text) {
  return text.split("").join("♥");
}
function arrowBelow(text) {
  return text.split("").join("͎") + "͎";
}
function crossAboveBelow(text) {
  return text.split("").join("͓̽") + "͓̽";
}
function manga(text) {
  return text
    .split("")
    .map(function (a) {
      return mangaCharMap[a] ? mangaCharMap[a] : a;
    })
    .join("");
}
const fancy1chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ค",
  b: "๖",
  c: "¢",
  d: "໓",
  e: "ē",
  f: "f",
  g: "ງ",
  h: "h",
  i: "i",
  j: "ว",
  k: "k",
  l: "l",
  m: "๓",
  n: "ຖ",
  o: "໐",
  p: "p",
  q: "๑",
  r: "r",
  s: "Ş",
  t: "t",
  u: "น",
  v: "ง",
  w: "ຟ",
  x: "x",
  y: "ฯ",
  z: "ຊ",
  A: "ค",
  B: "๖",
  C: "¢",
  D: "໓",
  E: "ē",
  F: "f",
  G: "ງ",
  H: "h",
  I: "i",
  J: "ว",
  K: "k",
  L: "l",
  M: "๓",
  N: "ຖ",
  O: "໐",
  P: "p",
  Q: "๑",
  R: "r",
  S: "Ş",
  T: "t",
  U: "น",
  V: "ง",
  W: "ຟ",
  X: "x",
  Y: "ฯ",
  Z: "ຊ",
};
function fancy1(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy1chrmap[a] ? fancy1chrmap[a] : a;
    })
    .join("");
}
const fancy2chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ą",
  b: "ც",
  c: "ƈ",
  d: "ɖ",
  e: "ɛ",
  f: "ʄ",
  g: "ɠ",
  h: "ɧ",
  i: "ı",
  j: "ʝ",
  k: "ƙ",
  l: "Ɩ",
  m: "ɱ",
  n: "ŋ",
  o: "ơ",
  p: "℘",
  q: "զ",
  r: "ཞ",
  s: "ʂ",
  t: "ɬ",
  u: "ų",
  v: "۷",
  w: "ῳ",
  x: "ҳ",
  y: "ყ",
  z: "ʑ",
  A: "ą",
  B: "ც",
  C: "ƈ",
  D: "ɖ",
  E: "ɛ",
  F: "ʄ",
  G: "ɠ",
  H: "ɧ",
  I: "ı",
  J: "ʝ",
  K: "ƙ",
  L: "Ɩ",
  M: "ɱ",
  N: "ŋ",
  O: "ơ",
  P: "℘",
  Q: "զ",
  R: "ཞ",
  S: "ʂ",
  T: "ɬ",
  U: "ų",
  V: "۷",
  W: "ῳ",
  X: "ҳ",
  Y: "ყ",
  Z: "ʑ",
};
function fancy2(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy2chrmap[a] ? fancy2chrmap[a] : a;
    })
    .join("");
}
const fancy3chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ﾑ",
  b: "乃",
  c: "ᄃ",
  d: "り",
  e: "乇",
  f: "ｷ",
  g: "ム",
  h: "ん",
  i: "ﾉ",
  j: "ﾌ",
  k: "ズ",
  l: "ﾚ",
  m: "ﾶ",
  n: "刀",
  o: "の",
  p: "ｱ",
  q: "ゐ",
  r: "尺",
  s: "丂",
  t: "ｲ",
  u: "ひ",
  v: "√",
  w: "W",
  x: "ﾒ",
  y: "ﾘ",
  z: "乙",
  A: "ﾑ",
  B: "乃",
  C: "ᄃ",
  D: "り",
  E: "乇",
  F: "ｷ",
  G: "ム",
  H: "ん",
  I: "ﾉ",
  J: "ﾌ",
  K: "ズ",
  L: "ﾚ",
  M: "ﾶ",
  N: "刀",
  O: "の",
  P: "ｱ",
  Q: "ゐ",
  R: "尺",
  S: "丂",
  T: "ｲ",
  U: "ひ",
  V: "√",
  W: "W",
  X: "ﾒ",
  Y: "ﾘ",
  Z: "乙",
};

function fancy3(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy3chrmap[a] ? fancy3chrmap[a] : a;
    })
    .join("");
}
const fancy4chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "卂",
  b: "乃",
  c: "匚",
  d: "ᗪ",
  e: "乇",
  f: "千",
  g: "Ꮆ",
  h: "卄",
  i: "丨",
  j: "ﾌ",
  k: "Ҝ",
  l: "ㄥ",
  m: "爪",
  n: "几",
  o: "ㄖ",
  p: "卩",
  q: "Ɋ",
  r: "尺",
  s: "丂",
  t: "ㄒ",
  u: "ㄩ",
  v: "ᐯ",
  w: "山",
  x: "乂",
  y: "ㄚ",
  z: "乙",
  A: "卂",
  B: "乃",
  C: "匚",
  D: "ᗪ",
  E: "乇",
  F: "千",
  G: "Ꮆ",
  H: "卄",
  I: "丨",
  J: "ﾌ",
  K: "Ҝ",
  L: "ㄥ",
  M: "爪",
  N: "几",
  O: "ㄖ",
  P: "卩",
  Q: "Ɋ",
  R: "尺",
  S: "丂",
  T: "ㄒ",
  U: "ㄩ",
  V: "ᐯ",
  W: "山",
  X: "乂",
  Y: "ㄚ",
  Z: "乙",
};
function fancy4(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy4chrmap[a] ? fancy4chrmap[a] : a;
    })
    .join("");
}
const fancy5chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "🄰",
  b: "🄱",
  c: "🄲",
  d: "🄳",
  e: "🄴",
  f: "🄵",
  g: "🄶",
  h: "🄷",
  i: "🄸",
  j: "🄹",
  k: "🄺",
  l: "🄻",
  m: "🄼",
  n: "🄽",
  o: "🄾",
  p: "🄿",
  q: "🅀",
  r: "🅁",
  s: "🅂",
  t: "🅃",
  u: "🅄",
  v: "🅅",
  w: "🅆",
  x: "🅇",
  y: "🅈",
  z: "🅉",
  A: "🄰",
  B: "🄱",
  C: "🄲",
  D: "🄳",
  E: "🄴",
  F: "🄵",
  G: "🄶",
  H: "🄷",
  I: "🄸",
  J: "🄹",
  K: "🄺",
  L: "🄻",
  M: "🄼",
  N: "🄽",
  O: "🄾",
  P: "🄿",
  Q: "🅀",
  R: "🅁",
  S: "🅂",
  T: "🅃",
  U: "🅄",
  V: "🅅",
  W: "🅆",
  X: "🅇",
  Y: "🅈",
  Z: "🅉",
};
function fancy5(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy5chrmap[a] ? fancy5chrmap[a] : a;
    })
    .join("");
}
const fancy6chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "Ꮧ",
  b: "Ᏸ",
  c: "ፈ",
  d: "Ꮄ",
  e: "Ꮛ",
  f: "Ꭶ",
  g: "Ꮆ",
  h: "Ꮒ",
  i: "Ꭵ",
  j: "Ꮰ",
  k: "Ꮶ",
  l: "Ꮭ",
  m: "Ꮇ",
  n: "Ꮑ",
  o: "Ꭷ",
  p: "Ꭾ",
  q: "Ꭴ",
  r: "Ꮢ",
  s: "Ꮥ",
  t: "Ꮦ",
  u: "Ꮼ",
  v: "Ꮙ",
  w: "Ꮗ",
  x: "ጀ",
  y: "Ꭹ",
  z: "ፚ",
  A: "Ꮧ",
  B: "Ᏸ",
  C: "ፈ",
  D: "Ꮄ",
  E: "Ꮛ",
  F: "Ꭶ",
  G: "Ꮆ",
  H: "Ꮒ",
  I: "Ꭵ",
  J: "Ꮰ",
  K: "Ꮶ",
  L: "Ꮭ",
  M: "Ꮇ",
  N: "Ꮑ",
  O: "Ꭷ",
  P: "Ꭾ",
  Q: "Ꭴ",
  R: "Ꮢ",
  S: "Ꮥ",
  T: "Ꮦ",
  U: "Ꮼ",
  V: "Ꮙ",
  W: "Ꮗ",
  X: "ጀ",
  Y: "Ꭹ",
  Z: "ፚ",
};
function fancy6(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy6chrmap[a] ? fancy6chrmap[a] : a;
    })
    .join("");
}
const fancy7chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ᗩ",
  b: "ᗷ",
  c: "ᑕ",
  d: "ᗪ",
  e: "E",
  f: "ᖴ",
  g: "G",
  h: "ᕼ",
  i: "I",
  j: "ᒍ",
  k: "K",
  l: "ᒪ",
  m: "ᗰ",
  n: "ᑎ",
  o: "O",
  p: "ᑭ",
  q: "ᑫ",
  r: "ᖇ",
  s: "ᔕ",
  t: "T",
  u: "ᑌ",
  v: "ᐯ",
  w: "ᗯ",
  x: "᙭",
  y: "Y",
  z: "ᘔ",
  A: "ᗩ",
  B: "ᗷ",
  C: "ᑕ",
  D: "ᗪ",
  E: "E",
  F: "ᖴ",
  G: "G",
  H: "ᕼ",
  I: "I",
  J: "ᒍ",
  K: "K",
  L: "ᒪ",
  M: "ᗰ",
  N: "ᑎ",
  O: "O",
  P: "ᑭ",
  Q: "ᑫ",
  R: "ᖇ",
  S: "ᔕ",
  T: "T",
  U: "ᑌ",
  V: "ᐯ",
  W: "ᗯ",
  X: "᙭",
  Y: "Y",
  Z: "ᘔ",
};
function fancy7(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy7chrmap[a] ? fancy7chrmap[a] : a;
    })
    .join("");
}
const fancy8chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "ǟ",
  b: "ɮ",
  c: "ƈ",
  d: "ɖ",
  e: "ɛ",
  f: "ʄ",
  g: "ɢ",
  h: "ɦ",
  i: "ɨ",
  j: "ʝ",
  k: "ӄ",
  l: "ʟ",
  m: "ʍ",
  n: "ռ",
  o: "օ",
  p: "ք",
  q: "զ",
  r: "ʀ",
  s: "ֆ",
  t: "ȶ",
  u: "ʊ",
  v: "ʋ",
  w: "ա",
  x: "Ӽ",
  y: "ʏ",
  z: "ʐ",
  A: "ǟ",
  B: "ɮ",
  C: "ƈ",
  D: "ɖ",
  E: "ɛ",
  F: "ʄ",
  G: "ɢ",
  H: "ɦ",
  I: "ɨ",
  J: "ʝ",
  K: "ӄ",
  L: "ʟ",
  M: "ʍ",
  N: "ռ",
  O: "օ",
  P: "ք",
  Q: "զ",
  R: "ʀ",
  S: "ֆ",
  T: "ȶ",
  U: "ʊ",
  V: "ʋ",
  W: "ա",
  X: "Ӽ",
  Y: "ʏ",
  Z: "ʐ",
};
function fancy8(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy8chrmap[a] ? fancy8chrmap[a] : a;
    })
    .join("");
}
const fancy9chrmap = {
  0: "𝟶",
  1: "𝟷",
  2: "𝟸",
  3: "𝟹",
  4: "𝟺",
  5: "𝟻",
  6: "𝟼",
  7: "𝟽",
  8: "𝟾",
  9: "𝟿",
  a: "𝚊",
  b: "𝚋",
  c: "𝚌",
  d: "𝚍",
  e: "𝚎",
  f: "𝚏",
  g: "𝚐",
  h: "𝚑",
  i: "𝚒",
  j: "𝚓",
  k: "𝚔",
  l: "𝚕",
  m: "𝚖",
  n: "𝚗",
  o: "𝚘",
  p: "𝚙",
  q: "𝚚",
  r: "𝚛",
  s: "𝚜",
  t: "𝚝",
  u: "𝚞",
  v: "𝚟",
  w: "𝚠",
  x: "𝚡",
  y: "𝚢",
  z: "𝚣",
  A: "𝙰",
  B: "𝙱",
  C: "𝙲",
  D: "𝙳",
  E: "𝙴",
  F: "𝙵",
  G: "𝙶",
  H: "𝙷",
  I: "𝙸",
  J: "𝙹",
  K: "𝙺",
  L: "𝙻",
  M: "𝙼",
  N: "𝙽",
  O: "𝙾",
  P: "𝙿",
  Q: "𝚀",
  R: "𝚁",
  S: "𝚂",
  T: "𝚃",
  U: "𝚄",
  V: "𝚅",
  W: "𝚆",
  X: "𝚇",
  Y: "𝚈",
  Z: "𝚉",
};
function fancy9(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy9chrmap[a] ? fancy9chrmap[a] : a;
    })
    .join("");
}
const fancy10chrmap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  a: "𝙖",
  b: "𝙗",
  c: "𝙘",
  d: "𝙙",
  e: "𝙚",
  f: "𝙛",
  g: "𝙜",
  h: "𝙝",
  i: "𝙞",
  j: "𝙟",
  k: "𝙠",
  l: "𝙡",
  m: "𝙢",
  n: "𝙣",
  o: "𝙤",
  p: "𝙥",
  q: "𝙦",
  r: "𝙧",
  s: "𝙨",
  t: "𝙩",
  u: "𝙪",
  v: "𝙫",
  w: "𝙬",
  x: "𝙭",
  y: "𝙮",
  z: "𝙯",
  A: "𝘼",
  B: "𝘽",
  C: "𝘾",
  D: "𝘿",
  E: "𝙀",
  F: "𝙁",
  G: "𝙂",
  H: "𝙃",
  I: "𝙄",
  J: "𝙅",
  K: "𝙆",
  L: "𝙇",
  M: "𝙈",
  N: "𝙉",
  O: "𝙊",
  P: "𝙋",
  Q: "𝙌",
  R: "𝙍",
  S: "𝙎",
  T: "𝙏",
  U: "𝙐",
  V: "𝙑",
  W: "𝙒",
  X: "𝙓",
  Y: "𝙔",
  Z: "𝙕",
};
function fancy10(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy10chrmap[a] ? fancy10chrmap[a] : a;
    })
    .join("");
}
const fancy11chrmap = {
  0: "𝟬",
  1: "𝟭",
  2: "𝟮",
  3: "𝟯",
  4: "𝟰",
  5: "𝟱",
  6: "𝟲",
  7: "𝟳",
  8: "𝟴",
  9: "𝟵",
  a: "𝗮",
  b: "𝗯",
  c: "𝗰",
  d: "𝗱",
  e: "𝗲",
  f: "𝗳",
  g: "𝗴",
  h: "𝗵",
  i: "𝗶",
  j: "𝗷",
  k: "𝗸",
  l: "𝗹",
  m: "𝗺",
  n: "𝗻",
  o: "𝗼",
  p: "𝗽",
  q: "𝗾",
  r: "𝗿",
  s: "𝘀",
  t: "𝘁",
  u: "𝘂",
  v: "𝘃",
  w: "𝘄",
  x: "𝘅",
  y: "𝘆",
  z: "𝘇",
  A: "𝗔",
  B: "𝗕",
  C: "𝗖",
  D: "𝗗",
  E: "𝗘",
  F: "𝗙",
  G: "𝗚",
  H: "𝗛",
  I: "𝗜",
  J: "𝗝",
  K: "𝗞",
  L: "𝗟",
  M: "𝗠",
  N: "𝗡",
  O: "𝗢",
  P: "𝗣",
  Q: "𝗤",
  R: "𝗥",
  S: "𝗦",
  T: "𝗧",
  U: "𝗨",
  V: "𝗩",
  W: "𝗪",
  X: "𝗫",
  Y: "𝗬",
  Z: "𝗭",
};
function fancy11(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy11chrmap[a] ? fancy11chrmap[a] : a;
    })
    .join("");
}
const fancy12chrmap = {
  0: "𝟎",
  1: "𝟏",
  2: "𝟐",
  3: "𝟑",
  4: "𝟒",
  5: "𝟓",
  6: "𝟔",
  7: "𝟕",
  8: "𝟖",
  9: "𝟗",
  a: "𝐚",
  b: "𝐛",
  c: "𝐜",
  d: "𝐝",
  e: "𝐞",
  f: "𝐟",
  g: "𝐠",
  h: "𝐡",
  i: "𝐢",
  j: "𝐣",
  k: "𝐤",
  l: "𝐥",
  m: "𝐦",
  n: "𝐧",
  o: "𝐨",
  p: "𝐩",
  q: "𝐪",
  r: "𝐫",
  s: "𝐬",
  t: "𝐭",
  u: "𝐮",
  v: "𝐯",
  w: "𝐰",
  x: "𝐱",
  y: "𝐲",
  z: "𝐳",
  A: "𝐀",
  B: "𝐁",
  C: "𝐂",
  D: "𝐃",
  E: "𝐄",
  F: "𝐅",
  G: "𝐆",
  H: "𝐇",
  I: "𝐈",
  J: "𝐉",
  K: "𝐊",
  L: "𝐋",
  M: "𝐌",
  N: "𝐍",
  O: "𝐎",
  P: "𝐏",
  Q: "𝐐",
  R: "𝐑",
  S: "𝐒",
  T: "𝐓",
  U: "𝐔",
  V: "𝐕",
  W: "𝐖",
  X: "𝐗",
  Y: "𝐘",
  Z: "𝐙",
};
function fancy12(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy12chrmap[a] ? fancy12chrmap[a] : a;
    })
    .join("");
}
const fancy13chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝘢","b":"𝘣","c":"𝘤","d":"𝘥","e":"𝘦","f":"𝘧","g":"𝘨","h":
"𝘩","i":"𝘪","j":"𝘫","k":"𝘬","l":"𝘭","m":"𝘮","n":"𝘯","o":"𝘰","p":"𝘱","q":"𝘲","r":"𝘳","s":"𝘴","t":"𝘵","u":"𝘶","v":"𝘷","w":"𝘸","x":"𝘹"
,"y":"𝘺","z":"𝘻","A":"𝘈","B":"𝘉","C":"𝘊","D":"𝘋","E":"𝘌","F":"𝘍","G":"𝘎","H":"𝘏","I":"𝘐","J":"𝘑","K":"𝘒","L":"𝘓","M":"𝘔","N":"𝘕","O"
:"𝘖","P":"𝘗","Q":"𝘘","R":"𝘙","S":"𝘚","T":"𝘛","U":"𝘜","V":"𝘝","W":"𝘞","X":"𝘟","Y":"𝘠","Z":"𝘡"};
function fancy13(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy13chrmap[a] ? fancy13chrmap[a] : a;
    })
    .join("");
}
const fancy14chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"α","b":"Ⴆ","c":"ƈ","d":"ԃ","e":"ҽ","f":"ϝ","g":"ɠ","h":"ԋ","i":"ι","j":"ʝ","k":"ƙ","l":"ʅ","m":"ɱ","n":"ɳ","o":"σ","p":"ρ","q":"ϙ","r":"ɾ","s":"ʂ","t":"ƚ","u":"υ","v":"ʋ","w":"ɯ","x":"x","y":"ყ","z":"ȥ","A":"A","B":"B","C":"C","D":"D","E":"E","F":"F","G":"G","H":"H","I":"I","J":"J","K":"K","L":"L","M":"M","N":"N","O":"O","P":"P","Q":"Q","R":"R","S":"S","T":"T","U":"U","V":"V","W":"W","X":"X","Y":"Y","Z":"Z"}
function fancy14(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy14chrmap[a] ? fancy14chrmap[a] : a;
    })
    .join("");
}
const fancy15chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"₳","b":"฿","c":"₵","d":"Đ","e":"Ɇ","f":"₣","g":"₲","h":"Ⱨ","i":"ł","j":"J","k":"₭","l":"Ⱡ","m":"₥","n":"₦","o":"Ø","p":"₱","q":"Q","r":"Ɽ","s":"₴","t":"₮","u":"Ʉ","v":"V","w":"₩","x":"Ӿ","y":"Ɏ","z":"Ⱬ","A":"₳","B":"฿","C":"₵","D":"Đ","E":"Ɇ","F":"₣","G":"₲","H":"Ⱨ","I":"ł","J":"J","K":"₭","L":"Ⱡ","M":"₥","N":"₦","O":"Ø","P":"₱","Q":"Q","R":"Ɽ","S":"₴","T":"₮","U":"Ʉ","V":"V","W":"₩","X":"Ӿ","Y":"Ɏ","Z":"Ⱬ"}
function fancy15(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy15chrmap[a] ? fancy15chrmap[a] : a;
    })
    .join("");
}
const fancy16chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"å","b":"ß","c":"¢","d":"Ð","e":"ê","f":"£","g":"g","h":"h","i":"ï","j":"j","k":"k","l":"l","m":"m","n":"ñ","o":"ð","p":"þ","q":"q","r":"r","s":"§","t":"†","u":"µ","v":"v","w":"w","x":"x","y":"¥","z":"z","A":"Ä","B":"ß","C":"Ç","D":"Ð","E":"È","F":"£","G":"G","H":"H","I":"Ì","J":"J","K":"K","L":"L","M":"M","N":"ñ","O":"Ö","P":"þ","Q":"Q","R":"R","S":"§","T":"†","U":"Ú","V":"V","W":"W","X":"×","Y":"¥","Z":"Z"}
function fancy16(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy16chrmap[a] ? fancy16chrmap[a] : a;
    })
    .join("");
}
const fancy17chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"α","b":"в","c":"¢","d":"∂","e":"є","f":"ƒ","g":"g","h":"н","i":"ι","j":"נ","k":"к","l":"ℓ","m":"м","n":"η","o":"σ","p":"ρ","q":"q","r":"я","s":"ѕ","t":"т","u":"υ","v":"ν","w":"ω","x":"χ","y":"у","z":"z","A":"α","B":"в","C":"¢","D":"∂","E":"є","F":"ƒ","G":"g","H":"н","I":"ι","J":"נ","K":"к","L":"ℓ","M":"м","N":"η","O":"σ","P":"ρ","Q":"q","R":"я","S":"ѕ","T":"т","U":"υ","V":"ν","W":"ω","X":"χ","Y":"у","Z":"z"}

function fancy17(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy17chrmap[a] ? fancy17chrmap[a] : a;
    })
    .join("");
}
const fancy18chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"Λ","b":"B","c":"ᄃ","d":"D","e":"Σ","f":"F","g":"G","h":"Ή","i":"I","j":"J","k":"K","l":"ᄂ","m":"M","n":"П","o":"Ө","p":"P","q":"Q","r":"Я","s":"Ƨ","t":"Ƭ","u":"Ц","v":"V","w":"Щ","x":"X","y":"Y","z":"Z","A":"Λ","B":"B","C":"ᄃ","D":"D","E":"Σ","F":"F","G":"G","H":"Ή","I":"I","J":"J","K":"K","L":"ᄂ","M":"M","N":"П","O":"Ө","P":"P","Q":"Q","R":"Я","S":"Ƨ","T":"Ƭ","U":"Ц","V":"V","W":"Щ","X":"X","Y":"Y","Z":"Z"}
function fancy18(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy18chrmap[a] ? fancy18chrmap[a] : a;
    })
    .join("");
}
const fancy19chrmap = {"0":"⊘","1":"𝟙","2":"ϩ","3":"Ӡ","4":"५","5":"Ƽ","6":"Ϭ","7":"7","8":"𝟠","9":"९","a":"ą","b":"ҍ","c":"ç","d":"ժ","e":"ҽ","f":"ƒ","g":"ց","h":"հ","i":"ì","j":"ʝ","k":"ҟ","l":"Ӏ","m":"ʍ","n":"ղ","o":"օ","p":"ք","q":"զ","r":"ɾ","s":"ʂ","t":"է","u":"մ","v":"ѵ","w":"ա","x":"×","y":"վ","z":"Հ","A":"Ⱥ","B":"β","C":"↻","D":"Ꭰ","E":"Ɛ","F":"Ƒ","G":"Ɠ","H":"Ƕ","I":"į","J":"ل","K":"Ҡ","L":"Ꝉ","M":"Ɱ","N":"ហ","O":"ට","P":"φ","Q":"Ҩ","R":"འ","S":"Ϛ","T":"Ͳ","U":"Ա","V":"Ỽ","W":"చ","X":"ჯ","Y":"Ӌ","Z":"ɀ"}
function fancy19(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy19chrmap[a] ? fancy19chrmap[a] : a;
    })
    .join("");
}
const fancy20chrmap = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","a":"ₐ","b":"b","c":"c","d":"d","e":"ₑ","f":"f","g":"g","h":"ₕ","i":"ᵢ","j":"ⱼ","k":"ₖ","l":"ₗ","m":"ₘ","n":"ₙ","o":"ₒ","p":"ₚ","q":"q","r":"ᵣ","s":"ₛ","t":"ₜ","u":"ᵤ","v":"ᵥ","w":"w","x":"ₓ","y":"y","z":"z","A":"ₐ","B":"B","C":"C","D":"D","E":"ₑ","F":"F","G":"G","H":"ₕ","I":"ᵢ","J":"ⱼ","K":"ₖ","L":"ₗ","M":"ₘ","N":"ₙ","O":"ₒ","P":"ₚ","Q":"Q","R":"ᵣ","S":"ₛ","T":"ₜ","U":"ᵤ","V":"ᵥ","W":"W","X":"ₓ","Y":"Y","Z":"Z"}
function fancy20(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy20chrmap[a] ? fancy20chrmap[a] : a;
    })
    .join("");
}
const fancy21chrmap =  {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ","e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ","i":"ⁱ","j":"ʲ","k":"ᵏ","l":"ˡ","m":"ᵐ","n":"ⁿ","o":"ᵒ","p":"ᵖ","q":"q","r":"ʳ","s":"ˢ","t":"ᵗ","u":"ᵘ","v":"ᵛ","w":"ʷ","x":"ˣ","y":"ʸ","z":"ᶻ","A":"ᴬ","B":"ᴮ","C":"ᶜ","D":"ᴰ","E":"ᴱ","F":"ᶠ","G":"ᴳ","H":"ᴴ","I":"ᴵ","J":"ᴶ","K":"ᴷ","L":"ᴸ","M":"ᴹ","N":"ᴺ","O":"ᴼ","P":"ᴾ","Q":"Q","R":"ᴿ","S":"ˢ","T":"ᵀ","U":"ᵁ","V":"ⱽ","W":"ᵂ","X":"ˣ","Y":"ʸ","Z":"ᶻ"}
function fancy21(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy21chrmap[a] ? fancy21chrmap[a] : a;
    })
    .join("");
}
const fancy22chrmap =  {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ค","b":"๒","c":"ς","d":"๔","e":"є","f":"Ŧ","g":"ﻮ","h":"ђ","i":"เ","j":"ן","k":"к","l":"ɭ","m":"๓","n":"ภ","o":"๏","p":"ק","q":"ợ","r":"г","s":"ร","t":"Շ","u":"ย","v":"ש","w":"ฬ","x":"א","y":"ץ","z":"չ","A":"ค","B":"๒","C":"ς","D":"๔","E":"є","F":"Ŧ","G":"ﻮ","H":"ђ","I":"เ","J":"ן","K":"к","L":"ɭ","M":"๓","N":"ภ","O":"๏","P":"ק","Q":"ợ","R":"г","S":"ร","T":"Շ","U":"ย","V":"ש","W":"ฬ","X":"א","Y":"ץ","Z":"չ"}
function fancy22(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy22chrmap[a] ? fancy22chrmap[a] : a;
    })
    .join("");
};
const fancy23chrmap =  {"0":"𝟘","1":"𝟙","2":"𝟚","3":"𝟛","4":"𝟜","5":"𝟝","6":"𝟞","7":"𝟟","8":"𝟠","9":"𝟡","a":"𝕒","b":"𝕓","c":"𝕔","d":"𝕕","e":"𝕖","f":"𝕗","g":"𝕘","h":"𝕙","i":"𝕚","j":"𝕛","k":"𝕜","l":"𝕝","m":"𝕞","n":"𝕟","o":"𝕠","p":"𝕡","q":"𝕢","r":"𝕣","s":"𝕤","t":"𝕥","u":"𝕦","v":"𝕧","w":"𝕨","x":"𝕩","y":"𝕪","z":"𝕫","A":"𝔸","B":"𝔹","C":"ℂ","D":"𝔻","E":"𝔼","F":"𝔽","G":"𝔾","H":"ℍ","I":"𝕀","J":"𝕁","K":"𝕂","L":"𝕃","M":"𝕄","N":
"ℕ","O":"𝕆","P":"ℙ","Q":"ℚ","R":"ℝ","S":"𝕊","T":"𝕋","U":"𝕌","V":"𝕍","W":"𝕎","X":"𝕏","Y":"𝕐","Z":"ℤ"}
function fancy23(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy23chrmap[a] ? fancy23chrmap[a] : a;
    })
    .join("");
};
const fancy24chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝖆","b":"𝖇","c":"𝖈","d":"𝖉","e":"𝖊","f":"𝖋","g":"𝖌","h":
"𝖍","i":"𝖎","j":"𝖏","k":"𝖐","l":"𝖑","m":"𝖒","n":"𝖓","o":"𝖔","p":"𝖕","q":"𝖖","r":"𝖗","s":"𝖘","t":"𝖙","u":"𝖚","v":"𝖛","w":"𝖜","x":"𝖝"
,"y":"𝖞","z":"𝖟","A":"𝕬","B":"𝕭","C":"𝕮","D":"𝕯","E":"𝕰","F":"𝕱","G":"𝕲","H":"𝕳","I":"𝕴","J":"𝕵","K":"𝕶","L":"𝕷","M":"𝕸","N":"𝕹","O"
:"𝕺","P":"𝕻","Q":"𝕼","R":"𝕽","S":"𝕾","T":"𝕿","U":"𝖀","V":"𝖁","W":"𝖂","X":"𝖃","Y":"𝖄","Z":"𝖅"}
function fancy24(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy24chrmap[a] ? fancy24chrmap[a] : a;
    })
    .join("");
};
const fancy25chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"🅰","b":"🅱","c":"🅲","d":"🅳","e":"🅴","f":"🅵","g":"🅶","h":
"🅷","i":"🅸","j":"🅹","k":"🅺","l":"🅻","m":"🅼","n":"🅽","o":"🅾","p":"🅿","q":"🆀","r":"🆁","s":"🆂","t":"🆃","u":"🆄","v":"🆅","w":"🆆","x":"🆇"
,"y":"🆈","z":"🆉","A":"🅰","B":"🅱","C":"🅲","D":"🅳","E":"🅴","F":"🅵","G":"🅶","H":"🅷","I":"🅸","J":"🅹","K":"🅺","L":"🅻","M":"🅼","N":"🅽","O"
:"🅾","P":"🅿","Q":"🆀","R":"🆁","S":"🆂","T":"🆃","U":"🆄","V":"🆅","W":"🆆","X":"🆇","Y":"🆈","Z":"🆉"}
 function fancy25(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy25chrmap[a] ? fancy25chrmap[a] : a;
    })
    .join("");
};
const fancy26chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝓪","b":"𝓫","c":"𝓬","d":"𝓭","e":"𝓮","f":"𝓯","g":"𝓰","h":
"𝓱","i":"𝓲","j":"𝓳","k":"𝓴","l":"𝓵","m":"𝓶","n":"𝓷","o":"𝓸","p":"𝓹","q":"𝓺","r":"𝓻","s":"𝓼","t":"𝓽","u":"𝓾","v":"𝓿","w":"𝔀","x":"𝔁"
,"y":"𝔂","z":"𝔃","A":"𝓐","B":"𝓑","C":"𝓒","D":"𝓓","E":"𝓔","F":"𝓕","G":"𝓖","H":"𝓗","I":"𝓘","J":"𝓙","K":"𝓚","L":"𝓛","M":"𝓜","N":"𝓝","O"
:"𝓞","P":"𝓟","Q":"𝓠","R":"𝓡","S":"𝓢","T":"𝓣","U":"𝓤","V":"𝓥","W":"𝓦","X":"𝓧","Y":"𝓨","Z":"𝓩"}
  function fancy26(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy26chrmap[a] ? fancy26chrmap[a] : a;
    })
    .join("");
};
const fancy27chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝔞","b":"𝔟","c":"𝔠","d":"𝔡","e":"𝔢","f":"𝔣","g":"𝔤","h":
"𝔥","i":"𝔦","j":"𝔧","k":"𝔨","l":"𝔩","m":"𝔪","n":"𝔫","o":"𝔬","p":"𝔭","q":"𝔮","r":"𝔯","s":"𝔰","t":"𝔱","u":"𝔲","v":"𝔳","w":"𝔴","x":"𝔵"
,"y":"𝔶","z":"𝔷","A":"𝔄","B":"𝔅","C":"ℭ","D":"𝔇","E":"𝔈","F":"𝔉","G":"𝔊","H":"ℌ","I":"ℑ","J":"𝔍","K":"𝔎","L":"𝔏","M":"𝔐","N":"𝔑","O":"�","P":"𝔓","Q":"𝔔","R":"ℜ","S":"𝔖","T":"𝔗","U":"𝔘","V":"𝔙","W":"𝔚","X":"𝔛","Y":"𝔜","Z":"ℨ"}
function fancy27(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy27chrmap[a] ? fancy27chrmap[a] : a;
    })
    .join("");
};

const fancy28chrmap = {"0":"０","1":"１","2":"２","3":"３","4":"４","5":"５","6":"６","7":"７","8":"８","9":"９","a":"ａ","b":"ｂ","c":"ｃ","d":"ｄ","e":"ｅ","f":"ｆ","g":"ｇ","h":"ｈ","i":"ｉ","j":"ｊ","k":"ｋ","l":"ｌ","m":"ｍ","n":"ｎ","o":"ｏ","p":"ｐ","q":"ｑ","r":"ｒ","s":"ｓ","t":"ｔ","u":"ｕ","v":"ｖ","w":"ｗ","x":"ｘ","y":"ｙ","z":"ｚ","A":"Ａ","B":"Ｂ","C":"Ｃ","D":"Ｄ","E":"Ｅ","F":"Ｆ","G":"Ｇ","H":"Ｈ","I":"Ｉ","J":"Ｊ","K":"Ｋ","L":"Ｌ","M":"Ｍ","N":"Ｎ","O":"Ｏ","P":"Ｐ","Q":"Ｑ","R":"Ｒ","S":"Ｓ","T":"Ｔ","U":"Ｕ","V":"Ｖ","W":"Ｗ","X":"Ｘ","Y":"Ｙ","Z":"Ｚ"}
function fancy28(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy28chrmap[a] ? fancy28chrmap[a] : a;
    })
    .join("");
};
const fancy29chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝒂","b":"𝒃","c":"𝒄","d":"𝒅","e":"𝒆","f":"𝒇","g":"𝒈","h":
"𝒉","i":"𝒊","j":"𝒋","k":"𝒌","l":"𝒍","m":"𝒎","n":"𝒏","o":"𝒐","p":"𝒑","q":"𝒒","r":"𝒓","s":"𝒔","t":"𝒕","u":"𝒖","v":"𝒗","w":"𝒘","x":"𝒙"
,"y":"𝒚","z":"𝒛","A":"𝑨","B":"𝑩","C":"𝑪","D":"𝑫","E":"𝑬","F":"𝑭","G":"𝑮","H":"𝑯","I":"𝑰","J":"𝑱","K":"𝑲","L":"𝑳","M":"𝑴","N":"𝑵","O"
:"𝑶","P":"𝑷","Q":"𝑸","R":"𝑹","S":"𝑺","T":"𝑻","U":"𝑼","V":"𝑽","W":"𝑾","X":"𝑿","Y":"𝒀","Z":"𝒁"}
function fancy29(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy29chrmap[a] ? fancy29chrmap[a] : a;
    })
    .join("");
};
const fancy30chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝛥","b":"𝐵","c":"𝐶","d":"𝐷","e":"𝛯","f":"𝐹","g":"𝐺","h":
"𝛨","i":"𝛪","j":"𝐽","k":"𝛫","l":"𝐿","m":"𝛭","n":"𝛮","o":"𝛩","p":"𝛲","q":"𝑄","r":"𝑅","s":"𝑆","t":"𝑇","u":"𝑈","v":"𝛻","w":"𝑊","x":"𝛸"
,"y":"𝑌","z":"𝛧","A":"𝛥","B":"𝐵","C":"𝐶","D":"𝐷","E":"𝛯","F":"𝐹","G":"𝐺","H":"𝛨","I":"𝛪","J":"𝐽","K":"𝛫","L":"𝐿","M":"𝛭","N":"𝛮","O"
:"𝛩","P":"𝛲","Q":"𝑄","R":"𝑅","S":"𝑆","T":"𝑇","U":"𝑈","V":"𝛻","W":"𝑊","X":"𝛸","Y":"𝑌","Z":"𝛧"}
function fancy30(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy30chrmap[a] ? fancy30chrmap[a] : a;
    })
    .join("");
};
const fancy31chrmap = {"0":"𝟬","1":"𝟭","2":"𝟮","3":"𝟯","4":"𝟰","5":"𝟱","6":"𝟲","7":"𝟳","8":"𝟴","9":"𝟵","a":"𝞓","b":"𝞑","c":"𝘾","d":"𝘿","e":"𝞢","f":"𝙁","g"
:"𝙂","h":"𝞖","i":"𝞘","j":"𝙅","k":"𝞙","l":"𝙇","m":"𝞛","n":"𝞜","o":"𝞗","p":"𝞠","q":"𝙌","r":"𝞒","s":"𝙎","t":"𝙏","u":"𝙐","v":"𝝯","w":"𝙒","x":"𝞦","y":"𝙔","z":"𝙕","A":"𝞓","B":"𝞑","C":"𝘾","D":"𝘿","E":"𝞢","F":"𝙁","G":"𝙂","H":"𝞖","I":"𝞘","J":"𝙅","K":"𝞙","L":"𝙇","M":"𝞛","N":"𝞜","O":"𝞗","P":"𝞠","Q":"𝙌","R":"𝞒","S":"𝙎","T":"𝙏","U":"𝙐","V":"𝝯","W":"𝙒","X":"𝞦","Y":"𝙔","Z":"𝙕"}
function fancy31(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy31chrmap[a] ? fancy31chrmap[a] : a;
    })
    .join("");
};
const fancy32chrmap =  {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝚫","b":"𝚩","c":"𝐂","d":"𝐃","e":"𝚵","f":"𝐅","g":"𝐆","h":
"𝚮","i":"𝚰","j":"𝐉","k":"𝐊","l":"𝐋","m":"𝚳","n":"𝚴","o":"𝚯","p":"𝚸","q":"𝐐","r":"𝚪","s":"𝐒","t":"𝚻","u":"𝐔","v":"𝛁","w":"𝐖","x":"𝚾"
,"y":"𝐘","z":"𝚭","A":"𝚫","B":"𝚩","C":"𝐂","D":"𝐃","E":"𝚵","F":"𝐅","G":"𝐆","H":"𝚮","I":"𝚰","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝚳","N":"𝚴","O"
:"𝚯","P":"𝚸","Q":"𝐐","R":"𝚪","S":"𝐒","T":"𝚻","U":"𝐔","V":"𝛁","W":"𝐖","X":"𝚾","Y":"𝐘","Z":"𝚭"}
function fancy32(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy32chrmap[a] ? fancy32chrmap[a] : a;
    })
    .join("");
};
const fancy33chrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ᗩ","b":"ᗷ","c":"ᑕ","d":"ᗞ","e":"ᗴ","f":"ᖴ","g":"Ꮐ","h":"ᕼ","i":"Ꮖ","j":"ᒍ","k":"Ꮶ","l":"し","m":"ᗰ","n":"ᑎ","o":"ᝪ","p":"ᑭ","q":"ᑫ","r":"ᖇ","s":"ᔑ","t":"Ꭲ","u":"ᑌ","v":"ᐯ","w":"ᗯ","x":"᙭","y":"Ꭹ","z":"Ꮓ","A":"ᗩ","B":"ᗷ","C":"ᑕ","D":"ᗞ","E":"ᗴ","F":"ᖴ","G":"Ꮐ","H":"ᕼ","I":"Ꮖ","J":"ᒍ","K":"Ꮶ","L":"し","M":"ᗰ","N":"ᑎ","O":"ᝪ","P":"ᑭ","Q":"ᑫ","R":"ᖇ","S":"ᔑ","T":"Ꭲ","U":"ᑌ","V":"ᐯ","W":"ᗯ","X":"᙭","Y":"Ꭹ","Z":"Ꮓ"}
function fancy33(text) {
  return text
    .split("")
    .map(function (a) {
      return fancy33chrmap[a] ? fancy33chrmap[a] : a;
    })
    .join("");
};
const tinyChrmap = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ᴀ","b":"ʙ","c":"ᴄ","d":"ᴅ","e":"ᴇ","f":"ꜰ","g":"ɢ","h":"ʜ","i":"ɪ","j":"ᴊ","k":"ᴋ","l":"ʟ","m":"ᴍ","n":"ɴ","o":"ᴏ","p":"ᴘ","q":"ϙ","r":"ʀ","s":"ꜱ","t":"ᴛ","u":"ᴜ","v":"ᴠ","w":"ᴡ","x":"x","y":"ʏ","z":"ᴢ","A":"A","B":"ʙ","C":"C","D":"D","E":"E","F":"F","G":"G","H":"H","I":"I","J":"J","K":"K","L":"L","M":"M","N":"N","O":"O","P":"P","Q":"Q","R":"R","S":"S","T":"T","U":"U","V":"V","W":"W","X":"X","Y":"Y","Z":"Z"}
function tiny(text) {
  return text
    .split("")
    .map(function (a) {
      return tinyChrmap[a] ? tinyChrmap[a] : a;
    })
    .join("");
};
function ladybug(text) {
  return text
    .split("")
    .map(function (a) {
      return ladybugCharMap[a] ? ladybugCharMap[a] : a;
    })
    .join("");
}

function runes(text) {
  return text
    .split("")
    .map(function (a) {
      return runesCharMap[a] ? runesCharMap[a] : a;
    })
    .join("");
}
function serif_B(text) {
  return text
    .split("")
    .map(function (a) {
      return serif_BCharMap[a] ? serif_BCharMap[a] : a;
    })
    .join("");
}
function serif_BI(text) {
  return text
    .split("")
    .map(function (a) {
      return serif_BICharMap[a] ? serif_BICharMap[a] : a;
    })
    .join("");
}
function serif_I(text) {
  return text
    .split("")
    .map(function (a) {
      return serif_ICharMap[a] ? serif_ICharMap[a] : a;
    })
    .join("");
}
function wingdings(text) {
  return text
    .split("")
    .map(function (a) {
      return wingdingsCharMap[a] ? wingdingsCharMap[a] : a;
    })
    .join("");
}

function vaporwave(text) {
  return text
    .split("")
    .map(function (a) {
      return vaporwaveCharMap[a] ? vaporwaveCharMap[a] : a;
    })
    .join("");
}

function sparrow(text) {
  return text
    .split("")
    .map(function (a) {
      return sparrowCharMap[a] ? sparrowCharMap[a] : a;
    })
    .join("");
}

function typewriter(text) {
  return text
    .split("")
    .map(function (a) {
      return typewriterCharMap[a] ? typewriterCharMap[a] : a;
    })
    .join("");
}
function analucia(text) {
  return text
    .split("")
    .map(function (a) {
      return analuciaCharMap[a] ? analuciaCharMap[a] : a;
    })
    .join("");
}

module.exports = {
  randomStyle:(text)=>{
    let list = listall(text)
   return list[Math.floor(Math.random()*list.length)]
  },
  listall,
  strikeThrough,
  wingdings,
  vaporwave,
  typewriter,
  analucia,
  tildeStrikeThrough,
  underline,
  doubleUnderline,
  slashThrough,
  sparrow,
  heartsBetween,
  arrowBelow,
  crossAboveBelow,
  creepify,
  bubbles,
  mirror,
  squares,
  roundsquares,
  flip,
  tiny,
  createMap,
  serif_I,
  manga,
  ladybug,
  runes,
  serif_B,
  serif_BI,
  serif_I,
  fancy1,
fancy2,
fancy3,
fancy4,
fancy5,
fancy6,
fancy7,
 fancy8,
 fancy9,
 fancy10,
 fancy11,
 fancy12,
 fancy13,
 fancy14,
 fancy15,
 fancy16,
 fancy17,
 fancy18,
 fancy19,
 fancy20,
 fancy21,
 fancy22,
 fancy23,
 fancy24,
 fancy25,
 fancy26,
 fancy27,
 fancy28,
 fancy29,
 fancy30,
 fancy31,
 fancy32,
 fancy33,
};




