# Log de Saneamiento CV3 - 2026-01-18

## 📁 Reorganización de Carpetas
- `app/alertas/` -> `app/dashboard/alertas/`
- `app/caminatas/` -> `app/dashboard/caminatas/`
- `app/economia/` -> `app/dashboard/economia/`
- `app/coordinadores/` -> `app/dashboard/coordinadores/`
- `app/page.tsx` (antiguo dashboard) -> `app/dashboard/page.tsx`

## 🛠 Refactor de Imports
Todos los imports relativos en la carpeta `app/` fueron convertidos a alias absolutos `@/`.
### Archivos Modificados:
- `app/dashboard/economia/page.tsx`
- `app/dashboard/coordinadores/page.tsx`
- `app/dashboard/caminatas/page.tsx`
- `app/dashboard/alertas/page.tsx`
- `app/dashboard/page.tsx`
- `app/api/coordinator/skills/route.ts`
- `app/api/coordinator/availability/route.ts`
- `app/api/coordinator/geo/route.ts`
- `app/api/coordinator/photo/route.ts`
- `app/api/coordinator/score/route.ts`
- `lib/queries/coordinadores.ts`
- `lib/queries/caminatas.ts`
- `lib/queries/economia.ts`
- `lib/queries/alertas.ts`

## ⚙ Configuración de Infraestructura
- **Supabase Centralizado**: Se creó `lib/supabase/server.ts` para unificar el cliente.
- **Index de Queries**: Se creó `lib/queries/index.ts` para soportar `import { ... } from '@/lib/queries'`.
- **Tipos de Dominio**: Se actualizaron los tipos en `lib/types/coordinador.ts` (CoordinatorSkill, etc).
- **Layouts**: 
  - `app/layout.tsx`: Ahora es un layout raíz minimalista (compatible con Landing).
  - `app/dashboard/layout.tsx`: Contiene la estructura Sidebar/Header/Footer para el dashboard.
- **Navegación**: Se actualizaron los links en `components/layout/Sidebar.tsx`.


## 🧹 Fase 4: Purga Final de Residuos
Se procedió a la eliminación de carpetas y archivos obsoletos previa verificación de su existencia en el backup principal.
### 🗑 Carpetas Eliminadas:
- `dashboard-next-backup/`
- `import_backup_20260118_1344/`
- `capturas/`
- `code_tracker/`
- `context_state/`
- `brain/`
- `pgtap_results/`

### 🗑 Archivos Eliminados:
- `app_tree.txt`, `project_files.txt`, `audit_report.txt`
- `tsconfig.tsbuildinfo`
- `crear_mvp.ps1`, `purga_landing_next.ps1`
- `debug-react-window.js`
- `explain_poe.csv`, `dashboard_mvp_status.json`, `datos-supabase.txt`, `fix_status.json`, `stack_versions.txt`

### ✅ Estado Final del Repositorio
- **Raíz Limpia**: Solo quedan carpetas de dominio (`app`, `lib`, `components`, `supabase`, `database`, `docs`, `tests`, `public`).
- **Backup Seguro**: `Backup_CV3_Saneamiento_YYYYMMDD_HHmm` preserva el 100% de los archivos eliminados.
- **Responsable**: AG (Antigravity)
- **Fecha**: 2026-01-18 14:20 (local)

## 🏗 Wizard Step 1: Datos Personales
Se ha iniciado la fase de desarrollo del Onboarding de Coordinadores.
### 📂 Estructura Creada:
- `app/dashboard/onboarding/step1-personal/`
  - `page.tsx`: Entry point del paso 1.
  - `form.tsx`: Componente de formulario de datos personales.
  - `hooks.ts`: Lógica de persistencia y estado.
  - `types.ts`: Definición de tipos de datos personales.

