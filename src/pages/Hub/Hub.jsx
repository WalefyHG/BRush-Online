import { useState, useEffect, useRef } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import classes from "./Hub.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaRegTrashAlt,
  FaPencilAlt,
  FaFileImage,
  FaCheck,
} from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import CustomDiv from "../../components/CustomDiv/CustomDiv";
import Swal from "sweetalert2";
import { FcAddImage } from "react-icons/fc";

const Hub = () => {
  const [newsList, setNewsList] = useState([]);
  const [newNews, setNewNews] = useState({
    notice_title: "",
    notice_content: "",
    notice_date: getCurrentDate(),
  });
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const card2NewsRefs = useRef([]);

  const Toast = Swal.mixin({
    toast: true,
    background: "#555",
    color: "#fff",
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/notices/allnotices`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setNewsList(response.data);
        } catch (error) {
          console.error("Erro ao encontrar as noticias: ", error);
        }
      }
    };

    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/perfil`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.log("Erro ao encontrar o usuario: ", error);
        }
      }
    };

    fetchUser();
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewNews({
      ...newNews,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectNews = (id) => {
    setSelectedNewsId(id);

    // Recupera a referência para o elemento da notícia
    const selectedNewsRef = card2NewsRefs.current[id]

    // Rola até a notícia selecionada
    if (selectedNewsRef) {
      const offsetTop = selectedNewsRef.offsetTop;
      const offsetTopSmooth = offsetTop - 50;
      selectedNewsRef.scrollIntoView({
        top: offsetTopSmooth,
        behavior: "smooth",
      });
    }
    setTimeout(() => {
      setSelectedNewsId(null);
    }, 4000);
    
  };

  const handleCreateNews = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const formData = new FormData();
        formData.append("notice", JSON.stringify(newNews));
        formData.append("image", image);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}notices/notices`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const createNews = response.data;
          setNewsList([...newsList, createNews]);

          setNewNews({
            notice_title: "",
            notice_content: "",
            notice_date: getCurrentDate(),
          });

          Toast.fire({
            icon: "success",
            text: "Noticia criada com sucesso",
          });

          setSearch("");
          setImage(null);
          setIsModalOpen(false);
        } else {
          console.error("Erro ao criar noticia: ", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao criar noticia: ", error);
      }
    }
  };

  const handleDeleteNews = async (id) => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/notices/deletando/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setNewsList(newsList.filter((news) => news.notice_id !== id));
          Toast.fire({
            icon: "success",
            text: "Noticia deletada com sucesso",
          });
        } else {
          console.log("Erro ao deletar noticia: ", response.statusText);
        }
      } catch (error) {
        if (error.response.status === 401) {
          console.log("Erro 401: Sem permissão");
          Toast.fire({
            icon: "error",
            text: "Você não tem permissão para deletar",
          });
        }
        if (error.response.status === 404) {
          Toast.fire({
            icon: "error",
            text: "Noticia não encontrada",
          });
        }
      }
    }
  };

  const handleUpdateNews = async () => {
    const token = Cookies.get("token");
    if (token && editingId) {
      try {
        const formData = new FormData();
        formData.append("notice", JSON.stringify(newNews));

        formData.append("image", image);

        const response = await axios.put(
          `http://127.0.0.1:8000/notices/update/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          const updatedNews = newsList.map((news) =>
            news.notice_id === editingId ? response.data : news
          );
          setNewsList(updatedNews);

          setNewNews({
            notice_title: "",
            notice_content: "",
            notice_date: getCurrentDate(),
          });
          setEditingId(null);
          setImage(null);
          setIsModalOpen(false);
        }
        if (response.status === 401) {
          Toast.fire({
            icon: "error",
            text: "Você não tem permissão para deletar",
          });
        } else {
          console.error("Erro ao deletar noticia: ", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao atualizar noticia: ", error);
      }
    }
  };

  const startNewsEditing = (news) => {
    setIsModalOpen(true);
    setEditingId(news.notice_id);
    setNewNews({
      notice_title: news.notice_title,
      notice_content: news.notice_content,
      notice_date: getCurrentDate(),
    });
    setImage(news.notice_image);

    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleSearch = () => {
    const results = newsList.filter((news) =>
      news.notice_title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
    setSearch("");
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearch("");
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNewNews({
      notice_title: "",
      notice_content: "",
      notice_date: getCurrentDate(),
    });
    setEditingId(null);
  };

  const formatData = (data) => {
    const date = new Date(data);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <div
        className={`${classes.mainContainer} ${
          isModalOpen ? classes.blur : ""
        }`}
      >
        {user && <NavBar user={user} />}
        <div className={classes.container}>
          <CustomDiv />
          <div className={classes.card2}>
            {newsList.map((news) => (
              <div
                className={`${classes.news} ${
                  selectedNewsId === news.notice_id ? classes.selectedNews : ""
                }`}
                key={news.notice_id}
                id={news.notice_id}
                ref={(ref) => (card2NewsRefs.current[news.notice_id] = ref)}
              >
                <h2>{news.notice_title}</h2>
                <p>{news.notice_content}</p>
                <p>Data de Criação: {formatData(news.notice_date)}</p>
                <h2>Autor: {news.notice_writer.user_name}</h2>
                {news.notice_image ? (
                  <img src={`http://127.0.0.1:8000${news.notice_image}`} />
                ) : (
                  <img style={{ display: "none" }} />
                )}

                {user && user.user_id === news.notice_writer.user_id && (
                  <div className={classes.edit}>
                    <FaRegTrashAlt
                      onClick={() => handleDeleteNews(news.notice_id)}
                    />
                    <FaPencilAlt
                      id={classes.editando}
                      onClick={() => startNewsEditing(news)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={classes.search}>
            <div className={classes.controlSearch}>
              <h2>Pesquise sua noticia aqui</h2>
              <div className={classes.controleSearch}>
              <input
                type="text"
                placeholder="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearch}>Pesquisar</button>

              <span
                onClick={handleClearSearch}
                className={`${classes.clearIcon} ${
                  search || searchResults.length > 0 ? "" : classes.hidden
                }`}
              >
                &#x2715;
              </span>
              </div>
            </div>
            {searchResults.map((news) => (
              <div
                className={classes.news2}
                key={news.notice_id}
                onClick={() => handleSelectNews(news.notice_id)}
                id={news.notice_id}
              >
                <h1>{news.notice_title}</h1>
                <p>{news.notice_content}</p>
                <p>Data de Criação: {formatData(news.notice_date)}</p>
                <h2>Autor: {news.notice_writer.user_name}</h2>
                {news.notice_image ? (
                  <img src={`http://127.0.0.1:8000${news.notice_image}`} />
                ) : (
                  <img style={{ display: "none" }} />
                )}
              </div>
            ))}
          </div>
        </div>
        {!isModalOpen && (
          <button
            onClick={handleModal}
            id={classes.btnCreate}
            className={isModalOpen ? "" : classes.fadeIn}
          >
            + Criar Noticia
          </button>
        )}
        <Footer />
      </div>
      {isModalOpen && (
        <div className={`${classes.modal} ${isModalOpen ? classes.show : ""}`}>
          <VscError onClick={handleModal} id={classes.closeModal} />
          <div className={classes.controlCreate}>
            <label htmlFor="notice_title" className={classes.texto}>
              Titulo:{" "}
            </label>
            <input
              id="notice_title"
              type="text"
              placeholder="Titulo"
              name="notice_title"
              value={newNews.notice_title}
              onChange={handleInputChange}
            />
            <label htmlFor="notice_content" className={classes.texto}>
              Conteudo:{" "}
            </label>
            <textarea
              id="notice_content"
              name="notice_content"
              placeholder="Conteudo"
              value={newNews.notice_content}
              onChange={handleInputChange}
            />
            <hr />
            <div className={classes.imageControl}>
              <label htmlFor="inputImage" className={classes.fileUpload}>
                <FcAddImage />
                Envie seu Arquivo
                <input
                  type="file"
                  accept="img/*"
                  id="inputImage"
                  name="image"
                  onChange={handleImage}
                />
                {image ? <FaCheck /> : <VscError />}
              </label>
              {image && <FaRegTrashAlt onClick={() => setImage(null)} />}
            </div>
          </div>
          {editingId ? (
            <button onClick={handleUpdateNews}>Atualizando Noticia</button>
          ) : (
            <button onClick={handleCreateNews}>Criando Noticia</button>
          )}
        </div>
      )}
    </>
  );
};

export default Hub;
