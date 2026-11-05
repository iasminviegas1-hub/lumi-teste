/* Conversa natural da Lumi: mantém o mesmo visual e link. */
(function(){
  const oldAnswer=answer;
  const KEY="lumi_contexto_conversa";
  function ctx(){try{return JSON.parse(sessionStorage.getItem(KEY)||"{}")}catch(e){return {}}}
  function save(v){sessionStorage.setItem(KEY,JSON.stringify(v))}
  function topic(name){const v=ctx();v.topic=name;save(v)}
  function rotate(list,key){const v=ctx(),n=(v[key]||0)+1;v[key]=n;save(v);return list[n%list.length]}
  function history(){return get(HK).filter(x=>x.k==="u")}
  function greeting(q){
    if(!/^(oi|ola|olá|opa|e ai|e aí|tudo bem|td bem)[!. ]*$/i.test(q))return null;
    topic("conversa");
    return rotate(["Oi! Tudo bem? Como posso ajudar você?","Opa! Como posso ajudar hoje?","Oi! Quer conversar, aprender algo ou criar uma ideia?"],"hello");
  }
  function direct(q){
    const c=ctx(), h=history(), last=h.length>1?h[h.length-2].t:"";
    if(/^(sim|isso|entendi|ta|tá|ok|beleza|pode ser)[!. ]*$/i.test(q)&&c.topic) return "Certo. Sobre "+c.topic+", qual parte você quer resolver agora?";
    if(/^(nao|não)[!. ]*$/i.test(q)&&c.topic) return "Tudo bem. O que você prefere fazer em vez disso?";
    if(/como|onde|quando|quanto|porque|por que|qual|quem/i.test(q)) return "Qual assunto você quer saber? Me diga o tema e eu respondo direto.";
    if(last) return "Você quer continuar falando de "+last.slice(0,70)+" ou começar outro assunto?";
    return "Você quer ajuda para conversar, aprender, criar um site ou usar uma foto?";
  }
  window.answer=function(q){
    const t=norm(q);
    const hello=greeting(q); if(hello)return hello;
    if(/quem e voce|seu nome|o que voce faz|o que tu faz|suas regras|regras/.test(t)){topic("conhecer a Lumi");return rotate(["Eu sou a Lumi. Posso conversar, explicar assuntos, ajudar a criar projetos e usar fotos como referência. Também protejo dados pessoais.","Sou a Lumi. Posso ajudar você a aprender, organizar uma ideia ou começar um site. Tenho regras para manter a conversa segura."],"about")}
    if(/site|app|projeto|criar/.test(t)){topic("criar um projeto");return rotate(["Qual é o nome do projeto e o que ele precisa fazer?","Você quer criar um site ou aplicativo? Me diga para quem é.","Qual problema o projeto resolve? Aí eu monto o começo com você."],"project")}
    if(/foto|imagem/.test(t)){topic("imagem");return rotate(["Pode enviar a foto. O que você quer que eu observe nela?","Envie a imagem e diga se você quer analisar ou criar um visual com ela."],"photo")}
    if(/triste|medo|ansioso|conselho|sozinh/.test(t)){topic("conversa e conselho");return rotate(["Pode me contar o que aconteceu. Vou ouvir sem julgar.","O que está deixando você assim? Pode falar do seu jeito."],"care")}
    if(/entender|explique|como funciona/.test(t)){topic("explicação");return "O que você quer que eu explique: uma palavra, uma conta ou uma situação?"}
    const known=oldAnswer(q);
    if(known!=="Entendi. Me explica um pouquinho mais, do seu jeito?")return known;
    return direct(q);
  };
  window.send=async function(q){
    if(!q.trim())return;
    add(q,"u"); input.value="";
    thinking.classList.add("on");
    thinking.querySelector("span").textContent="Lumi está pensando e digitando";
    await new Promise(r=>setTimeout(r,Math.min(1500,700+q.length*15)));
    thinking.classList.remove("on");
    thinking.querySelector("span").textContent="Lumi está digitando";
    const r=answer(q); if(r==="MEM")consent(); else add(r);
  };
  form.onsubmit=e=>{e.preventDefault();window.send(input.value)};
  document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>window.send(b.dataset.q));
})();
