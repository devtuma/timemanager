# 🚀 Guia Rápido de Instalação

## Opção 1: GitHub Pages (Teste Rápido - 5 minutos)

### 1. Fork/Clone o Repositório
```bash
git clone https://github.com/seu-usuario/timemanager.git
cd timemanager
```

### 2. Faça Push para seu GitHub
```bash
git remote set-url origin https://github.com/SEU-USUARIO/timemanager.git
git push -u origin main
```

### 3. Ative GitHub Pages
1. Acesse: **Settings → Pages**
2. Source: **main** branch
3. Salve e aguarde 2-3 minutos

### 4. Acesse o App
```
https://SEU-USUARIO.github.io/timemanager/
```

**✅ Pronto! Use o "Modo Demo" para testar.**

---

## Opção 2: Hostinger (Produção - 15 minutos)

### Pré-requisitos
- Conta na Hostinger
- Acesso ao cPanel
- Domínio configurado

### Passo a Passo

#### 1️⃣ Criar Banco de Dados

1. Acesse **cPanel → MySQL Databases**
2. Crie banco: `timemanager`
3. Crie usuário: `timemanager_user`
4. **Anote a senha gerada!**
5. Adicione usuário ao banco (All Privileges)

#### 2️⃣ Importar Schema

1. Acesse **phpMyAdmin**
2. Selecione banco `timemanager`
3. Clique em **SQL**
4. Cole conteúdo de `api/database.sql`
5. Clique em **Go/Executar**

#### 3️⃣ Upload dos Arquivos

**Via File Manager:**
```
cPanel → File Manager → public_html/
Upload todos os arquivos do projeto
```

**Via FTP:**
```
Host: ftp.seudominio.com
User: seu_usuario_ftp
Pass: sua_senha_ftp

Faça upload de tudo para /public_html/
```

#### 4️⃣ Configurar API

1. Copie `api/config.php.example` para `api/config.php`
   ```bash
   cp api/config.php.example api/config.php
   ```

2. Edite `api/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'seu_banco_REAL');
   define('DB_USER', 'seu_usuario_REAL');
   define('DB_PASS', 'sua_senha_REAL');

   // IMPORTANTE: Mude isso!
   define('JWT_SECRET', 'cole-aqui-uma-string-aleatoria-longa');
   ```

3. Gere uma chave JWT segura:
   - Visite: https://randomkeygen.com/
   - Copie uma "Fort Knox Password"
   - Cole em `JWT_SECRET`

#### 5️⃣ Testar

1. **Teste a API:**
   ```
   https://seudominio.com/api/ping.php
   ```
   Deve retornar: `{"status":"ok",...}`

2. **Teste o App:**
   ```
   https://seudominio.com/
   ```
   - Crie uma conta
   - Crie um projeto
   - Faça logout e login
   - Verifique se o projeto ainda existe ✅

#### 6️⃣ Segurança (IMPORTANTE!)

1. **Altere permissões do config.php:**
   ```bash
   chmod 600 api/config.php
   ```

2. **Verifique .htaccess:**
   - Arquivo `api/.htaccess` deve bloquear acesso a `config.php`

3. **SSL/HTTPS:**
   - Ative SSL gratuito no cPanel (Let's Encrypt)
   - Force HTTPS

---

## 🔍 Troubleshooting

### Erro: "Database connection failed"
- ✅ Verifique credenciais em `api/config.php`
- ✅ Certifique-se que o banco foi criado
- ✅ Verifique se usuário tem permissões

### Erro: "Authentication required"
- ✅ Verifique se `JWT_SECRET` foi alterado
- ✅ Tente fazer logout e login novamente
- ✅ Limpe cache do navegador

### GitHub Pages não carrega
- ✅ Aguarde 5-10 minutos após ativar
- ✅ Verifique se branch está correto (main)
- ✅ Confira URL: `usuario.github.io/timemanager/`

### API não funciona na Hostinger
- ✅ Verifique se PHP está ativo (cPanel → PHP Version)
- ✅ Teste `ping.php` primeiro
- ✅ Veja logs de erro: cPanel → Error Log

---

## 📞 Precisa de Ajuda?

- 📖 Leia o [README.md](README.md) completo
- 🐛 Abra uma [Issue no GitHub](https://github.com/seu-usuario/timemanager/issues)
- 💬 Verifique discussões existentes

---

**🎉 Instalação Completa! Agora domine suas apresentações!**
