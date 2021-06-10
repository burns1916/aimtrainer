class ChangeCommentColumnName < ActiveRecord::Migration[6.1]
  def change
    rename_column :comments, :comment, :text
  end
end
