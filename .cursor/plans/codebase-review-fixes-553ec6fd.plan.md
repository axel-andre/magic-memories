<!-- 553ec6fd-a9a3-410f-ab75-5ad98e13051f 51cfc63f-d3b2-489f-ac45-54dc62b31f82 -->
# Comprehensive Codebase Fixes and Improvements

## Phase 1: Critical Security Fixes

### 1. Fix TypeScript Error in Edit Route

**File:** `src/routes/memory-lanes/$id/edit.tsx`

- Lines 37-38: Fix incorrect `MemoryAdditionDialog` usage
- The component expects `isOpen`, `onClose`, `title`, `description` props
- Remove the incorrect `.Header` subcomponent usage and DialogHeader wrapper

### 2. Implement Ownership Validation Middleware

**File:** `src/utils/server/memories/middlewares.ts`

- Lines 15-21: Add actual ownership validation logic
- Query database to verify user owns the memory lane
- Throw proper error if validation fails

### 3. Secure File Serving Endpoint

**File:** `src/routes/api/files/$.ts`

- Add authentication and authorization logic
- Check memory lane ownership and publication status
- Public access for published lanes, owner-only for drafts/archived

### 4. Add Authentication to Delete Memory Function

**File:** `src/utils/server/memories/delete.ts`

- Line 21: Add `requireAuthed` middleware to `deleteMemoryFn`
- Validate memory ownership before deletion

## Phase 2: File Upload Validation

### 5. Add File Upload Validation

**File:** `src/utils/server/memories/create.ts`

- Lines 57-76: Add validation before processing file
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/gif, image/webp
- Validate file size matches actual data length

**File:** `src/utils/server/memories/schemas.ts`

- Add file size validation to schema (max 5MB = 5242880 bytes)
- Add MIME type validation

## Phase 3: Database Schema Improvements

### 6. Export Memory Lane Status Types

**File:** `src/db/memory-lane-schema.ts`

- Lines 5-14: Export `memoryLaneStatus` constant and status type
- Create proper TypeScript type for status values

## Phase 4: Remove Dead Code

### 7. Remove Unused State Variables

**File:** `src/components/MemoryLanesFeed.tsx`

- Line 9: Remove unused `limit` state and `setLimit`

**File:** `src/components/UserProfileFeed.tsx`

- Line 25: Remove unused `setLimit` from destructuring

### 8. Remove Unused Database Query

**File:** `src/utils/server/memories/create.ts`

- Lines 33-38: Remove unused `ml` variable query in `createMemoryLaneFn`

## Phase 5: Improve Error Handling

### 9. Create Custom Error Types

**New File:** `src/utils/errors.ts`

- Define custom error classes (ValidationError, AuthorizationError, NotFoundError)
- User-friendly messages for end users
- Detailed error info for logging

### 10. Create Error Alert Component with ShadCN

**New File:** `src/components/ui/ErrorAlert.tsx`

- Use ShadCN Alert component for consistent error display
- Support different error severity levels
- Reusable across the application

### 11. Update Error Handling in Components

**File:** `src/components/CreateMemoryModal.tsx`

- Line 53: Replace generic `any` type with proper error handling
- Use new ErrorAlert component

**File:** `src/utils/server/memories/update.ts`

- Lines 31-33: Add specific error messages based on error type
- Add authentication and ownership validation

**File:** `src/utils/server/memories/create.ts`

- Add specific error messages for different failure scenarios
- Wrap file upload errors with context

### 12. Improve Image Storage Error Handling

**File:** `src/utils/server/services/imageStorage.ts`

- Lines 12-19: Add proper error handling and logging
- Add retry logic for transient failures (3 retries with exponential backoff)

## Phase 6: Extract Duplicate Code

### 13. Create Intersection Observer Hook

**New File:** `src/hooks/useInfiniteScroll.ts`

- Extract intersection observer logic from both feed components
- Reusable hook with proper TypeScript types

### 14. Update Feed Components to Use Hook

**File:** `src/components/MemoryLanesFeed.tsx`

- Lines 23-45: Replace with custom hook

**File:** `src/components/UserProfileFeed.tsx`

- Lines 74-96: Replace with custom hook

## Phase 7: Additional Improvements

### 15. Add Missing Authentication Middleware

**File:** `src/utils/server/memories/update.ts`

- Add `requireAuthed` middleware
- Add ownership validation for memory updates

### 16. Add Comprehensive Validation Helper

**New File:** `src/utils/validation.ts`

- File type validation helper
- File size validation helper
- Reusable validation utilities

### 17. Add Logging Utility

**New File:** `src/utils/logger.ts`

- Structured logging for server errors
- Development vs production modes
- Error context capturing

## Phase 8: Testing and Verification

### 18. Fix Linter Errors

- Run linter on all modified files
- Fix any new issues introduced

### 19. Verify All Changes

- Ensure TypeScript compiles without errors
- Test authentication flows
- Verify file upload validation works
- Test error handling displays correctly

### To-dos

- [ ] Fix TypeScript error in edit.tsx with MemoryAdditionDialog usage
- [ ] Implement actual ownership validation in assertMemoryLaneOwner middleware
- [ ] Add authentication and authorization to file serving endpoint
- [ ] Add requireAuthed middleware to deleteMemoryFn
- [ ] Add file upload validation (5MB max, image types only)
- [ ] Export memory lane status types from schema
- [ ] Remove unused state variables and database queries
- [ ] Create custom error types and classes
- [ ] Create ErrorAlert component using ShadCN Alert
- [ ] Update error handling across components and server functions
- [ ] Add error handling and retry logic to image storage
- [ ] Extract intersection observer logic into useInfiniteScroll hook
- [ ] Update feed components to use new useInfiniteScroll hook
- [ ] Add authentication and ownership validation to update functions
- [ ] Create file validation helper utilities
- [ ] Create structured logging utility
- [ ] Run linter and fix any errors in modified files
- [ ] Test and verify all changes work correctly