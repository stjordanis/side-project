defmodule Db.UsersTest do
  use Db.DataCase
  alias Db.Users.Users
  alias Db.Skills.UserSkill

  describe "edit/2" do
    test "succeeds to edit a user" do
      skill = Factory.insert(:skill)
      existing_user = Factory.insert(:user)

      assert {:ok, user} =
               Users.edit(existing_user, %{display_name: "new name", skill_ids: [skill.id]})

      assert user.display_name == "new name"
      assert Repo.get_by(UserSkill, user_id: user.id, skill_id: skill.id)
    end

    test "fails to edit a user because of unexpected input" do
      user = Factory.insert(:user)
      assert {:error, "display_name: can't be blank"} = Users.edit(user, %{display_name: ""})
    end
  end

  describe "search/1" do
    setup do
      occupation_type1 = Factory.insert(:occupation_type)
      occupation_type2 = Factory.insert(:occupation_type)

      genre1 = Factory.insert(:genre)
      genre2 = Factory.insert(:genre)
      datetime = NaiveDateTime.utc_now()
      seconds_in_day = 60 * 60 * 24

      current_user =
        Factory.insert(
          :user,
          genre: genre1,
          occupation_type: occupation_type1
        )

      user1 =
        Factory.insert(
          :user,
          genre: genre1,
          occupation_type: occupation_type1,
          last_activated_at: NaiveDateTime.add(datetime, -(seconds_in_day * 5), :second),
          geom: %Geo.Point{coordinates: {29, -90}, srid: 4326}
        )

      user2 =
        Factory.insert(
          :user,
          genre: genre2,
          occupation_type: occupation_type2,
          last_activated_at: NaiveDateTime.add(datetime, -(seconds_in_day * 2), :second)
        )

      skill1 = Factory.insert(:skill)
      skill2 = Factory.insert(:skill)
      Factory.insert(:user_skill, user: user1, skill: skill1)
      Factory.insert(:user_skill, user: user2, skill: skill2)

      {
        :ok,
        current_user: current_user,
        user1: user1,
        user2: user2,
        genre_id: genre1.id,
        occupation_type_id: occupation_type2.id,
        skill1_id: skill1.id,
        skill2_id: skill2.id
      }
    end

    test "returns users which current_user hasn't liked yet, when conditions is empty", %{
      current_user: current_user,
      user1: user1,
      user2: user2
    } do
      Factory.insert(
        :user_like,
        user: current_user,
        target_user: user1
      )

      conditions = %{}

      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})

      assert Enum.map(users, & &1.id) == [user2.id]
    end

    test "returns empty record, when condition doesn't match users which current_user hasn't liked yet",
         %{
           current_user: current_user,
           user1: user1,
           genre_id: genre_id
         } do
      Factory.insert(
        :user_like,
        user: current_user,
        target_user: user1
      )

      conditions = %{genre_id: genre_id}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})

      assert Enum.map(users, & &1.id) == []
    end

    test "returns all record, when only unexpected keyword is included", %{
      current_user: current_user,
      user1: user1,
      user2: user2
    } do
      conditions = %{test_id: 1}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) |> Enum.sort() == [user1.id, user2.id]
    end

    test "returns users that are close to the current user", %{
      current_user: current_user,
      user1: user1
    } do
      conditions = %{
        location: %{distance: 10, latitude: 30, longitude: -90}
      }

      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) == [user1.id]
    end

    test "returns users that has that genre, when genre_id is included", %{
      current_user: current_user,
      user1: user1,
      genre_id: genre_id
    } do
      conditions = %{genre_id: genre_id}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) == [user1.id]
    end

    test "returns users that has occupation_type, when occupation_type_id is included", %{
      current_user: current_user,
      user2: user2,
      occupation_type_id: occupation_type_id
    } do
      conditions = %{occupation_type_id: occupation_type_id}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) == [user2.id]
    end

    test "returns users that was activated app within the last 3 days, when is_active is included",
         %{current_user: current_user, user2: user2} do
      conditions = %{is_active: true}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})

      assert Enum.map(users, & &1.id) == [user2.id]
    end

    test "returns users that have these skills, when skill_ids are included", %{
      current_user: current_user,
      user1: user1,
      skill1_id: skill1_id
    } do
      conditions = %{skill_ids: [skill1_id]}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) == [user1.id]
    end

    test "returns users matches to the multiple conditions, when multiple conditions are included",
         %{
           current_user: current_user,
           user2: user2,
           genre_id: genre_id,
           occupation_type_id: occupation_type_id
         } do
      conditions = %{genre_id: genre_id, is_active: true}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})

      assert Enum.map(users, & &1.id) == []

      conditions = %{occupation_type_id: occupation_type_id, is_active: true}
      {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user.id})
      assert Enum.map(users, & &1.id) == [user2.id]
    end
  end

  # describe "search/2" do
  #   setup do
  #     occupation_type1 = Factory.insert(:occupation_type)

  #     genre1 = Factory.insert(:genre)
  #     genre2 = Factory.insert(:genre)

  #     datetime = NaiveDateTime.utc_now()
  #     seconds_in_day = 60 * 60 * 24

  #     current_user =
  #       Factory.insert(
  #         :user,
  #         genre: genre1,
  #         occupation_type: occupation_type1
  #     )

  #     user1 =
  #       Factory.insert(
  #         :user,
  #         genre: genre1,
  #         occupation_type: occupation_type1
  #       )

  #     user2 =
  #       Factory.insert(
  #         :user,
  #         genre: genre2,
  #         occupation_type: occupation_type1
  #       )

  #       Factory.insert(
  #         :user_like,
  #         user: current_user,
  #         target_user: user1
  #       )

  #     {
  #       :ok,
  #       current_user_id: current_user.id,
  #       user1_id: user1.id,
  #       user2_id: user2.id,
  #       genre_id: genre1.id
  #     }
  #   end

  #   test "returns users which current_user hasn't liked yet, when conditions is empty", %{current_user_id: current_user_id, user2_id: user2_id} do
  #     conditions = %{}
  #     {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user_id})

  #     assert Enum.map(users, & &1.id) == [user2_id]
  #   end

  #   test "returns empty record, when condition doesn't match users which current_user hasn't liked yet", %{
  #     current_user_id: current_user_id,
  #     genre_id: genre_id
  #   } do
  #     conditions = %{genre_id: genre_id}
  #     {:ok, users} = Users.search(%{conditions: conditions, user_id: current_user_id})

  #     assert Enum.map(users, & &1.id) == []
  #   end
  # end
end
