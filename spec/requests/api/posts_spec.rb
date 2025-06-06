require 'rails_helper'

RSpec.describe 'Api::Posts', type: :request do
  before { sign_in user }

  let(:user) { create(:user) }

  describe 'POST /api/posts' do
    let(:api_path) { api_posts_path }
    let(:params) { { post: { body: 'a' } } }

    it 'create successfully with valid params' do
      expect { post api_path, params: }.to change { Post.count }.by(1)
      expect(response).to have_http_status(:success)
      expect(json_data[:post][:id]).to eq(Post.last.id)
    end

    it 'send successfully with valid params' do
      expect { post api_path, params: params.merge(send: true) }.to change { Post.count }.by(1)
      expect(response).to have_http_status(:success)
      expect(json_data[:post][:id]).to eq(Post.last.id)
    end

    it 'failure to create with invalid params' do
      params[:post][:body] = Faker::Lorem.characters(number: 2001)

      expect { post api_path, params: }.not_to change { Post.count }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_data).to include(:errors)
    end

    it 'failure to send with invalid params' do
      params[:post][:body] = ''

      expect { post api_path, params: params.merge(send: true) }.not_to change { Post.count }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_data).to include(:errors)
    end
  end

  describe 'PUT /api/posts/:id' do
    let!(:post) { create(:post, user:, body: 'a') }
    let(:api_path) { api_post_path(post.id) }

    it 'update successfully with valid params' do
      expect { put api_path, params: { post: { body: 'b' } } }.not_to change { Post.count }
      expect { post.reload }.to change { post.body }.from('a').to('b')
      expect(response).to have_http_status(:success)
      expect(json_data[:post][:id]).to eq(Post.last.id)
    end

    it 'failure to update with invalid params' do
      expect { put api_path, params: { post: { body: '' } } }.not_to change { Post.count }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_data).to include(:errors)
    end
  end

  describe 'attach image' do
    let(:file) { fixture_file_upload(file_fixture('images/image_1.webp'), 'image/webp') }

    describe 'PUT /api/posts/:id/attach_file' do
      let!(:post) { create(:post, user:) }
      let(:api_path) { attach_file_api_post_path(post.id) }

      it 'attach file successfully' do
        expect { put api_path, params: { file: } }.to change { post.images.count }.by(1)
        expect(response).to have_http_status(:success)
        expect(json_data[:attachment][:id]).to eq(post.images.last.id)
      end
    end

    describe 'PUT /api/posts/:id/delete_attachment' do
      let!(:post) { create(:post, user:, images: [file]) }
      let(:api_path) { delete_attachment_api_post_path(post.id) }

      it 'delete attachment successfully' do
        expect { put api_path, params: { attachment_id: post.images.last.id } }
          .to change { post.images.count }.by(-1)
        expect(response).to have_http_status(:success)
      end
    end

    describe 'PUT /api/posts/:id' do
      let!(:post) { create(:post, :draft, user:, images: [file]) }
      let(:api_path) { api_post_path(post.id) }

      it 'send successfully with only images' do
        expect { put api_path, params: { send: true, post: { body: '' } } }.not_to change { Post.count }
        expect(response).to have_http_status(:success)
        expect(json_data[:post][:id]).to eq(Post.last.id)
      end
    end
  end

  describe 'DELETE /api/posts/:id' do
    let!(:post) { create(:post, user:) }
    let(:api_path) { api_post_path(post.id) }

    it 'discard successfully' do
      expect { delete api_path }.to change { Post.discarded.count }.by(1)
      expect(response).to have_http_status(:success)
    end
  end
end
