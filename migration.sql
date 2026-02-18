-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de organizaciones
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_code text UNIQUE NOT NULL, -- Código único para login
  logo_url text,
  primary_color text DEFAULT '#1e293b',
  secondary_color text DEFAULT '#64748b',
  custom_text jsonb, -- Textos personalizados
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de perfiles (extiende auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('super_admin', 'owner', 'employee', 'readonly')),
  organization_id uuid REFERENCES organizations,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger para crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Familias dolientes
CREATE TABLE families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text NOT NULL,
  address text,
  relationship text, -- Relación con el difunto
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Catálogo de servicios
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  duration_minutes int DEFAULT 120,
  category text NOT NULL CHECK (category IN ('velatorio', 'cremacion', 'entierro', 'paquete')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Ceremonias
CREATE TABLE ceremonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  family_id uuid REFERENCES families NOT NULL,
  service_id uuid REFERENCES services NOT NULL,
  deceased_name text NOT NULL,
  deceased_birth_date date NOT NULL,
  deceased_death_date date NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'programada' CHECK (status IN ('programada', 'en_proceso', 'completada', 'cancelada')),
  location text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Contratos
CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ceremony_id uuid REFERENCES ceremonies NOT NULL,
  organization_id uuid REFERENCES organizations NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  paid_amount decimal(10,2) DEFAULT 0,
  pending_amount decimal(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  contract_pdf_url text,
  status text NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'firmado', 'pagado', 'cancelado')),
  created_at timestamptz DEFAULT now()
);

-- Pagos
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts NOT NULL,
  organization_id uuid REFERENCES organizations NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text DEFAULT 'Efectivo',
  payment_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Inventario
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('ataud', 'urna', 'flores', 'accesorio')),
  stock int DEFAULT 0,
  price decimal(10,2) NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Memoriales públicos
CREATE TABLE memorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ceremony_id uuid REFERENCES ceremonies NOT NULL,
  organization_id uuid REFERENCES organizations NOT NULL,
  slug text UNIQUE NOT NULL, -- URL amigable
  obituary_text text NOT NULL,
  photo_gallery text[], -- Array de URLs
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Condolencias
CREATE TABLE condolences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id uuid REFERENCES memorials NOT NULL,
  author_name text NOT NULL,
  author_email text,
  message text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS: Super-admin ve todo, usuarios solo su organización
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admin full access" ON organizations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );
CREATE POLICY "Org users read own org" ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- RLS para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Super admin can view all profiles" ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Función para aplicar RLS
CREATE OR REPLACE FUNCTION apply_rls_policy(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  
  EXECUTE format('
    CREATE POLICY "Super admin full access" ON %I FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''super_admin''
        )
      )
  ', table_name, table_name);
  
  EXECUTE format('
    CREATE POLICY "Org users access own data" ON %I FOR ALL
      USING (
        organization_id IN (
          SELECT organization_id FROM profiles
          WHERE profiles.id = auth.uid()
        )
      )
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Aplicar RLS a todas las tablas
SELECT apply_rls_policy('families');
SELECT apply_rls_policy('services');
SELECT apply_rls_policy('ceremonies');
SELECT apply_rls_policy('contracts');
SELECT apply_rls_policy('payments');
SELECT apply_rls_policy('inventory_items');
SELECT apply_rls_policy('memorials');

-- RLS especial para condolences
ALTER TABLE condolences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert condolences" ON condolences FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Org users can view their memorials condolences" ON condolences FOR SELECT
  USING (
    memorial_id IN (
      SELECT id FROM memorials
      WHERE organization_id IN (
        SELECT organization_id FROM profiles
        WHERE profiles.id = auth.uid()
      )
    )
  );
CREATE POLICY "Org users can update condolences approval" ON condolences FOR UPDATE
  USING (
    memorial_id IN (
      SELECT id FROM memorials
      WHERE organization_id IN (
        SELECT organization_id FROM profiles
        WHERE profiles.id = auth.uid()
      )
    )
  );

-- Índices para performance
CREATE INDEX idx_families_org ON families(organization_id);
CREATE INDEX idx_services_org ON services(organization_id);
CREATE INDEX idx_ceremonies_org_date ON ceremonies(organization_id, start_time);
CREATE INDEX idx_ceremonies_status ON ceremonies(organization_id, status);
CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_payments_org_date ON payments(organization_id, payment_date);
CREATE INDEX idx_inventory_org ON inventory_items(organization_id);
CREATE INDEX idx_memorials_slug ON memorials(slug);
CREATE INDEX idx_condolences_memorial ON condolences(memorial_id);
