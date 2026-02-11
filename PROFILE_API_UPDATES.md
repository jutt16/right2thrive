# Profile API Backend Updates Required

This document outlines the backend changes needed to support the new profile field: `profile_picture`.

## Routes (Already Defined)
```php
Route::get('/user', [UserProfileController::class, 'show']);
Route::post('/user', [UserProfileController::class, 'updateProfile']);
```

## UserProfileController Updates

### 1. Update `show()` method

Ensure the response includes `profile_picture_url`:

```php
public function show(Request $request)
{
    $user = $request->user();
    $user->load('profile');
    
    return response()->json([
        'success' => true,
        'data' => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            // ... other user fields
            'profile' => [
                'id' => $user->profile->id ?? null,
                'user_id' => $user->profile->user_id ?? null,
                'date_of_birth' => $user->profile->date_of_birth ?? null,
                'gender' => $user->profile->gender ?? null,
                'cultural_background' => $user->profile->cultural_background ?? null,
                'telephone' => $user->profile->telephone ?? null,
                'mobile' => $user->profile->mobile ?? null,
                'employment_status' => $user->profile->employment_status ?? null,
                'country' => $user->profile->country ?? null,
                'address' => $user->profile->address ?? null,
                'qualifications' => $user->profile->qualifications ?? null,
                'experience' => $user->profile->experience ?? null,
                'profile_picture' => $user->profile->profile_picture ?? null,
                'created_at' => $user->profile->created_at ?? null,
                'updated_at' => $user->profile->updated_at ?? null,
            ],
            'is_email_verified' => $user->email_verified_at !== null,
            'profile_picture_url' => $user->profile->profile_picture 
                ? asset('storage/' . $user->profile->profile_picture) 
                : null, // ✅ Add this
        ],
    ]);
}
```

### 2. Update `updateProfile()` method

Add validation and handling for the new fields:

```php
public function updateProfile(Request $request)
{
    $user = $request->user();
    
    // Get or create profile
    $profile = $user->profile ?? $user->profile()->create(['user_id' => $user->id]);
    
    // Validation rules
    $rules = [
        'date_of_birth' => 'nullable|date',
        'gender' => 'nullable|in:male,female,other',
        'telephone' => 'nullable|string|max:20',
        'mobile' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'country' => 'nullable|string|max:100',
        'employment_status' => 'nullable|string|max:100',
        'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // ✅ Add this
    ];
    
    $validated = $request->validate($rules);
    
    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        // Delete old profile picture if exists
        if ($profile->profile_picture) {
            Storage::disk('public')->delete($profile->profile_picture);
        }
        
        // Store new profile picture
        $path = $request->file('profile_picture')->store('profiles', 'public');
        $validated['profile_picture'] = $path;
    }
    
    // Update profile
    $profile->update($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => [
            'profile' => $profile->fresh(),
            'profile_picture_url' => $profile->profile_picture 
                ? asset('storage/' . $profile->profile_picture) 
                : null,
        ],
    ]);
}
```

## Profile Model Updates

Ensure the `Profile` model has the new fields in `$fillable`:

```php
protected $fillable = [
    'user_id',
    'date_of_birth',
    'gender',
    'cultural_background',
    'telephone',
    'mobile',
    'employment_status',
    'country',
    'address',
    'qualifications',
    'experience',
    'profile_picture', // ✅ Ensure this exists
];
```

## Storage Configuration

Ensure Laravel storage is properly configured:

1. Create storage link: `php artisan storage:link`
2. Ensure `config/filesystems.php` has public disk configured:
```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

## Testing Checklist

- [ ] GET `/api/user` returns `profile_picture_url` at root level
- [ ] POST `/api/user` accepts all profile fields as multipart/form-data
- [ ] POST `/api/user` accepts `profile_picture` as multipart/form-data file
- [ ] POST `/api/user` validates image file types (jpeg, png, jpg, gif)
- [ ] POST `/api/user` validates image file size (max 2MB)
- [ ] POST `/api/user` stores uploaded image in `storage/app/public/profiles/`
- [ ] POST `/api/user` deletes old image when new one is uploaded
- [ ] POST `/api/user` returns updated profile with `profile_picture_url`

## Notes

- The frontend always sends FormData (multipart/form-data) for POST requests
- The backend should handle `multipart/form-data` Content-Type
- Use Laravel's `$request->hasFile('profile_picture')` to detect file upload
- Use `Storage::disk('public')->delete()` to remove old images
- Return full URL using `asset('storage/...')` for profile picture
- All profile fields are sent as form fields, profile_picture is sent as a file when provided
