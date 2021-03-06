defmodule ApiWeb.Schema.Queries.Projects do
  use Absinthe.Schema.Notation
  alias ApiWeb.Schema.Resolvers
  alias ApiWeb.Schema.Middleware

  object :projects_queries do
    @desc "Fetch project info"
    field :project, :project do
      arg(:id, :id)
      resolve(&Resolvers.Projects.fetch_profile/3)
    end

    @desc "Search Projects"
    field :projects, list_of(:project) do
      arg(:conditions, :project_search_conditions)
      middleware(Middleware.Authorize)
      resolve(&Resolvers.Projects.search/3)
    end

    @desc "Show my projects"
    field :my_projects, list_of(:project) do
      middleware(Middleware.Authorize)
      resolve(&Resolvers.Projects.liked_by/3)
    end

    @desc "Show editable projects"
    field :editable_projects, list_of(:project) do
      middleware(Middleware.Authorize)
      resolve(&Resolvers.Projects.fetch_editable/3)
    end

    @desc "Fetch data needed for search"
    field :project_search_form, :project_search_form do
      middleware(Middleware.Authorize)
      resolve(&Resolvers.Projects.fetch_search_form/3)
    end

    @desc "Fetch data needed for form"
    field :project_form, :project_form do
      middleware(Middleware.Authorize)
      resolve(&Resolvers.Projects.fetch_form/3)
    end
  end
end
