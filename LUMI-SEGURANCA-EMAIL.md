# Lumi: bloqueio central de 90 dias por e-mail

Esta versão tira a decisão de segurança do navegador. O bloqueio fica no servidor por 90 dias completos e acompanha o **e-mail confirmado**, mesmo que a pessoa troque de celular, navegador ou apague dados locais.

## O que ela faz

- Envia um código de 6 números para confirmar o e-mail.
- Permite no máximo uma solicitação de código por minuto.
- Bloqueia tentativas de código depois de 5 erros.
- Cria sessões de 30 dias depois da confirmação.
- Registra bloqueios graves no banco central por 90 dias.
- Ao voltar com o mesmo e-mail em outro aparelho, consulta o mesmo bloqueio.
- Não guarda o e-mail em texto no banco de segurança: usa uma impressão criptográfica (hash).

## Configuração necessária no Cloudflare Workers

1. Publique `lumi-brain-worker.js` como Worker.
2. Crie um KV Namespace e conecte-o ao Worker com o nome **LUMI_SECURITY**.
3. Adicione os segredos: **RESEND_API_KEY** e **LUMI_AI_API_KEY**.
4. Adicione as variáveis: **LUMI_EMAIL_FROM** (um endereço verificado no Resend), **LUMI_ALLOWED_ORIGIN** (o endereço público da Lumi) e, se necessário, **LUMI_AI_URL** e **LUMI_AI_MODEL**.
5. Faça o site chamar: `POST /auth/request-code`, `POST /auth/verify-code` e `POST /chat` com o token retornado no cabeçalho `Authorization: Bearer TOKEN`.

## Limite honesto

Ninguém consegue impedir com certeza absoluta que alguém use um e-mail novo. Para barrar isso também, seria necessária validação de identidade, que é muito mais invasiva. Com e-mail confirmado e bloqueio no servidor, porém, trocar apenas de telefone ou limpar o navegador não libera o acesso.

## Importante

O chat público não deve continuar respondendo por código local depois desta integração. Todas as mensagens precisam passar por `/chat`; é isso que torna os 90 dias reais.
