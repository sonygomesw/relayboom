import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createStripeAccount, createAccountLink } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Headers CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token d\'authentification manquant' }, { status: 401, headers })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Créer un client Supabase avec le token utilisateur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Erreur auth:', authError)
      return NextResponse.json({ error: 'Non authentifié', details: authError?.message }, { status: 401, headers })
    }

    // Récupérer le profil utilisateur
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Erreur profil:', profileError)
      // Si le profil n'existe pas, utiliser l'email du user
      if (profileError?.code === 'PGRST116') {
        // Profil non trouvé, on utilise l'email du token JWT
        const email = user.email
        if (!email) {
          return NextResponse.json({ error: 'Email utilisateur non trouvé' }, { status: 404, headers })
        }
        
        // Créer le profil en même temps
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: email,
            pseudo: email.split('@')[0],
            created_at: new Date().toISOString()
          })
        
        if (createProfileError) {
          console.error('Erreur création profil:', createProfileError)
        }
        
        // Utiliser l'email du token
        profile = { email }
      } else {
        return NextResponse.json({ error: 'Profil non trouvé', details: profileError?.message }, { status: 404, headers })
      }
    }

    // Vérifier si l'utilisateur a déjà un compte Stripe
    const { data: existingAccount } = await supabase
      .from('clipper_stripe_accounts')
      .select('stripe_account_id')
      .eq('clipper_id', user.id)
      .single()

    if (existingAccount) {
      return NextResponse.json({ 
        error: 'Un compte Stripe existe déjà',
        accountId: existingAccount.stripe_account_id 
      }, { status: 400, headers })
    }

    // Créer le compte Stripe Connect
    const stripeAccount = await createStripeAccount(profile.email)
    
    // Sauvegarder l'ID du compte Stripe dans la base de données
    const { error: dbError } = await supabase
      .from('clipper_stripe_accounts')
      .insert({
        clipper_id: user.id,
        stripe_account_id: stripeAccount.id,
        status: 'pending',
        charges_enabled: false,
        payouts_enabled: false,
        requirements_currently_due: [],
        requirements_eventually_due: []
      })

    if (dbError) {
      console.error('Erreur sauvegarde compte Stripe:', dbError)
      return NextResponse.json({ error: 'Erreur sauvegarde', details: dbError.message }, { status: 500, headers })
    }

    // Créer le lien d'onboarding
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const accountLink = await createAccountLink(
      stripeAccount.id,
      `${baseUrl}/dashboard/clipper/stripe/refresh`,
      `${baseUrl}/dashboard/clipper/stripe/success`
    )

    return NextResponse.json({
      accountId: stripeAccount.id,
      onboardingUrl: accountLink.url,
      success: true
    }, { headers })

  } catch (error) {
    console.error('Erreur API create-account:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }})
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 