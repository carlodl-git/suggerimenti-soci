# 🏌️‍♂️ Scatola delle Idee - Play Golf 54

Sistema online per la raccolta di suggerimenti dai soci dei circoli golf (Montecchia, Frassanelle, Galzignano, Albarella).

## 🚀 Tecnologie

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database)
- **Zod** (Validazione)

## 📋 Funzionalità

- ✅ Form per invio suggerimenti (anonimo o firmato)
- ✅ Selezione circolo golf
- ✅ Honeypot antispam
- ✅ Hash IP per privacy
- ✅ Admin panel protetto (Basic Auth)
- ✅ Filtri e ricerca per gestione suggerimenti
- ✅ Design mobile-first

## 🛠️ Setup Locale

1. **Installa le dipendenze**
   ```bash
   npm install
   ```

2. **Configura le variabili d'ambiente**
   - Copia `.env.local` e configura:
     - `NEXT_PUBLIC_SITE_URL`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE`
     - `HASH_SALT`
     - `ADMIN_USER`
     - `ADMIN_PASS`

3. **Configura il database**
   - Esegui lo script SQL in `supabase/schema.sql` sulla console Supabase

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

5. **Apri nel browser**
   - Frontend: `http://localhost:3000/suggerimenti`
   - Admin: `http://localhost:3000/admin/suggestions`

## 📁 Struttura Progetto

```
├── app/
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   └── suggerimenti/       # Pagina form suggerimenti
├── lib/
│   └── supabaseAdmin.ts    # Client Supabase admin
├── supabase/
│   └── schema.sql          # Schema database
└── middleware.ts           # Basic auth per admin
```

## 🚢 Deployment

Vedi `DEPLOYMENT.md` per le istruzioni complete di deployment.

### Quick Deploy (Vercel)

1. Push su GitHub/GitLab
2. Connetti repository a Vercel
3. Configura variabili d'ambiente
4. Aggiungi dominio personalizzato
5. Deploy automatico!

## 📝 Scripts

- `npm run dev` - Avvia server di sviluppo
- `npm run build` - Build per produzione
- `npm run start` - Avvia server produzione
- `npm run lint` - Linter

## 🔒 Sicurezza

- Basic Auth per admin panel
- Honeypot antispam
- Hash IP per privacy
- Validazione input con Zod
- RLS abilitato su Supabase

## 📄 Licenza

Proprietario - Play Golf 54

