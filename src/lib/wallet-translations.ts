import { Language } from './clipper-translations';

export const walletTranslations = {
  en: {
    common: {
      loading: "Loading...",
      loadingWallet: "Loading your wallet...",
      error: "Error:"
    },
    wallet: {
      title: "Your Wallet",
      description: "Manage your earnings and withdrawals",
      stats: {
        totalEarnings: "Total Earnings",
        availableBalance: "Available Balance",
        pendingPayments: "Pending Payments",
        lastWithdrawal: "Last Withdrawal",
        withdrawalHistory: "Withdrawal History",
        noWithdrawals: "No withdrawals yet"
      },
      actions: {
        withdraw: "Withdraw",
        addBankAccount: "Add Bank Account",
        viewHistory: "View History"
      },
      bankAccount: {
        title: "Bank Account",
        description: "Add or update your bank account information",
        accountHolder: "Account Holder",
        iban: "IBAN",
        bic: "BIC",
        save: "Save",
        cancel: "Cancel",
        success: "Bank account updated successfully",
        error: "Error updating bank account"
      },
      withdrawal: {
        title: "Withdrawal",
        description: "Request a withdrawal of your available balance",
        amount: "Amount",
        minimumAmount: "Minimum amount:",
        maximumAmount: "Maximum amount:",
        confirm: "Confirm Withdrawal",
        cancel: "Cancel",
        success: "Withdrawal request submitted successfully",
        error: "Error submitting withdrawal request"
      }
    }
  },
  fr: {
    common: {
      loading: "Chargement...",
      loadingWallet: "Chargement de votre portefeuille...",
      error: "Erreur :"
    },
    wallet: {
      title: "Votre Portefeuille",
      description: "Gérez vos gains et vos retraits",
      stats: {
        totalEarnings: "Gains totaux",
        availableBalance: "Solde disponible",
        pendingPayments: "Paiements en attente",
        lastWithdrawal: "Dernier retrait",
        withdrawalHistory: "Historique des retraits",
        noWithdrawals: "Aucun retrait pour le moment"
      },
      actions: {
        withdraw: "Retirer",
        addBankAccount: "Ajouter un compte bancaire",
        viewHistory: "Voir l'historique"
      },
      bankAccount: {
        title: "Compte bancaire",
        description: "Ajoutez ou mettez à jour vos informations bancaires",
        accountHolder: "Titulaire du compte",
        iban: "IBAN",
        bic: "BIC",
        save: "Enregistrer",
        cancel: "Annuler",
        success: "Compte bancaire mis à jour avec succès",
        error: "Erreur lors de la mise à jour du compte bancaire"
      },
      withdrawal: {
        title: "Retrait",
        description: "Demandez un retrait de votre solde disponible",
        amount: "Montant",
        minimumAmount: "Montant minimum :",
        maximumAmount: "Montant maximum :",
        confirm: "Confirmer le retrait",
        cancel: "Annuler",
        success: "Demande de retrait soumise avec succès",
        error: "Erreur lors de la soumission de la demande de retrait"
      }
    }
  }
}; 