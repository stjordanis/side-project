defmodule ApiWeb.Schema.Types.Projects do
  use Absinthe.Schema.Notation
  alias Db.Uploaders.ProjectPhotoUploader
  alias Db.Projects.Photo
  alias Db.Chats.Chat
  alias Db.Projects.Projects

  object :project do
    field(:id, :id)
    field(:title, :string)
    field(:genre, :genre)
    field(:status, :project_status)
    field(:owner, :user)
    field(:city, :city)
    field(:lead_sentence, :string)
    field(:requirement, :string)
    field(:motivation, :string)
    field(:updated_at, :native_datetime)
    field(:skills, list_of(:skill))
    field(:photos, list_of(:project_photo))
    field(:users, list_of(:user))
    field(:has_liked, :boolean)

    field(
      :chat_id,
      :string,
      resolve: fn _, %{source: project} ->
        case Projects.main_chat(project.id) do
          %Chat{id: id} = chat ->
            {:ok, id}

          _ ->
            {:ok, nil}
        end
      end
    )

    field(
      :main_photo_url,
      :string,
      resolve: fn _, %{source: project} ->
        case Projects.main_photo(project.id) do
          %Photo{image_url: image_url} = photo ->
            {:ok, ProjectPhotoUploader.url({image_url, photo}, :thumb)}

          _ ->
            {:ok, ProjectPhotoUploader.missing_url(:thumb)}
        end
      end
    )
  end

  enum :project_status do
    value(:editing)
    value(:completed)
  end

  object :project_photo do
    field(:id, :id)
    field(:rank, :integer)
    field(:project_id, :id)

    field :image_url, :string do
      arg(:format, :string, default_value: "thumb")

      resolve(fn %Photo{image_url: image_url} = photo, %{format: format}, _ ->
        {:ok, ProjectPhotoUploader.url({image_url, photo}, String.to_atom(format))}
      end)
    end
  end

  object :project_search_form do
    field(:genres, list_of(:genre))
  end

  object :project_status_change do
    field(:id, :id)
    field(:status, :project_status)
  end

  object :project_form do
    field(:genres, list_of(:genre))
  end

  input_object :project_search_conditions do
    field(:genre_id, :id)
    field(:city_id, :id)
    field(:skill_ids, list_of(:id))
  end

  input_object :project_input do
    field(:title, :string)
    field(:lead_sentence, :string)
    field(:requirement, :string)
    field(:motivation, :string)
    field(:genre_id, :id)
    field(:city_id, :id)
    field(:zip_code, :string)
    field(:skill_ids, list_of(:id))
  end

  input_object :project_upload_input do
    field(:project_id, :id)
    field(:photo, :upload)
    field(:rank, :integer)
  end
end
