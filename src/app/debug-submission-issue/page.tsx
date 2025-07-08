'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthContext'

export default function DebugSubmissionIssue() {
  const { user } = useAuth()
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [testMissionId, setTestMissionId] = useState('')

  const runDiagnostic = async () => {
    if (!user) {
      alert('Vous devez être connecté pour faire ce diagnostic')
      return
    }

    setLoading(true)
    const diagnosticResults: any = {}

    try {
      // 1. Vérifier la structure des tables
      console.log('🔍 Test 1: Structure des tables...')
      
      // Vérifier les tables existantes
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['missions', 'submissions', 'clip_submissions'])
      
      diagnosticResults.tables = {
        success: !tablesError,
        data: tables?.map(t => t.table_name) || [],
        error: tablesError?.message
      }

      // 2. Vérifier les missions existantes
      console.log('🔍 Test 2: Missions existantes...')
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('id, title, status, creator_name')
        .limit(10)
      
      diagnosticResults.missions = {
        success: !missionsError,
        count: missions?.length || 0,
        data: missions || [],
        error: missionsError?.message
      }

      // 3. Vérifier les contraintes de la table submissions
      console.log('🔍 Test 3: Contraintes table submissions...')
      const { data: constraints, error: constraintsError } = await supabase
        .rpc('get_table_constraints', { table_name_param: 'submissions' })
        .single()
      
      diagnosticResults.constraints = {
        success: !constraintsError,
        data: constraints,
        error: constraintsError?.message || 'RPC non disponible'
      }

      // 4. Test d'insertion avec une mission existante
      if (missions && missions.length > 0) {
        console.log('🔍 Test 4: Test insertion avec mission existante...')
        const testMission = missions[0]
        
        try {
          const testData = {
            mission_id: testMission.id,
            user_id: user.id,
            tiktok_url: 'https://tiktok.com/@test/video/diagnostic123',
            description: 'Test diagnostic',
            status: 'pending',
            views_count: 0,
            submission_type: 'url',
            created_at: new Date().toISOString()
          }

          const { data: insertResult, error: insertError } = await supabase
            .from('submissions')
            .insert(testData)
            .select()

          diagnosticResults.testInsertion = {
            success: !insertError,
            data: insertResult,
            error: insertError?.message
          }

          // Nettoyer le test
          if (insertResult && insertResult[0]) {
            await supabase
              .from('submissions')
              .delete()
              .eq('id', insertResult[0].id)
          }

        } catch (testError) {
          diagnosticResults.testInsertion = {
            success: false,
            error: (testError as Error).message
          }
        }
      }

      // 5. Test avec mission inexistante
      console.log('🔍 Test 5: Test avec mission inexistante...')
      try {
        const testData = {
          mission_id: 'non-existent-mission-id',
          user_id: user.id,
          tiktok_url: 'https://tiktok.com/@test/video/diagnostic456',
          description: 'Test mission inexistante',
          status: 'pending',
          views_count: 0,
          submission_type: 'url',
          created_at: new Date().toISOString()
        }

        const { data: badInsertResult, error: badInsertError } = await supabase
          .from('submissions')
          .insert(testData)
          .select()

        diagnosticResults.testBadInsertion = {
          success: !badInsertError,
          data: badInsertResult,
          error: badInsertError?.message,
          errorCode: badInsertError?.code
        }

      } catch (badTestError) {
        diagnosticResults.testBadInsertion = {
          success: false,
          error: (badTestError as Error).message
        }
      }

      // 6. Vérifier les RLS policies
      console.log('🔍 Test 6: Vérification RLS policies...')
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('tablename, policyname, permissive, cmd, qual')
        .eq('tablename', 'submissions')
      
      diagnosticResults.policies = {
        success: !policiesError,
        data: policies || [],
        error: policiesError?.message
      }

      setResults(diagnosticResults)

    } catch (error) {
      console.error('Erreur diagnostic:', error)
      setResults({
        globalError: (error as Error).message
      })
    } finally {
      setLoading(false)
    }
  }

  const testSpecificMission = async () => {
    if (!testMissionId || !user) return

    setLoading(true)
    try {
      // Vérifier si la mission existe
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('id, title, status')
        .eq('id', testMissionId)
        .single()

      const testData = {
        mission_id: testMissionId,
        user_id: user.id,
        tiktok_url: `https://tiktok.com/@test/video/${Date.now()}`,
        description: 'Test mission spécifique',
        status: 'pending',
        views_count: 0,
        submission_type: 'url',
        created_at: new Date().toISOString()
      }

      const { data: insertResult, error: insertError } = await supabase
        .from('submissions')
        .insert(testData)
        .select()

             setResults((prev: any) => ({
         ...prev,
         specificTest: {
           missionExists: !missionError,
           missionData: mission,
           insertSuccess: !insertError,
           insertData: insertResult,
           insertError: insertError?.message,
           insertErrorCode: insertError?.code
         }
       }))

      // Nettoyer
      if (insertResult && insertResult[0]) {
        await supabase
          .from('submissions')
          .delete()
          .eq('id', insertResult[0].id)
      }

         } catch (error) {
       setResults((prev: any) => ({
         ...prev,
         specificTest: {
           error: (error as Error).message
         }
       }))
    } finally {
      setLoading(false)
    }
  }

  const renderResult = (title: string, result: any) => {
    if (!result) return null

    return (
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? '✅ Succès' : '❌ Échec'}
          {result.error && (
            <div className="text-red-600 mt-1">
              <strong>Erreur:</strong> {result.error}
              {result.errorCode && <span className="ml-2 text-gray-500">({result.errorCode})</span>}
            </div>
          )}
          {result.count !== undefined && (
            <div className="text-gray-600 mt-1">Nombre d'éléments: {result.count}</div>
          )}
        </div>
        {result.data && (
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">Voir les données</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté pour utiliser ce diagnostic</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔍 Diagnostic Problème Soumission</h1>
          
          <div className="mb-6 space-y-4">
            <button
              onClick={runDiagnostic}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '⏳ Diagnostic en cours...' : '🚀 Lancer le diagnostic complet'}
            </button>

            <div className="flex gap-4">
              <input
                type="text"
                value={testMissionId}
                onChange={(e) => setTestMissionId(e.target.value)}
                placeholder="ID de mission spécifique à tester"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={testSpecificMission}
                disabled={loading || !testMissionId}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Tester Mission
              </button>
            </div>
          </div>

          {results.globalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800">Erreur Globale</h3>
              <p className="text-red-600">{results.globalError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">📋 Diagnostic Base de Données</h2>
              {renderResult('1. Tables Existantes', results.tables)}
              {renderResult('2. Missions Disponibles', results.missions)}
              {renderResult('3. Contraintes Table', results.constraints)}
              {renderResult('6. Politiques RLS', results.policies)}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">🧪 Tests d'Insertion</h2>
              {renderResult('4. Insertion Valide', results.testInsertion)}
              {renderResult('5. Insertion Mission Inexistante', results.testBadInsertion)}
              {renderResult('Test Mission Spécifique', results.specificTest)}
            </div>
          </div>

          {/* Conseils basés sur les résultats */}
          {Object.keys(results).length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Analyse des Résultats</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {results.testBadInsertion?.errorCode === '23503' && (
                  <li>• <strong>Contrainte clé étrangère:</strong> Le mission_id doit exister dans la table missions</li>
                )}
                {results.testInsertion?.success === false && (
                  <li>• <strong>Problème RLS:</strong> Vérifiez les politiques de sécurité au niveau ligne</li>
                )}
                {results.missions?.count === 0 && (
                  <li>• <strong>Pas de missions:</strong> La table missions est vide</li>
                )}
                <li>• <strong>Solution:</strong> S'assurer que le missionId existe avant l'insertion</li>
                <li>• <strong>Alternative:</strong> Supprimer la contrainte FK si les missions sont externes</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 