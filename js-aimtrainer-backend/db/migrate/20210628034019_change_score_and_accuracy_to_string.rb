class ChangeScoreAndAccuracyToString < ActiveRecord::Migration[6.1]
  def change
    change_column :high_scores, :score, :string
    change_column :high_scores, :accuracy, :string
  end
end
