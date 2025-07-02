'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'
import { IconWallet, IconArrowUp, IconArrowDown, IconClock, IconCreditCard, IconCheck } from '@tabler/icons-react'
import StripePaymentForm from '@/components/StripePaymentForm'

interface WalletStats {
  totalDeposited: number
  availableCredits: number
  reservedCredits: number
  spentCredits: number
  lastRechargeAt: string | null
}

interface Transaction {
  id: string
  type: 'recharge' | 'payment' | 'reserve'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export default function WalletPage() {
  const { user } = useAuth()
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalDeposited: 0,
    availableCredits: 0,
    reservedCredits: 0,
    spentCredits: 0,
    lastRechargeAt: null
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRecharge, setShowRecharge] = useState(false)
  const [isStripeConfigured, setIsStripeConfigured] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [showStripeForm, setShowStripeForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)

  useEffect(() => {
    if (user?.id) {
      loadWalletData()
    }
    checkStripeConfiguration()
  }, [user?.id])

  const checkStripeConfiguration = () => {
    // Côté client, on ne peut vérifier que la clé publique
    // La clé secrète n'est accessible que côté serveur (et c'est normal !)
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    console.log('🔍 Vérification configuration Stripe (client):', {
      hasPublishableKey,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configurée' : 'Manquante',
      isConfigured: hasPublishableKey
    })
    
    setIsStripeConfigured(hasPublishableKey)
  }

