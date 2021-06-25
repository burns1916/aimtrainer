class RenameHighScoreColumnToScore < ActiveRecord::Migration[6.1]
  def change
    rename_column :high_scores, :high_score, :score
  end
end
