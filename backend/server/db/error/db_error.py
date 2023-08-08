from enum import Enum, auto


class DBErrorType(Enum):
    NOT_SELECTED_ARTICLE_ID_ERROR = auto()
    NOT_SELECTED_ARTICLE_CONTENT_ERROR = auto()
    NOT_SELECTED_NODE_ID_ERROR = auto()
    NOT_SELECTED_NODE_NAME_ERROR = auto()
    NOT_SELECTED_EDIT_HISTORY_ID_ERROR = auto()
    NOT_SELECTED_USER_ID_ERROR = auto()
    NOT_SELECTED_USER_NAME_ERROR = auto()
    ARTICLE_IS_EMPTY_ERROR = auto()
    NODE_IS_EMPTY_ERROR = auto()
    EDIT_HISTORY_IS_EMPTY_ERROR = auto()
    NOT_EXIST_ARTICLE_CORRESPONDING_TO_NODE_ERROR = auto()


def db_error(db_error_type: DBErrorType) -> str:
    if db_error_type == DBErrorType.NOT_SELECTED_ARTICLE_ID_ERROR:
        return "Not selected article id"
    elif db_error_type == DBErrorType.NOT_SELECTED_ARTICLE_CONTENT_ERROR:
        return "Not selected article content"
    elif db_error_type == DBErrorType.NOT_SELECTED_NODE_ID_ERROR:
        return "Not selected node id"
    elif db_error_type == DBErrorType.NOT_SELECTED_NODE_NAME_ERROR:
        return "Not selected node name"
    elif db_error_type == DBErrorType.NOT_SELECTED_EDIT_HISTORY_ID_ERROR:
        return "Not selected edit history id"
    elif db_error_type == DBErrorType.NOT_SELECTED_USER_ID_ERROR:
        return "Not selected user id"
    elif db_error_type == DBErrorType.NOT_SELECTED_USER_NAME_ERROR:
        return "Not selected user name"
    elif db_error_type == DBErrorType.ARTICLE_IS_EMPTY_ERROR:
        return "Article is empty"
    elif db_error_type == DBErrorType.NODE_IS_EMPTY_ERROR:
        return "Node is empty"
    elif db_error_type == DBErrorType.EDIT_HISTORY_IS_EMPTY_ERROR:
        return "Edit history is empty"
    elif db_error_type == DBErrorType.NOT_EXIST_ARTICLE_CORRESPONDING_TO_NODE_ERROR:
        return "Not exits article corresponding to node"
