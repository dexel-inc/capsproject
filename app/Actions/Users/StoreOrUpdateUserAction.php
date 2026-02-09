<?php

declare(strict_types=1);

namespace App\Actions\Users;

use App\Models\Role;
use App\Models\User;

final class StoreOrUpdateUserAction
{
    public function execute(User $user, array $data): User
    {
        $user->name = $data['name'];
        $user->email = $data['email'];

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        if (isset($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
        }

        return $user->fresh() ?? $user;
    }
}
