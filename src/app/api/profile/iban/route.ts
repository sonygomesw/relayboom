import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: Récupérer les informations IBAN du profil
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('iban, bank_name, account_holder_name, role')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    // Masquer partiellement l'IBAN pour la sécurité
    const maskedIban = profile.iban 
      ? profile.iban.substring(0, 8) + '****' + profile.iban.substring(profile.iban.length - 4)
      : null

    return NextResponse.json({
      iban: profile.iban, // IBAN complet pour l'édition
      maskedIban, // IBAN masqué pour l'affichage
      bank_name: profile.bank_name,
      account_holder_name: profile.account_holder_name,
      hasIban: !!profile.iban,
      role: profile.role
    })
  } catch (error) {
    console.error('Erreur récupération IBAN:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT: Mettre à jour les informations IBAN
export async function PUT(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { iban, bank_name, account_holder_name } = await request.json()

    // Validation des champs requis
    if (!iban || !account_holder_name) {
      return NextResponse.json(
        { error: 'IBAN et nom du titulaire sont requis' },
        { status: 400 }
      )
    }

    // Validation format IBAN (basique)
    const cleanIban = iban.replace(/\s/g, '').toUpperCase()
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
    
    if (!ibanRegex.test(cleanIban)) {
      return NextResponse.json(
        { error: 'Format IBAN invalide' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur est un clippeur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    if (profile.role !== 'clipper') {
      return NextResponse.json(
        { error: 'Seuls les clippeurs peuvent configurer un IBAN' },
        { status: 403 }
      )
    }

    // Mettre à jour le profil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        iban: cleanIban,
        bank_name: bank_name?.trim() || null,
        account_holder_name: account_holder_name.trim()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Erreur mise à jour IBAN:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Informations bancaires sauvegardées avec succès'
    })
  } catch (error) {
    console.error('Erreur sauvegarde IBAN:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE: Supprimer les informations IBAN
export async function DELETE(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        iban: null,
        bank_name: null,
        account_holder_name: null
      })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Informations bancaires supprimées'
    })
  } catch (error) {
    console.error('Erreur suppression IBAN:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 