import { NextRequest, NextResponse } from 'next/server'
import { processAutomaticPayment } from '@/lib/stripe-cliptokk'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json()

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

    // Vérifier que l'utilisateur est créateur ou admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['creator', 'admin'].includes(profile.role)) {
      return NextResponse.json({ 
        error: 'Seuls les créateurs et admins peuvent traiter les paiements' 
      }, { status: 403 })
    }

    // Valider l'ID de soumission
    if (!submissionId) {
      return NextResponse.json({ 
        error: 'ID de soumission requis' 
      }, { status: 400 })
    }

    // Traiter le paiement automatique
    const success = await processAutomaticPayment(submissionId)

    return NextResponse.json({ 
      success,
      message: success ? 'Paiement traité avec succès' : 'Échec du traitement' 
    })
  } catch (error) {
    console.error('Erreur API traitement paiement:', error)
    
    let errorMessage = 'Erreur interne du serveur'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('Budget')) {
        errorMessage = 'Budget insuffisant pour cette campagne'
        statusCode = 400
      } else if (error.message.includes('non activé')) {
        errorMessage = 'Compte Stripe du clippeur non activé'
        statusCode = 400
      } else if (error.message.includes('non trouvée')) {
        errorMessage = 'Soumission non trouvée ou déjà traitée'
        statusCode = 404
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
} 