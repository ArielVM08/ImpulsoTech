# ImpulsoTech

Plataforma web de **PDI (Plano de Desenvolvimento Individual)** para estudantes de cursos técnicos de informática, criada para ajudá-los a planejar a carreira e a conquistar o primeiro estágio ou emprego na área de tecnologia.

Projeto de Extensão da disciplina *Prática Profissional e Gestão*, do curso de Análise e Desenvolvimento de Sistemas da **Unifametro** (2026.2), desenvolvido em parceria com uma escola estadual de educação profissional de Fortaleza-CE.

> **Status:** em desenvolvimento.

## O que a plataforma faz

- **Cadastro e login** de usuários, com confirmação por e-mail
- **Onboarding** para entender o perfil do aluno, seus objetivos (como primeiro estágio e portfólio) e sua área de interesse
- **Meu PDI**: metas e competências que o aluno cria e edita, com acompanhamento do progresso e gráficos
- **Planejamento**: roteiro de 90 dias com calendário mensal, tarefas marcáveis como concluídas, dicas e revisão semanal

## Tecnologias

| Área | Ferramentas |
| --- | --- |
| Front-end | React, Vite, JavaScript, HTML5 e CSS3 |
| Back-end e banco de dados | Supabase (autenticação e PostgreSQL com RLS) |
| Gráficos | Recharts |
| Gerenciador de pacotes | pnpm |
| Versionamento | Git e GitHub |

## Como rodar localmente

**Pré-requisitos:** [Node.js](https://nodejs.org/), [pnpm](https://pnpm.io/) e um projeto no [Supabase](https://supabase.com/).

```bash
# 1. Clone o repositório
git clone https://github.com/ArielVM08/ImpulsoTech.git
cd ImpulsoTech

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# edite o .env.local com a URL e a chave pública (anon) do seu projeto Supabase

# 4. Rode o projeto
pnpm dev
```

O app abre em `http://localhost:5173`.

## Banco de dados

As tabelas principais no Supabase são `profiles`, `metas`, `competencias` e `plano_etapas`, todas com **Row Level Security (RLS)** ativado, de forma que cada usuário acessa apenas os próprios dados.

## Próximos passos

- Gravar o módulo de Planejamento no banco de dados
- Publicar a versão online
- Testes com alunos da escola parceira

## Autor

Desenvolvimento técnico: **Ariel Valente Machado**
[LinkedIn](https://www.linkedin.com/in/ariel-valente-384159380/) · [GitHub](https://github.com/ArielVM08)
