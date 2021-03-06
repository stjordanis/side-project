defmodule Db.UserTest do
  use Db.DataCase
  alias Db.Users.User

  describe "changeset/1" do
    test "with invalid required attributes" do
      invalid_attrs = %{provider_id: "facebook"}
      %Changeset{valid?: valid_changeset?} = User.changeset(invalid_attrs)

      refute valid_changeset?
    end
  end
end
