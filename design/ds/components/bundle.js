/* @ds-bundle: {"format":4,"namespace":"LightHead","components":[{"name":"LocaleProvider"},{"name":"Icon"},{"name":"Button"},{"name":"Chip"},{"name":"SegmentedControl"},{"name":"TextField"},{"name":"NumberField"},{"name":"OptionGrid"},{"name":"StepHeader"},{"name":"Step"},{"name":"ActionBar"},{"name":"Rating"},{"name":"StrainBadge"},{"name":"StrainAvatar"},{"name":"StatTile"},{"name":"BreakProgress"},{"name":"SessionCard"},{"name":"StrainCard"},{"name":"Notice"},{"name":"TabBar"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, keys) {
    var r = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) r[k] = obj[k];
    return r;
  }
  function useMaybeControlled(value, initial, onChange) {
    var s = useState(initial);
    var controlled = value !== undefined;
    return [controlled ? value : s[0], function (v) { if (!controlled) s[1](v); if (onChange) onChange(v); }];
  }

  /* ---------- Locale ---------- */
  var MESSAGES = {
    en: {
      close: 'Close without saving', back: 'Back', 'continue': 'Continue', skip: 'Skip', done: 'Done',
      stepOf: 'Step {step} of {total}', decrease: 'Decrease {label}', increase: 'Increase {label}',
      sameAsLast: 'Same as last time', lastTime: 'Last time', fromStrain: 'From the strain', fromLabel: 'From the package label',
      rating: 'Rating', ratingOf: '{n} of {max}', rated: 'Rated {n} of {max}',
      indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid', cbd: 'CBD', thc: 'THC', sessions: 'Sessions',
      breakLabel: 'Tolerance break', breakDone: 'Break complete', ofTotal: 'of {total}',
      daysToGo: { one: '{count} day to go', other: '{count} days to go' },
      mainNav: 'Main', today: 'Today', log: 'Journal', strains: 'Strains', stats: 'Stats', 'break': 'Break',
      amount: 'Amount', method: 'Method', strain: 'Strain', effects: 'Effects', now: 'Now',
      joint: 'Joint', vape: 'Vape', bong: 'Bong', edible: 'Edible', somethingElse: 'Something else',
      calm: 'Calm', happy: 'Happy', creative: 'Creative', focused: 'Focused', sleepy: 'Sleepy', hungry: 'Hungry',
      qStrain: 'What did you have?', qAmount: 'How much?', qFeel: 'How do you feel?',
      prefilledSub: 'Prefilled from last time. Adjust if needed.', optionalSub: 'Optional. You can add this later.',
      saveSession: 'Save session', sessionSaved: 'Session saved',
      thcDerived: '≈ {mg} mg THC', thcIn: 'in {amount} of {strain} ({pct})',
      addPhoto: 'Add photo', changePhoto: 'Change photo'
    },
    de: {
      close: 'Schließen ohne Speichern', back: 'Zurück', 'continue': 'Weiter', skip: 'Überspringen', done: 'Fertig',
      stepOf: 'Schritt {step} von {total}', decrease: '{label} verringern', increase: '{label} erhöhen',
      sameAsLast: 'Wie beim letzten Mal', lastTime: 'Letztes Mal', fromStrain: 'Von der Sorte', fromLabel: 'Laut Verpackung',
      rating: 'Bewertung', ratingOf: '{n} von {max}', rated: 'Bewertet mit {n} von {max}',
      indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybrid', cbd: 'CBD', thc: 'THC', sessions: 'Sitzungen',
      breakLabel: 'Toleranzpause', breakDone: 'Pause beendet', ofTotal: 'von {total}',
      daysToGo: { one: 'Noch {count} Tag', other: 'Noch {count} Tage' },
      mainNav: 'Hauptmenü', today: 'Heute', log: 'Tagebuch', strains: 'Sorten', stats: 'Statistik', 'break': 'Pause',
      amount: 'Menge', method: 'Methode', strain: 'Sorte', effects: 'Wirkung', now: 'Jetzt',
      joint: 'Joint', vape: 'Vaporizer', bong: 'Bong', edible: 'Edible', somethingElse: 'Etwas anderes',
      calm: 'Ruhig', happy: 'Fröhlich', creative: 'Kreativ', focused: 'Fokussiert', sleepy: 'Müde', hungry: 'Hungrig',
      qStrain: 'Was hattest du?', qAmount: 'Wie viel?', qFeel: 'Wie fühlst du dich?',
      prefilledSub: 'Wie beim letzten Mal. Bei Bedarf anpassen.', optionalSub: 'Optional. Du kannst das später ergänzen.',
      saveSession: 'Sitzung speichern', sessionSaved: 'Sitzung gespeichert',
      thcDerived: '≈ {mg} mg THC', thcIn: 'in {amount} {strain} ({pct})',
      addPhoto: 'Foto hinzufügen', changePhoto: 'Foto ändern'
    },
    pl: {
      close: 'Zamknij bez zapisywania', back: 'Wstecz', 'continue': 'Dalej', skip: 'Pomiń', done: 'Gotowe',
      stepOf: 'Krok {step} z {total}', decrease: 'Zmniejsz: {label}', increase: 'Zwiększ: {label}',
      sameAsLast: 'Tak jak ostatnio', lastTime: 'Ostatnio', fromStrain: 'Z odmiany', fromLabel: 'Z etykiety',
      rating: 'Ocena', ratingOf: '{n} z {max}', rated: 'Ocena {n} z {max}',
      indica: 'Indica', sativa: 'Sativa', hybrid: 'Hybryda', cbd: 'CBD', thc: 'THC', sessions: 'Sesje',
      breakLabel: 'Przerwa', breakDone: 'Przerwa zakończona', ofTotal: 'z {total}',
      daysToGo: { one: 'Został {count} dzień', few: 'Zostały {count} dni', many: 'Zostało {count} dni', other: 'Zostało {count} dni' },
      mainNav: 'Główne', today: 'Dziś', log: 'Dziennik', strains: 'Odmiany', stats: 'Statystyki', 'break': 'Przerwa',
      amount: 'Ilość', method: 'Sposób', strain: 'Odmiana', effects: 'Efekty', now: 'Teraz',
      joint: 'Joint', vape: 'Waporyzator', bong: 'Bongo', edible: 'Jadalne', somethingElse: 'Coś innego',
      calm: 'Spokój', happy: 'Radość', creative: 'Kreatywność', focused: 'Skupienie', sleepy: 'Senność', hungry: 'Głód',
      qStrain: 'Jaka odmiana?', qAmount: 'Ile?', qFeel: 'Jak się czujesz?',
      prefilledSub: 'Tak jak ostatnio. Zmień, jeśli trzeba.', optionalSub: 'Opcjonalnie. Możesz dodać to później.',
      saveSession: 'Zapisz sesję', sessionSaved: 'Sesja zapisana',
      thcDerived: '≈ {mg} mg THC', thcIn: 'w {amount} odmiany {strain} ({pct})',
      addPhoto: 'Dodaj zdjęcie', changePhoto: 'Zmień zdjęcie'
    }
  };
  function translate(locale, key, vars) {
    var pack = MESSAGES[locale] || MESSAGES.en;
    var msg = pack[key] != null ? pack[key] : MESSAGES.en[key];
    if (msg == null) return key;
    if (typeof msg === 'object') {
      var cat = 'other';
      try { cat = new Intl.PluralRules(locale).select(vars && vars.count != null ? vars.count : 0); } catch (e) {}
      msg = msg[cat] != null ? msg[cat] : msg.other;
    }
    return String(msg).replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; });
  }
  function formatNumber(locale, n, decimals) {
    try { return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 }).format(n); }
    catch (e) { return (+n).toFixed(decimals || 0); }
  }
  function formatPercent(locale, n, decimals) {
    try { return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: decimals != null ? decimals : 1 }).format(n / 100); }
    catch (e) { return n + '%'; }
  }
  var LocaleContext = React.createContext('en');
  function LocaleProvider(props) {
    return h(LocaleContext.Provider, { value: props.locale || 'en' }, props.children);
  }
  function useLocale() {
    var locale = React.useContext(LocaleContext);
    return {
      locale: locale,
      t: function (key, vars) { return translate(locale, key, vars); },
      num: function (n, d) { return formatNumber(locale, n, d); },
      pct: function (n, d) { return formatPercent(locale, n, d); }
    };
  }

  /* ---------- Icon ---------- */
  var PATHS = {
    home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
    session: 'M12 3c.8 2.6 4.8 4.8 4.8 9.6a4.8 4.8 0 0 1-9.6 0c0-2.4 1.3-3.9 2.3-4.8.3 1.5 1 2.4 2.2 2.9-.2-2.9-.6-5 .3-7.7z',
    leaf: 'M5 19C5 10.5 10 5 19 5c0 9-5.5 14-14 14zM5 19l7.5-7.5',
    'break': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 9v6M14 9v6',
    stash: 'M8 3h8M6.5 6h11M7 6v12.5A2.5 2.5 0 0 0 9.5 21h5a2.5 2.5 0 0 0 2.5-2.5V6M10 11.5h4',
    stats: 'M5 20v-7M12 20V5M19 20v-11M3 20h18',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    check: 'M5 12.5l4.5 4.5L19 7',
    lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    calendar: 'M4 6h16v14H4zM4 10.5h16M8.5 3v4M15.5 3v4',
    cloud: 'M7 18.5a4 4 0 0 1-.6-7.95 6 6 0 0 1 11.5 1.45 3.25 3.25 0 0 1-.4 6.5z',
    chevron: 'M9.5 6l6 6-6 6',
    close: 'M6 6l12 12M18 6L6 18',
    alert: 'M12 4l9 16H3zM12 10v4M12 17.2v.1',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
    camera: 'M4 8h3.5L9 5.5h6L16.5 8H20v11H4zM12 16.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5z'
  };
  function Icon(props) {
    var size = props.size || 24;
    var d = PATHS[props.name] || PATHS.leaf;
    var a11y = props.title ? { role: 'img', 'aria-label': props.title } : { 'aria-hidden': 'true' };
    return h('svg', Object.assign({
      className: cx('lh-icon', props.className), width: size, height: size, viewBox: '0 0 24 24',
      fill: props.filled ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: 1.75,
      strokeLinecap: 'round', strokeLinejoin: 'round', focusable: 'false'
    }, a11y), h('path', { d: d }));
  }
  Icon.names = Object.keys(PATHS);

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'secondary';
    var size = props.size || 'md';
    var iconOnly = props.icon && !props.children;
    var rest = omit(props, ['variant', 'size', 'icon', 'block', 'className', 'children']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('lh-btn', 'lh-btn-' + variant, 'lh-btn-' + size, iconOnly && 'lh-btn-icon', props.block && 'lh-btn-block', props.className)
    }), props.icon ? h(Icon, { name: props.icon, size: size === 'lg' ? 22 : 20 }) : null, props.children ? h('span', null, props.children) : null);
  }

  /* ---------- Chip ---------- */
  function Chip(props) {
    var st = useMaybeControlled(props.selected, !!props.defaultSelected, props.onChange);
    return h('button', {
      type: 'button', className: cx('lh-chip', st[0] && 'is-selected', props.className),
      'aria-pressed': st[0] ? 'true' : 'false', disabled: props.disabled,
      onClick: function () { st[1](!st[0]); }
    }, st[0] ? h(Icon, { name: 'check', size: 16 }) : null, h('span', null, props.children));
  }

  /* ---------- SegmentedControl ---------- */
  function SegmentedControl(props) {
    var opts = props.options || [];
    var st = useMaybeControlled(props.value, props.defaultValue !== undefined ? props.defaultValue : (opts[0] && opts[0].value), props.onChange);
    return h('div', { className: 'lh-seg', role: 'radiogroup', 'aria-label': props.label },
      opts.map(function (o) {
        var on = o.value === st[0];
        return h('button', {
          key: o.value, type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false',
          className: cx('lh-seg-item', on && 'is-on'), onClick: function () { st[1](o.value); }
        }, o.icon ? h(Icon, { name: o.icon, size: 18 }) : null, h('span', null, o.label));
      }));
  }

  /* ---------- TextField ---------- */
  var fieldSeq = 0;
  function TextField(props) {
    var idRef = React.useRef(props.id || ('lh-f-' + (++fieldSeq)));
    var id = idRef.current;
    var rest = omit(props, ['label', 'hint', 'error', 'suffix', 'multiline', 'className', 'id']);
    var describedBy = (props.error || props.hint) ? id + '-d' : undefined;
    var control = h(props.multiline ? 'textarea' : 'input', Object.assign({
      id: id, className: 'lh-field-input', 'aria-invalid': props.error ? 'true' : undefined, 'aria-describedby': describedBy,
      rows: props.multiline ? 3 : undefined
    }, rest));
    return h('div', { className: cx('lh-field', props.error && 'has-error', props.className) },
      h('label', { className: 'lh-field-label', htmlFor: id }, props.label),
      h('div', { className: 'lh-field-box' }, control, props.suffix ? h('span', { className: 'lh-field-suffix' }, props.suffix) : null),
      (props.error || props.hint) ? h('p', { id: describedBy, className: 'lh-field-hint' },
        props.error ? h(Icon, { name: 'alert', size: 16 }) : null, props.error || props.hint) : null);
  }

  /* ---------- NumberField ---------- */
  var numSeq = 0;
  function NumberField(props) {
    var step = props.step || 1, min = props.min != null ? props.min : 0, max = props.max != null ? props.max : 100;
    var decimals = props.decimals != null ? props.decimals : 0;
    var size = props.size || 'md';
    var L10n = useLocale();
    var label = props.label || L10n.t('amount');
    var idRef = React.useRef(props.id || ('lh-n-' + (++numSeq)));
    var id = idRef.current;
    var st = useMaybeControlled(props.value, props.defaultValue != null ? props.defaultValue : min, props.onChange);
    var dr = useState(null), draft = dr[0], setDraft = dr[1];
    function clamp(v) { return Math.min(max, Math.max(min, +(+v).toFixed(4))); }
    function nudge(dir) { setDraft(null); st[1](clamp(Math.round((st[0] + dir * step) / step) * step)); }
    function parse(s) { var n = parseFloat(String(s).replace(',', '.')); return isNaN(n) ? null : n; }
    var hint = props.hint || (props.prefilled ? L10n.t('sameAsLast') : null);
    return h('div', { className: cx('lh-num', 'lh-num-' + size, props.className) },
      h('label', { className: 'lh-field-label', htmlFor: id }, label),
      h('div', { className: 'lh-num-track' },
        h('button', { type: 'button', className: 'lh-num-btn', 'aria-label': L10n.t('decrease', { label: label }), disabled: st[0] <= min, onClick: function () { nudge(-1); } }, h(Icon, { name: 'minus', size: size === 'lg' ? 28 : 22 })),
        h('div', { className: 'lh-num-center' },
          h('input', {
            id: id, className: 'lh-num-input', inputMode: 'decimal', autoComplete: 'off', 'aria-describedby': hint ? id + '-h' : undefined,
            value: draft != null ? draft : L10n.num(st[0], decimals),
            onFocus: function (e) { e.target.select(); },
            onChange: function (e) { setDraft(e.target.value); var n = parse(e.target.value); if (n != null && n >= min && n <= max) st[1](n); },
            onBlur: function () { var n = parse(draft); setDraft(null); if (n != null) st[1](clamp(n)); }
          }),
          props.unit ? h('span', { className: 'lh-num-unit', 'aria-hidden': 'true' }, props.unit) : null),
        h('button', { type: 'button', className: 'lh-num-btn', 'aria-label': L10n.t('increase', { label: label }), disabled: st[0] >= max, onClick: function () { nudge(1); } }, h(Icon, { name: 'plus', size: size === 'lg' ? 28 : 22 }))),
      hint ? h('p', { id: id + '-h', className: 'lh-field-hint' }, props.prefilled ? h(Icon, { name: 'clock', size: 16 }) : null, hint) : null);
  }

  /* ---------- OptionGrid ---------- */
  function OptionGrid(props) {
    var opts = props.options || [];
    var multiple = !!props.multiple;
    var st = useMaybeControlled(props.value, props.defaultValue !== undefined ? props.defaultValue : (multiple ? [] : null), props.onChange);
    function isOn(v) { return multiple ? (st[0] || []).indexOf(v) >= 0 : st[0] === v; }
    function pick(v) {
      if (!multiple) return st[1](v);
      var cur = (st[0] || []).slice(), i = cur.indexOf(v);
      if (i >= 0) cur.splice(i, 1); else cur.push(v);
      st[1](cur);
    }
    return h('div', { className: cx('lh-options', 'lh-cols-' + (props.columns || 2)), role: multiple ? 'group' : 'radiogroup', 'aria-label': props.label },
      opts.map(function (o) {
        var on = isOn(o.value);
        return h('button', {
          key: o.value, type: 'button', role: multiple ? 'checkbox' : 'radio', 'aria-checked': on ? 'true' : 'false',
          className: cx('lh-option', on && 'is-on'), onClick: function () { pick(o.value); }
        },
          o.media ? h('span', { className: 'lh-option-media' }, o.media) : o.icon ? h('span', { className: 'lh-option-icon' }, h(Icon, { name: o.icon, size: 28 })) : null,
          h('span', { className: 'lh-option-label' }, o.label),
          o.hint ? h('span', { className: 'lh-option-hint' }, o.hint) : null,
          h('span', { className: 'lh-option-check', 'aria-hidden': 'true' }, on ? h(Icon, { name: 'check', size: 16 }) : null));
      }));
  }

  /* ---------- StepHeader ---------- */
  function StepHeader(props) {
    var L10n = useLocale();
    var total = props.total || 4, step = Math.min(props.step || 1, total);
    return h('header', { className: 'lh-stephead' },
      h('div', { className: 'lh-stephead-bar' },
        h(Button, { variant: 'quiet', icon: 'close', 'aria-label': props.closeLabel || L10n.t('close'), onClick: props.onClose }),
        h('div', { className: 'lh-progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': step, 'aria-label': L10n.t('stepOf', { step: step, total: total }) },
          h('span', { className: 'lh-progress-fill', style: { width: (step / total * 100) + '%' } })),
        h('span', { className: 'lh-stephead-count' }, step + '/' + total)),
      props.title ? h('h2', { className: 'lh-stephead-title' }, props.title) : null,
      props.subtitle ? h('p', { className: 'lh-stephead-sub' }, props.subtitle) : null);
  }

  /* ---------- Step (transition wrapper) ---------- */
  function Step(props) {
    return h('section', { key: props.stepKey, className: cx('lh-step', props.direction === 'back' ? 'lh-step-back' : 'lh-step-fwd') }, props.children);
  }

  /* ---------- ActionBar ---------- */
  function ActionBar(props) {
    var L10n = useLocale();
    return h('div', { className: cx('lh-actionbar', props.className) },
      props.secondary ? h(Button, { variant: 'quiet', size: 'lg', onClick: props.onSecondary }, props.secondary === true ? L10n.t('skip') : props.secondary) : null,
      h(Button, { variant: 'primary', size: 'lg', block: true, disabled: props.disabled, onClick: props.onPrimary }, props.primary || L10n.t('continue')));
  }

  /* ---------- Rating ---------- */
  function Rating(props) {
    var L10n = useLocale();
    var max = props.max || 5;
    var st = useMaybeControlled(props.value, props.defaultValue || 0, props.onChange);
    var items = [];
    for (var i = 1; i <= max; i++) {
      (function (n) {
        var on = n <= st[0];
        items.push(props.readOnly
          ? h('span', { key: n, className: cx('lh-rate-leaf', on && 'is-on') }, h(Icon, { name: 'leaf', size: props.size || 20, filled: on }))
          : h('button', { key: n, type: 'button', role: 'radio', 'aria-checked': n === st[0] ? 'true' : 'false', 'aria-label': L10n.t('ratingOf', { n: n, max: max }),
              className: cx('lh-rate-leaf', on && 'is-on'), onClick: function () { st[1](n === st[0] ? 0 : n); } },
              h(Icon, { name: 'leaf', size: props.size || 28, filled: on })));
      })(i);
    }
    return h('div', props.readOnly
      ? { className: 'lh-rating is-readonly', role: 'img', 'aria-label': L10n.t('rated', { n: st[0], max: max }) }
      : { className: 'lh-rating', role: 'radiogroup', 'aria-label': props.label || L10n.t('rating') }, items);
  }

  /* ---------- StrainBadge ---------- */
  var TYPES = { indica: 1, sativa: 1, hybrid: 1, cbd: 1 };
  function StrainBadge(props) {
    var L10n = useLocale();
    var t = TYPES[props.type] ? props.type : 'hybrid';
    return h('span', { className: cx('lh-badge', 'lh-badge-' + t) }, h('span', { className: 'lh-badge-dot', 'aria-hidden': 'true' }), props.children || L10n.t(t));
  }

  /* ---------- StrainAvatar ---------- */
  function initials(name) {
    var words = String(name || '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').split(/[\s-]+/).filter(Boolean);
    if (!words.length) return '?';
    var out = words.length === 1 ? Array.from(words[0]).slice(0, 2).join('') : Array.from(words[0])[0] + Array.from(words[1])[0];
    return out.toLocaleUpperCase();
  }
  var AVATAR_SIZES = { sm: 32, md: 48, lg: 72, xl: 112 };
  function StrainAvatar(props) {
    var L10n = useLocale();
    var t = TYPES[props.type] ? props.type : 'hybrid';
    var px = AVATAR_SIZES[props.size || 'md'] || props.size;
    var fileRef = React.useRef(null);
    var face = props.src
      ? h('img', { className: 'lh-avatar-img', src: props.src, alt: props.name || '', width: px, height: px, draggable: false })
      : h('span', { className: 'lh-avatar-initials', 'aria-hidden': props.name ? 'true' : undefined, style: { fontSize: Math.round(px * 0.38) + 'px' } }, initials(props.name));
    var label = props.src ? null : h('span', { className: 'lh-visually-hidden' }, props.name);
    var body = h('span', { className: cx('lh-avatar', 'lh-avatar-' + t, props.className), style: { width: px + 'px', height: px + 'px' } }, face, label);
    if (!props.editable) return body;
    return h('span', { className: 'lh-avatar-edit' },
      h('button', { type: 'button', className: 'lh-avatar-btn', onClick: function () { if (fileRef.current) fileRef.current.click(); },
        'aria-label': L10n.t(props.src ? 'changePhoto' : 'addPhoto') }, body,
        h('span', { className: 'lh-avatar-badge', 'aria-hidden': 'true' }, h(Icon, { name: 'camera', size: px >= 72 ? 18 : 14 }))),
      h('input', { ref: fileRef, type: 'file', accept: 'image/*', hidden: true,
        onChange: function (e) { var f = e.target.files && e.target.files[0]; if (f && props.onPick) props.onPick(f); e.target.value = ''; } }));
  }
  StrainAvatar.initials = initials;

  /* Resize to a square WebP on the device. Redrawing through a canvas drops EXIF, including GPS location. */
  function prepareStrainPhoto(file, size) {
    size = size || 512;
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var side = Math.min(img.naturalWidth, img.naturalHeight);
        var c = document.createElement('canvas'); c.width = c.height = Math.min(size, side);
        c.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('encode')); }, 'image/webp', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  /* ---------- StatTile ---------- */
  function Sparkline(p) {
    var pts = p.data || [];
    if (pts.length < 2) return null;
    var w = 120, ht = 36, pad = 3;
    var mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts);
    var span = mx - mn || 1;
    var xy = pts.map(function (v, i) { return [pad + i * (w - pad * 2) / (pts.length - 1), pad + (ht - pad * 2) * (1 - (v - mn) / span)]; });
    var line = xy.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('');
    var area = line + 'L' + xy[xy.length - 1][0].toFixed(1) + ' ' + ht + 'L' + xy[0][0].toFixed(1) + ' ' + ht + 'Z';
    var last = xy[xy.length - 1];
    return h('svg', { className: 'lh-spark', viewBox: '0 0 ' + w + ' ' + ht, width: w, height: ht, 'aria-hidden': 'true' },
      h('path', { className: 'lh-spark-area', d: area }), h('path', { className: 'lh-spark-line', d: line }),
      h('circle', { className: 'lh-spark-dot', cx: last[0], cy: last[1], r: 3 }));
  }
  function StatTile(props) {
    return h('div', { className: cx('lh-stat', props.tone && 'lh-tone-' + props.tone) },
      h('span', { className: 'lh-stat-label' }, props.label),
      h('span', { className: 'lh-stat-value' }, props.value, props.unit ? h('span', { className: 'lh-unit' }, ' ' + props.unit) : null),
      props.trend ? h(Sparkline, { data: props.trend }) : null,
      props.note ? h('span', { className: 'lh-stat-note' }, props.note) : null);
  }

  /* ---------- BreakProgress ---------- */
  function BreakProgress(props) {
    var L10n = useLocale();
    var total = props.total || 21, day = Math.min(props.day || 0, total);
    var r = 52, c = 2 * Math.PI * r, frac = day / total;
    var left = total - day;
    return h('div', { className: 'lh-break' },
      h('div', { className: 'lh-break-ring' },
        h('svg', { viewBox: '0 0 120 120', width: 120, height: 120, role: 'img', 'aria-label': day + ' / ' + total },
          h('circle', { className: 'lh-break-track', cx: 60, cy: 60, r: r }),
          h('circle', { className: 'lh-break-fill', cx: 60, cy: 60, r: r, strokeDasharray: c.toFixed(2), strokeDashoffset: (c * (1 - frac)).toFixed(2), transform: 'rotate(-90 60 60)' })),
        h('div', { className: 'lh-break-num', 'aria-hidden': 'true' }, h('span', null, day), h('small', null, L10n.t('ofTotal', { total: total })))),
      h('div', { className: 'lh-break-text' },
        h('span', { className: 'lh-overline' }, props.label || L10n.t('breakLabel')),
        h('strong', { className: 'lh-break-title' }, left > 0 ? L10n.t('daysToGo', { count: left }) : L10n.t('breakDone')),
        props.since ? h('span', { className: 'lh-break-meta' }, h(Icon, { name: 'calendar', size: 16 }), props.since) : null,
        props.action || null));
  }

  /* ---------- SessionCard ---------- */
  function SessionCard(props) {
    return h('article', { className: 'lh-card lh-session' },
      h('div', { className: 'lh-session-time' }, h('span', { className: 'lh-data' }, props.time), props.ago ? h('small', null, props.ago) : null),
      h('div', { className: 'lh-session-body' },
        h('div', { className: 'lh-row' }, h(StrainAvatar, { name: props.strain, type: props.type, src: props.photo, size: 'sm' }), h('h3', { className: 'lh-card-title' }, props.strain), props.type ? h(StrainBadge, { type: props.type }) : null),
        h('p', { className: 'lh-meta' }, [props.method, props.amount, props.setting].filter(Boolean).join(' · ')),
        props.effects && props.effects.length ? h('div', { className: 'lh-tags' }, props.effects.map(function (e) { return h('span', { key: e, className: 'lh-tag' }, e); })) : null,
        props.note ? h('p', { className: 'lh-note' }, props.note) : null,
        props.rating ? h(Rating, { value: props.rating, readOnly: true, size: 16 }) : null));
  }

  /* ---------- StrainCard ---------- */
  function StrainCard(props) {
    var L10n = useLocale();
    return h('article', { className: cx('lh-card', 'lh-strain', 'lh-leafcorner') },
      h('div', { className: 'lh-row lh-row-between' }, h(StrainBadge, { type: props.type }),
        props.inStash != null ? h('span', { className: 'lh-stash' }, h(Icon, { name: 'stash', size: 16 }), h('span', { className: 'lh-data' }, props.inStash)) : null),
      h('div', { className: 'lh-strain-head' }, h(StrainAvatar, { name: props.name, type: props.type, src: props.photo, size: 'lg' }),
        h('div', { className: 'lh-strain-title' }, h('h3', { className: 'lh-strain-name' }, props.name), props.breeder ? h('p', { className: 'lh-meta' }, props.breeder) : null)),
      h('dl', { className: 'lh-cannab' },
        props.thc != null ? h('div', null, h('dt', null, L10n.t('thc')), h('dd', { className: 'lh-data' }, L10n.pct(props.thc))) : null,
        props.cbd != null ? h('div', null, h('dt', null, L10n.t('cbd')), h('dd', { className: 'lh-data' }, L10n.pct(props.cbd))) : null,
        props.sessions != null ? h('div', null, h('dt', null, L10n.t('sessions')), h('dd', { className: 'lh-data' }, props.sessions)) : null),
      props.terpenes && props.terpenes.length ? h('div', { className: 'lh-tags' }, props.terpenes.map(function (t) { return h('span', { key: t, className: 'lh-tag' }, t); })) : null,
      props.rating ? h(Rating, { value: props.rating, readOnly: true, size: 16 }) : null);
  }

  /* ---------- Notice ---------- */
  var NOTICE_ICON = { private: 'lock', info: 'check', warn: 'alert', danger: 'alert', backup: 'cloud' };
  function Notice(props) {
    var tone = props.tone || 'private';
    return h('div', { className: cx('lh-notice', 'lh-notice-' + tone), role: tone === 'danger' ? 'alert' : 'status' },
      h(Icon, { name: props.icon || NOTICE_ICON[tone] || 'lock', size: 20 }),
      h('div', { className: 'lh-notice-body' }, props.title ? h('strong', null, props.title) : null, props.children ? h('p', null, props.children) : null),
      props.action || null);
  }

  /* ---------- TabBar ---------- */
  var DEFAULT_TABS = [
    { value: 'today', icon: 'home' },
    { value: 'log', icon: 'session' },
    { value: 'strains', icon: 'leaf' },
    { value: 'stats', icon: 'stats' },
    { value: 'break', icon: 'break' }
  ];
  function TabBar(props) {
    var L10n = useLocale();
    var items = props.items || DEFAULT_TABS;
    var st = useMaybeControlled(props.value, props.defaultValue || items[0].value, props.onChange);
    return h('nav', { className: 'lh-tabbar', 'aria-label': L10n.t('mainNav') },
      items.map(function (t) {
        var on = t.value === st[0];
        return h('button', { key: t.value, type: 'button', className: cx('lh-tab', on && 'is-on'), 'aria-current': on ? 'page' : undefined, onClick: function () { st[1](t.value); } },
          h('span', { className: 'lh-tab-pill' }, h(Icon, { name: t.icon, size: 22 })), h('span', { className: 'lh-tab-label' }, t.label || L10n.t(t.value)));
      }));
  }

  window.LightHead = Object.assign(window.LightHead || {}, {
    prepareStrainPhoto: prepareStrainPhoto, StrainAvatar: StrainAvatar,
    LocaleProvider: LocaleProvider, useLocale: useLocale, messages: MESSAGES, translate: translate, formatNumber: formatNumber, formatPercent: formatPercent,
    Icon: Icon, Button: Button, Chip: Chip, SegmentedControl: SegmentedControl, TextField: TextField,
    NumberField: NumberField, OptionGrid: OptionGrid, StepHeader: StepHeader, Step: Step, ActionBar: ActionBar, Rating: Rating, StrainBadge: StrainBadge, StatTile: StatTile,
    BreakProgress: BreakProgress, SessionCard: SessionCard, StrainCard: StrainCard, Notice: Notice, TabBar: TabBar
  });
})();
