# ⏱️ Timer Manager - Domine a Si Mesmo

Timer Manager é um aplicativo web de produtividade especializado em ajudar você a planejar, estruturar e executar apresentações, reuniões ou qualquer atividade com tempo rigidamente controlado.

## 🎯 Propósito

O Timer Manager resolve um problema crítico: **controle total do tempo durante apresentações**. Seja para uma defesa de TCC, reunião executiva ou palestra, o aplicativo libera você da preocupação com o relógio, permitindo total foco no conteúdo e na audiência.

## ✨ Funcionalidades Principais

### 1. 📊 Estruturação de Tempo
- Divida apresentações em "pontos" cronometrados
- Defina duração exata para cada ponto (horas, minutos, segundos)
- Visualize tempo total vs. tempo alocado em tempo real

### 2. 🎤 Guia por Voz (Text-to-Speech)
- O app fala o título de cada ponto automaticamente
- Palavras-chave são anunciadas no momento certo
- Mantém você no ritmo sem olhar para a tela
- Suporta Português (PT-BR) e Inglês (EN-US)

### 3. 📱 Sincronização em Nuvem
- **GitHub Pages**: Armazenamento local (localStorage)
- **Hostinger**: Sincronização completa via MySQL
- Seus projetos acessíveis de qualquer dispositivo

### 4. 🔔 Alertas Inteligentes
- Alertas sonoros (beeps) para transições
- Notificações visuais de progresso
- Barras de progresso coloridas (verde → amarelo → vermelho)

### 5. 💾 Exportar/Importar
- Faça backup de projetos em JSON
- Compartilhe projetos com outros usuários
- Importe projetos de outros dispositivos

### 6. 🌓 Personalização
- Modo Claro/Escuro
- Multi-idioma (PT/EN)
- Interface responsiva

## 🚀 Como Usar

### Modo 1: GitHub Pages (Teste Rápido)

1. **Acesse o app**:
   ```
   https://seu-usuario.github.io/timemanager/
   ```

2. **Faça login ou use Modo Demo**:
   - Clique em "Modo Demo (Sem Login)" para testar sem cadastro
   - Ou crie uma conta (dados salvos localmente)

3. **Crie seu primeiro projeto**:
   - Clique em "+ Novo Projeto"
   - Defina nome e tempo total
   - Adicione pontos com palavras-chave
   - Salve!

4. **Execute a apresentação**:
   - Clique em "Iniciar" no projeto
   - Use ▶️ Play/Pause para controlar
   - Navegue entre pontos com ⏮ Anterior/Próximo ⏭

### Modo 2: Hostinger (Produção com Banco de Dados)

Siga as instruções de deploy abaixo para configurar na Hostinger.

## 📦 Deploy no GitHub Pages

### 1. Preparar Repositório

```bash
# Clone ou inicialize o repositório
git init
git add .
git commit -m "Initial commit: Timer Manager"
git branch -M main
git remote add origin https://github.com/seu-usuario/timemanager.git
git push -u origin main
```

### 2. Ativar GitHub Pages

1. Acesse: **Settings → Pages**
2. Em **Source**, selecione **main** branch
3. Clique em **Save**
4. Aguarde alguns minutos
5. Acesse: `https://seu-usuario.github.io/timemanager/`

**Pronto!** O app funcionará com armazenamento local (localStorage).

## 🌐 Deploy na Hostinger (Com Backend PHP)

### 1. Preparar Hostinger

1. **Acesse cPanel** da Hostinger
2. **Crie um banco de dados MySQL**:
   - Nome: `timemanager`
   - Usuário: `timemanager_user`
   - Anote a senha gerada

### 2. Configurar Banco de Dados

1. **Acesse phpMyAdmin**
2. Selecione o banco `timemanager`
3. Clique em **SQL**
4. Cole o conteúdo de `api/database.sql`
5. Clique em **Executar**

### 3. Upload dos Arquivos

**Via File Manager (cPanel):**
1. Acesse **File Manager**
2. Navegue até `public_html/`
3. Faça upload de todos os arquivos do projeto
4. Estrutura final:
   ```
   public_html/
   ├── index.html
   ├── login.html
   ├── register.html
   ├── app.html
   ├── css/
   ├── js/
   └── api/
   ```