### ✅ Estado:
Implementado con UX Tipoform 2026, validaciones Zod y animaciones Framer Motion.
- **Validaciones**: Nombre, Apellido y DNI requeridos; Fecha de nacimiento y Género obligatorios.
- **Estética**: Campos grandes, bordes dinámicos, colores corporativos (Verde/Coral).
- **Hooks**: Integración con `usePersonalData` para manejo de carga y persistencia simulada.

## 🏗 Wizard Step 2: Datos de Contacto
### 📂 Estructura Creada:
- `app/dashboard/onboarding/step2-contact/`
  - `page.tsx`: Entry point del paso 2.
  - `form.tsx`: Componente de formulario de contacto.
  - `hooks.ts`: Lógica para `coordinadores_bio` y `coordinator_geo_availability`.
  - `types.ts`: Definición de `ContactFormData`.

### ✅ Estado:
Implementado con UX Tipoform 2026, validaciones Zod y multiselect de zonas.
- **Validaciones**: Email obligatorio y validado; Teléfono argentino (10 dígitos).
- **Zonas**: Selector múltiple de zonas de cobertura vinculado conceptualmente a `coordinator_geo_availability`.
- **UX**: Navegación fluida con Framer Motion, micro-interacciones en botones de zonas y feedback de guardado.
- **Hooks**: Soporte para fetching inicial y persistencia simulada multi-tabla.

## 🏗 Wizard Step 3: Experiencia y Habilidades
### 📂 Estructura Creada:
- `app/dashboard/onboarding/step3-skills/`
  - `page.tsx`: Entry point del paso 3.
  - `form.tsx`: Componente para fichas de habilidades y ratings.
  - `hooks.ts`: Lógica para `coordinator_skills` y `coordinadores_bio`.
  - `types.ts`: Definición de `SkillsFormData` y `PREDEFINED_SKILLS`.

### ✅ Estado:
Implementado con fichas de habilidades interactivas y sistema de ratings de 5 estrellas.
- **Validaciones**: Años de experiencia, motivación y al menos una habilidad con rating obligatorio.
- **Interactividad**: Toggle de habilidades con expansión dinámica de controles de rating y comentarios.
- **UX**: Animaciones `AnimatePresence` para entrada/salida de fichas, iconografía de estrellas y colores corporativos.
- **Persistencia**: Estructura compatible con `coordinator_skills` y `coordinadores_bio`.

## 🏗 Wizard Step 4: Geo Disponibilidad
### 📂 Componentes:
- `app/dashboard/onboarding/step4-geo/`
  - `page.tsx`: Vista principal con encabezado motivador.
  - `form.tsx`: Selector complejo de Provincias y Localidades.
  - `hooks.ts`: Lógica de persistencia en `coordinator_geo_availability`.
  - `types.ts`: Definición de datos geográficos estáticos.

### ✅ Estado:
Implementado con estética Tipoform 2026 Premium.
- **Interacción**: Selección de provincias habilita dinámicamente el scroll de localidades.
- **Visual**: Tags con animaciones `popIn/popOut`, checkboxes personalizados y efectos de profundidad.
- **Mobile-First**: Layout adaptable con scroll interno optimizado para listas largas de localidades.

## 🏗 Wizard Step 5: Disponibilidad Horaria
### 📂 Componentes:
- `app/dashboard/onboarding/step5-availability/`
  - `page.tsx`: Vista final del registro con feedback visual premium.
  - `form.tsx`: Selector de slots horarios por día con sistema de tags dinámicas.
  - `hooks.ts`: Lógica de persistencia en `coordinator_availability`.
  - `types.ts`: Días y franjas horarias predefinidas.

### ✅ Estado:
Implementado bajo el estándar de "Input Vivo" y micro-interacciones.
- **Interacción**: Sistema de navegación por días; al seleccionar un día se despliegan sus slots con animaciones de escala.
- **Identidad**: Uso intensivo de Verde Camina (#4CAF50) y Coral (#FF6B6B) para acciones finales.
- **UX**: Tags de resumen ordenadas cronológicamente para una revisión rápida de la disponibilidad total.
- **Feedback**: Estados de carga y validación visual inmediata.
