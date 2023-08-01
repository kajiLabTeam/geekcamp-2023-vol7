import model.article as articleModel
import model.node as nodeModel
import model.relation_node_id_list as relationNodeIdListModel


def create_all_tables():
    # 新しいテーブルを作成する場合はここに追加する
    articleModel.create_table()
    nodeModel.create_table()
    relationNodeIdListModel.create_table()
