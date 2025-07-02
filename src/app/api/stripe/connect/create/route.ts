import { NextRequest, NextResponse } from 'next/server'
import { createClipperStripeAccount } from '@/lib/stripe-cliptokk'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, country = 'FR' } = await req.json()

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un clippeur
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'clipper') {
      return NextResponse.json({ 
        error: 'Seuls les clippeurs peuvent créer un compte Stripe' 
      }, { status: 403 })
    }

    // Valider l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        error: 'Email invalide' 
      }, { status: 400 })
    }

    // Créer le compte Stripe Connect
    const result = await createClipperStripeAccount(user.id, email, country)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur API création compte Stripe:', error)
    
    if (error instanceof Error && error.message.includes('déjà existant')) {
      return NextResponse.json(
        { error: 'Compte Stripe déjà existant' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 