**Via FTP:**
```bash
# Use FileZilla ou qualquer cliente FTP
Host: ftp.seudominio.com
Usuário: seu_usuario_ftp
Senha: sua_senha_ftp
```

### 4. Configurar API

Edite `api/config.php`:

```php
// Substitua com suas credenciais reais
define('DB_HOST', 'localhost');
define('DB_NAME', 'seu_banco');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');

// IMPORTANTE: Altere a chave secreta!
define('JWT_SECRET', 'gere-uma-chave-secreta-unica-aqui');
```

### 5. Testar API

Acesse:
```
https://seudominio.com/api/ping.php
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "Timer Manager API is running",
  "timestamp": 1234567890
}
```

### 6. Testar o App

1. Acesse: `https://seudominio.com/`
2. Crie uma conta real
3. Crie um projeto
4. **Verifique se os dados persistem após logout/login**

## 🛠️ Estrutura do Projeto

```
timemanager/
├── index.html              # Landing page
├── login.html              # Login page
├── register.html           # Registration page
├── app.html                # Main app interface
│
├── css/
│   └── styles.css          # Complete styles (dark/light theme)
│
├── js/
│   ├── i18n.js             # Internationalization (PT/EN)
│   ├── storage.js          # Storage abstraction (localStorage + API)
│   ├── auth.js             # Authentication handler
│   ├── app.js              # Main app controller
│   └── timer.js            # Timer & presentation mode
│
├── api/                    # PHP Backend
│   ├── config.php          # Database & auth config
│   ├── auth.php            # User registration & login
│   ├── projects.php        # CRUD for projects
│   ├── ping.php            # API health check
│   ├── database.sql        # Database schema
│   └── .htaccess           # Security & CORS
│
└── README.md               # This file
```

## 🔒 Segurança

### GitHub Pages (Local Storage)
- ✅ Dados armazenados apenas no navegador do usuário
- ⚠️ Limpar cache = perder dados
- ✅ Sem servidor = sem vazamento de dados

### Hostinger (MySQL)
- ✅ Senhas criptografadas (bcrypt)
- ✅ Tokens JWT para autenticação
- ⚠️ **IMPORTANTE**: Altere `JWT_SECRET` em produção
- ✅ Proteção CORS
- ✅ SQL Injection prevention (PDO prepared statements)

## 🎓 Casos de Uso

- 🎓 **Defesas de TCC e Teses**: Controle exato de tempo e tópicos
- 💼 **Reuniões Executivas**: Pauta estruturada com timing
- 🎙️ **Palestras e Conferências**: Guia mãos-livres por voz
- 👨‍🏫 **Workshops e Treinamentos**: Módulos cronometrados
- 📺 **Apresentações de Pitch**: Timing perfeito para convencer investidores

## 🌟 Vantagens

### Resolvemos TODAS as Desvantagens Anteriores:

| Antes | Depois |
|-------|--------|
| ❌ Apenas localStorage | ✅ localStorage + MySQL (sincronização) |
| ❌ Login falso | ✅ Autenticação real com JWT |
| ❌ Sem colaboração | ✅ Exportar/Importar projetos |
| ❌ Dependência total do navegador | ✅ Backup em nuvem (Hostinger) |

### Mantemos as Vantagens:

- ✅ **Gestão de Tempo Excepcional**
- ✅ **Redução de Ansiedade** (automação do controle)
- ✅ **Apresentações Estruturadas**
- ✅ **Guia Mãos-Livres** (voz + beeps)
- ✅ **Ritmo Dinâmico** (keywords progressivas)
- ✅ **Interface Intuitiva**
- ✅ **Funciona Offline** (GitHub Pages)
- ✅ **Funciona Online** (Hostinger com sync)

## 🔧 Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Web Speech API (Text-to-Speech)
- Web Audio API (Beeps)
- LocalStorage API

### Backend
- PHP 7.4+
- MySQL 5.7+
- JWT Authentication
- PDO (SQL Injection Prevention)

### Deploy
- GitHub Pages (static hosting)
- Hostinger (PHP + MySQL)

## 📝 Licença

Este projeto é de código aberto. Você pode usar, modificar e distribuir livremente.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou pull request.

## 📧 Suporte

- **GitHub Issues**: Para bugs e sugestões
- **Email**: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ para ajudar apresentadores a dominarem a si mesmos!**

*"Domine a si mesmo" - Timer Manager*
