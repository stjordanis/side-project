defmodule Db.OccupationTypes.OccupationType do
  @moduledoc """

  """
  use Ecto.Schema
  use Db.Helper.SoftDeletion
  import Ecto.Changeset
  alias Db.Users.User
  alias __MODULE__

  @type t :: %OccupationType{}

  schema "occupation_types" do
    field(:name, :string, null: false)
    field(:deleted_at, :utc_datetime)
    timestamps(type: :utc_datetime)

    has_many(:users, User)
  end

  @spec changeset(map()) :: Ecto.Changeset.t()
  def changeset(attrs) do
    permitted_attrs = ~w(name)a
    required_attrs = ~w(name)a

    %OccupationType{}
    |> cast(attrs, permitted_attrs)
    |> validate_required(required_attrs)
    |> unique_constraint(:name, name: "occupation_types_name_index")
  end
end
