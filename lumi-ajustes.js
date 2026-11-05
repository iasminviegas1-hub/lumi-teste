/* Ajustes, voz e proteção contextual da Lumi. Dados ficam neste navegador. */
(function () {
  const KEY = 'lumi_ajustes_1';
  const SESSION_NAME = 'lumi_nome_sessao';
  const defaults = { name: '', voice: '', rate: 1, autoSpeak: false, animate: true };
  const load = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_) { return { ...defaults }; } };
  const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));
  let settings = load();

  const style = document.createElement('style');
  style.textContent = `
    .settings-button{margin-right:7px;cursor:pointer}.lumi-settings{display:none;margin-top:12px;padding:16px;background:#1c0d33eF;border:1px solid #b99aff66;border-radius:20px}.lumi-settings.on{display:block}.lumi-settings h2{margin:0 0 6px;font-size:18px}.lumi-settings p{margin:0 0 13px;color:#dacfee;font-size:13px;line-height:1.4}.lumi-setting{display:grid;gap:6px;margin:12px 0}.lumi-setting label{font-size:13px;font-weight:700;color:#f5f0ff}.lumi-setting input,.lumi-setting select{width:100%;padding:11px;border-radius:12px;border:1px solid #a887e066;background:#291643;color:#fff;font-size:15px}.lumi-setting input::placeholder{color:#cbbce1}.lumi-settings .setting-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 0;border-top:1px solid #ffffff18}.lumi-settings .setting-row span{font-size:14px}.lumi-settings input[type=checkbox]{accent-color:#a46cff;width:20px;height:20px}.lumi-settings .save-settings{border:0;border-radius:12px;padding:11px 14px;background:linear-gradient(135deg,#9564f8,#51bdf8);color:#fff;font-weight:800;cursor:pointer}.lumi-dance.lumi-speaking .lumi-head{animation:lumi-talk .22s ease-in-out infinite alternate}.lumi-dance.lumi-speaking .lumi-mouth{height:9px;border-radius:0 0 10px 10px;background:#41215f;border:0}.lumi-dance.paused,.lumi-dance.paused *{animation-play-state:paused!important}@keyframes lumi-talk{to{transform:translateY(-2px) rotate(2deg) scale(1.025)}}
  `;
  document.head.append(style);

  const top = document.querySelector('.top > div:last-child');
  const history = document.querySelector('#history');
  if (top && history) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'headbutton settings-button'; button.id = 'settings'; button.textContent = 'Configurações';
    top.insertBefore(button, history);
  }

  const chatbox = document.querySelector('.chatbox');
  const panel = document.createElement('section');
  panel.id = 'settingsPanel'; panel.className = 'lumi-settings';
  panel.innerHTML = `
    <h2>Configurações da Lumi</h2>
    <p>Você controla como ela fala e aparece. Seu nome só fica salvo neste navegador se você escolher salvar.</p>
    <div class="lumi-setting"><label for="lumiName">Como a Lumi deve te chamar</label><input id="lumiName" maxlength="40" placeholder="Digite seu nome"></div>
    <div class="lumi-setting"><label for="lumiVoice">Voz da Lumi</label><select id="lumiVoice"><option value="">Voz padrão do aparelho</option></select></div>
    <div class="lumi-setting"><label for="lumiRate">Velocidade da voz</label><select id="lumiRate"><option value="0.82">Mais calma</option><option value="1">Normal</option><option value="1.14">Mais rápida</option></select></div>
    <div class="setting-row"><span>Ler as respostas automaticamente</span><input id="lumiAutoSpeak" type="checkbox"></div>
    <div class="setting-row"><span>Cabecinha e corpo em movimento</span><input id="lumiAnimate" type="checkbox"></div>
    <button class="save-settings" type="button" id="saveSettings">Salvar configurações</button>
  `;
  chatbox.after(panel);

  const nameOf = () => sessionStorage.getItem(SESSION_NAME) || load().name || '';
  function applyMotion() {
    document.querySelectorAll('.lumi-dance').forEach(el => el.classList.toggle('paused', !settings.animate));
  }
  function fillVoices() {
    const select = document.querySelector('#lumiVoice');
    if (!select || !window.speechSynthesis) return;
    const all = speechSynthesis.getVoices().filter(v => /^pt([_-]|$)/i.test(v.lang));
    const voices = all.length ? all : speechSynthesis.getVoices();
    const old = settings.voice;
    select.innerHTML = '<option value="">Voz padrão do aparelho</option>';
    voices.forEach((voice, i) => {
      const option = document.createElement('option'); option.value = voice.name;
      const likelyWoman = /(female|femin|maria|luciana|francisca|helena|joana|ana|camila|lucy|samantha|victoria)/i.test(voice.name);
      const likelyMan = /(male|mascul|ricardo|daniel|felipe|antonio|jorge|joao|carlos|google brasil)/i.test(voice.name);
      option.textContent = (likelyWoman ? 'Voz de mulher · ' : likelyMan ? 'Voz de homem · ' : 'Voz disponível · ') + voice.name;
      if (voice.name === old) option.selected = true;
      select.append(option);
    });
  }
  if (window.speechSynthesis) { fillVoices(); speechSynthesis.onvoiceschanged = fillVoices; }
  document.querySelector('#lumiName').value = settings.name || '';
  document.querySelector('#lumiRate').value = String(settings.rate);
  document.querySelector('#lumiAutoSpeak').checked = !!settings.autoSpeak;
  document.querySelector('#lumiAnimate').checked = settings.animate !== false;
  applyMotion();

  document.querySelector('#settings').onclick = () => panel.classList.toggle('on');
  document.querySelector('#saveSettings').onclick = () => {
    settings = {
      name: document.querySelector('#lumiName').value.trim(),
      voice: document.querySelector('#lumiVoice').value,
      rate: Number(document.querySelector('#lumiRate').value),
      autoSpeak: document.querySelector('#lumiAutoSpeak').checked,
      animate: document.querySelector('#lumiAnimate').checked
    };
    save(settings); if (settings.name) sessionStorage.setItem(SESSION_NAME, settings.name); else sessionStorage.removeItem(SESSION_NAME);
    applyMotion(); panel.classList.remove('on');
    if (window.add) window.add(settings.name ? `Pronto, ${settings.name}. Suas configurações foram salvas neste navegador.` : 'Pronto. Suas configurações foram salvas neste navegador.');
  };

  const previousSpeak = window.speak;
  window.speak = function (text) {
    if (!('speechSynthesis' in window)) { if (window.add) window.add('Seu navegador não tem leitura em voz. Você pode continuar escrevendo ou usando o microfone.'); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR'; utterance.rate = Number(load().rate) || 1;
    const selected = load().voice;
    const voice = speechSynthesis.getVoices().find(v => v.name === selected);
    if (voice) utterance.voice = voice;
    const avatar = document.querySelector('.lumi-dance');
    utterance.onstart = () => avatar && avatar.classList.add('lumi-speaking');
    utterance.onend = utterance.onerror = () => avatar && avatar.classList.remove('lumi-speaking');
    speechSynthesis.speak(utterance);
  };

  const priorAdd = window.add;
  window.add = function (text, kind = 'l', keep = true) {
    priorAdd(text, kind, keep);
    if (kind === 'l' && load().autoSpeak) window.speak(text);
  };

  function normalized(text) { return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function childSafetyAlert(text) {
    const t = normalized(text);
    const child = /(crianca|menor|adolescente|bebe|bebê|filho|filha|menino|menina)/.test(t);
    if (!child) return null;
    const immediate = /(agora|neste momento|acabou de|ta apanhando|esta apanhando|machuquei|machucou|feri|sangrando|perigo)/.test(t);
    const sexual = /(sexo|nude|pelad|toque intime|foto intima|pornografia|abuso|explora|alici)/.test(t);
    const violence = /(bati|bateu|gritei|ameac|castigo fisico|deixei sozinho|trancad|humilh)/.test(t);
    if (!(sexual || violence || immediate)) return null;
    if (immediate) return 'Alerta de proteção: se uma criança está em perigo ou machucada agora, pare a situação, procure um adulto responsável seguro e ligue 190 ou 192. Para denúncia e orientação sobre violência contra crianças e adolescentes no Brasil, Disque 100. Não vou tratar isso como algo normal.';
    if (sexual) return 'Alerta de proteção: qualquer conversa, imagem, toque ou pedido sexual envolvendo criança ou adolescente é grave e não é seguro. Não compartilhe nem peça nada assim. Proteja a criança, fale com um adulto responsável seguro e procure ajuda pelo Disque 100 ou 190 se houver risco.';
    return 'Alerta de proteção: gritar, bater, ameaçar, humilhar, trancar ou deixar uma criança sozinha pode machucar e não é uma forma segura de resolver. Pare, veja se a criança está bem e chame um adulto responsável de confiança para ajudar. Em risco, ligue 190; para orientação e denúncia, Disque 100.';
  }

  const previousAnswer = window.answer;
  window.answer = function (question) {
    const raw = String(question || ''); const t = normalized(raw);
    const intro = raw.match(/\b(?:meu nome e|me chamo|eu sou o|eu sou a)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]{1,38})/i);
    if (intro) {
      const firstName = intro[1].trim().replace(/\s+(e|eu|pra|para|e gosto).*$/i, '');
      sessionStorage.setItem(SESSION_NAME, firstName);
      return `Prazer, ${firstName}. Vou te chamar assim nesta conversa. Se quiser que eu lembre neste aparelho, você pode salvar seu nome em Configurações.`;
    }
    const warning = childSafetyAlert(raw);
    if (warning) return warning;
    if (/^(oi|ola|opa|e ai|e ai lumi|tudo bem)[!?. ]*$/i.test(t) && nameOf()) return `Oi, ${nameOf()}! O que você precisa hoje?`;
    if (/(qual.*meu nome|voce lembra.*meu nome|sabe.*meu nome)/.test(t)) return nameOf() ? `Você me disse que prefere ser chamado de ${nameOf()}.` : 'Ainda não sei seu nome. Você pode me dizer e eu uso nesta conversa, ou salvar nas Configurações.';
    return previousAnswer(raw);
  };
})();
