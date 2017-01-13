Rails.application.routes.draw do
  resources :visitors
  root to: 'visitors#index'
end
