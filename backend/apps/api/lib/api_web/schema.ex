defmodule ApiWeb.Schema do
  use Absinthe.Schema

  alias ApiWeb.Resolvers
  alias ApiWeb.Schema.Middleware

  def middleware(middleware, field, object) do
    middleware
    #|> apply(:errors, field, object)
    #|> apply(:debug, field, object)
  end
  # #
  # defp apply(middleware, :errors, _field, %{identifier: :mutation}) do
  #   middleware ++ [Middleware.ChangesetErrors]
  # end
  # #
  defp apply(middleware, :debug, _field, _object) do
    if System.get_env("DEBUG") do
      [{Middleware.Debug, :start}] ++ middleware
    else
      middleware
    end
  end
  #
  defp apply(middleware, _, _, _) do
    middleware
  end
  #
  # def plugins do
  #   #[Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults]
  #   [Absinthe.Plugin.defaults]
  # end

  # def dataloader() do
  #
  # end
  #
  # def context(ctx) do
  #   ctx
  #   |> Map.put(:loader, dataloader())
  # end

  import_types __MODULE__.AccountsTypes
  import_types Absinthe.Phoenix.Types
  #
  query do
    field :test, :test do
      middleware Middleware.Authorize
      resolve &Resolvers.Accounts.test/3
    end

    field :refresh_token, :user do
      arg :refresh_token, non_null(:string)
      resolve &Resolvers.Accounts.refresh/3
    end
  end

  @desc "Signup"
  mutation do
    field :signup, :user do
      arg :provider_id, non_null(:string)
      arg :uid, non_null(:string)
      # arg :email, :string
      # arg :display_name, :string
      # arg :photo_url, :string
      resolve &Resolvers.Accounts.signup/3
    end
  end

  subscription do

  end
end
