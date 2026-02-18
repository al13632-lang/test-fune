-- Super Admin
-- Nota: En producción esto sería vía auth.admin
-- Pero para el migration/seed manual:
-- INSERT INTO profiles (id, email, full_name, role) VALUES ('uuid-here', 'admin@funeralsync.com', 'Admin Principal', 'super_admin');

-- Organizaciones
INSERT INTO organizations (name, org_code, primary_color, secondary_color, is_active)
VALUES 
('Funeraria San José', 'sanjose', '#1e3a8a', '#3b82f6', true),
('Funeraria La Paz', 'lapaz', '#166534', '#22c55e', true),
('Servicios Fúnebres Esperanza', 'esperanza', '#7c2d12', '#f97316', true)
ON CONFLICT (org_code) DO NOTHING;

-- Familias para San José
INSERT INTO families (organization_id, first_name, last_name, phone, relationship, notes)
SELECT id, 'Juan', 'Pérez', '5511223344', 'Hijo', 'Familia muy atenta.'
FROM organizations WHERE org_code = 'sanjose';

INSERT INTO families (organization_id, first_name, last_name, phone, relationship)
SELECT id, 'María', 'García', '5599887766', 'Esposa'
FROM organizations WHERE org_code = 'sanjose';

-- Servicios para San José
INSERT INTO services (organization_id, name, price, category)
SELECT id, 'Velatorio Básico', 5000, 'velatorio'
FROM organizations WHERE org_code = 'sanjose';

INSERT INTO services (organization_id, name, price, category)
SELECT id, 'Cremación Directa', 8500, 'cremacion'
FROM organizations WHERE org_code = 'sanjose';

-- Inventario para San José
INSERT INTO inventory_items (organization_id, name, category, stock, price)
SELECT id, 'Ataúd de Roble', 'ataud', 5, 12000
FROM organizations WHERE org_code = 'sanjose';

INSERT INTO inventory_items (organization_id, name, category, stock, price)
-- Memorial para Juan Pérez (Simulación)
-- Primero necesitamos una ceremonia (agregamos una rápida para el ejemplo)
INSERT INTO ceremonies (organization_id, family_id, service_id, deceased_name, deceased_birth_date, deceased_death_date, start_time, end_time, status)
SELECT 
    org.id, 
    fam.id, 
    svc.id, 
    'Juan Pérez Sr.', 
    '1940-05-15', 
    '2025-01-20', 
    '2025-01-22 10:00:00', 
    '2025-01-22 12:00:00', 
    'completada'
FROM organizations org, families fam, services svc
WHERE org.org_code = 'sanjose' 
AND fam.last_name = 'Pérez' 
AND svc.name = 'Velatorio Básico'
LIMIT 1;

INSERT INTO memorials (ceremony_id, organization_id, slug, obituary_text, is_public)
SELECT 
    c.id, 
    c.organization_id, 
    'juan-perez-2025', 
    'Un hombre ejemplar que dedicó su vida a su familia y amigos. Siempre será recordado por su alegría y sabiduría.', 
    true
FROM ceremonies c
WHERE deceased_name = 'Juan Pérez Sr.'
LIMIT 1;
