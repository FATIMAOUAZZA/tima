import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [detailPost, setDetailPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(result => {
        setPosts(result.data);
        setFilteredPosts(result.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    if (searchId === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.id === parseInt(searchId));
      setFilteredPosts(filtered);
    }
  };

  const handleAddPost = () => {
    const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    const postToAdd = { id: newId, ...newPost };
    setPosts([...posts, postToAdd]);
    setFilteredPosts([...posts, postToAdd]);
    setNewPost({ title: '', body: '' });
  };

  const viewDetailPost = async (postId) => {
    try {
      const result = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setDetailPost(result.data);
      setIsModalOpen(true);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditPost = (post) => {
    setDetailPost(post);
    setNewPost({ title: post.title, body: post.body });
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleEditPost = () => {
    const updatedPosts = posts.map(post => post.id === detailPost.id ? { ...post, ...newPost } : post);
    setPosts(updatedPosts);
    setFilteredPosts(updatedPosts);
    setIsModalOpen(false);
    setDetailPost(null);
    setNewPost({ title: '', body: '' });
    setEditMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailPost(null);
    setNewPost({ title: '', body: '' });
    setEditMode(false);
  };

  return (
    <div className="container">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Rechercher par ID"
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="button" className="btn btn-warning m-2" onClick={handleSearch}>
          Rechercher
        </button>
        
        <h2>Ajouter une publication</h2>
        <input
          type="text"
          placeholder="Titre"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="form-control m-2"
        />
        <textarea
          placeholder="Corps de la publication"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          className="form-control m-2"
        />
        <button type="button" className="btn btn-success m-2" onClick={handleAddPost}>
          Ajouter
        </button>
        
        <h2>Liste des publications</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setFilteredPosts(filteredPosts.filter((item) => item !== post));
                        setPosts(posts.filter((item) => item.id !== post.id));
                      }}
                    >
                      Supprimer
                    </button>
                    <button
                      type="button"
                      className="btn btn-info m-2"
                      onClick={() => viewDetailPost(post.id)}
                    >
                      Voir Détail
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary m-2"
                      onClick={() => openEditPost(post)}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center fw-bold">
                  Aucune publication
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {isModalOpen && (
          <div className="modale">
            <div className="modale-content">
              <span className="close-button" onClick={closeModal}>
                &times;
              </span>
              <label>ID : </label>
              <input type="text" className="form-control" readOnly value={detailPost ? detailPost.id : ''} />
              <label>Titre : </label>
              <input type="text" className="form-control" 
                     readOnly={!editMode} 
                     value={editMode ? newPost.title : detailPost ? detailPost.title : ''} 
                     onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <label>Corps : </label>
              <textarea className="form-control" 
                        readOnly={!editMode} 
                        value={editMode ? newPost.body : detailPost ? detailPost.body : ''} 
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              />
              {editMode ? (
                <button type="button" className="btn btn-primary m-2" onClick={handleEditPost}>
                  Mettre à jour
                </button>
              ) : (
                <button type="button" className="btn btn-secondary m-2" onClick={() => setIsModalOpen(false)}>
                  Fermer
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
