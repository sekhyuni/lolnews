import { User, UserModel } from './user';

export class DB {
    constructor() { }

    create(user: User): Promise<User> {
        const newUser = new UserModel(user);
        return newUser.save();
    }

    read(query: any) {
        return UserModel.find(query);
    }

    update(user: User) {
        return UserModel.updateOne({ id: user.id }, { ...user });
    }

    delete(user: User) {
        return UserModel.remove({ id: user.id });
    }
}