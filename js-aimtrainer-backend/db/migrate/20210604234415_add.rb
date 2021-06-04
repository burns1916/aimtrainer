class Add < ActiveRecord::Migration[6.1]
  def change
    add_column :high_scores, :user_id, :integer
  end
end
