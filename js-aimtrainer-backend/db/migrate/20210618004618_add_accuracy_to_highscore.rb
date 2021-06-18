class AddAccuracyToHighscore < ActiveRecord::Migration[6.1]
  def change
    add_column :high_scores, :accuracy, :integer
  end
end
