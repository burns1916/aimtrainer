class ChangeScoreAndAccuracyToIntAndFloat < ActiveRecord::Migration[6.1]
  def change
    change_column :high_scores, :score, :integer
    change_column :high_scores, :accuracy, :float
  end
end
