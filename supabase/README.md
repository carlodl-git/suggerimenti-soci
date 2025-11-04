# Schema Database Supabase

## Esecuzione dello script SQL

1. Accedi al tuo progetto Supabase
2. Vai alla **SQL Editor**
3. Copia e incolla il contenuto di `schema.sql`
4. Esegui lo script

## Note importanti

- **gen_random_uuid()**: In Supabase l'estensione `pgcrypto` è già abilitata di default, quindi `gen_random_uuid()` funziona senza configurazioni aggiuntive.

- **Row Level Security (RLS)**: 
  - RLS è abilitato sulla tabella `suggestions`
  - Gli inserimenti avverranno via **service role** (API server-side), quindi non sono necessarie policy aggiuntive per INSERT
  - Se in futuro vorrai abilitare SELECT per utenti autenticati, potrai aggiungere policy appropriate

- **Enum `club`**: 
  - I valori sono: `montecchia`, `frassanelle`, `galzignano`, `albarella`
  - Per aggiungere/modificare valori in futuro, usa `ALTER TYPE club ADD VALUE 'nuovo_valore';`

## Verifica

Dopo l'esecuzione, verifica che:
- L'enum `club` sia stato creato
- La tabella `public.suggestions` esista con tutti i campi corretti
- RLS sia abilitato (visibile nelle impostazioni della tabella)

