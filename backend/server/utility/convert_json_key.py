import re


def convert_to_snake(key: str) -> str:
    """キャメルケースからスネークケースに変換する

    Args:
        key(str):キャメルケースの名前

    Returns:
        snake_key(str):スネークケースの名前
    """
    snake_key = re.sub("([A-Z])", lambda x: "_" + x.group(1).lower(), key)
    return snake_key


def convert_to_camel(key: str) -> str:
    """スネークケースキャメルケースからキャメルケースに変換する

    Args:
        key(str):スネークケースの名前

    Returns:
        camel_key(str):キャメルケースの名前
    """
    camel_key = re.sub("_(.)", lambda x: x.group(1).upper(), key)
    return camel_key
