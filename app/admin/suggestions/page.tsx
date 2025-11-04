import { supabaseAdmin } from '@/lib/supabaseAdmin';
import AdminSuggestionsClient from './AdminSuggestionsClient';

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

interface PageProps {
  searchParams: {
    club?: string;
    status?: string;
    search?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 20;

export default async function AdminSuggestionsPage({ searchParams }: PageProps) {
  const club = searchParams.club as Club | undefined;
  const status = searchParams.status as Status | undefined;
  const search = searchParams.search || '';
  const page = parseInt(searchParams.page || '1', 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Costruisci query
  let query = supabaseAdmin
    .from('suggestions')
    .select('id, created_at, club, is_anonymous, name, message, status', {
      count: 'exact',
    })
    .order('created_at', { ascending: false });

  // Filtro club
  if (club) {
    query = query.eq('club', club);
  }

  // Filtro status
  if (status) {
    query = query.eq('status', status);
  }

  // Ricerca full-text nel messaggio
  if (search) {
    query = query.ilike('message', `%${search}%`);
  }

  // Paginazione
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching suggestions:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">Errore nel caricamento dei dati: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const suggestions = (data || []) as Suggestion[];
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <AdminSuggestionsClient
      initialSuggestions={suggestions}
      initialClub={club}
      initialStatus={status}
      initialSearch={search}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}

