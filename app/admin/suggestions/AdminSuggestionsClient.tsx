'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Club = 'montecchia' | 'frassanelle' | 'galzignano' | 'albarella';
type Status = 'new' | 'reviewed' | 'archived';

interface Suggestion {
  id: string;
  created_at: string;
  club: Club;
  is_anonymous: boolean;
  name: string | null;
  message: string;
  status: Status;
}

interface AdminSuggestionsClientProps {
  initialSuggestions: Suggestion[];
  initialClub?: Club;
  initialStatus?: Status;
  initialSearch?: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const CLUBS: { value: Club; label: string }[] = [
  { value: 'montecchia', label: 'Montecchia' },
  { value: 'frassanelle', label: 'Frassanelle' },
  { value: 'galzignano', label: 'Galzignano' },
  { value: 'albarella', label: 'Albarella' },
];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'new', label: 'Nuovo' },
  { value: 'reviewed', label: 'Esaminato' },
  { value: 'archived', label: 'Archiviato' },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function AdminSuggestionsClient({
  initialSuggestions,
  initialClub,
  initialStatus,
  initialSearch,
  currentPage,
  totalPages,
  totalCount,
}: AdminSuggestionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [club, setClub] = useState<Club | ''>(initialClub || '');
  const [status, setStatus] = useState<Status | ''>(initialStatus || '');
  const [search, setSearch] = useState(initialSearch || '');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessage = (id: string) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const updateFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (club) params.set('club', club);
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      params.set('page', '1'); // Reset to first page when filtering
      router.push(`/admin/suggestions?${params.toString()}`);
    });
  };

  const goToPage = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/admin/suggestions?${params.toString()}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Suggerimenti</h1>
          <p className="text-gray-600">
            Totale: <span className="font-semibold">{totalCount}</span> suggerimenti
          </p>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro Club */}
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-2">
                Circolo
              </label>
              <select
                id="club"
                value={club}
                onChange={(e) => setClub(e.target.value as Club | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutti</option>
                {CLUBS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Stato
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutti</option>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ricerca */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Cerca nel messaggio
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateFilters();
                    }
                  }}
                  placeholder="Cerca testo..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={updateFilters}
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {isPending ? '...' : 'Cerca'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabella */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Circolo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anonimo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messaggio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {initialSuggestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Nessun suggerimento trovato
                    </td>
                  </tr>
                ) : (
                  initialSuggestions.map((suggestion) => {
                    const isExpanded = expandedMessages.has(suggestion.id);
                    const displayMessage = isExpanded
                      ? suggestion.message
                      : truncateText(suggestion.message, 100);

                    return (
                      <tr key={suggestion.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(suggestion.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {CLUBS.find((c) => c.value === suggestion.club)?.label ||
                            suggestion.club}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {suggestion.is_anonymous ? (
                            <span className="text-gray-500">Sì</span>
                          ) : (
                            <span className="text-green-600">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {suggestion.is_anonymous || !suggestion.name ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            suggestion.name
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className={isExpanded ? '' : 'line-clamp-2'}>
                              {displayMessage}
                            </p>
                            {suggestion.message.length > 100 && (
                              <button
                                onClick={() => toggleMessage(suggestion.id)}
                                className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                {isExpanded ? 'Mostra meno' : 'Mostra tutto'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              suggestion.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : suggestion.status === 'reviewed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {STATUSES.find((s) => s.value === suggestion.status)?.label ||
                              suggestion.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Precedente
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Successivo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Pagina <span className="font-medium">{currentPage}</span> di{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1 || isPending}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Precedente
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Mostra prima, ultima, corrente, e 2 pagine prima/dopo
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        );
                      })
                      .map((page, index, array) => {
                        // Aggiungi ellipsis se necessario
                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex">
                            {showEllipsisBefore && (
                              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => goToPage(page)}
                              disabled={isPending}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              } disabled:bg-gray-100 disabled:text-gray-400`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || isPending}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Successivo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

