defmodule ApiWeb.Schema.Types.Cities do
  use Absinthe.Schema.Notation
  alias Db.Locations.City

  object :city do
    field(:id, :id)
    field(:name, :string)

    field(
      :full_name,
      :string,
      resolve: fn %City{
                    name: name,
                    state_abbreviation: state_abbreviation,
                    state_name: state_name
                  } = city,
                  _,
                  _ ->
        {:ok, "#{name}, #{state_abbreviation || state_name}"}
      end
    )
  end

  input_object :city_input do
    field(:name, :string)
    field(:state_name, :string)
    field(:state_abbreviation, :string)
    field(:country_name, :string)
  end
end
