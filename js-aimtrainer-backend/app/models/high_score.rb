class HighScore < ApplicationRecord
    belongs_to :user
    validates :score, presence: true
    validates :accuracy, presence: true
end
