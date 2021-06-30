Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users do
    resources :comments
    resources :high_scores
  end
  resources :comments
  resources :high_scores

  post '/login' => 'sessions#create'

  get 'logout' => 'sessions#destroy'
end
