class User < ApplicationRecord
    has_many :comments
    has_one :high_score
end
