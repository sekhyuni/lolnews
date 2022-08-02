import { User, UserModel } from './user';

export class DB {
    constructor() { }

    create(user: User): Promise<User> {
        let p = new UserModel(user);
        return p.save();
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