-- CREATE USER 'geek_camp'@'%' IDENTIFIED BY 'geek_camp_pass';
GRANT ALL PRIVILEGES ON *.* TO 'geek_camp' @'%';

use wisdomtree;

create table article(
    id int primary key,
    content VARCHAR(10000),
    last_update datetime
);

create table node(
    id int primary key,
    node_name VARCHAR(255),
    article_id int,
    foreign key (article_id) references article (id)
);

create table relationnodeidlist(
    id int primary key auto_increment,
    one_node_id int,
    two_node_id int,
    foreign key (one_node_id) references node (id),
    foreign key (two_node_id) references node (id),
    unique (one_node_id, two_node_id)
);

-- article
INSERT INTO
    article(id, content, last_update)
VALUES
    (
        1,
        "# JavaScript
    JavaScriptはJavaに触発されたプログラミング言語です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    article(id, content, last_update)
VALUES
    (
        2,
        "# TypeScript
    TypeScriptとはJavaScriptに型づけを行うプログラミング言語です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    article(id, content, last_update)
VALUES
    (
        3,
        "# React
    ReactとはUIコンポーネントを開発する際に便利なJavaScriptライブラリです",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    article(id, content, last_update)
VALUES
    (
        4,
        "# useState
    useStateとはReactのHooksで状態を管理するために用いられる関数です",
        "2020-01-01 10:10:10"
    );

INSERT INTO
    article(id, content, last_update)
VALUES
    (
        5,
        "# useCallback
    useCallbackとはReactのHooksで変数の変化に応じて発火させる関数のタイミングを管理する関数です",
        "2020-01-01 10:10:10"
    );

-- node
INSERT INTO
    node(id, node_name, article_id)
VALUES
    (1, "JavaScript", 1);

INSERT INTO
    node(id, node_name, article_id)
VALUES
    (2, "TypeScript", 2);

INSERT INTO
    node(id, node_name, article_id)
VALUES
    (3, "React", 3);

INSERT INTO
    node(id, node_name, article_id)
VALUES
    (4, "useState", 4);

INSERT INTO
    node(id, node_name, article_id)
VALUES
    (5, "useCallback", 5);

-- relationnodeidlist
INSERT INTO
    relationnodeidlist(one_node_id, two_node_id)
VALUES
    (3, 1);

INSERT INTO
    relationnodeidlist(one_node_id, two_node_id)
VALUES
    (3, 2);

INSERT INTO
    relationnodeidlist(one_node_id, two_node_id)
VALUES
    (4, 3);

INSERT INTO
    relationnodeidlist(one_node_id, two_node_id)
VALUES
    (5, 3);

select
    'ok' as result;