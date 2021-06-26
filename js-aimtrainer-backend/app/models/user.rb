class User < ApplicationRecord
    has_many :comments
    has_many :high_scores
    validates :username, presence: true
    validates :username, uniqueness: true
end
