/* Camada visual da Lumi: controles claros, animação local e sem coleta extra. */
(function () {
  const hero = document.querySelector('.hero');
  const oldForm = document.querySelector('#form');
  const chatbox = document.querySelector('.chatbox');
  if (!hero || !oldForm || !chatbox) return;

  const style = document.createElement('style');
  style.textContent = `
    .app{max-width:720px;padding:18px 14px 112px}
    .top{padding:2px 4px}.brand{font-size:18px}.brand .star{width:42px;height:42px}
    .hero{position:relative;overflow:hidden;text-align:left;padding:24px 22px 18px;background:linear-gradient(145deg,#241146ed,#121d3eed);border-color:#b38aff55}
    .hero:after{content:"";position:absolute;width:190px;height:190px;right:-62px;top:-82px;border-radius:50%;background:#8454ff24;filter:blur(8px);pointer-events:none}
    .welcome{position:relative;z-index:1;max-width:390px}.welcome small{display:block;margin-bottom:7px;color:#cbb4ff;font-weight:700;letter-spacing:.04em}.welcome h1{margin:0;font-size:clamp(26px,7vw,35px);letter-spacing:-.05em;line-height:1.02}.welcome h1 strong{color:#ae7aff}.welcome p{max-width:345px;margin:11px 0 0;color:#ded4f5;line-height:1.45}
    .lumi-dance{position:absolute;right:17px;bottom:14px;z-index:1;width:108px;height:118px;display:grid;place-items:center;filter:drop-shadow(0 9px 14px #06031188);animation:lumi-float 2.8s ease-in-out infinite}
    .lumi-head{position:absolute;top:9px;width:61px;height:61px;border-radius:46% 46% 43% 43%;background:radial-gradient(circle at 34% 27%,#fff 0 6%,#d7c5ff 7% 24%,#9c63ff 49%,#503181 78%);box-shadow:0 0 0 6px #c29dff25,0 0 28px #9f6dff99}
    .lumi-head:before,.lumi-head:after{content:"";position:absolute;top:27px;width:6px;height:8px;border-radius:50%;background:#261241}.lumi-head:before{left:18px}.lumi-head:after{right:18px}.lumi-mouth{position:absolute;top:41px;width:13px;height:6px;border-bottom:2px solid #41215f;border-radius:0 0 12px 12px}
    .lumi-body{position:absolute;top:67px;width:49px;height:43px;border-radius:25px 25px 15px 15px;background:linear-gradient(135deg,#a76dff,#4bbffa)}
    .lumi-arm{position:absolute;top:72px;width:34px;height:10px;border-radius:12px;background:#b982ff;transform-origin:5px 50%;animation:lumi-wave .65s ease-in-out infinite alternate}.lumi-arm.left{left:4px;transform:rotate(142deg)}.lumi-arm.right{right:4px;transform-origin:29px 50%;transform:rotate(38deg);animation-delay:-.4s}
    .lumi-leg{position:absolute;top:103px;width:10px;height:18px;border-radius:9px;background:#6945ad;animation:lumi-step .48s ease-in-out infinite alternate}.lumi-leg.left{left:42px}.lumi-leg.right{right:42px;animation-delay:-.3s}
    @keyframes lumi-float{50%{transform:translateY(-6px) rotate(2deg)}}@keyframes lumi-wave{to{transform:rotate(76deg)}}@keyframes lumi-step{to{transform:translateY(5px) rotate(16deg)}}
    .quick{position:relative;z-index:2;justify-content:flex-start;margin:20px 0 0;padding-right:88px}.quick button{border:1px solid #bd9bff88;background:#281449cc;transition:.2s transform,.2s background}.quick button:active{transform:scale(.96)}.quick button:nth-child(1){background:linear-gradient(135deg,#8550f6,#5d3ea6)}
    .control-note{font-size:12px;color:#cfc3e6;margin:16px 3px 8px}.control-note b{color:#fff}
    .form.lumi-composer{position:fixed;z-index:10;bottom:12px;left:50%;transform:translateX(-50%);width:min(692px,calc(100% - 22px));display:grid;grid-template-columns:48px 48px 1fr 52px;gap:6px;align-items:center;padding:7px;border:1px solid #aa7dff;border-radius:23px;background:#fdfbff;box-shadow:0 14px 38px #05000e88}.lumi-composer input[type=text]{min-width:0;border:0;outline:0;background:transparent;color:#171123;padding:11px 4px;font-size:15px}.lumi-control,.lumi-send{height:42px;border:0;border-radius:17px;display:grid;place-items:center;cursor:pointer;font-weight:800}.lumi-control{background:#f1ebfa;color:#39265d;font-size:19px}.lumi-control:hover{background:#e5d9fa}.lumi-send{background:#211334;color:#fff;font-size:18px}.lumi-send:hover{background:#6e43be}.lumi-file{position:relative;overflow:hidden}.lumi-file input{position:absolute;inset:0;opacity:0;cursor:pointer}.lumi-file:focus-within{outline:2px solid #8a57e8}.lumi-photo-preview{display:flex;align-items:center;gap:10px}.lumi-photo-preview img{width:66px;height:66px;object-fit:cover;border-radius:13px;border:1px solid #ffffff4d}.lumi-photo-preview span{font-size:13px}.readmsg{cursor:pointer}.readmsg:focus,.lumi-control:focus,.lumi-send:focus{outline:2px solid #70d7ff;outline-offset:2px}
    @media(max-width:430px){.hero{min-height:250px}.welcome{max-width:245px}.welcome p{font-size:14px}.lumi-dance{right:-1px;bottom:12px;transform:scale(.86)}.quick{padding-right:50px}.quick button{font-size:12px}.form.lumi-composer{bottom:8px}.control-note{margin-top:13px}}
    @media(prefers-reduced-motion:reduce){.lumi-dance,.lumi-arm,.lumi-leg{animation:none}}
  `;
  document.head.append(style);

  hero.innerHTML = `
    <div class="welcome">
      <small>BEM-VINDO À LUMI</small>
      <h1>Oi, Pessoal,<br><strong>o que precisa</strong><br>ser resolvido?</h1>
      <p>Eu converso, explico e ajudo a transformar suas ideias em projetos.</p>
    </div>
    <div class="lumi-dance" aria-label="Lumi dançando" role="img">
      <div class="lumi-head"></div><div class="lumi-mouth"></div><div class="lumi-body"></div>
      <div class="lumi-arm left"></div><div class="lumi-arm right"></div>
      <div class="lumi-leg left"></div><div class="lumi-leg right"></div>
    </div>
    <div class="quick" aria-label="Começar uma conversa">
      <button type="button" data-q="Quero conversar">Conversar</button>
      <button type="button" data-q="Quero criar uma ideia">Criar algo</button>
      <button type="button" data-q="Me explique de um jeito simples">Me explicar</button>
    </div>`;

  const note = document.createElement('p');
  note.className = 'control-note';
  note.innerHTML = '<b>Foto</b> para selecionar uma imagem, <b>microfone</b> para falar e <b>áudio</b> em cada resposta da Lumi.';
  chatbox.before(note);

  const form = document.createElement('form');
  form.id = 'form';
  form.className = 'form lumi-composer';
  form.innerHTML = `
    <label class="lumi-control lumi-file" title="Escolher foto" aria-label="Escolher foto">
      <input id="photo" type="file" accept="image/*" aria-label="Escolher foto">▣
    </label>
    <button id="mic" class="lumi-control" type="button" title="Falar com a Lumi" aria-label="Falar com a Lumi">◉</button>
    <input id="input" type="text" autocomplete="off" placeholder="Converse com a Lumi" aria-label="Mensagem para Lumi">
    <button class="lumi-send" type="submit" title="Enviar mensagem" aria-label="Enviar mensagem">➜</button>`;
  oldForm.replaceWith(form);

  const previousSend = window.send;
  window.send = async function (text) {
    if (!String(text || '').trim() || !previousSend) return;
    await previousSend(text);
    form.querySelector('#input').value = '';
  };
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const box = form.querySelector('#input');
    window.send(box.value);
  });
  hero.querySelectorAll('[data-q]').forEach(function (button) {
    button.addEventListener('click', function () { if (window.send) window.send(button.dataset.q); });
  });

  const freshMic = form.querySelector('#mic');
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  freshMic.onclick = function () {
    if (!Recognition) { if (window.add) window.add('Seu navegador não liberou o microfone. Você pode escrever normalmente.'); return; }
    const recognition = new Recognition();
    recognition.lang = 'pt-BR'; recognition.interimResults = true;
    const thinking = document.querySelector('#thinking');
    thinking.classList.add('on', 'listening');
    thinking.querySelector('span').textContent = 'Lumi está ouvindo';
    recognition.onresult = function (event) {
      let words = ''; for (const result of event.results) words += result[0].transcript;
      form.querySelector('#input').value = words;
    };
    recognition.onend = function () { thinking.classList.remove('on', 'listening'); thinking.querySelector('span').textContent = 'Lumi está digitando'; };
    recognition.onerror = function () { thinking.classList.remove('on', 'listening'); thinking.querySelector('span').textContent = 'Lumi está digitando'; if (window.add) window.add('Não consegui ouvir agora. Veja se o microfone foi liberado e tente de novo.'); };
    recognition.start();
  };

  form.querySelector('#photo').onchange = function () {
    const file = this.files && this.files[0];
    if (!file) return;
    const item = document.createElement('div'); item.className = 'msg u lumi-photo-preview';
    const image = document.createElement('img'); image.src = URL.createObjectURL(file); image.alt = 'Foto selecionada';
    const text = document.createElement('span'); text.textContent = 'Foto selecionada. Diga o que você quer criar ou observar nela.';
    item.append(image, text); document.querySelector('#chat').append(item); window.scrollTo(0, document.body.scrollHeight);
  };
})();
