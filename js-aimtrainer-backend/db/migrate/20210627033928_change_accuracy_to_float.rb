class ChangeAccuracyToFloat < ActiveRecord::Migration[6.1]
  def change
    change_column :high_scores, :accuracy, :float
  end
end
