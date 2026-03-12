# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Corrigido

- Lançamentos: o schema compartilhado de observação voltou a aceitar `null`, corrigindo o erro `Invalid input: expected string, received null` ao salvar novos lançamentos sem anotação.
- Cartões/Faturas: o pagamento da fatura passou a usar o valor líquido do período no cartão, evitando que o extrato da conta registre o total bruto das despesas quando houver receitas como estornos ou créditos na mesma fatura.

### Alterado

- Queries e organização de domínios: o dashboard passou a nomear queries de leitura com sufixo `-queries.ts` e `preferences-queries.ts`, relatórios adotaram nomes explícitos como `cards-report-queries.ts`, `category-report-queries.ts`, `category-chart-queries.ts` e `establishments/queries.ts`, `insights/queries.ts` foi renomeado para `constants.ts` e as leituras reutilizáveis de lançamentos foram concentradas em `transactions/queries.ts`, deixando `page-helpers.ts` focado em parsing, filtros e transformação.

## [2.0.0] - 2026-03-09

### Alterado

- Hooks e memoização: removidos `useCallback`/`useMemo` preventivos em páginas de listagem, navegação, formulários de ajustes, calendário e controllers da dashboard; também foi corrigido o uso indevido de `setState` dentro de `useMemo` no relatório por categoria.
- Pagadores: a tela de detalhe agora mantém o card principal do pagador visível durante a navegação entre abas, sem repetir o bloco completo dentro de cada seção.
- Pagadores: detalhes sensíveis como envio automático, último envio e observações agora ficam ocultos quando o acesso ao pagador é somente leitura.
- Pagadores: o e-mail do pagador agora aparece apenas no cabeçalho fixo, evitando repetição dentro do card de detalhes.
- Relatório de tendências: a tabela e os cards mobile agora exibem a média mensal do período filtrado ao lado do total, com destaque visual em azul; a coluna de categoria também ficou mais compacta com truncamento para nomes longos.
- Dashboard: o welcome banner deixou de ser um bloco colorido para virar apenas texto destacado.
- Tema global: removidos do `globals.css` os tokens legados de `welcome-banner`, que não eram mais usados após a simplificação do dashboard.
- UI base: o `Card` compartilhado agora mantém a borda neutra no estado padrão e aplica um gradiente entre `border` e `primary` no hover.
- Assets: imagens que estavam soltas na raiz de `public/` foram movidas para `public/imagens/`, com atualização dos caminhos usados por landing page, logos, exports e manifesto do app.
- Dashboard: `section-cards` foi renomeado para `dashboard-metrics-cards`, deixando mais claro que o componente representa os cards de métricas no topo da dashboard.
- Dashboard: nomes em `lib/dashboard` foram padronizados por responsabilidade, com domínio `bills` em inglês no código, helpers mais explícitos e remoção do `common.ts` genérico.
- Widgets: `widget-card` foi separado entre um card base e uma versão expansível, isolando a lógica de overflow sem alterar o visual atual dos widgets.
- Dashboard: `invoices-widget` foi dividido em componentes locais (`invoices/`) e teve helpers/controle movidos para `lib/dashboard`, deixando o arquivo principal focado na composição visual.
- Dashboard: `boletos-widget` foi renomeado para `bill-widget`, ganhou componentes locais em `bills/` e teve o estado/formatadores extraídos para `lib/dashboard`.
- Dashboard: `payment-status-widget` teve os componentes visuais internos separados em uma pasta local, deixando o arquivo principal só como ponto de composição.
- Dashboard: `notes-widget` teve lista, item e composição dos dialogs separados em `notes/`, com helpers/controller extraídos para `lib/dashboard` para manter responsabilidades mais claras.
- Dashboard: `goals-progress-widget` agora separa lista, item e diálogo em `goals-progress/`, com helpers/controller extraídos para `lib/dashboard` para manter o componente principal focado em composição.
- Dashboard: `payment-overview-widget` passou a separar o shell de abas da regra de estado, isolando a composição dos widgets de condições e formas de pagamento.
- Dashboard: `payment-conditions-widget` e `payment-methods-widget` passaram a usar uma base visual compartilhada para listas de distribuição, reduzindo duplicação e deixando cada widget responsável só por mapear seus dados.
- Dashboard: os componentes internos de comportamento de pagamento foram reunidos em `payment-overview/`, deixando apenas o widget pai na raiz de `components/dashboard`.
- Dashboard: `installment-expenses-widget` teve item/lista/view separados em `installment-expenses/`, com cálculos auxiliares movidos para `lib/dashboard` para deixar o componente principal focado na composição.
- Datas: helpers de `YYYY-MM-DD`, labels de vencimento/pagamento e o relógio de negócio foram centralizados em `lib/utils/date.ts`, com adoção inicial em dashboard, pagadores, calendário, exports e actions de pagamento para reduzir drift de timezone.
- Dashboard: `bill-widget` e `invoices-widget` agora compartilham um hook base de confirmação de pagamento em `lib/dashboard`, mantendo os wrappers específicos só com as regras de cada domínio.
- Dashboard: os widgets de receita e despesa por categoria passaram a compartilhar uma view de breakdown no client e um builder de agregação no server, preservando queries separadas para não misturar regras financeiras específicas.
- Dashboard: filtros repetidos de `lancamentos` passaram a usar helpers compartilhados em `lib/dashboard/lancamento-filters.ts`, reduzindo duplicação nas queries centrais de métricas, categorias, pagamentos, compras e estabelecimentos.
- Lançamentos: a tabela deixou de quebrar ao formatar datas inválidas ou serializadas como ISO completo, normalizando `purchaseDate` para `YYYY-MM-DD` e adicionando fallback seguro no `formatDate`.
- Períodos: `lib/utils/period` passou a concentrar conversões `Date <-> YYYY-MM` e labels reutilizáveis, com adoção inicial em pickers, calendário e filtros de relatórios.
- Períodos: a adoção dos helpers centrais avançou para histórico de categorias, relatórios de cartões, exportações, insights, actions e cálculos de parcelas, reduzindo parse manual de `YYYY-MM` em regras de domínio.
- Dashboard e faturas: labels financeiros de vencimento/pagamento agora compartilham uma base em `lib/utils/financial-dates.ts`, reduzindo duplicação entre `bills` e `invoices`.
- Formatadores: porcentagens passaram a usar um util compartilhado em `lib/utils/percentage.ts`, com adoção inicial em breakdowns, metas, relatórios e cabeçalhos de categoria.
- Formatadores: moeda passou a ter base compartilhada em `lib/utils/currency.ts`, com adoção inicial em componentes compartilhados, notificações e cards de relatórios.
- Formatadores: a adoção do util de moeda avançou em resumo de fatura, extrato de conta, diálogo de orçamento, cabeçalho de pagador e histórico de categorias.
- Datas e labels: `formatDateTime` foi adicionado em `lib/utils/date.ts`, com adoção em pagadores, notificações relacionadas e no modal de calendário para reduzir repetição de `toLocaleString`/`toLocaleDateString`.
- Logos e cartões: resolução de logos e brand assets foi consolidada em `lib/logo/index.ts` e `lib/cartoes/brand-assets.ts`, com adoção principal em cartões, contas, notificações, inbox, relatórios e seletores.
- Notas: helpers transversais saíram de `lib/dashboard` e foram separados entre `lib/notes/formatters.ts` e `lib/dashboard/notes-mappers.ts`, deixando o dashboard responsável apenas pela adaptação dos dados do widget.
- Documentação: o relatório de duplicações de datas e utils agora inclui um checklist executivo com itens feitos, pendentes e o que não vale abstrair agora.