  const loadWalletData = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)

      // Récupérer ou créer le wallet
      let { data: wallet, error } = await supabase
        .from('creator_wallets')
        .select('*')
        .eq('creator_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Aucun wallet trouvé, créer un nouveau wallet
        console.log('Creating new wallet for user:', user.id)
        const { data: newWallet, error: createError } = await supabase
          .from('creator_wallets')
          .insert({
            creator_id: user.id,
            available_credits: 0,
            total_deposited: 0,
            total_credits: 0,
            reserved_credits: 0,
            spent_credits: 0,
            last_recharge_at: null
          })
          .select()
          .single()

        if (createError) {
          console.error('Erreur création wallet:', createError)
          return
        }
        wallet = newWallet
      } else if (error) {
        console.error('Erreur récupération wallet:', error)
        return
      }

      // Convertir les montants de centimes en euros
      const walletData: WalletStats = {
        totalDeposited: (wallet?.total_deposited || 0) / 100,
        availableCredits: (wallet?.available_credits || 0) / 100,
        reservedCredits: (wallet?.reserved_credits || 0) / 100,
        spentCredits: (wallet?.spent_credits || 0) / 100,
        lastRechargeAt: wallet?.last_recharge_at
      }

      setWalletStats(walletData)

      // Récupérer l'historique des transactions depuis wallet_recharges
      console.log('📋 Récupération de l\'historique des transactions...')
      const { data: transactionsData, error: transError } = await supabase
        .from('wallet_recharges')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (transError) {
        console.error('❌ Erreur récupération transactions:', transError)
        console.log('Détails de l\'erreur transactions:', {
          code: transError.code,
          message: transError.message,
          details: transError.details
        })
        
        if (transError.code === 'PGRST116') {
          console.log('ℹ️ Aucune transaction trouvée - c\'est normal pour un nouveau compte')
        } else if (transError.code === '42P01') {
          console.log('⚠️ Table wallet_recharges n\'existe pas - utilisez les scripts SQL pour la créer')
        }
        
        // Définir des transactions vides au lieu de planter
        setTransactions([])
      } else {
        console.log('✅ Transactions récupérées:', transactionsData)
        // Convertir les transactions en format attendu
        const formattedTransactions: Transaction[] = (transactionsData || []).map(t => ({
          id: t.id,
          type: 'recharge', // toutes les entrées dans wallet_recharges sont des recharges
          amount: t.gross_amount / 100, // Convertir en euros (utiliser gross_amount)
          description: `Recharge ${t.gross_amount / 100}€ (net: ${t.net_amount / 100}€)`,
          date: t.created_at,
          status: t.status === 'succeeded' ? 'completed' : (t.status || 'completed') // Mapper succeeded -> completed
        }))
        setTransactions(formattedTransactions)
        console.log('✅ Transactions formatées:', formattedTransactions)
      }

    } catch (error) {
      console.error('Erreur chargement wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRechargeSuccess = async (amount: number) => {
    console.log('🎯 CLIC DÉTECTÉ ! Montant:', amount)
    console.log('🎯 User ID:', user?.id)
    console.log('🎯 User complet:', user)
    
    if (!user?.id) {
      console.error('❌ Aucun utilisateur connecté')
      alert('Erreur : Aucun utilisateur connecté')
      return
    }

    try {
      console.log('🔄 Début de la recharge:', { userId: user.id, amount })

      // Récupérer le wallet actuel
      console.log('📖 Récupération du wallet actuel...')
      const { data: currentWallet, error: fetchError } = await supabase
        .from('creator_wallets')
        .select('*')
        .eq('creator_id', user.id)
        .single()

      if (fetchError) {
        console.error('❌ Erreur récupération wallet:', fetchError)
        console.log('Détails de l\'erreur:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details
        })
        
        // Si le wallet n'existe pas, essayons de le créer
        if (fetchError.code === 'PGRST116') {
          console.log('💡 Tentative de création du wallet...')
          const { data: newWallet, error: createError } = await supabase
            .from('creator_wallets')
            .insert({
              creator_id: user.id,
              available_credits: amount * 100, // Directement avec le montant rechargé
              total_deposited: amount * 100,
              total_credits: amount * 100, // Ajouter pour respecter la contrainte
              reserved_credits: 0,
              spent_credits: 0,
              last_recharge_at: new Date().toISOString()
            })
            .select()
            .single()

          if (createError) {
            console.error('❌ Erreur création wallet:', createError)
            alert(`Erreur création wallet: ${createError.message}`)
            return
          }

          console.log('✅ Wallet créé avec succès:', newWallet)
          
          // Recharger les données et terminer
          await loadWalletData()
          setShowRecharge(false)
          alert(`Simulation : ${amount}€ ajoutés au wallet !`)
          return
        } else {
          alert(`Erreur récupération wallet: ${fetchError.message}`)
          return
        }
      }

      console.log('✅ Wallet actuel récupéré:', currentWallet)

      // Calculer les nouveaux montants
      const newAvailableCredits = (currentWallet?.available_credits || 0) + (amount * 100)
      const newTotalDeposited = (currentWallet?.total_deposited || 0) + (amount * 100)

      console.log('💰 Nouveaux montants calculés:', {
        currentAvailable: currentWallet?.available_credits || 0,
        currentTotal: currentWallet?.total_deposited || 0,
        newAvailable: newAvailableCredits,
        newTotal: newTotalDeposited
      })

      // Mettre à jour le wallet dans Supabase avec une approche alternative
      console.log('💾 Mise à jour du wallet avec SQL raw...')
      
      // Essayons d'abord avec une requête SQL brute pour contourner la contrainte
      const { data: sqlResult, error: sqlError } = await supabase.rpc('update_wallet_credits', {
        user_id: user.id,
        credit_amount: amount * 100,
        deposited_amount: amount * 100
      })

      if (sqlError) {
        console.log('⚠️ RPC échoué, essayons avec UPDATE direct...')
        
        // Si la fonction RPC n'existe pas, essayons avec une mise à jour directe simplifiée
        const { data: updatedWallet, error: updateError } = await supabase
          .from('creator_wallets')
          .update({
            available_credits: newAvailableCredits,
            total_deposited: newTotalDeposited,
            total_credits: newTotalDeposited,
            last_recharge_at: new Date().toISOString()
          })
          .eq('creator_id', user.id)
          .select()

        if (updateError) {
          console.error('❌ Erreur mise à jour wallet:', updateError)
          console.log('Détails de l\'erreur update:', {
            code: updateError.code,
            message: updateError.message,
            details: updateError.details
          })
          
          // Essayons une dernière approche : mise à jour champ par champ
          console.log('🔄 Tentative de mise à jour champ par champ...')
          
          try {
            // Mise à jour des crédits disponibles seulement
            const { error: creditsError } = await supabase
              .from('creator_wallets')
              .update({ available_credits: newAvailableCredits })
              .eq('creator_id', user.id)
            
            if (creditsError) throw creditsError
            
            // Mise à jour du total déposé
            const { error: totalError } = await supabase
              .from('creator_wallets')
              .update({ total_deposited: newTotalDeposited })
              .eq('creator_id', user.id)
            
            if (totalError) throw totalError
            
            // Mise à jour de la date
            const { error: dateError } = await supabase
              .from('creator_wallets')
              .update({ last_recharge_at: new Date().toISOString() })
              .eq('creator_id', user.id)
            
            if (dateError) throw dateError
            
            console.log('✅ Mise à jour champ par champ réussie')
            
          } catch (fieldError) {
            console.error('❌ Échec de toutes les méthodes de mise à jour:', fieldError)
            alert(`Toutes les tentatives de mise à jour ont échoué. Veuillez vérifier les contraintes de la base de données.`)
            return
          }
        } else {
          console.log('✅ Wallet mis à jour avec succès (méthode directe):', updatedWallet)
        }
      } else {
        console.log('✅ Wallet mis à jour avec succès (RPC):', sqlResult)
      }

      // Essayer d'ajouter dans wallet_recharges (si cette table existe et a la bonne structure)
      console.log('📝 Tentative d\'ajout dans wallet_recharges...')
      try {
        // Calculer la commission (10% comme dans la structure)
        const grossAmount = amount * 100 // Montant brut en centimes
        const commissionAmount = Math.round(grossAmount * 0.10) // Commission 10%
        const netAmount = grossAmount - commissionAmount // Montant net

        const { error: rechargeError } = await supabase
          .from('wallet_recharges')
          .insert({
            creator_id: user.id,
            stripe_payment_intent_id: `sim_${Date.now()}_${user.id.slice(0, 8)}`, // ID de simulation unique
            gross_amount: grossAmount,
            commission_amount: commissionAmount,
            net_amount: netAmount,
            currency: 'eur',
            status: 'succeeded' // Pour les simulations, directement succeeded
          })

        if (rechargeError) {
          console.error('⚠️ Erreur ajout dans wallet_recharges (on continue):', rechargeError)
          console.log('Détails erreur recharge:', {
            code: rechargeError.code,
            message: rechargeError.message,
            details: rechargeError.details
          })
        } else {
          console.log('✅ Recharge ajoutée dans wallet_recharges avec commission')
          console.log(`💰 Détails: ${amount}€ brut → ${netAmount/100}€ net (commission: ${commissionAmount/100}€)`)
        }
      } catch (rechargeErr) {
        console.error('⚠️ Table wallet_recharges inaccessible (on continue):', rechargeErr)
      }

      // Recharger les données
      console.log('🔄 Rechargement des données...')
      await loadWalletData()
      setShowRecharge(false)

      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('walletUpdated', { 
        detail: { 
          availableCredits: newAvailableCredits / 100 // convertir en euros
        } 
      }))

      console.log('🎉 Recharge terminée avec succès')
      alert(`Simulation : ${amount}€ ajoutés au wallet !`)

    } catch (error) {
      console.error('❌ Erreur générale recharge:', error)
      alert(`Erreur générale: ${error}`)
    }
  }

  const handleRechargeError = (error: string) => {
    console.error('Erreur recharge:', error)
  }

  const handleStripeRecharge = async (amount: number) => {
    console.log('💳 Démarrage recharge Stripe pour:', amount, '€')
    
    // Si Stripe n'est pas configuré, utiliser la simulation
    if (!isStripeConfigured) {
      console.log('⚠️ Stripe non configuré, basculement vers simulation...')
      await handleRechargeSuccess(amount)
      return
    }

    // Afficher le formulaire de paiement Stripe
    setPaymentAmount(amount)
    setShowStripeForm(true)
  }

  const handlePaymentSuccess = async () => {
    console.log('✅ Paiement Stripe réussi !')
    
    // Fermer le formulaire
    setShowStripeForm(false)
    setShowRecharge(false)
    
    // Recharger les données wallet
    await loadWalletData()
    
    alert(`Paiement réussi ! ${paymentAmount}€ ajoutés à votre wallet.`)
  }

  const handlePaymentError = (error: string) => {
    console.error('❌ Erreur paiement Stripe:', error)
    alert(`Erreur de paiement: ${error}`)
  }

  const handlePaymentCancel = () => {
    setShowStripeForm(false)
  }

  const handleCustomRecharge = () => {
    const amount = parseFloat(customAmount)
    
    // Validation du montant (suppression du maximum)
    if (isNaN(amount) || amount < 10) {
      alert('Veuillez saisir un montant valide (minimum 10€)')
      return
    }
    
    // Arrondir à 2 décimales
    const roundedAmount = Math.round(amount * 100) / 100
    
    if (isStripeConfigured) {
      handleStripeRecharge(roundedAmount)
    } else {
      handleRechargeSuccess(roundedAmount)
    }
    
    // Reset du champ
    setCustomAmount('')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <IconArrowUp className="w-5 h-5 text-green-600" />
      case 'payment':
        return <IconArrowDown className="w-5 h-5 text-red-600" />
      case 'reserve':
        return <IconClock className="w-5 h-5 text-yellow-600" />
      default:
        return <IconWallet className="w-5 h-5 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'recharge':
        return 'text-green-600'
      case 'payment':
        return 'text-red-600'
      case 'reserve':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  if (showRecharge) {
    return (
      <div className="p-6">
        <button
          onClick={() => setShowRecharge(false)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Retour au wallet
        </button>
        
        {/* Recharge form */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Recharger le wallet</h2>
          
          <div className="space-y-4 mb-6">
            {!isStripeConfigured ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">🔧 Mode test</p>
                <p className="text-blue-600 text-sm">La recharge Stripe n'est pas configurée. Utilisez le bouton de simulation ci-dessous.</p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">💳 Recharge Stripe</p>
                <p className="text-green-600 text-sm">Stripe est configuré. Vous pouvez maintenant effectuer de vraies recharges.</p>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-3">
              {[50, 100, 250].map(amount => (
                <button
                  key={amount}
                  onClick={() => isStripeConfigured ? handleStripeRecharge(amount) : handleRechargeSuccess(amount)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center font-medium"
                >
                  {amount}€
                </button>
              ))}
            </div>

            {/* Champ de saisie personnalisé */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ou saisissez un montant personnalisé
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Ex: 75"
                    min="10"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium"
                  />
                  <span className="absolute right-3 top-3 text-gray-500 font-medium">€</span>
                </div>
                <button
                  onClick={handleCustomRecharge}
                  disabled={!customAmount || parseFloat(customAmount) < 10}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  💳 Recharger
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Montant minimum : 10€
              </p>
            </div>
            
            {!isStripeConfigured ? (
              <button
                onClick={() => handleRechargeSuccess(100)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
              >
                Simuler recharge 100€
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  💡 Utilisez les boutons ci-dessus ou saisissez un montant personnalisé
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Affichage du formulaire de paiement Stripe
  if (showStripeForm) {
    return (
      <div className="p-6">
        <button
          onClick={() => setShowStripeForm(false)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Retour
        </button>
        
        <div className="max-w-md mx-auto">
          <StripePaymentForm
            amount={paymentAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <IconWallet className="w-8 h-8 text-blue-600" />
          Mon Wallet
        </h1>
        <button
          onClick={() => setShowRecharge(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <IconArrowUp className="w-5 h-5" />
          Recharger
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du wallet...</p>
        </div>
      ) : (
        <>
          {/* Stats principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <IconWallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crédits disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(walletStats.availableCredits)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Pour lancer de nouvelles missions
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconArrowUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total déposé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(walletStats.totalDeposited)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Depuis la création du compte
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <IconClock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crédits réservés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(walletStats.reservedCredits)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Pour les missions en cours
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IconArrowDown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crédits dépensés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(walletStats.spentCredits)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Payés aux clippeurs
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Informations</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Dernière recharge</p>
                <p className="text-base font-medium">
                  {formatDate(walletStats.lastRechargeAt)}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Comment ça marche ?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Une commission de 10% est prélevée lors de la recharge</li>
                  <li>• Les clippeurs reçoivent 100% des gains promis</li>
                  <li>• Les crédits sont automatiquement réservés lors de la création d'une mission</li>
                  <li>• Les paiements sont effectués automatiquement à la validation des clips</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Historique des transactions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Historique des transactions</h2>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <IconWallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune transaction pour le moment</p>
                <p className="text-sm text-gray-400">Vos transactions apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Terminé' : 
                         transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 