class CommentsController < ApplicationController

    def index
        comments = Comment.all
        render json: comments, include: [:user]
    end

    def create
        comment = Comment.new(comment: params[:comment], user_id: params[:user_id])
        if comment.save
            render json: comment, include: [:user]
        else
            render json: comment.errors.full_messages
        end
    end

end