### Corrigido

- Hooks e sincronização: o provider de privacidade voltou a reagir corretamente às mudanças do modo privado, e o resumo de fatura agora reseta a data de pagamento quando a prop inicial deixa de existir.
- Compatibilidade da refatoração de hooks e relatórios: `useMobile`/`useIsMobile` voltaram a ter exports compatíveis, o shim de `components/ui/use-mobile.ts` foi restaurado para o sidebar e `lib/relatorios/types.ts` voltou a reexportar os tipos usados pelos fetchers legados.
- Widgets expansíveis: o shell compartilhado voltou a aplicar `relative` e `overflow-hidden`, mantendo o gradiente e o botão "Ver tudo" presos ao card.
- Dashboard: o widget "Lançamentos por categoria" deixou de ler a categoria salva no `sessionStorage` durante a renderização inicial, evitando mismatch de hidratação entre servidor e cliente.

### Removido

- Dashboard/Ajustes: toda a implementação legada de `magnet-lines` foi removida, incluindo componente órfão, preferência de usuário e a coluna `disable_magnetlines` do schema com migration dedicada.

## [1.7.7] - 2026-03-05

### Alterado

- Períodos e navegação mensal: `useMonthPeriod` passou a usar os helpers centrais de período (`YYYY-MM`), o month-picker foi simplificado e o rótulo visual agora segue o formato `Março 2026`.
- Hooks e organização: hooks locais de calculadora, month-picker, logo picker e sidebar foram movidos para perto das respectivas features, deixando `/hooks` focado nos hooks realmente compartilhados.
- Estado de formulários e responsividade: `useFormState` ganhou APIs explícitas de reset/substituição no lugar do setter cru, e `useIsMobile` foi atualizado para assinatura estável com `useSyncExternalStore`, reduzindo a troca estrutural inicial no sidebar entre mobile e desktop.
- Navegação e estrutura compartilhada: `components/navbar` e `components/sidebar` foram consolidados em `components/navigation/*`, componentes globais migraram para `components/shared/*` e os imports foram padronizados no projeto.
- Dashboard e relatórios: a análise de parcelas foi movida para `/relatorios/analise-parcelas`, ações rápidas e widgets do dashboard foram refinados, e os cards de relatórios ganharam ajustes para evitar overflow no mobile.
- Pré-lançamentos e lançamentos: tabs e cards da inbox ficaram mais consistentes no mobile, itens descartados podem voltar para `Pendente` e compras feitas no dia do fechamento do cartão agora entram na próxima fatura.
- Tipografia e exportações: suporte a `SF Pro` foi removido, a validação de fontes ficou centralizada em `public/fonts/font_index.ts` e as exportações em PDF/CSV/Excel receberam melhor branding e apresentação.
- Calculadora e diálogos: o arraste ficou mais estável, os bloqueios de fechamento externo foram reforçados e o display interno foi reorganizado para uso mais consistente.
- Também houve ajustes menores de responsividade, espaçamento e acabamento visual em telas mobile, modais e detalhes de interface.

