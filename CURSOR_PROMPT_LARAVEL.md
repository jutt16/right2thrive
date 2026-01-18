# Cursor IDE Prompt: Laravel Dynamic Homepage Content System

Copy and paste this entire prompt into Cursor IDE for the Laravel backend:

---

I need to create a Laravel backend system to make the Next.js homepage content fully dynamic. The super admin should be able to manage all homepage sections through a dashboard, and all content should be accessible via RESTful API endpoints.

## Current Static Content Structure (from Next.js)

The homepage has these sections that need to be dynamic:

1. **Hero Section**: Title, description, two buttons (text + links), background image
2. **Community Stories**: Array of stories with name, role, image, quote, objectPosition
3. **Testimonials**: Array with quote, name, age
4. **Services**: Array with title, description, short description, icon name, link, isFeatured flag
5. **Flow Steps**: 3 steps (Sign Up, Get Matched, Start Healing) with icon, title, description, link
6. **Section Headings**: Various section titles and subtitles throughout the page
7. **CTA Section**: Title, description, button, benefits array, login link
8. **Support Services**: Title, description, service info, crisis lines array, view all link

## Requirements

### 1. Database Tables

Create migrations for these tables with appropriate fields:

- `homepage_hero_sections`: title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image, is_active, display_order
- `community_stories`: name, role, image_path, object_position, quote, is_active, display_order
- `testimonials`: quote, name, age (nullable), is_active, display_order
- `services`: title, description, short_description, icon_name, link, is_featured, is_active, display_order
- `flow_steps`: title, description, icon_name, link, step_number, is_active
- `section_headings`: section_key (unique), heading, subheading (nullable), is_active
- `cta_sections`: title, description, button_text, button_link, login_link_text, login_link_url, benefits (JSON), is_active
- `support_services`: title, description, service_name, service_url, service_description, crisis_lines (JSON), view_all_link_text, view_all_link_url, is_active

All tables should have: id, timestamps, and appropriate indexes.

### 2. Eloquent Models

Create models for each table with:
- Proper fillable fields
- JSON casts for benefits and crisis_lines
- Scopes: `active()` and `ordered()` (or `orderByStep()` for flow_steps)
- Accessor for image URLs: `getImageUrlAttribute()` that returns full URL using `asset('storage/...')`

### 3. API Endpoints

Create `App\Http\Controllers\Api\HomepageController` with these public GET endpoints:

- `GET /api/homepage/hero` - Returns active hero section
- `GET /api/homepage/community-stories` - Returns active community stories ordered by display_order
- `GET /api/homepage/testimonials` - Returns active testimonials ordered by display_order
- `GET /api/homepage/services` - Returns active services ordered by display_order
- `GET /api/homepage/flow-steps` - Returns active flow steps ordered by step_number
- `GET /api/homepage/section-headings` - Returns all active section headings as key-value pairs (keyed by section_key)
- `GET /api/homepage/cta-section` - Returns active CTA section
- `GET /api/homepage/support-services` - Returns active support services
- `GET /api/homepage/all` - Returns all content in one response

All endpoints should:
- Return JSON with structure: `{ "success": true, "data": ... }`
- Only return records where `is_active = true`
- Order appropriately (display_order or step_number)
- Include full image URLs (not just paths)
- Handle empty/null gracefully

### 4. Admin Dashboard

Create admin controllers (resource controllers) for CRUD operations:

- `App\Http\Controllers\Admin\AdminHeroController`
- `App\Http\Controllers\Admin\AdminCommunityStoryController`
- `App\Http\Controllers\Admin\AdminTestimonialController`
- `App\Http\Controllers\Admin\AdminServiceController`
- `App\Http\Controllers\Admin\AdminFlowStepController`
- `App\Http\Controllers\Admin\AdminSectionHeadingController`
- `App\Http\Controllers\Admin\AdminCtaSectionController`
- `App\Http\Controllers\Admin\AdminSupportServiceController`

Each controller should have:
- `index()` - List with pagination, search, filter
- `create()` - Show create form
- `store()` - Validate and store (use Form Requests)
- `edit()` - Show edit form
- `update()` - Validate and update (use Form Requests)
- `destroy()` - Delete
- `toggleActive()` - Toggle is_active status

### 5. Admin Routes

Add routes in `routes/web.php`:
```php
Route::prefix('admin/homepage')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('hero', AdminHeroController::class);
    Route::resource('community-stories', AdminCommunityStoryController::class);
    Route::resource('testimonials', AdminTestimonialController::class);
    Route::resource('services', AdminServiceController::class);
    Route::resource('flow-steps', AdminFlowStepController::class);
    Route::resource('section-headings', AdminSectionHeadingController::class);
    Route::resource('cta-sections', AdminCtaSectionController::class);
    Route::resource('support-services', AdminSupportServiceController::class);
    
    // Bulk reorder endpoint
    Route::post('reorder', [AdminHomepageController::class, 'reorder']);
});
```

### 6. Form Requests (Validation)

Create Form Request classes for validation:
- `StoreHeroRequest` / `UpdateHeroRequest`
- `StoreCommunityStoryRequest` / `UpdateCommunityStoryRequest`
- (Similar for all entities)

Validation should include:
- Required fields
- Image validation: `image|mimes:jpeg,png,jpg,gif|max:2048`
- URL validation for links
- JSON validation for JSON fields
- String length limits where appropriate

### 7. Image Upload

- Store images in `storage/app/public/homepage/`
- Use Laravel Storage facade
- Create symbolic link: `php artisan storage:link`
- Return full URL in API: `asset('storage/homepage/filename.jpg')`
- Handle image deletion when record is deleted

### 8. Seeder

Create a seeder `HomepageContentSeeder` that populates initial content matching the current static content in the Next.js page. Include:
- 1 hero section
- 3 community stories
- 3 testimonials
- 9 services
- 3 flow steps
- Multiple section headings
- 1 CTA section
- 1 support services entry

### 9. Admin Views

Create Blade templates for admin dashboard:
- List pages with table, search, pagination
- Create/Edit forms with proper fields
- Image upload with preview
- Toggle switches for is_active
- Number inputs for display_order
- JSON editor for benefits/crisis_lines (or form fields)

### 10. Additional Features

- Add activity logging for content changes
- Implement soft deletes (optional)
- Add bulk enable/disable actions
- Add drag-and-drop reordering for display_order (optional, can use number input)

## Implementation Notes

- Use Laravel's standard conventions
- All API responses should be consistent JSON format
- Admin routes should be protected by auth and admin middleware
- Use eager loading where needed to prevent N+1 queries
- Consider adding caching for frequently accessed content
- Icon names should match React Icons: `FaCalendarAlt`, `FaComments`, `FaBrain`, etc.
- Support Unicode/emoji in text fields
- Handle image paths correctly (store relative paths, return full URLs in API)

## Priority

1. Migrations and Models
2. API endpoints
3. Admin CRUD controllers
4. Admin views/forms
5. Image upload
6. Seeder with default content
7. Testing

Please implement this system step by step, ensuring all code follows Laravel best practices and is production-ready.

