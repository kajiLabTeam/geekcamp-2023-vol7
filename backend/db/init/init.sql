-- CREATE USER 'geek_camp'@'%' IDENTIFIED BY 'geek_camp_pass';

GRANT ALL PRIVILEGES ON *.* TO 'geek_camp' @'%';

use wisdomtree;

create table articles(
    id int primary key,
    content VARCHAR(10000),
    last_update datetime
);

create table nodes(
    id int primary key,
    node_name VARCHAR(255),
    article_id int,
    foreign key (article_id) references articles (id)
);

create table parent_id_list(
    id int primary key,
    current_node_id int,
    parent_node_id int,
    foreign key (current_node_id) references nodes (id),
    foreign key (parent_node_id) references nodes (id),
    unique (current_node_id, parent_node_id)
);

create table child_id_list(
    id int primary key,
    current_node_id int,
    child_node_id int,
    foreign key (current_node_id) references nodes (id),
    foreign key (child_node_id) references nodes (id),
    unique (current_node_id, child_node_id)
);

-- articles
INSERT INTO
    articles(content, last_update)
VALUES
    (
        "# JavaScript
    JavaScriptはJavaに触発されたプログラミング言語です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    articles(content, last_update)
VALUES
    (
        "# TypeScript
    TypeScriptとはJavaScriptに型づけを行うプログラミング言語です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    articles(content, last_update)
VALUES
    (
        "# React
    ReactとはUIコンポーネントを開発する際に便利なJavaScriptライブラリです",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    articles(content, last_update)
VALUES
    (
        "# useState
    useStateとはReactのHooksで状態を管理するために用いられる関数です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    articles(content, last_update)
VALUES
    (
        "# useCallback
    useCallbackとはReactのHooksで変数の変化に応じて発火させる関数のタイミングを管理する関数です",
        "2020-01-01 10:10:10"
    );

-- nodes
INSERT INTO
    nodes(node_name, article_id)
VALUES
    ("JavaScript", 1);

INSERT INTO
    nodes(node_name, article_id)
VALUES
    ("TypeScript", 2);

INSERT INTO
    nodes(node_name, article_id)
VALUES
    ("React", 3);

INSERT INTO
    nodes(node_name, article_id)
VALUES
    ("useState", 4);

INSERT INTO
    nodes(node_name, article_id)
VALUES
    ("useCallback", 5);

-- parent_id_list
INSERT INTO
    parent_id_list(current_node_id, parent_node_id)
VALUES
    (3, 1);

INSERT INTO
    parent_id_list(current_node_id, parent_node_id)
VALUES
    (3, 2);

INSERT INTO
    parent_id_list(current_node_id, parent_node_id)
VALUES
    (4, 3);

INSERT INTO
    parent_id_list(current_node_id, parent_node_id)
VALUES
    (5, 3);

-- child_id_list
INSERT INTO
    child_id_list(current_node_id, child_node_id)
VALUES
    (1, 3);

INSERT INTO
    child_id_list(current_node_id, child_node_id)
VALUES
    (2, 3);

INSERT INTO
    child_id_list(current_node_id, child_node_id)
VALUES
    (3, 4);

INSERT INTO
    child_id_list(current_node_id, child_node_id)
VALUES
    (3, 5);

select
    'ok' as result;