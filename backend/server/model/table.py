import model.user as userModel
import model.article as articleModel
import model.node as nodeModel
import model.connection as connectionModel
import model.edit_history as editHistoryModel



def create_all_tables():
    # 新しいテーブルを作成する場合はここに追加する
    userModel.create_table()
    articleModel.create_table()
    editHistoryModel.create_table()
    connectionModel.create_table()
    nodeModel.create_table()
    
