class UsersController < ApplicationController

    def index
        users = User.all
        render json: users, only: [:id, :username]
    end

    def show
        user = User.find_by_id(params[:id])
        render json: user, only: [:id, :username]
    end

    def create
        user = User.new(user_params)
        if user.save
            session[:user_id] = user.id
            render json: user, only: [:id, :username]
        else
            render json: user.errors.full_messages
        end
    end

    private

    def user_params
        params.require(:user).permit(:username, :id)
    end
    
end
