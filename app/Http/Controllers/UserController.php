<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Users\StoreOrUpdateUserAction;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/users/Index', [
            'users' => $users,
        ]);
    }

    public function store(StoreUserRequest $request, StoreOrUpdateUserAction $action): RedirectResponse
    {
        $action->execute(new User, $request->validated());

        return redirect()->route('admin.users.index');
    }

    public function update(UpdateUserRequest $request, User $user, StoreOrUpdateUserAction $action): RedirectResponse
    {
        $action->execute($user, $request->validated());

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index');
    }
}
