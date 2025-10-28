# PeriodicGym
Uma aplicação inteligente que auxilia na execução correta de movimentos de musculação, proporcionando feedback em tempo real e orientações para melhorar a performance e prevenir lesões.

## Sobre o Projeto
O AI-Coach é uma solução inovadora desenvolvida para ajudar praticantes de musculação a executarem os exercícios com a técnica adequada. Através de tecnologia moderna, o sistema monitora e analisa os movimentos, fornecendo orientações instantâneas para otimizar o treino e garantir a segurança do usuário.

Foco Principal: Assistente de Movimentos de Musculação
A feature core do PeriodicGym é um sistema inteligente de análise de movimentos que:

- Detecta e analisa a execução de exercícios em tempo real
- Fornece feedback instantâneo sobre postura e técnica
- Identifica erros comuns e sugere correções
- Acompanha o progresso ao longo do tempo
- Previne lesões alertando sobre movimentos inadequados

Como Funciona

Captura: O usuário realiza o exercício enquanto é gravado
Análise: O sistema processa o movimento usando IA
Feedback: Retorna orientações precisas sobre a execução
Registro: Salva o histórico para acompanhamento da evolução

### Estrutura de Branches
O projeto utiliza três branches principais para organizar o fluxo de desenvolvimento:


main

- Branch de produção
- Contém código estável e testado
- Deploy automático para ambiente de produção


FRONTEND/ai-coach-page

- Branch de desenvolvimento do frontend
- Interface do usuário e experiência visual
- Integração com a API de análise de movimentos


BACKEND/api

- Branch de desenvolvimento do backend
- Lógica de negócio e processamento de IA
- Gerenciamento de dados e endpoints


QA/unit-test


- Branch de testes automatizados
- Testes unitários e de integração
- Validação de qualidade do código