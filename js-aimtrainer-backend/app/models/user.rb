class User < ApplicationRecord
    has_many :comments
    has_one :high_score
    validates :username, presence: true
    validates :username, uniqueness: true
end
