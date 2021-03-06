set :application, 'dymo'
set :repo_url, 'git@github.com:dsadaka/dymo.git'

ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

set :deploy_to, '/var/www/dymo'
set :deploy_via, :remote_cache
set :scm, :git

set :ssh_options, {
    forward_agent: true,
    auth_methods: ["publickey"],
    keys: ["#{ENV['HOME']}/.ec2_ws1/ws1ec2-e1.pem"]
}



set :format, :pretty
set :log_level, :debug
# set :pty, true

set :linked_files, %w{config/database.yml}
set :linked_dirs, %w{ log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
# set :rvm_ruby_string, :local
set :rvm_ruby_version, '2.3.0@dymo --create'      # Defaults to: 'default'
set :bundle_binstubs, nil


# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :keep_releases, 5
set :passenger_restart_with_sudo, true

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  after :finishing, 'deploy:cleanup'

end