## [1.7.6] - 2026-03-02

### Adicionado

- Suporte completo a Passkeys (WebAuthn) com plugin `@better-auth/passkey` no servidor e `passkeyClient` no cliente de autenticação
- Tabela `passkey` no banco de dados para persistência de credenciais WebAuthn vinculadas ao usuário
- Nova aba **Passkeys** em `/ajustes` com gerenciamento de credenciais: listar, adicionar, renomear e remover passkeys
- Ação de login com passkey na tela de autenticação (`/login`)
- Dashboard: botões rápidos na toolbar de widgets para `Nova receita`, `Nova despesa` e `Nova anotação` com abertura direta dos diálogos correspondentes
- Widget de **Anotações** no dashboard com listagem das anotações ativas, ações discretas de editar e ver detalhes, e atalho para `/anotacoes`

### Alterado

- `PasskeysForm` refatorado para melhor experiência com React 19/Next 16: detecção de suporte do navegador, bloqueio de ações simultâneas e atualização da lista sem loader global após operações
- Widget de pagadores no dashboard agora exibe variação percentual em relação ao mês anterior (seta + cor semântica), seguindo o padrão visual dos widgets de categorias
- Dashboard: widgets `Condições de Pagamentos` + `Formas de Pagamento` unificados em um único widget com abas; `Top Estabelecimentos` + `Maiores Gastos do Mês` também unificados em widget com abas
- Relatórios: rota de Top Estabelecimentos consolidada em `/relatorios/estabelecimentos`
- Dashboard: widget `Lançamentos recentes` removido e substituído por `Progresso de metas` com lista de orçamentos do período (gasto, limite configurado e percentual de uso por categoria)
- Dashboard: `fetchDashboardData` deixou de carregar `notificationsSnapshot` (notificações continuam sendo carregadas no layout), reduzindo uma query no carregamento da página inicial

