Tome responsabilidades e gere resultados;
Primeiro vc começa; depois melhora...

#ERROS#
Destacar no calendário data de hoje; referente a implementação anterior de registros diário e de horários dos terços, não visualizei no calendário os registros; Consegue verificar?
#######

########## GIT #############
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/deoliveiratech/wepraise-oracoes.git
git push -u origin master

git add .
git commit -m "Correções build"
git push

#######################

Gostaria que você desenvolvesse a seguinte ideia de aplicação: uma aplicação PWA de orações católicas, com foco principal no terço católico. Mostra na dashboard calendário com os registros de terços diários; ao clicar em um registro, abrir a oração do terço no formato de organograma/passo-a-passo com cada estágio da oração. Por exemplo: ao abrir o terço, mostrar na interface botão 'iniciar' e após habilitar label/botão/estágio da oração inicial: 'Creio'; ao clicar sobre ele expandir com a oração em texto; ao finalizar passar para o próximo estágio habilitando as 'três Ave-Marias' com sua devida descrição da oração e assim por diante...

STACK:
- Frontend: React + Vite + TailwindCSS + TypeScript
- Backend: Firebase (Firestore + Authentication + opcional Cloud Functions)
- Estado: Zustand
LAYOUT E DESIGN: 
 - O projeto utiliza uma estética Premium e Moderna, focada em usabilidade e clareza visual.
 1. AUTENTICAÇÃO
- Login com email/senha via Firebase Auth
- Persistência de sessão
- Estrutura multi-usuário (cada usuário vê apenas seus dados)
