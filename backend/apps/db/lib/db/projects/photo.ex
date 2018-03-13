defmodule Db.Projects.Photo do
  use Ecto.Schema
  use Arc.Ecto.Schema
  import Ecto.Changeset
  alias Db.Projects.Project
  alias Db.Uploaders.ProjectPhotoUploader

  alias __MODULE__

  @type t :: %Photo{}

  schema "project_photos" do
    field(:is_main, :boolean, default: false, null: false)
    field(:image_url, ProjectPhotoUploader.Type, null: false)
    field(:deleted_at, :utc_datetime)
    belongs_to(:project, Project)
    timestamps(type: :utc_datetime)
  end

  @spec changeset(map()) :: Ecto.Changeset.t()
  def changeset(attrs) do
    permitted_attrs = ~w(is_main project_id)a
    required_attrs = ~w(is_main image_url project_id)a

    %Photo{}
    |> cast(attrs, permitted_attrs)
    |> assoc_constraint(:project)
    |> cast_attachments(attrs, [:image_url])
    |> validate_required(required_attrs)
    |> unique_constraint(:user_id, name: "project_photos_project_id_and_is_main_index")
  end
end