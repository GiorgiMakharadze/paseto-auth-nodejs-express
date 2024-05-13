import { AlreadyExistsError, BadRequestError, NotFoundError } from '_app/errors';
import userModel from '_app/models/user.model';
import { clearCache, queryWithCache } from '_app/utils';

export class AdminService {
  public async getAllUsers() {
    const cacheKey = 'all_users';
    const users = await queryWithCache('User', {}, cacheKey).then((cachedData) => {
      if (cachedData) return cachedData;

      return userModel
        .find({})
        .select('-password -refreshToken -forgotPasswordToken -forgotPasswordExpire')
        .then((users) => {
          clearCache(cacheKey);
          return users;
        });
    });

    if (!users || users.length === 0) {
      throw new BadRequestError('Users not found');
    }

    return users;
  }

  public async getConcreteUser(id: string) {
    const cacheKey = `user_${id}`;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { email: id };
    const user = await queryWithCache('User', query, cacheKey).then((cachedData: any) => {
      if (cachedData) return cachedData;

      return userModel.findOne(query).then((user) => {
        if (!user) throw new NotFoundError('User not found');
        clearCache(cacheKey);
        return user;
      });
    });

    return user;
  }

  public async makeUserAdmin(userId: string) {
    if (!userId) {
      throw new BadRequestError('User ID is not provided');
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role === 'admin') {
      throw new AlreadyExistsError('User is already an admin');
    }

    user.role = 'admin';
    await user.save();

    clearCache(`user_${userId}`);
    clearCache('all_users');

    return { msg: 'User has been made admin' };
  }
}
