require 'rails_helper'

RSpec.describe 'Api::Relationships', type: :request do
  before { sign_in user }

  let(:user) { create(:user) }

  describe 'POST /api/relationships' do
    let(:api_path) { api_relationships_path }

    it 'create successfully with valid params' do
      other_user = create(:user)
      params = { relationship: { followed_id: other_user.id } }

      expect { post api_path, params: }
        .to change { Relationship.count }.by(1)
              .and change { user.followings_count }.by(1)
                     .and change { other_user.reload.followers_count }.by(1)
      expect(response).to have_http_status(:success)
      expect(json_data[:relationship_id]).to eq(Relationship.last.id)
    end

    it 'failure to create with invalid params' do
      params = { relationship: { followed_id: user.id } }

      expect { post api_path, params: }.not_to change { Post.count }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_data).to include(:errors)
    end
  end

  describe 'DELETE /api/relationships/:id' do
    let!(:relationship) { create(:relationship, follower: user) }
    let(:api_path) { api_relationship_path(relationship.id) }

    it 'destroy successfully' do
      expect { delete api_path }
        .to change { Relationship.count }.by(-1)
              .and change { user.reload.followings_count }.by(-1)
                     .and change { relationship.followed.reload.followers_count }.by(-1)
      expect(response).to have_http_status(:success)
    end
  end
end
