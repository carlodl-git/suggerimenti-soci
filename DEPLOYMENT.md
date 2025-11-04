# Guida al Deployment - Suggerimenti Soci

Questa guida ti aiuterà a deployare l'applicazione su un dominio personalizzato.

## 📋 Requisiti Pre-Deployment

### 1. Account e Servizi Necessari

- ✅ **Supabase** (già configurato)
  - URL del progetto
  - Service Role Key
- ✅ **Dominio** (es. `suggerimenti.golfmontecchia.it` o `suggerimenti.golfmontecchia.com`)
- ✅ **Account su piattaforma di hosting** (consigliato: Vercel)

### 2. Variabili d'Ambiente da Configurare

Assicurati di avere queste variabili pronte:

```env
# URL del sito (cambia in produzione)
NEXT_PUBLIC_SITE_URL=https://suggerimenti.golfmontecchia.it

# Supabase (già configurato)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key

# Hash per IP (usa una stringa lunga e casuale)
HASH_SALT=your-long-random-salt-string-here

# Admin credentials (IMPORTANTE: cambia in produzione!)
ADMIN_USER=admin
ADMIN_PASS=your-strong-password-here
```

## 🚀 Opzione 1: Deployment su Vercel (Consigliato)

Vercel è la piattaforma più semplice per Next.js e offre:
- ✅ Deploy automatico da Git
- ✅ SSL/HTTPS gratuito
- ✅ Domini personalizzati
- ✅ Variabili d'ambiente facili da gestire

### Passi:

1. **Prepara il repository Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Push su GitHub/GitLab/Bitbucket
   ```

2. **Crea account Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Registrati e connetti il tuo repository Git

3. **Configura il progetto**
   - Vercel rileverà automaticamente Next.js
   - Framework Preset: Next.js
   - Build Command: `npm run build` (automatico)
   - Output Directory: `.next` (automatico)

4. **Configura le variabili d'ambiente**
   - Vai su Project Settings → Environment Variables
   - Aggiungi tutte le variabili elencate sopra
   - **IMPORTANTE**: Usa valori di produzione per:
     - `NEXT_PUBLIC_SITE_URL`
     - `ADMIN_PASS` (password forte!)
     - `HASH_SALT` (stringa casuale lunga)

5. **Configura il dominio personalizzato**
   - Vai su Project Settings → Domains
   - Aggiungi il tuo dominio (es. `suggerimenti.golfmontecchia.it`)
   - Segui le istruzioni per configurare i DNS:
     - Aggiungi un record CNAME che punta a `cname.vercel-dns.com`
     - Oppure aggiungi record A con gli IP forniti da Vercel

6. **Deploy**
   - Vercel farà il deploy automatico
   - Il sito sarà disponibile su `https://suggerimenti.golfmontecchia.it`

## 🔧 Opzione 2: Deployment su VPS/Server Proprio

Se preferisci un server dedicato:

### Requisiti Server:
- Node.js 18+ e npm
- PM2 o simile per process management
- Nginx come reverse proxy
- SSL certificate (Let's Encrypt gratuito)

### Passi:

1. **Build del progetto**
   ```bash
   npm install
   npm run build
   ```

2. **Configura variabili d'ambiente**
   ```bash
   # Crea .env.production
   cp .env.local .env.production
   # Modifica con i valori di produzione
   ```

3. **Avvia con PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "suggerimenti" -- start
   pm2 save
   pm2 startup
   ```

4. **Configura Nginx**
   ```nginx
   server {
       listen 80;
       server_name suggerimenti.golfmontecchia.it;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Configura SSL con Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d suggerimenti.golfmontecchia.it
   ```

## ✅ Checklist Pre-Deployment

Prima di andare in produzione, verifica:

- [ ] Tutte le variabili d'ambiente sono configurate
- [ ] `NEXT_PUBLIC_SITE_URL` punta al dominio corretto
- [ ] `ADMIN_PASS` è una password forte (non quella di default!)
- [ ] `HASH_SALT` è una stringa casuale lunga e sicura
- [ ] Database Supabase è configurato e accessibile
- [ ] Il build funziona: `npm run build`
- [ ] Test locale funziona: `npm run dev`
- [ ] SSL/HTTPS è configurato (automatico su Vercel)

## 🔒 Sicurezza

### Password Admin
Genera una password forte per `ADMIN_PASS`:
```bash
# Opzione 1: Usa un generatore online
# Opzione 2: Genera con openssl
openssl rand -base64 32
```

### HASH_SALT
Genera una stringa casuale lunga:
```bash
openssl rand -hex 32
```

## 📝 Dopo il Deployment

1. **Testa tutte le funzionalità**:
   - ✅ Form suggerimenti funziona
   - ✅ API endpoint risponde correttamente
   - ✅ Admin panel è protetto (basic auth)
   - ✅ Database salva i dati

2. **Monitoraggio**:
   - Monitora i log su Vercel/Dashboard
   - Verifica errori in console browser
   - Controlla Supabase dashboard per i dati

3. **Backup**:
   - Il database Supabase ha backup automatici
   - Considera backup regolari dei dati

## 🆘 Troubleshooting

### Errore "Module not found"
- Verifica che tutte le dipendenze siano in `package.json`
- Esegui `npm install` prima del build

### Errore variabili d'ambiente
- Verifica che tutte le variabili siano configurate sulla piattaforma
- Riavvia il deployment dopo aver aggiunto variabili

### Errore CORS/Database
- Verifica che `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE` siano corrette
- Controlla che RLS sia configurato correttamente

## 📞 Supporto

Per problemi specifici:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

