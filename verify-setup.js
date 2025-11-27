import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables depuis .env.local
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('\n🔍 Vérification de la configuration Supabase...\n');

async function verifySetup() {
  const results = {
    connection: false,
    tables: {
      profiles: false,
      jobs: false,
      documents: false
    },
    storage: false,
    view: false
  };

  try {
    // 1. Test de connexion
    console.log('1️⃣  Test de connexion à Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(0);

    if (!testError || testError.code === 'PGRST116') {
      results.connection = true;
      console.log('   ✅ Connexion réussie\n');
    } else {
      console.log('   ❌ Erreur de connexion:', testError.message, '\n');
      return results;
    }

    // 2. Vérification des tables
    console.log('2️⃣  Vérification des tables...');

    // Table profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (!profilesError || profilesError.code === 'PGRST116') {
      results.tables.profiles = true;
      console.log('   ✅ Table "profiles" existe');
    } else {
      console.log('   ❌ Table "profiles" introuvable:', profilesError.message);
    }

    // Table jobs
    const { error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .limit(1);

    if (!jobsError || jobsError.code === 'PGRST116') {
      results.tables.jobs = true;
      console.log('   ✅ Table "jobs" existe');
    } else {
      console.log('   ❌ Table "jobs" introuvable:', jobsError.message);
    }

    // Table documents
    const { error: docsError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);

    if (!docsError || docsError.code === 'PGRST116') {
      results.tables.documents = true;
      console.log('   ✅ Table "documents" existe');
    } else {
      console.log('   ❌ Table "documents" introuvable:', docsError.message);
    }

    console.log('');

    // 3. Vérification du Storage
    console.log('3️⃣  Vérification du Storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (!bucketsError) {
      const jobDocsBucket = buckets.find(b => b.name === 'job-documents');
      if (jobDocsBucket) {
        results.storage = true;
        console.log('   ✅ Bucket "job-documents" existe');
        console.log(`      Public: ${jobDocsBucket.public ? 'Oui' : 'Non (privé) ✓'}`);
      } else {
        console.log('   ❌ Bucket "job-documents" introuvable');
      }
    } else {
      console.log('   ❌ Erreur lors de la récupération des buckets:', bucketsError.message);
    }

    console.log('');

    // 4. Vérification de la vue job_stats
    console.log('4️⃣  Vérification de la vue "job_stats"...');
    const { error: viewError } = await supabase
      .from('job_stats')
      .select('*')
      .limit(1);

    if (!viewError || viewError.code === 'PGRST116') {
      results.view = true;
      console.log('   ✅ Vue "job_stats" existe\n');
    } else {
      console.log('   ❌ Vue "job_stats" introuvable:', viewError.message, '\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
  console.log('='.repeat(50));

  const allChecks = [
    results.connection,
    ...Object.values(results.tables),
    results.storage,
    results.view
  ];

  const passed = allChecks.filter(Boolean).length;
  const total = allChecks.length;

  console.log(`\n✓ Vérifications réussies: ${passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 Toutes les migrations ont été correctement exécutées!');
    console.log('✅ Votre base de données est prête à être utilisée.\n');
  } else {
    console.log('\n⚠️  Certaines vérifications ont échoué.');
    console.log('📝 Veuillez exécuter le fichier complete_setup.sql dans Supabase SQL Editor.\n');
  }

  return results;
}

verifySetup().catch(console.error);
