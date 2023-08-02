-- CREATE USER 'geek_camp'@'%' IDENTIFIED BY 'geek_camp_pass';
GRANT ALL PRIVILEGES ON *.* TO 'geek_camp' @'%';
USE wisdomtree;

CREATE TABLE
    article (
        id INT PRIMARY KEY,
        article VARCHAR(10000),
        last_update datetime
    );

CREATE TABLE
    node (
        id INT AUTO_INCREMENT PRIMARY KEY,
        node_name VARCHAR(50),
        article_id INT,
        FOREIGN KEY (article_id) REFERENCES article (id)
    );

CREATE TABLE
    connection (
        id INT AUTO_INCREMENT PRIMARY KEY,
        node_id INT,
        connect_node_id INT,
        connection_strength FLOAT (1, 5),
        FOREIGN KEY (node_id) REFERENCES node (id),
        FOREIGN KEY (connect_node_id) REFERENCES node (id)
    )
CREATE TABLE
    edit_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        article_id INT,
        date datetime,
        FOREIGN KEY (user_id) REFERENCES user (id),
        FOREIGN KEY (article_id) REFERENCES article (id)
    );

CREATE TABLE
    user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20)
    );

-- article -----------------------------
INSERT INTO
    article (id, article, last_update)
VALUES
    (
        1,
        "# React.js\nReact.jsはなんかすごい、やつですよ",
        "2021-01-01"
    );

INSERT INTO
    article (id, article, last_update)
VALUES
    (
        2,
        "# JavaScript\nJavaScriptはなんかすごい、やつですよ",
        "2021-02-02"
    );

INSERT INTO
    article (id, article, last_update)
VALUES
    (3, "# フレームワーク\nフレームワークはなんかすごい、やつ", "2021-03-03");

INSERT INTO
    article (id, article, last_update)
VALUES
    (4, "# hooks\nhooksはなんかすごい、やつ", "2021-04-04");

INSERT INTO
    article (id, article, last_update)
VALUES
    (5, "# useState\nuseStateはなんかすごい、やつ", "2021-04-05");

INSERT INTO
    article (id, article, last_update)
VALUES
    (
        6,
        "# useEffect\nuseEffectはなんかすごい、やつ",
        "2021-04-06"
    );

-- node --------------------------------
INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("React.js", 1);

INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("JavaScript", 2);

INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("フレームワーク", 3);

INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("hooks", 4);

INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("useState", 5);

INSERT INTO
    nodes (node_name, article_id)
VALUES
    ("useEffect", 6);

-- connection --------------------------
INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (1, 2, 0.8);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (1, 3, 0.6);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (, 1, 0.6);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (1, 4, 0.4);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (4, 1, 0.4);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (4, 5, 0.8);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (5,4, 0.8);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (4, 6, 0.8);

INSERT INTO
    connection (node_id, connect_node_id, connection_strength)
VALUES
    (6, 4, 0.8);


-- edit_history ------------------------
INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (1, 1, "2020-03-10");

INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (2, 2, "2023-04-11");

INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (3, 3, "2021-01-01");

INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (4, 4, "2019-06-17");

INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (5, 5, "2022-03-16");

INSERT INTO
    edit_history (userid, article_id, date)
VALUES
    (6, 6, "2021-07-20");

-- user --------------------------------
INSERT INTO
    user (name)
VALUES
    ("SatooRu65536");

INSERT INTO
    user (name)
VALUES
    ("shibaken");

INSERT INTO
    user (name)
VALUES
    ("mi");

INSERT INTO
    user (name)
VALUES
    ("kousei");