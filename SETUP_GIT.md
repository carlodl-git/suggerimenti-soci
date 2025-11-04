# Setup Repository Git

Esegui questi comandi nel terminale per inizializzare il repository Git:

## 1. Inizializza Git

```bash
cd /Users/charles/Desktop/Code/Suggerimenti_soci
git init
```

## 2. Configura Git (se non già fatto)

```bash
git config user.name "Il Tuo Nome"
git config user.email "tua.email@example.com"
```

## 3. Aggiungi tutti i file

```bash
git add .
```

## 4. Fai il commit iniziale

```bash
git commit -m "Initial commit: Scatola delle Idee - Play Golf 54"
```

## 5. Crea repository su GitHub/GitLab

1. Vai su [GitHub.com](https://github.com) o [GitLab.com](https://gitlab.com)
2. Crea un nuovo repository (es. `suggerimenti-soci`)
3. **NON** inizializzarlo con README, .gitignore o licenza (già li abbiamo)

## 6. Collega il repository locale a quello remoto

```bash
# Per GitHub
git remote add origin https://github.com/TUO-USERNAME/suggerimenti-soci.git

# Oppure per GitLab
git remote add origin https://gitlab.com/TUO-USERNAME/suggerimenti-soci.git
```

## 7. Push sul repository remoto

```bash
git branch -M main
git push -u origin main
```

## ✅ Verifica

Dopo il push, verifica che tutti i file siano sul repository remoto.

## 📝 Note

- Il file `.env.local` è già nel `.gitignore` (non verrà committato)
- `node_modules` e `.next` sono già ignorati
- Tutti i file del progetto sono pronti per il commit

## 🚀 Prossimi Passi

Dopo il push su Git, puoi:
1. Connettere il repository a Vercel per il deployment
2. Vedi `DEPLOYMENT.md` per le istruzioni complete

