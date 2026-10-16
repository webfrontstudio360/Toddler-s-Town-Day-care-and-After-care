(function () {
  'use strict';

  /* ===== Settings you can change ===== */
  var WHATSAPP_NUMBER = '27789422043';              // international format, no + or spaces
  var EMAIL = 'toddlerstowndc@gmail.com';
  /* =================================== */

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Floating letters, numbers and shapes in the hero (like the logo)
  var confetti = document.querySelector('.confetti');
  var colours = ['#ee6a2c', '#1fa3b1', '#f6b93b', '#6fa92f'];
  var glyphs = ['A', 'B', 'C', '1', '2', '3', '7', '9', 'a', '\u2665', '\u25B2', '\u25CF', '\u2726'];
  var spots = [
    [4, 8], [12, 62], [8, 85], [22, 30], [30, 8], [38, 92], [46, 4], [58, 14],
    [66, 90], [74, 6], [82, 40], [88, 78], [90, 12], [18, 94], [52, 48], [6, 40]
  ];
  spots.forEach(function (pos, i) {
    var el = document.createElement('span');
    el.className = 'bit';
    el.textContent = glyphs[i % glyphs.length];
    el.style.top = pos[0] + '%';
    el.style.left = pos[1] + '%';
    el.style.color = colours[i % colours.length];
    el.style.fontSize = (1.4 + (i % 4) * 0.55) + 'rem';
    el.style.setProperty('--d', (7 + (i % 5) * 1.3) + 's');
    el.style.setProperty('--delay', (-i * 0.7) + 's');
    el.style.setProperty('--r0', (-12 + (i % 3) * 8) + 'deg');
    el.style.setProperty('--r1', (8 + (i % 4) * 6) + 'deg');
    confetti.appendChild(el);
  });

  // Enquiry form: sends the details to WhatsApp or opens an email
  var form = document.getElementById('enquiry-form');
  var status = document.getElementById('form-status');
  var lastMethod = 'whatsapp';

  form.querySelectorAll('button[type="submit"]').forEach(function (b) {
    b.addEventListener('click', function () { lastMethod = b.getAttribute('data-method'); });
  });

  function setError(id, msg) {
    var input = document.getElementById(id);
    var out = form.querySelector('.error[data-for="' + id + '"]');
    if (out) out.textContent = msg;
    if (msg) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
  }

  function validate() {
    var ok = true;
    var rules = {
      parent: 'Enter your name.',
      phone: 'Enter a phone or WhatsApp number we can reach you on.',
      child: "Enter your child's name.",
      age: "Enter your child's age or grade.",
      service: 'Choose what you are looking for.'
    };
    Object.keys(rules).forEach(function (id) {
      var v = document.getElementById(id).value.trim();
      if (!v) { setError(id, rules[id]); ok = false; } else { setError(id, ''); }
    });
    var phone = document.getElementById('phone').value.replace(/[^0-9]/g, '');
    if (phone && phone.length < 9) { setError('phone', 'That number looks too short. Check it and try again.'); ok = false; }
    var email = document.getElementById('email').value.trim();
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError('email', 'Check your email address, it looks incomplete.'); ok = false; }
    else { setError('email', ''); }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    if (!validate()) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var lines = [
      "Hi Toddler's Town, I'd like to enquire about a place for my child.",
      '',
      'Parent name: ' + v('parent'),
      'Phone: ' + v('phone'),
      v('email') ? 'Email: ' + v('email') : null,
      "Child's name: " + v('child'),
      'Age or grade: ' + v('age'),
      'Looking for: ' + v('service'),
      v('message') ? 'Notes: ' + v('message') : null
    ].filter(function (l) { return l !== null; });
    var text = lines.join('\n');

    if (lastMethod === 'email') {
      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Enquiry: ' + v('child')) +
        '&body=' + encodeURIComponent(text);
      status.textContent = 'Your email app should open with your details ready to send.';
    } else {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      status.textContent = 'WhatsApp is opening with your details. Press send to finish.';
    }
  });
})();
