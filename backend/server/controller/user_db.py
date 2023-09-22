from db.error.db_error import DBErrorType, db_error
from model.user import User


def register_user(uid: str, name: str):
    if not uid:
        return {"message": db_error(DBErrorType.NOT_SELECTED_USER_ID_ERROR)}
    if not name:
        return {"message": db_error(DBErrorType.NOT_SELECTED_USER_NAME_ERROR)}

    User.insert_user(User(id=uid, name=name))
    user = User.get_user_by_id(uid)

    return user
