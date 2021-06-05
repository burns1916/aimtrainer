class HighScoreController < ApplicationController
    
    def index
        high_scores = HighScore.all
        render json: high_scores, include: [:user]
    end

    def create
        high_score = HighScore.new(high_score: params[:high_score], user_id: params[:user_id])
        if high_score.save
            render json: high_score, include: [:user]
        else
            render json: high_score.errors.full_messages
    end

    def update

    end

end
