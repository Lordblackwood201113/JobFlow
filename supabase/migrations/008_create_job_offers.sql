-- Suppression de la table précédente pour repartir sur la nouvelle structure demandée
drop table if exists job_offers;

create table job_offers (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,        -- Entreprise
  position_title text not null,      -- Poste
  job_url text,                      -- Lien de l'offre
  location text,                     -- Localisation
  source text,                       -- Source
  work_type text,                    -- Type de travail
  published_at timestamptz default now(), -- Date de publication
  application_deadline date,         -- Date limite de candidature
  contact_name text,                 -- Nom du contact
  contact_email text,                -- Email du contact
  contact_phone text,                -- Téléphone du contact
  description text,                  -- Description du poste
  requirements text,                 -- Prérequis

  -- Champs techniques supplémentaires
  created_at timestamptz default now(),
  is_active boolean default true,
  tags text[] default '{}'
);

-- Index pour optimiser la recherche textuelle
create index job_offers_search_idx on job_offers using gin(to_tsvector('french', position_title || ' ' || coalesce(company_name, '')));

-- Activation de la sécurité (RLS)
alter table job_offers enable row level security;

-- Politique : Tout utilisateur connecté peut voir les offres actives
create policy "Users can view active job offers"
  on job_offers for select
  to authenticated
  using (is_active = true);

-- Politique : Tout utilisateur connecté peut insérer des offres (pour les scripts d'import ou admins)
create policy "Authenticated users can insert offers"
  on job_offers for insert
  to authenticated
  with check (true);