### Corrigido

- Login com passkey na tela de autenticação agora fica disponível em navegadores com WebAuthn, mesmo sem suporte a Conditional UI
- Listagem de passkeys em Ajustes agora trata `createdAt` ausente sem gerar data inválida na interface
- Migração `0017_previous_warstar` tornou-se idempotente para colunas de `preferencias_usuario` com `IF NOT EXISTS`, evitando falha em bancos já migrados

### Removido

- Código legado não utilizado no dashboard: widget e fetcher de `Lançamentos Recentes`
- Componente legado `CategoryCard` em categorias (substituído pelo layout atual em tabela)
- Componente `AuthFooter` não utilizado na autenticação
- Barrel files sem consumo em `components/relatorios`, `components/lancamentos` e `components/lancamentos/shared`
- Rota legada `/top-estabelecimentos` e arquivos auxiliares (`layout.tsx` e `loading.tsx`) removidos

## [1.7.5] - 2026-02-28

### Adicionado

- Inbox de pré-lançamentos: ações para excluir item individual (processado/descartado) e limpar itens em lote por status

### Alterado

- Página de categorias: layout migrado de cards para tabela com link direto para detalhe, ícone da categoria e ações inline de editar/remover
- Widgets de boletos e faturas no dashboard: cards e diálogos redesenhados, com destaque visual para status e valores
- Estados de vencimento em boletos e faturas: quando vencidos e não pagos, exibem indicação "Atrasado / Pagar"
- Notificações de faturas: exibição de logo do cartão (quando disponível) e atualização dos ícones da listagem

### Corrigido

- `parseDueDate` no widget de faturas agora retorna também a data parseada com fallback seguro (`date: null`) para evitar comparações inválidas
- Formatação do `components/dashboard/invoices-widget.tsx` ajustada para passar no lint

## [1.7.4] - 2026-02-28

### Alterado

