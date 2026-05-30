# Multi-Platform Support Migration

## Changes Made

### 1. Type Definitions
- Updated `lib/supabase/types.ts`:
  - Changed `platform: PlatformType | null` → `platforms: PlatformType[] | null`
  - Projects now support array of platforms instead of single platform

### 2. New Components
- **`components/ui/checkbox.tsx`** - Checkbox component from Radix UI
- **`components/ui/platforms-multi-select.tsx`** - Multi-select component with checkboxes and platform badges

### 3. Updated Components
- **`project-meta-form.tsx`** - Now uses PlatformsMultiSelect instead of single Select
  - Manages `selectedPlatforms` state with useState
  - Sends platforms as JSON string in form data
- **`project-form.tsx`** - Same changes as project-meta-form for new projects
- **`projects-content.tsx`** - Updated to display multiple platforms separated by commas
- **`projects/page.tsx`** - Changed query to fetch `platforms` instead of `platform`

### 4. Updated Actions
- **`projects/actions.ts`** - `createProject()` action:
  - Parses platforms JSON string
  - Sends platforms array to Supabase insert
- **`projects/[projectId]/actions.ts`** - `updateProjectMeta()` action:
  - Parses platforms JSON string
  - Sends platforms array to Supabase update

### 5. Updated Validators
- **`lib/validators.ts`**:
  - Changed `platform: platformSchema.optional()` → `platforms: z.array(platformSchema).optional()`
  - Updated both `projectCreateSchema` and `projectUpdateSchema`

### 6. Dependencies
- Added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` for drag-and-drop (from previous task)
- Added `@radix-ui/react-checkbox` for multi-select component

## Database Migration

You need to run this SQL migration on Supabase:

```sql
-- Migration: Change platform field to platforms array
BEGIN;

-- Add the new platforms column as an array
ALTER TABLE projects ADD COLUMN platforms text[] DEFAULT NULL;

-- Migrate existing data from platform to platforms
UPDATE projects 
SET platforms = CASE 
  WHEN platform IS NOT NULL THEN ARRAY[platform]
  ELSE NULL
END;

-- Drop the old platform column
ALTER TABLE projects DROP COLUMN platform;

COMMIT;
```

## How to Apply Migration

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy the SQL from `supabase-migration-platforms.sql`
4. Execute the query

## UI/UX

- **Multi-Select Display**: Checkboxes for each platform (TikTok, Instagram Reels, YouTube Shorts, YouTube Long, Other)
- **Visual Feedback**: Selected platforms shown as badges below the checkboxes
- **Form**: Platforms sent as hidden JSON field in form data
- **Display**: Projects list shows all selected platforms comma-separated

## Testing

1. Create a new project and select multiple platforms
2. Edit an existing project and change platforms
3. Verify platforms array is saved correctly in Supabase
4. Check that projects list displays all platforms
