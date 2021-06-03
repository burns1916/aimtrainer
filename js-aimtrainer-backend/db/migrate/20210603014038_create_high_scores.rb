class CreateHighScores < ActiveRecord::Migration[6.1]
  def change
    create_table :high_scores do |t|
      t.integer :high_score
      t.timestamps
    end
  end
end