- Card de análise de parcelas (`/dashboard/analise-parcelas`): layout empilhado no mobile — nome/cartão e valores Total/Pendente em linhas separadas ao invés de lado-a-lado, evitando truncamento
- Página de top estabelecimentos (`/top-estabelecimentos`): cards "Top Estabelecimentos por Frequência" e "Principais Categorias" empilhados verticalmente no mobile (`grid-cols-1 lg:grid-cols-2`)
- Padding da lista de parcelas expandida reduzido no mobile (`px-2 sm:px-8`)
- Ajustes gerais de responsividade em navbar, filtros, skeletons, widgets e dialogs (26 componentes)
- Remover selecionados: quando todos os itens selecionados pertencem à mesma série (parcelado ou recorrente), abre dialog de escopo com 3 opções ao invés de confirmação simples (parcial da PR #18)
- Despesa recorrente no cartão de crédito: só consome o limite do cartão quando a data da ocorrência já passou; mesma regra no relatório de cartões (parcial da PR #18)

## [1.7.3] - 2026-02-27

### Adicionado

- Prop `compact` no DatePicker para formato abreviado "28 fev" (sem "de" e sem ano)

### Alterado

- Modal de múltiplos lançamentos reformulado: selects de conta e cartão separados por forma de pagamento, InlinePeriodPicker ao selecionar cartão de crédito, grid full-width, DatePicker compacto
- Opção "Boleto" removida das formas de pagamento no modal de múltiplos lançamentos

## [1.7.2] - 2026-02-26

### Alterado

- Dialogs padronizados: padding maior (p-10), largura max-w-xl, botões do footer com largura igual (flex-1)
- Lançamento dialog simplificado: período da fatura calculado automaticamente a partir da data de compra + dia de fechamento do cartão via `deriveCreditCardPeriod()`
- Seção "Condições e anotações" colapsável no lançamento dialog
- Mass-add dialog: campo unificado conta/cartão com parsing por prefixo, period picker apenas para cartão de crédito
- PeriodPicker removido dos campos básicos; substituído por InlinePeriodPicker inline no cartão de crédito

### Corrigido

- Non-null assertions (!) substituídas por type assertions ou optional chaining com guards em 15+ arquivos
- `any` substituído por `unknown` ou tipos explícitos (use-form-state, pagadores/data, ajustes/actions, insights/actions)
- Hooks com dependências exaustivas: magnet-lines (useEffect antes de early return), lancamentos-filters (useCallback), inbox-page (useCallback + deps)
- `Error` component renomeado para `ErrorComponent` evitando shadowing do global

### Removido

- 6 componentes não utilizados: dashboard-grid, expenses/income-by-category widgets, installment analysis panels, fatura-warning-dialog
- 20+ funções/tipos não utilizados: successResult, generateApiToken, validateApiToken, getTodayUTC/Local, calculatePercentage, roundToDecimals, safeParseInt/Float, isPeriodValid, getLastPeriods, entre outros
- FaturaWarningDialog e checkFaturaStatusAction (substituídos por derivação automática de período)

## [1.7.1] - 2026-02-24

### Adicionado

- Topbar de navegação substituindo o header fixo: backdrop blur, links agrupados em 5 seções (Dashboard, Lançamentos, Cartões, Relatórios, Ferramentas)
- Dropdown Ferramentas na topbar consolidando calculadora e modo privacidade
- Sino de notificações expandido: exibe orçamentos estourados e pré-lançamentos pendentes com seções separadas e contagem agregada
- Página dedicada de changelog em `/changelog`
- Link para o changelog no menu do usuário com versão exibida ao lado

### Alterado

- Logo refatorado com variante compacta para uso na topbar
- Menu do usuário incorpora o botão de logout e link para ajustes
- Links da topbar em lowercase; layout centralizado em max-w-8xl
- Data no changelog exibida no formato dd/mm/aaaa

### Removido

- Header lateral substituído pela topbar
- Aba Changelog removida de Ajustes (agora é página própria)
- Componentes separados de logout e modo privacidade (incorporados à topbar)

## [1.6.3] - 2026-02-19

### Corrigido

- E-mail Resend: variável `RESEND_FROM_EMAIL` não era lida do `.env` (valores com espaço precisam estar entre aspas). Leitura centralizada em `lib/email/resend.ts` com `getResendFromEmail()` e carregamento explícito do `.env` no contexto de Server Actions

### Alterado

- `.env.example`: `RESEND_FROM_EMAIL` com valor entre aspas e comentário para uso em Docker/produção
- `docker-compose.yml`: env do app passa `RESEND_FROM_EMAIL` (em vez de `EMAIL_FROM`) para o container, alinhado ao nome usado pela aplicação

## [1.6.2] - 2026-02-19

### Corrigido

- Bug no mobile onde, ao selecionar um logo no diálogo de criação de conta/cartão, o diálogo principal fechava inesperadamente: adicionado `stopPropagation` nos eventos de click/touch dos botões de logo e delay com `requestAnimationFrame` antes de fechar o seletor de logo

## [1.6.1] - 2026-02-18

### Alterado

- Transferências entre contas: nome do estabelecimento passa a ser "Saída - Transf. entre contas" na saída e "Entrada - Transf. entre contas" na entrada e adicionando em anotação no formato "de {conta origem} -> {conta destino}"
- ChartContainer (Recharts): renderização do gráfico apenas após montagem no cliente e uso de `minWidth`/`minHeight` no ResponsiveContainer para evitar aviso "width(-1) and height(-1)" no console

## [1.6.0] - 2026-02-18

### Adicionado

- Preferência "Anotações em coluna" em Ajustes > Extrato e lançamentos: quando ativa, a anotação dos lançamentos aparece em coluna na tabela; quando inativa, permanece no balão (tooltip) no ícone
- Preferência "Ordem das colunas" em Ajustes > Extrato e lançamentos: lista ordenável por arraste para definir a ordem das colunas na tabela do extrato e dos lançamentos (Estabelecimento, Transação, Valor, etc.); a linha inteira é arrastável
- Coluna `extrato_note_as_column` e `lancamentos_column_order` na tabela `preferencias_usuario` (migrations 0017 e 0018)
- Constantes e labels das colunas reordenáveis em `lib/lancamentos/column-order.ts`

### Alterado

- Header do dashboard fixo apenas no mobile (`fixed top-0` com `md:static`); conteúdo com `pt-12 md:pt-0` para não ficar sob o header
- Abas da página Ajustes (Preferências, Companion, etc.): no mobile, rolagem horizontal com seta indicando mais opções à direita; scrollbar oculta
- Botões "Novo orçamento" e "Copiar orçamentos do último mês": no mobile, rolagem horizontal  (`h-8`, `text-xs`)
- Botões "Nova Receita", "Nova Despesa" e ícone de múltiplos lançamentos: no mobile, mesma rolagem horizontal + botões menores
- Tabela de lançamentos aplica a ordem de colunas salva nas preferências (extrato, lançamentos, categoria, fatura, pagador)
- Adicionado variavel no docker compose para manter o caminho do volume no compose up/down

**Contribuições:** [Guilherme Bano](https://github.com/Gbano1)

## [1.5.3] - 2026-02-21

### Adicionado

- Painel do pagador: card "Status de Pagamento" com totais pagos/pendentes e listagem individual de boletos com data de vencimento, data de pagamento e status
- Funções `fetchPagadorBoletoItems` e `fetchPagadorPaymentStatus` em `lib/pagadores/details.ts`
- SEO completo na landing page: metadata Open Graph, Twitter Card, JSON-LD Schema.org, sitemap.xml (`/app/sitemap.ts`) e robots.txt (`/app/robots.ts`)
- Layout específico da landing page (`app/(landing-page)/layout.tsx`) com metadados ricos

### Corrigido

- Validação obrigatória de categoria, conta e cartão no dialog de lançamento — agora validada no cliente (antes do submit) e no servidor via Zod
- Atributo `lang` do HTML corrigido de `en` para `pt-BR`

### Alterado

- Painel do pagador reorganizado em grid de 3 colunas com cards de Faturas, Boletos e Status de Pagamento
- `PagadorBoletoCard` refatorado para exibir lista de boletos individuais em vez de resumo agregado
- Imagens da landing page convertidas de PNG para WebP (melhora de performance)
- Template de título dinâmico no layout raiz (`%s | OpenMonetis`)

## [1.5.2] - 2026-02-16

### Alterado

- Landing page reformulada: visual modernizado, melhor experiência mobile e novas seções
- Hero section com gradient sutil e tipografia responsiva
- Dashboard preview sem bordas para visual mais limpo
- Seção "Funcionalidades" reorganizada em 2 blocos: 6 cards principais + 6 extras compactos
- Seção "Como usar" com tabs Docker (Recomendado) vs Manual
- Footer simplificado com 3 colunas (Projeto, Companion, descrição)
- Métricas de destaque (widgets, self-hosted, stars, forks) entre hero e dashboard preview
- Espaçamento e padding otimizados para mobile em todas as seções

### Adicionado

- Menu hamburger mobile com Sheet drawer (`components/landing/mobile-nav.tsx`)
- Animações de fade-in no scroll via Intersection Observer (`components/landing/animate-on-scroll.tsx`)
- Seção dedicada ao OpenMonetis Companion com screenshot do app, fluxo de captura e bancos suportados
- Galeria "Conheça as telas" com screenshots de Lançamentos, Calendário e Cartões
- Link "Conheça as telas" na navegação (desktop e mobile)
- Componente de tabs para setup (`components/landing/setup-tabs.tsx`)

## [1.5.1] - 2026-02-16

### Alterado

- Projeto renomeado de **OpenSheets** para **OpenMonetis** em todo o codebase (~40 arquivos): package.json, manifests, layouts, componentes, server actions, emails, Docker, docs e landing page
- URLs do repositório atualizados de `opensheets-app` para `openmonetis`
- Docker image renomeada para `felipegcoutinho/openmonetis`
- Logo textual atualizado (`logo_text.png`)

### Adicionado

- Suporte a multi-domínio via `PUBLIC_DOMAIN`: domínio público serve apenas a landing page (sem botões de login/cadastro, rotas do app bloqueadas pelo middleware)
- Variável de ambiente `PUBLIC_DOMAIN` no `.env.example` com documentação

## [1.5.0] - 2026-02-15

### Adicionado

- Customização de fontes nas preferências — fonte da interface e fonte de valores monetários configuráveis por usuário
- 13 fontes disponíveis: AI Sans, Anthropic Sans, SF Pro Display, SF Pro Rounded, Inter, Geist Sans, Roboto, Reddit Sans, Fira Sans, Ubuntu, JetBrains Mono, Fira Code, IBM Plex Mono
- FontProvider com preview ao vivo — troca de fonte aplica instantaneamente via CSS variables, sem necessidade de reload
- Fontes Apple SF Pro (Display e Rounded) carregadas localmente com 4 pesos (Regular, Medium, Semibold, Bold)
- Colunas `system_font` e `money_font` na tabela `preferencias_usuario`

### Corrigido

- Cores de variação invertidas na tabela de receitas em `/relatorios/tendencias` — aumento agora é verde (bom) e diminuição é vermelho (ruim), consistente com a semântica de receita

### Alterado

- Sistema de fontes migrado de className direto para CSS custom properties (`--font-app`, `--font-money`) via `@theme inline`
- MoneyValues usa `var(--font-money)` em vez de classe fixa, permitindo customização

## [1.4.1] - 2026-02-15

### Adicionado

- Abas "Pendentes", "Processados" e "Descartados" na página de pré-lançamentos (antes exibia apenas pendentes)
- Logo do cartão/conta exibido automaticamente nos cards de pré-lançamento via matching por nome do app
- Pre-fill automático do cartão de crédito ao processar pré-lançamento (match pelo nome do app)
- Badge de status e data nos cards de itens já processados/descartados (modo readonly)

### Corrigido

- `revalidateTag("dashboard", "max")` para invalidar todas as entradas de cache da tag (antes invalidava apenas a mais recente)
- Cor `--warning` ajustada para melhor contraste (mais alaranjada)
- `EstabelecimentoLogo` não precisava de `"use client"` — removido
- Fallback no cálculo de `fontSize` em `EstabelecimentoLogo`

### Alterado

- Nome do estabelecimento formatado em Title Case ao processar pré-lançamento
- Subtítulo da página de pré-lançamentos atualizado

## [1.4.0] - 2026-02-07

### Corrigido

- Widgets de boleto/fatura não atualizavam após pagamento: actions de fatura (`updateInvoicePaymentStatusAction`, `updatePaymentDateAction`) e antecipação de parcelas não invalidavam o cache do dashboard
- Substituídos `revalidatePath()` manuais por `revalidateForEntity()` nas actions de fatura e antecipação
- Expandido `revalidateConfig.cartoes` para incluir `/contas` e `/lancamentos` (afetados por pagamento de fatura)
- Scroll não funcionava em listas Popover+Command (estabelecimento, categorias, filtros): adicionado `modal` ao Popover nos 4 componentes afetados

### Adicionado

- Link "detalhes" no card de orçamento para navegar diretamente à página da categoria
- Indicadores de tendência coloridos nos cards de métricas do dashboard (receitas, despesas, balanço, previsto) com cores semânticas sutis
- Tokens semânticos de estado no design system: `--success`, `--warning`, `--info` (com foregrounds) para light e dark mode
- Cores de chart estendidas de 6 para 10 (`--chart-7` a `--chart-10`: teal, violet, cyan, lime)
- Variantes `success` e `info` no componente Badge

### Alterado

- Migrados ~60+ componentes de cores hardcoded do Tailwind (`green-500`, `red-600`, `amber-500`, `blue-500`, etc.) para tokens semânticos (`success`, `destructive`, `warning`, `info`)
- Unificados 3 arrays duplicados de cores de categorias (em `category-report-chart.tsx`, `category-history.ts`, `category-history-widget.tsx`) para importação única de `category-colors.ts`
- Month picker migrado de tokens customizados (`--month-picker`) para tokens padrão (`--card`)
- Dark mode normalizado: hues consistentes (~70 warm family) em vez de valores dispersos
- Token `--accent` ajustado para ser visualmente distinto de `--background`
- Token `--card` corrigido para branco limpo (`oklch(100% 0 0)`)

### Removido

- Tokens não utilizados: `--dark`, `--dark-foreground`, `--month-picker`, `--month-picker-foreground`

## [1.3.1] - 2026-02-06

### Adicionado

- Calculadora arrastável via drag handle no header do dialog
- Callback `onSelectValue` na calculadora para inserir valor diretamente no campo de lançamento
- Aba "Changelog" em Ajustes com histórico de versões parseado do CHANGELOG.md

### Alterado

- Unificadas páginas de itens ativos e arquivados em Cartões, Contas e Anotações com sistema de tabs (padrão Categorias)
- Removidas rotas separadas `/cartoes/inativos`, `/contas/inativos` e `/anotacoes/arquivadas`
- Removidos sub-links de inativos/arquivados da sidebar
- Padronizada nomenclatura para "Arquivados"/"Arquivadas" em todas as entidades

## [1.3.0] - 2026-02-06

### Adicionado

- Indexes compostos em `lancamentos`: `(userId, period, transactionType)` e `(pagadorId, period)`
- Cache cross-request no dashboard via `unstable_cache` com tag `"dashboard"` e TTL de 120s
- Invalidação automática do cache do dashboard via `revalidateTag("dashboard")` em mutations financeiras
- Helper `getAdminPagadorId()` com `React.cache()` para lookup cacheado do admin pagador

### Alterado

- Eliminados ~20 JOINs com tabela `pagadores` nos fetchers do dashboard (substituídos por filtro direto com `pagadorId`)
- Consolidadas queries de income-expense-balance: 12 queries → 1 (GROUP BY period + transactionType)
- Consolidadas queries de payment-status: 2 queries → 1 (GROUP BY transactionType)
- Consolidadas queries de expenses/income-by-category: 4 queries → 2 (GROUP BY categoriaId + period)
- Scan de métricas limitado a 24 meses ao invés de histórico completo
- Auth session deduplicada por request via `React.cache()`
- Widgets de dashboard ajustados para aceitar `Date | string` (compatibilidade com serialização do `unstable_cache`)
- `CLAUDE.md` otimizado de ~1339 linhas para ~140 linhas

## [1.2.6] - 2025-02-04

### Alterado

- Refatoração para otimização do React 19 compiler
- Removidos `useCallback` e `useMemo` desnecessários (~60 instâncias)
- Removidos `React.memo` wrappers desnecessários
- Simplificados padrões de hidratação com `useSyncExternalStore`

### Arquivos modificados

- `hooks/use-calculator-state.ts`
- `hooks/use-form-state.ts`
- `hooks/use-month-period.ts`
- `components/auth/signup-form.tsx`
- `components/contas/accounts-page.tsx`
- `components/contas/transfer-dialog.tsx`
- `components/lancamentos/table/lancamentos-filters.tsx`
- `components/sidebar/nav-main.tsx`
- `components/month-picker/nav-button.tsx`
- `components/month-picker/return-button.tsx`
- `components/privacy-provider.tsx`
- `components/dashboard/category-history-widget.tsx`
- `components/anotacoes/note-dialog.tsx`
- `components/categorias/category-dialog.tsx`
- `components/confirm-action-dialog.tsx`
- `components/orcamentos/budget-dialog.tsx`

## [1.2.5] - 2025-02-01

### Adicionado

- Widget de pagadores no dashboard
- Avatares atualizados para pagadores

## [1.2.4] - 2025-01-22

### Corrigido

- Preservar formatação nas anotações
- Layout do card de anotações

## [1.2.3] - 2025-01-22

### Adicionado

- Versão exibida na sidebar
- Documentação atualizada

## [1.2.2] - 2025-01-22

### Alterado

- Atualização de dependências
- Aplicada formatação no código
