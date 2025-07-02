import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: Récupérer les paiements en attente (pour admin) ou les paiements d'un clippeur
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil pour vérifier le rôle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'all'

    if (profile.role === 'admin') {
      // Admin: voir tous les paiements ou filtrer par statut
      let query = supabase
        .from('admin_pending_payments')
        .select('*')

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      const { data: payments, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ payments })
    } else if (profile.role === 'clipper') {
      // Clippeur: voir seulement ses propres paiements
      let query = supabase
        .from('pending_payments')
        .select(`
          *,
          campaigns(title, creator_id),
          profiles!campaigns_creator_id_fkey(full_name)
        `)
        .eq('clipper_id', user.id)

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      const { data: payments, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ payments })
    } else {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
  } catch (error) {
    console.error('Erreur récupération paiements:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST: Créer un paiement en attente (appelé automatiquement lors de l'approbation d'une soumission)
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que c'est un admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 })
    }

    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: 'ID de soumission requis' },
        { status: 400 }
      )
    }

    // Appeler la fonction SQL pour créer le paiement en attente
    const { data: paymentId, error } = await supabase.rpc('create_pending_payment', {
      submission_id_param: submissionId
    })

    if (error) {
      console.error('Erreur création paiement:', error)
      
      if (error.message.includes('IBAN manquant')) {
        return NextResponse.json(
          { error: 'Le clippeur doit renseigner son IBAN avant de recevoir des paiements' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || 'Erreur création paiement' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentId,
      message: 'Paiement en attente créé avec succès'
    })
  } catch (error) {
    console.error('Erreur création paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT: Marquer un paiement comme effectué (admin seulement)
export async function PUT(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que c'est un admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 })
    }

    const { paymentId, paymentReference, adminNotes } = await request.json()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement requis' },
        { status: 400 }
      )
    }

    // Appeler la fonction SQL pour marquer comme payé
    const { data, error } = await supabase.rpc('mark_payment_as_paid', {
      payment_id_param: paymentId,
      payment_reference_param: paymentReference || null,
      admin_notes_param: adminNotes || null
    })

    if (error) {
      console.error('Erreur marquage paiement:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur marquage paiement' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Paiement marqué comme effectué'
    })
  } catch (error) {
    console.error('Erreur marquage paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 