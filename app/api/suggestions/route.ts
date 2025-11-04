import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const clubEnum = z.enum(['montecchia', 'frassanelle', 'galzignano', 'albarella']);

const suggestionSchema = z.object({
  club: clubEnum,
  message: z.string().min(10).max(4000),
  is_anonymous: z.boolean(),
  name: z.string().optional(),
  honey: z.string().optional(),
});

type SuggestionInput = z.infer<typeof suggestionSchema>;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback: cerca nell'URL o usa un default
  return 'unknown';
}

function hashIp(ip: string): string {
  const hashSalt = process.env.HASH_SALT;
  if (!hashSalt) {
    throw new Error('HASH_SALT environment variable is not set');
  }
  
  const hash = createHash('sha256');
  hash.update(ip + hashSalt);
  return hash.digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validazione con Zod
    const validationResult = suggestionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Honeypot antispam: se il campo honey è presente e ha contenuto (max length 0), non salvare
    if (data.honey && data.honey.length > 0) {
      return NextResponse.json({ ok: true });
    }
    
    // Hash IP
    const clientIp = getClientIp(request);
    const ipHash = hashIp(clientIp);
    
    // User agent
    const userAgent = request.headers.get('user-agent') || null;
    
    // Preparazione dati per inserimento
    const insertData: {
      club: string;
      message: string;
      is_anonymous: boolean;
      name: string | null;
      user_agent: string | null;
      ip_sha256: string;
    } = {
      club: data.club,
      message: data.message,
      is_anonymous: data.is_anonymous,
      name: data.is_anonymous ? null : (data.name || null),
      user_agent: userAgent,
      ip_sha256: ipHash,
    };
    
    // Inserimento in Supabase
    const { error } = await supabaseAdmin
      .from('suggestions')
      .insert(insertData);
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to save suggestion' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

