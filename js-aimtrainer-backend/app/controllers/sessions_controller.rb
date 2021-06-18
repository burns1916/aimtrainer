class SessionsController < ApplicationController

    def create
        user = User.find_by(username: params[:username])
        if user
            session[:user_id] = user.id
            render json: user, only: [:username, :id]
        else
            render json: { message: "User Not Found" }
        end
    end

    def destroy
        if session[:user_id]
            session.clear
        end
    end

end
