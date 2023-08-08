from model.user import User


def register_user(uid: str, name: str):
    User.insert_user(User(id=uid, name=name))
    user = User.get_user_by_id(uid)

    return user
