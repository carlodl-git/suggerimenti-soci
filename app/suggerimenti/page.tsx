'use client';

import { useState } from 'react';

type Club = 'montecchia' | 'frassanelle' | 'galzignano' | 'albarella';

interface FormErrors {
  club?: string;
  message?: string;
  name?: string;
}

const CLUBS: { value: Club; label: string }[] = [
  { value: 'montecchia', label: 'Montecchia' },
  { value: 'frassanelle', label: 'Frassanelle' },
  { value: 'galzignano', label: 'Galzignano' },
  { value: 'albarella', label: 'Albarella' },
];

export default function SuggerimentiPage() {
  const [club, setClub] = useState<Club | ''>('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          club,
          message: message.trim(),
          is_anonymous: isAnonymous,
          name: isAnonymous ? '' : name.trim(),
          honey: website, // Honeypot field
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        // Reset form
        setClub('');
        setMessage('');
        setIsAnonymous(false);
        setName('');
        setWebsite('');
      } else {
        // Mappare errori Zod
        if (data.details && Array.isArray(data.details)) {
          const newErrors: FormErrors = {};
          data.details.forEach((error: { path: (string | number)[]; message: string }) => {
            const field = error.path[0] as string;
            if (field === 'club') {
              newErrors.club = 'Seleziona un circolo';
            } else if (field === 'message') {
              if (error.message.includes('at least')) {
                newErrors.message = 'Il messaggio deve contenere almeno 10 caratteri';
              } else if (error.message.includes('at most')) {
                newErrors.message = 'Il messaggio non può superare i 4000 caratteri';
              } else {
                newErrors.message = 'Messaggio non valido';
              }
            } else if (field === 'name') {
              newErrors.name = error.message;
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({ message: data.error || 'Si è verificato un errore. Riprova.' });
        }
      }
    } catch (error) {
      setErrors({ message: 'Errore di connessione. Riprova più tardi.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center border border-neutral-200">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-[#1a5632] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-12 w-12 text-[#1a5632]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">Grazie!</h1>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            Il tuo suggerimento è stato inviato con successo. 
            <span className="font-semibold text-neutral-900"> Lo prenderemo in considerazione</span> e lo condivideremo con lo staff del club.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setErrors({});
            }}
            className="w-full bg-[#1a5632] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2d6a4f] transition-colors shadow-sm hover:shadow-md"
          >
            Invia un altro suggerimento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-10 mb-8 border border-neutral-200">
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-4xl">🏌️‍♂️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
              La Scatola delle Idee
            </h1>
            <div className="h-1 w-24 bg-[#8b7355] mx-auto mb-4"></div>
            <p className="text-lg text-[#1a5632] font-medium">
              la tua voce per migliorare il Club
            </p>
          </div>
          
          <div className="space-y-5 text-neutral-700 leading-relaxed max-w-2xl mx-auto">
            <p className="text-base">
              Hai un suggerimento o un'idea per migliorare il nostro circolo?
              Scrivila qui, anonimamente o firmata, come preferisci.
            </p>
            
            <p className="text-base">
              Ogni contributo viene letto con attenzione e condiviso con lo staff,
              perché crediamo che il valore del club nasca dal dialogo con chi lo vive ogni giorno.
            </p>
            
            <p className="text-base font-medium text-neutral-900 pt-3">
              Grazie per condividere la tua voce con noi!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-10 space-y-7 border border-neutral-200">
          {/* Select Circolo */}
          <div>
            <label htmlFor="club" className="block text-sm font-semibold text-neutral-800 mb-3 uppercase tracking-wide">
              Circolo <span className="text-red-600">*</span>
            </label>
            <select
              id="club"
              value={club}
              onChange={(e) => setClub(e.target.value as Club)}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-[#1a5632] transition-colors text-neutral-700 ${
                errors.club ? 'border-red-500 bg-red-50' : 'border-neutral-300 hover:border-neutral-400'
              }`}
              disabled={loading}
            >
              <option value="">Seleziona un circolo</option>
              {CLUBS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.club && <p className="mt-1 text-sm text-red-500">{errors.club}</p>}
          </div>

          {/* Textarea Messaggio */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-neutral-800 mb-3 uppercase tracking-wide">
              Il tuo suggerimento <span className="text-red-600">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              maxLength={4000}
              rows={8}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-[#1a5632] transition-colors resize-y text-neutral-700 placeholder-neutral-400 ${
                errors.message ? 'border-red-500 bg-red-50' : 'border-neutral-300 hover:border-neutral-400'
              }`}
              placeholder="Scrivi qui il tuo suggerimento... (minimo 10 caratteri)"
              disabled={loading}
            />
            <div className="mt-2 flex justify-between items-center">
              {errors.message ? (
                <p className="text-sm text-red-600">{errors.message}</p>
              ) : (
                <span className="text-xs text-neutral-500">
                  Minimo 10 caratteri, massimo 4000
                </span>
              )}
              <span className="text-xs text-neutral-500 font-medium">
                {message.length}/4000
              </span>
            </div>
          </div>

          {/* Checkbox Anonimo */}
          <div className="flex items-start p-5 bg-neutral-50 rounded-lg border border-neutral-200">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-1 h-5 w-5 text-[#1a5632] focus:ring-[#1a5632] border-neutral-300 rounded cursor-pointer"
              disabled={loading}
            />
            <label htmlFor="isAnonymous" className="ml-3 block text-sm text-neutral-700 cursor-pointer">
              <span className="font-semibold">Invia in forma anonima</span>
              <span className="block text-xs text-neutral-500 mt-1">
                Il tuo nome non verrà salvato o visualizzato
              </span>
            </label>
          </div>

          {/* Input Nome (condizionale) */}
          {!isAnonymous && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-800 mb-3 uppercase tracking-wide">
                Nome e cognome (opzionale)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-[#1a5632] transition-colors text-neutral-700 placeholder-neutral-400 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-neutral-300 hover:border-neutral-400'
                }`}
                placeholder="Il tuo nome (opzionale)"
                disabled={loading}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Errori generici */}
          {errors.message && !errors.club && !errors.name && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !club || message.trim().length < 10}
            className="w-full bg-[#1a5632] text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-[#2d6a4f] focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:ring-offset-2 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Invio in corso...
              </span>
            ) : (
              'Invia suggerimento'
            )}
          </button>

          {/* Privacy Notice */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="flex items-start justify-center gap-3 text-xs text-neutral-600">
              <svg className="w-4 h-4 mt-0.5 text-[#1a5632] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-center leading-relaxed">
                <span className="font-semibold text-neutral-800">Privacy garantita:</span> Se scegli l'anonimo, non registriamo il tuo nome. 
                I tuoi dati sono trattati nel rispetto della privacy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
